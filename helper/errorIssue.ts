import 'server-only'
import { ErrorReport } from './errorReport'
import { fingerprintOf } from './errorIssuePolicy'

const LABEL = 'auto:error'
const API = 'https://api.github.com'

/**
 * 인스턴스당 시간당 새 이슈 생성 상한.
 *
 * /api/report 는 공개 엔드포인트다. 지문 정규화가 대부분의 변형을 접지만,
 * 그걸 뚫는 입력이 있어도 저장소가 이슈로 뒤덮이지 않도록 마지막 방어선을 둔다.
 * 상한을 넘으면 이슈는 건너뛰고 webhook 알림만 나간다.
 */
const CREATE_BUDGET = { max: 5, windowMs: 60 * 60 * 1000 }
let budget = { until: 0, count: 0 }

function marker(fingerprint: string) {
  return `<!-- error-fingerprint: ${fingerprint} -->`
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

function withinBudget() {
  const now = Date.now()

  if (budget.until <= now) {
    budget = { until: now + CREATE_BUDGET.windowMs, count: 0 }
  }

  return budget.count < CREATE_BUDGET.max
}

function body(report: ErrorReport, fingerprint: string) {
  return [
    marker(fingerprint),
    '',
    '```',
    report.message,
    '```',
    '',
    `- source: \`${report.source}\``,
    report.path ? `- path: \`${report.path}\`` : null,
    report.status ? `- status: \`${report.status}\`` : null,
    `- 최초 관측: ${new Date().toISOString()}`,
    '',
    '_에러 리포터가 자동으로 만든 이슈입니다._',
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * 지문이 같은 이슈를 찾아 상태를 갱신한다.
 *
 * - 없음   → 생성
 * - open   → 재발 코멘트
 * - closed → reopen + 재발 코멘트. 고쳤다고 판단한 게 다시 났다는 신호다.
 *
 * 검색 API(30/분) 대신 라벨 필터 조회(core, 5000/시간)를 쓴다.
 */
export async function upsertErrorIssue(report: ErrorReport): Promise<void> {
  const conf = config()

  if (!conf) {
    return
  }

  const { repo, token } = conf
  const fingerprint = fingerprintOf(report)

  const issues = await gh<Issue[]>(
    `/repos/${repo}/issues?labels=${LABEL}&state=all&per_page=100&sort=updated&direction=desc`,
    token
  )
  // 이 엔드포인트는 PR도 함께 반환하므로 걸러낸다.
  const existing = issues.find(
    (issue) => !issue.pull_request && issue.body?.includes(marker(fingerprint))
  )

  if (!existing) {
    if (!withinBudget()) {
      return
    }

    budget.count += 1

    await gh(`/repos/${repo}/issues`, token, {
      method: 'POST',
      body: JSON.stringify({
        title: `[${report.tag}] ${report.message.split('\n')[0].slice(0, 120)}`,
        body: body(report, fingerprint),
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
        '```',
        report.message,
        '```',
        `- source: \`${report.source}\` · ${new Date().toISOString()}`,
      ].join('\n'),
    }),
  })
}
