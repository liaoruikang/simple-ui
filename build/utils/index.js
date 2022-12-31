import { spawn } from 'child_process'
import { projectRoot } from './paths.js'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

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

const withDirAllname = dirname => {
  let total = []
  const filename = fs.readdirSync(dirname)
  function getFileCount(dirname, names) {
    const folder = names.filter(name => name.indexOf('.') == -1)
    total.push(
      ...names.map(item => ({
        name: item,
        no_suffix_name: item.split('.')[0],
        is_file: item.indexOf('.') != -1,
      }))
    )
    if (folder.length) {
      folder.forEach(name => {
        const dir = path.resolve(dirname, name)
        const filename = fs.readdirSync(dir)
        getFileCount(dir, filename)
      })
    }
  }
  getFileCount(dirname, filename)
  return total
}

const withDirname = url => {
  const __filenameNew = fileURLToPath(url)
  const __dirname = path.dirname(__filenameNew)
  return __dirname
}

export { run, withTaskName, withDirname, withDirAllname }
