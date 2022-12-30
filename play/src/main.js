import { createApp } from 'vue'
import App from './App.vue'

import SimpleUi, { SAlert } from '../../dist/es/components'
console.log(SAlert)
const app = createApp(App)

app.use(SimpleUi)

app.mount('#app')
