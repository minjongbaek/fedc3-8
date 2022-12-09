import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './HomePage'
import SearchPage from './SearchPage'
import MovieDetail from './MovieDetail'
import NotFound from './NotFound'

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
