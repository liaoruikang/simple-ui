import { withTaskName, run } from './utils/index.js'
import gulp from 'gulp'
const { series } = gulp

export default series(
  withTaskName('clean', async () => run('rd /S /Q dist')),
  withTaskName('buildPackages', async () => run('pnpm run --filter @simple-ui/* --parallel build'))
)
