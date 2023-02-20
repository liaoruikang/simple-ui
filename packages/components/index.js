import version from './version'
import SInput from './input'
import STimeline from './timeline'
import SIcon from './icon'

export { SInput }
export { STimeline }
export { SIcon }
export { version }

const components = [SInput, STimeline, SIcon]

const SimpleUi = {
  install(app) {
    components.forEach((component) => {
      app.use(component)
    })
  },
  version
}

const install = SimpleUi.install

export { install }
export default SimpleUi
