import SInput from './input'

const plugins = [SInput]

const SimpleUi = {
  install(app) {
    plugins.forEach(plugin => {
      app.use(plugin)
    })
  },
}

const install = SimpleUi.install

export default SimpleUi

export { SInput }
export { install }
