import gulp from 'gulp'
import buildConfig from './utils/config.js'
import babel from 'gulp-babel'
import { run, withDirAllname, withTaskName } from './utils/index.js'
import { outDir } from './utils/paths.js'
import path from 'path'
import uglify from 'gulp-uglify'
import replace from 'gulp-replace'
import fs from 'fs'
import rename from 'gulp-rename'
const { series, parallel, src, dest } = gulp
const buildPackages = (dirname, name) => {
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const output = path.resolve(dirname, 'dist', config.output.name)
    const outputDist = path.resolve(outDir, config.output.name, name)
    const outputDist_copy = path.resolve(outDir, config.output.name, name + '_copy')
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
        return src(`${output}/**`).pipe(dest(outputDist_copy))
      }),
      withTaskName(`correctPath:${name}`, () => {
        return new Promise(resolve => {
          let total = 0
          const filename = fs.readdirSync(outputDist_copy)
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
          getFileCount(outputDist_copy, filename)
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
              const reg = new RegExp(outputDist_copy.replace(/\\/g, '\\\\'), 'g')
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

                let fileCode = fs.readFileSync(path.resolve(dirname, name)).toString()
                fileCode = fileCode.replace(/@simple-ui\//g, relative)
                const importPaths = fileCode.match(
                  /(from[\s]*['"]{1}[^'"]+['"]{1}[;]?)|require\(['"]{1}[^'"]+['"]{1}\)[;]?/g
                )
                if (importPaths) {
                  importPaths.forEach(item => {
                    let p = item.match(/['"]{1}[^'"]+['"]{1}/g)[0].replace(/['"]/g, '')
                    const filenames = withDirAllname(path.resolve(outDir, config.output.name)).map(
                      item => item.no_suffix_name
                    )
                    if (filenames.includes(p.split('/')[p.split('/').length - 1].split('.')[0])) {
                      let newPath
                      try {
                        const res = fs.statSync(path.resolve(dirname, p))
                        if (res.isFile()) {
                          if (!p.includes('.js')) {
                            newPath = p + '.js'
                          } else {
                            newPath = p
                          }
                        } else {
                          newPath = p + '/index.js'
                        }
                      } catch (error) {
                        newPath = p + '.js'
                      }
                      fileCode = fileCode.replace(new RegExp(p, 'g'), newPath)
                    }
                  })
                }
                fs.writeFileSync(path.resolve(dirname, name), fileCode)
                // src(path.resolve(dirname, name))
                //   .pipe(replace(/@simple-ui\//g, relative))
                //   .pipe(dest(dirname))
              }
              if (total == ++count) resolve()
            })
          }
          getFile(outputDist_copy, filename)
        })
      }),
      withTaskName(`transform:${outputDist_copy}`, () => {
        if (module == 'cjs') {
          return src(path.resolve(outputDist_copy, '**/*.js'))
            .pipe(rename({ extname: '.cjs' }))
            .pipe(replace(/\.js/g, '.cjs'))
            .pipe(dest(outputDist))
        } else if (module == 'esm') {
          return src(path.resolve(outputDist_copy, '**/*.js'))
            .pipe(rename({ extname: '.mjs' }))
            .pipe(replace(/\.js/g, '.mjs'))
            .pipe(dest(outputDist))
        }
      }),
      withTaskName('clearCache', () => {
        return new Promise(async resolve => {
          await run(`rd /S /Q ${name + '_copy'}`, path.resolve(outDir, config.output.name))
          resolve()
        })
      })
    )
  })
  return parallel(...tasks)
}

export { buildPackages }
