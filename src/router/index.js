import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/seller',
    component: () => import('../views/SellerPage')
  },
  {
    path: '/trend',
    component: () => import('../views/TrendPage')
  },
  {
    path: '/map',
    component: () => import('../views/MapPage')
  },
  {
    path: '/rank',
    component: () => import('../views/RankPage')
  }
]

const router = new VueRouter({
  routes
})

export default router
