export default [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/Home.vue'),
      },
      {
        path: '/components',
        name: 'components',
        component: () => import('@/views/Components/index.vue'),
      },
    ],
  },
]
