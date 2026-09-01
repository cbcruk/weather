import 'server-only'
import { ErrorReport } from './errorReport'
import { issueKeyOf, issueTitleOf } from './errorIssuePolicy'

const LABEL = 'auto:error'
const API = 'https://api.github.com'

function marker(key: string) {
  return `<!-- error-key: ${key} -->`
}

type Issue = {
  number: number
  state: 'open' | 'closed'
  body: string | null
  pull_request?: unknown
}

function config() {
  const repo = process.env.ERROR_ISSUE_REPO
  const token = process.env.ERROR_ISSUE_TOKEN

  return repo && token ? { repo, token } : null
}

async function gh<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })

  if (!response.ok) {
    throw new Error(
      `GitHub ${init?.method ?? 'GET'} ${path} → ${response.status} ${await response
        .text()
        .catch(() => '')}`.slice(0, 300)
    )
  }

  return response.json() as Promise<T>
}

function occurrence(report: ErrorReport) {
  return [
    '```',
    report.message,
    '```',
    [
      `source: \`${report.source}\``,
      report.path ? `path: \`${report.path}\`` : null,
      report.status ? `status: \`${report.status}\`` : null,
      new Date().toISOString(),
    ]
      .filter(Boolean)
      .join(' · '),
  ].join('\n')
}

/**
 * 태그에 해당하는 이슈를 찾아 상태를 갱신한다.
 *
 * - 없음   → 생성
 * - open   → 발생 코멘트
 * - closed → reopen + 재발 코멘트. 고쳤다고 판단한 게 다시 났다는 신호다.
 *
 * 검색 API(30/분) 대신 라벨 필터 조회(core, 5000/시간)를 쓴다.
 */
export async function upsertErrorIssue(report: ErrorReport): Promise<void> {
  const conf = config()
  const key = issueKeyOf(report)

  if (!conf || !key) {
    return
  }

  const { repo, token } = conf
  const issues = await gh<Issue[]>(
    `/repos/${repo}/issues?labels=${LABEL}&state=all&per_page=100&sort=updated&direction=desc`,
    token
  )
  // 이 엔드포인트는 PR도 함께 반환하므로 걸러낸다.
  const existing = issues.find(
    (issue) => !issue.pull_request && issue.body?.includes(marker(key))
  )

  if (!existing) {
    await gh(`/repos/${repo}/issues`, token, {
      method: 'POST',
      body: JSON.stringify({
        title: issueTitleOf(key),
        body: [
          marker(key),
          '',
          '이 태그의 에러가 발생할 때마다 아래에 코멘트가 쌓입니다.',
          '수정 후 이슈를 닫으면, 다시 발생했을 때 자동으로 다시 열립니다.',
          '',
          '---',
          '',
          occurrence(report),
        ].join('\n'),
        labels: [LABEL, 'bug'],
      }),
    })

    return
  }

  const reopened = existing.state === 'closed'

  if (reopened) {
    await gh(`/repos/${repo}/issues/${existing.number}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ state: 'open' }),
    })
  }

  await gh(`/repos/${repo}/issues/${existing.number}/comments`, token, {
    method: 'POST',
    body: JSON.stringify({
      body: [
        reopened
          ? '🔁 **닫힌 뒤 재발했습니다.** 이전 수정이 이 경로를 덮지 못했습니다.'
          : '🔔 다시 관측되었습니다.',
        '',
        occurrence(report),
      ].join('\n'),
    }),
  })
}
