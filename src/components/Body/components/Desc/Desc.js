import React from 'react'

function Desc({ summary, location }) {
  return (
    <div>
      <div>{summary}</div>
      <div>{location}</div>
    </div>
  )
}

export default Desc
