import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './HomePage.vue'
import SearchPage from './SearchPage.vue'
import MovieDetail from './MovieDetail.vue'
import NotFound from './NotFound.vue'

export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      component: HomePage
    },
    {
      path: '/search',
      component: SearchPage
    },
    {
      path: '/movie/:id',
      component: MovieDetail
    },
    {
      path: '/:notFound(.*)',
      component: NotFound
    },
  ]
})
