import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

// Next 16에서 `next lint`가 제거되어 eslint를 직접 실행한다.
// eslint-config-next 16은 flat config를 그대로 export 하므로 FlatCompat 래핑이 필요 없다.
const eslintConfig = [...coreWebVitals, ...typescript]

export default eslintConfig
