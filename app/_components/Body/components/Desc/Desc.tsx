import React from 'react'

type Props = {
  summary: string
  location: string
}

function Desc({ summary, location }: Props) {
  return (
    <div>
      <div>{summary}</div>
      <div>{location}</div>
    </div>
  )
}

export default Desc
