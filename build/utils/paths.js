import path from 'path'
import { fileURLToPath } from 'url'

const withDirname = () => {
  const __filenameNew = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filenameNew)
  return __dirname
}

const __dirname = withDirname()

const projectRoot = path.resolve(__dirname, '../../')

const outDir = path.resolve(projectRoot, './dist')

export { projectRoot, outDir }
