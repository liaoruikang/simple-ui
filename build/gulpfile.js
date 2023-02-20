import { withTaskName, run } from './utils/index.js'
import gulp from 'gulp'
import { projectRoot, versionEsDir, versionLibDir } from './utils/paths.js'
const { series } = gulp
import path from 'path'
import fs from 'fs'

export default series(
  withTaskName('clean', () => run('rd /S /Q dist')),
  withTaskName('buildPackages', () => run('pnpm run --filter "./packages/*" --parallel build')),
  withTaskName('updateVersion', () => {
    const version =
      'Version' +
      fs
        .readFileSync(path.resolve(projectRoot, 'package.json'))
        .toString()
        .match(/"version":[\s]*"[^"]+"/g)[0]
        .split(':')[1]
        .replace(/"/g, '')

    return new Promise(reslove => {
      let code
      try {
        code = fs.readFileSync(versionEsDir).toString()
      } catch (error) {
        reslove(error)
      }
      code = code.replace(/\$\{simple-ui-version\}/g, version.trim())
      fs.writeFileSync(versionEsDir, code)
      code = fs.readFileSync(versionLibDir).toString()
      code = code.replace(/\$\{simple-ui-version\}/g, version.trim())
      fs.writeFileSync(versionLibDir, code)
      reslove()
    })
  })
)
