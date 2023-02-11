import version from './version'
import SInput from './input'
import STimeline from './timeline'

export { SInput }
export { STimeline }
export { version }

const plugins = [SInput, STimeline]

const SimpleUi = {
  install(app) {
    plugins.forEach(plugin => {
      app.use(plugin)
    })
  },
  version,
}

const install = SimpleUi.install

export { install }
export default SimpleUi
