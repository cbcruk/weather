import { css } from '@emotion/css'

export const wrapper = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 100vh;
  background-color: var(--color-background-afternoon);
  transition: background-color 3s;
  animation: none;

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`

export const isNight = css`
  background-color: var(--color-background-night);
`

export const isNoon = css`
  background-color: var(--color-background-afternoon);
`

export const isLoading = css`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    270deg,
    var(--color-background-day),
    var(--color-background-night)
  );
  background-size: 400% 400%;
  animation: gradient 30s ease infinite;
`
