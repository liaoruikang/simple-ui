import SInput from './input'
import SAlert from './alert'

const plugins = [SInput, SAlert]

const SimpleUi = {
  install(app) {
    plugins.forEach(plugin => {
      app.use(plugin)
    })
  },
}

export default SimpleUi

export { SInput, SAlert }
