import { createApp } from 'vue'
import App from './App.vue'
import SimpleUi from '@simple-ui/components'

import './index.scss'
// import '../../dist/theme-chalk/css/index.css'
// import '../../dist/theme-chalk/css/dark/vars.css'
const app = createApp(App)
app.use(SimpleUi)

app.mount('#app')
