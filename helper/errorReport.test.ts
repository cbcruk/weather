import { describe, it, expect } from 'vitest'
import { toErrorReport, redactCoords, errorReportSchema } from './errorReport'
import { HttpError, SchemaError } from './errors'

describe('toErrorReport', () => {
  it('태그된 에러에서 _tag 와 메시지를 뽑는다', () => {
    const report = toErrorReport(
      new HttpError({
        resource: 'weather',
        url: 'https://weather.example/api/weather/today/02610114',
        status: 503,
        statusText: 'Service Unavailable',
        body: 'upstream down',
      }),
      'server'
    )

    expect(report.tag).toBe('HttpError')
    expect(report.message).toContain('503 Service Unavailable')
    expect(errorReportSchema.safeParse(report).success).toBe(true)
  })

  it('태그가 없는 값도 안전하게 처리한다', () => {
    expect(toErrorReport(new TypeError('boom'), 'server').tag).toBe('TypeError')
    expect(toErrorReport('문자열 throw', 'boundary').tag).toBe('UnknownError')
    expect(toErrorReport(null, 'boundary').tag).toBe('UnknownError')
  })

  it('사용자 좌표를 소수 2자리로 줄인다', () => {
    const report = toErrorReport(
      new SchemaError({
        resource: 'geocode',
        url: 'https://x.test/geocode?coords=127.2236579,37.3728211',
        issues: ['name: Required'],
      }),
      'server'
    )

    expect(report.message).toContain('127.22,37.37')
    expect(report.message).not.toContain('127.2236579')
  })

  it('메시지를 1000자로 자른다', () => {
    const report = toErrorReport(new Error('x'.repeat(5000)), 'server')

    expect(report.message.length).toBe(1000)
    expect(errorReportSchema.safeParse(report).success).toBe(true)
  })
})

describe('redactCoords', () => {
  it('정밀도가 낮은 수는 건드리지 않는다', () => {
    expect(redactCoords('status 503, pm10 32, ratio 1.5')).toBe(
      'status 503, pm10 32, ratio 1.5'
    )
  })
})
