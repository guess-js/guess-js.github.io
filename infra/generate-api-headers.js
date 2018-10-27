const fs = require('fs')
const path = require('path')
const base = 'content/api'
const apis = fs.readdirSync(base).filter(p => p !== '.' && p !== '..')

const DotReplace = '---'

const addHeaders = (base, dir) => {
  const files = fs.readdirSync(path.join(base, dir))
  const docs = files.filter(f => f.endsWith('.md'))
  docs.forEach(f => {
    const content = fs.readFileSync(path.join(base, dir, f)).toString()
    const apiPath = path
      .join(base, dir, f)
      .replace(/^content/, 'docs')
      .replace('README.md', 'index')
      .replace(/\.md$/, '')
      .replace(/\./g, DotReplace)
    let result = `---
path: "/${apiPath}"
---
${content}
`
    result = result.replace(/\[(.*?)\]\((.*?)\)/g, (all, alt, link) => {
      if (/.md(#.*)?$/.test(link)) {
        return `[${alt}](${link
          .replace(/\.md/, '')
          .replace(/\./g, DotReplace)
          .replace(new RegExp(`${DotReplace}${DotReplace}`, 'g'), '..')})`
      }
      return all
    })
    if (f === 'README.md') {
      fs.unlinkSync(path.join(base, dir, f))
      f = 'index.md'
    }
    fs.writeFileSync(path.join(base, dir, f), result)
  })
  files
    .filter(f => !f.endsWith('.md') && f !== '.' && f !== '..')
    .forEach(addHeaders.bind(null, path.join(base, dir)))
}

apis.forEach(addHeaders.bind(null, base))
