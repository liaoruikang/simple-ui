import gulp from 'gulp'
import less from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import path from 'path'
import { run, withDirname, withTaskName } from '../../build/utils/index.js'
const { series, src, dest } = gulp
const __dirname = withDirname(import.meta.url)

function compile() {
  return src(path.resolve(__dirname, './src/**/*.less'))
    .pipe(less())
    .pipe(cleanCss())
    .pipe(autoprefixer())
    .pipe(dest('./dist/css'))
}

function copyfont() {
  return src(path.resolve(__dirname, 'src/font/**')).pipe(cleanCss()).pipe(dest('./dist/fonts'))
}

function copyfullStyle() {
  return src(path.resolve(__dirname, './dist/**')).pipe(
    dest(path.resolve(__dirname, '../../dist/theme-chalk'))
  )
}

function clearCache() {
  return new Promise(async resolve => {
    await run('rd /S /Q dist', __dirname)
    resolve()
  })
}

export default series(
  withTaskName(`compileCss`, compile),
  withTaskName(`compileLess`, () => {
    return src(path.resolve(__dirname, './src/**/*.less')).pipe(dest('./dist/less'))
  }),
  withTaskName(`copyfont`, copyfont),
  withTaskName(`copyfullStyle`, copyfullStyle),
  withTaskName(`clearCache:${__dirname}`, clearCache)
)
