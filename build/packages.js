const { series, parallel, src, dest } = require('gulp')
const buildConfig = require('./utils/config')
const babel = require('gulp-babel')
const { withTaskName } = require('./utils/index')
const { outDir } = require('./utils/paths')
const path = require('path')
const uglify = require('gulp-uglify')
const replace = require('gulp-replace')
const fs = require('fs')

const buildPackages = (dirname, name) => {
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const output = path.resolve(dirname, 'dist', config.output.name)
    const output2 = path.resolve(outDir, config.output.name, name)
    return series(
      withTaskName(`build:${dirname}`, () => {
        const inputs = ['**/*.js', '!es/**', '!lib/**', '!gulpfile.js', '!dist/**/**']
        if (module == 'cjs') {
          // 转换commonjs模块
          return src(inputs)
            .pipe(
              babel({
                plugins: ['@babel/plugin-transform-modules-commonjs'],
              })
            )
            .pipe(replace(/\.vue/g, '.js'))
            .pipe(uglify())
            .pipe(
              replace(
                /exports.default=_default;/g,
                'exports.default=_default;exports.install=_default.install'
              )
            )
            .pipe(dest(output))
        } else if (module == 'esm') {
          // 转换es模块
          return src(inputs)
            .pipe(
              babel({
                plugins: ['transform-commonjs-es2015-modules'],
              })
            )
            .pipe(replace(/\.vue/g, '.js'))
            .pipe(uglify())
            .pipe(dest(output))
        }
      }),
      withTaskName(`copy:${dirname}`, () => {
        return src(`${output}/**`).pipe(dest(output2))
      }),
      withTaskName(`correctPath:${name}`, () => {
        return new Promise(resolve => {
          let total = 0
          const filename = fs.readdirSync(output2)
          function getFileCount(dirname, names) {
            const folder = names.filter(name => name.indexOf('.') == -1)
            const files = names.filter(name => name.indexOf('.') != -1)
            if (folder.length) {
              folder.forEach(name => {
                const dir = path.resolve(dirname, name)
                const filename = fs.readdirSync(dir)
                getFileCount(dir, filename)
              })
            }
            files.forEach(_ => total++)
          }
          getFileCount(output2, filename)
          let count = 0
          function getFile(dirname, names) {
            const folder = names.filter(name => name.indexOf('.') == -1)
            const files = names.filter(name => name.indexOf('.') != -1)
            if (folder.length) {
              folder.forEach(name => {
                const dir = path.resolve(dirname, name)
                const filename = fs.readdirSync(dir)
                getFile(dir, filename)
              })
            }
            files.forEach(name => {
              // 获取到每个文件相对路径
              const reg = new RegExp(output2.replace(/\\/g, '\\\\'), 'g')
              let relative = path
                .resolve(dirname, name)
                .replace(reg, '')
                .replace(/\\/g, '/')
                .match(/\//g)
              if (relative) {
                relative = relative
                  .map(item => {
                    if (relative.length > 1) {
                      return `..${item}`
                    } else {
                      return `.${item}`
                    }
                  })
                  .join('')
                // 将每个文件路径做下替换
                src(path.resolve(dirname, name))
                  .pipe(replace(/@simple-ui\//g, relative))
                  .pipe(dest(dirname))
              }
              if (total == ++count) resolve()
            })
          }
          getFile(output2, filename)
        })
      })
    )
  })
  return parallel(...tasks)
}

module.exports = { buildPackages }
