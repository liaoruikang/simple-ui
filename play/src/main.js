import { createApp } from 'vue'
import App from './App.vue'

import SimpleUi from '@simple-ui/components'
const app = createApp(App)
app.use(SimpleUi)

app.mount('#app')
