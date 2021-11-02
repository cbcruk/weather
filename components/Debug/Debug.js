import React from 'react'
import * as styles from './style'

function Debug({ rawData }) {
  return (
    <pre className={styles.wrapper}>{JSON.stringify(rawData, null, 2)}</pre>
  )
}

export default Debug
