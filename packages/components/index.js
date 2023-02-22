import version from './version'
import SInput from './input'
import STimershaft from './timershaft'
import SIcon from './icon'

export { SInput }
export { STimershaft }
export { SIcon }
export { version }

const components = [SInput, STimershaft, SIcon]

const SimpleUi = {
  install(app) {
    components.forEach(component => {
      app.use(component)
    })
  },
  version,
}

const install = SimpleUi.install

export { install }
export default SimpleUi
