import { css } from '@emotion/css'

export const wrapper = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-background-day);
  transition: background-color 3s;
  animation: none;

  &.is-night {
    background-color: var(--color-background-night);
  }

  &.is-loading {
    background: linear-gradient(
      270deg,
      var(--color-background-day),
      var(--color-background-night)
    );
    background-size: 400% 400%;
    animation: gradient 30s ease infinite;
  }

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`
