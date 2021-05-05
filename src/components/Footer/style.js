import { css } from '@emotion/css'

export const wrapper = css`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  padding: 30px;
  font-size: 21px;
  color: #fff;
`

export const location = css`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`

export const date = css`
  margin-top: 14px;
`

export const current = css`
  font-size: 96px;
  font-weight: 900;
`

export const temperature = css``

export const status = css`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
`

export const button = css`
  all: inherit;
  cursor: pointer;
`
