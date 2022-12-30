const path = require('path')

const projectRoot = path.resolve(__dirname, '../../')

const outDir = path.resolve(projectRoot, './dist')

module.exports = { projectRoot, outDir }
