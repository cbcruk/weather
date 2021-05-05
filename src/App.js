import React from 'react'
import { useAtom } from 'jotai'
import { cx } from '@emotion/css'
import { toggleAtom } from './atom/toggle'
import { nightAtom } from './atom/sunCalc'
import { Body, Footer } from './components'
import * as styles from './style'

function App() {
  const [isNight] = useAtom(nightAtom)
  const [, toggle] = useAtom(toggleAtom)

  return (
    <div
      className={cx([
        styles.wrapper,
        {
          [styles.isNight]: isNight,
        },
      ])}
      onClick={(e) => {
        console.log(e.target)
        toggle((prev) => !prev)
      }}
    >
      <Body />
      <Footer />
    </div>
  )
}

export default App
