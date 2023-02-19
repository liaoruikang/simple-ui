import gulp from 'gulp'
import {
  parse,
  compileTemplate,
  compileScript,
  rewriteDefault
} from 'vue/compiler-sfc'
import { withTaskName, run, withDirname } from '../../build/utils/index.js'
import fs from 'fs'
import path from 'path'
import { buildPackages } from '../../build/packages.js'
const { series } = gulp
const __dirname = withDirname(import.meta.url)

const cacheDir = []

function compilerVue(dirname, name) {
  return new Promise((resolve) => {
    const res = fs.readFileSync(path.resolve(dirname, name))
    // 这个 id 是 scopeId，用于 css scope，保证唯一即可
    const id = Date.now().toString()
    const scopeId = `data-v-${id}`
    const no_suffix_name = name.split('.')[0]

    const file = parse(res.toString(), {
      id: scopeId,
      filename: name
    })
    const codeList = []

    const { code } = compileTemplate({
      id: scopeId,
      source: file.descriptor.template.content
    })

    const { content } = compileScript(file.descriptor, {
      id: scopeId,
      filename: name
    })

    codeList.push(rewriteDefault(content, `__sfc_${no_suffix_name}__`))
    codeList.push(`__sfc_${no_suffix_name}__.__scopeId='${scopeId}'`)
    codeList.push(code)
    codeList.push(`__sfc_${no_suffix_name}__.render = render`)
    codeList.push(`export default __sfc_${no_suffix_name}__`)
    fs.writeFileSync(path.resolve(dirname, name + '.js'), codeList.join('\n'))
    cacheDir.push({
      dirname,
      name: name + '.js'
    })
    resolve()
  })
}

function start() {
  return new Promise((resolve) => {
    let total = 0
    const filename = fs.readdirSync(__dirname)
    function getFileCount(dirname, names) {
      const folder = names.filter((name) => name.indexOf('.') == -1)
      const files = names.filter((name) => name.match(/\.vue$/))
      if (folder.length) {
        folder.forEach((name) => {
          const dir = path.resolve(dirname, name)
          const filename = fs.readdirSync(dir)
          getFileCount(dir, filename)
        })
      }
      files.forEach((_) => total++)
    }
    getFileCount(__dirname, filename)
    let count = 0
    function getFile(dirname, names) {
      const folder = names.filter((name) => name.indexOf('.') == -1)
      const files = names.filter((name) => name.match(/\.vue$/))
      if (folder.length) {
        folder.forEach((name) => {
          const dir = path.resolve(dirname, name)
          const filename = fs.readdirSync(dir)
          getFile(dir, filename)
        })
      }
      files.forEach(async (name) => {
        await compilerVue(dirname, name)
        if (total == ++count) resolve()
      })
    }
    getFile(__dirname, filename)
  })
}

function clearCache() {
  return new Promise(async (resolve) => {
    await run('rd /S /Q dist', __dirname)
    cacheDir.forEach(async (dir, index) => {
      await run(`del /q ${dir.name}`, dir.dirname)
      if (index == cacheDir.length - 1) resolve(), (cacheDir.length = 0)
    })
  })
}

export default series(
  withTaskName('compilerVue', start),
  withTaskName('buildVue', buildPackages(__dirname, 'components')),
  withTaskName('clearCache', clearCache)
)
