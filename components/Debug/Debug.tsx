import React from 'react'
import * as styles from './style'

type Props = {
  rawData: string
}

function Debug({ rawData }: Props) {
  return (
    <pre className={styles.wrapper}>{JSON.stringify(rawData, null, 2)}</pre>
  )
}

export default Debug
