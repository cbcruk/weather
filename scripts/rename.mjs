import child_process from 'child_process'
import { promisify } from 'util'
import glob from 'fast-glob'
import { readFile } from 'fs/promises'

const exec = promisify(child_process.exec)

async function main() {
  const folder = 'pages'
  const files = await glob(`${folder}/**/*.js`, {
    ignore: ['node_modules'],
  })

  for (const file of files) {
    if (file.includes('.js')) {
      const content = await readFile(file, 'utf-8')
      const hasHtml = content.match(/<\/\w+/i)

      await exec(
        `git mv ${file} ${file.replace('.js', hasHtml ? '.tsx' : '.ts')}`
      )
    }
  }
}
main()
