import { createRouter, createWebHashHistory } from 'vue-router'
import pages from './pages'

const router = createRouter({
  history: createWebHashHistory(),
  routes: pages,
})

export default router
