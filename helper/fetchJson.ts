import { z } from 'zod'
import {
  HttpError,
  JsonParseError,
  NetworkError,
  SchemaError,
} from './errors'

type FetchJsonParams<Schema extends z.ZodTypeAny> = {
  /** 로그에 남길 요청 이름. 어떤 API가 실패했는지 구분하는 용도. */
  resource: string
  url: URL
  schema: Schema
  headers?: HeadersInit
  fetchImpl?: typeof fetch
}

/**
 * fetch → JSON 파싱 → 스키마 검증을 한 곳에서 처리하고,
 * 각 단계의 실패를 어느 요청에서 났는지 알 수 있는 태그된 에러로 바꿔 던진다.
 */
export async function fetchJson<Schema extends z.ZodTypeAny>({
  resource,
  url,
  schema,
  headers,
  fetchImpl = fetch,
}: FetchJsonParams<Schema>): Promise<z.infer<Schema>> {
  let response: Response

  try {
    response = await fetchImpl(url, { headers })
  } catch (cause) {
    throw new NetworkError({ resource, url, cause })
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '')

    throw new HttpError({
      resource,
      url,
      status: response.status,
      statusText: response.statusText,
      body,
    })
  }

  // json() 대신 text()를 거치는 이유: 파싱에 실패했을 때 실제 본문을 에러에 담기 위해서다.
  const body = await response.text()
  let data: unknown

  try {
    data = JSON.parse(body)
  } catch (cause) {
    throw new JsonParseError({ resource, url, body, cause })
  }

  const parsed = schema.safeParse(data)

  if (!parsed.success) {
    throw new SchemaError({ resource, url, issues: parsed.error.issues })
  }

  return parsed.data
}
