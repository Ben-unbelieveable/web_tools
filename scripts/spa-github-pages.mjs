import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const indexHtml = join(dist, 'index.html')
const notFound = join(dist, '404.html')

if (!existsSync(indexHtml)) {
  console.warn('spa-github-pages: dist/index.html missing, skip 404 copy')
  process.exit(0)
}

copyFileSync(indexHtml, notFound)
console.log('spa-github-pages: copied dist/index.html -> dist/404.html')
