const { series } = require('gulp')
const { withTaskName, run } = require('./utils')

exports.default = series(
  withTaskName('clean', async () => run('rd /S /Q dist')),
  withTaskName('buildPackages', async () => run('pnpm run --filter @simple-ui/* --parallel build'))
)
