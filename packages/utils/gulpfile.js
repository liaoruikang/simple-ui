import gulp from 'gulp'
import { buildPackages } from '../../build/packages.js'
import { run, withDirname, withTaskName } from '../../build/utils/index.js'
const { series } = gulp
const __dirname = withDirname(import.meta.url)

function clearCache() {
  return new Promise(async resolve => {
    await run('rd /S /Q dist', __dirname)
    resolve()
  })
}

export default series(
  withTaskName(`build:${__dirname}`, buildPackages(__dirname, 'utils')),
  withTaskName(`clearCache:${__dirname}`, clearCache)
)
