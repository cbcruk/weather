import { css } from 'emotion'

export const wrapper = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-background-day);
  transition: background-color 0.3s;

  &.is-night {
    background-color: var(--color-background-night);
  }

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`
