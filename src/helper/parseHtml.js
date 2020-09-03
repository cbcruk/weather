function parseHtml(html) {
  const parser = new DOMParser()
  const document = parser.parseFromString(html, 'text/html')

  return document
}

export default parseHtml
