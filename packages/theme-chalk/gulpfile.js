const { series, src, dest } = require('gulp')
const less = require('gulp-less')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const path = require('path')

function compile() {
  return src(path.resolve(__dirname, './src/*.less'))
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

exports.default = series(compile, copyfont, copyfullStyle)
