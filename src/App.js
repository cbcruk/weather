import React from 'react'
import { useAtom } from 'jotai'
import { cx } from '@emotion/css'
import { toggleAtom } from './atom/toggle'
import { Body, Footer } from './components'
import * as styles from './style'
import { nightAtom } from './atom/sunCalc'

function App() {
  const [, toggle] = useAtom(toggleAtom)
  const [isNight] = useAtom(nightAtom)

  return (
    <div
      className={cx([
        styles.wrapper,
        {
          [styles.isNight]: isNight,
        },
      ])}
      onClick={() => toggle((prev) => !prev)}
    >
      <Body />
      <Footer />
    </div>
  )
}

export default App
