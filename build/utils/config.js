const path = require('path')
const { outDir } = require('./paths')

const buildConfig = {
  esm: {
    module: 'ESNext',
    fromat: 'esm',
    output: {
      name: 'es',
      path: path.resolve(outDir, 'es'),
    },
    bundle: {
      path: 'simple-ui/es',
    },
  },
  cjs: {
    module: 'ComminJS',
    fromat: 'cjs',
    output: {
      name: 'lib',
      path: path.resolve(outDir, 'lib'),
    },
    bundle: {
      path: 'simple-ui/lib',
    },
  },
}

module.exports = buildConfig
