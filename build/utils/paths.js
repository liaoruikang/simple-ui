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

const versionEsDir = path.resolve(outDir, 'es/components/version.mjs')
const versionLibDir = path.resolve(outDir, 'lib/components/version.cjs')

export { projectRoot, outDir, versionEsDir, versionLibDir }
