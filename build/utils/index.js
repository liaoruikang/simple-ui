const { spawn } = require('child_process')
const { projectRoot } = require('./paths')
const path = require('path')
const fs = require('fs')

const withTaskName = (name, fn) => Object.assign(fn, { displayName: name })

const run = (command, path) => {
  return new Promise(resolve => {
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd: path || projectRoot,
      stdio: 'inherit',
      shell: true,
    })
    app.on('close', resolve)
  })
}

module.exports = {
  run,
  withTaskName,
}
