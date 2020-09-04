import { JSDOM } from 'jsdom'

function parseHtml(html) {
  const { window } = new JSDOM(html)

  return window.document
}

export default parseHtml
