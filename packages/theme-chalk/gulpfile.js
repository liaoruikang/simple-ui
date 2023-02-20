import gulp from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass)
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import path from 'path'
import { run, withDirname, withTaskName } from '../../build/utils/index.js'
const { series, src, dest } = gulp
const __dirname = withDirname(import.meta.url)

function compileCss() {
  return src(['./src/**/*.sass', './src/**/*.scss'])
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCss({}))
    .pipe(dest('./dist/css'))
}

function compileSass() {
  return src(['./src/**/*.sass', './src/**/*.scss']).pipe(dest('./dist/sass'))
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
  withTaskName(`compileCss`, compileCss),
  withTaskName(`compileSass`, compileSass),
  withTaskName(`copyfullStyle`, copyfullStyle),
  withTaskName(`clearCache:${__dirname}`, clearCache)
)
