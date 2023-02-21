import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/static/css/reset.css'
// 引入TailwindCss
import 'tailwindcss/tailwind.css'

// 引入simple-ui
// import SimpleUi from '../../dist/es/components'

const app = createApp(App)

app.use(router)
// app.use(SimpleUi)

app.mount('#app')
