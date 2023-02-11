import { createApp } from 'vue'
import App from './App.vue'

import SimpleUi from '../../dist/es/components'
const app = createApp(App)
app.use(SimpleUi)

app.mount('#app')
