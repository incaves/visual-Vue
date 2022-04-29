import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    component: () => import('../views/ScreenPage')
  },
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
  },
  {
    path: '/hot',
    component: () => import('../views/HotPage')
  },
  {
    path: '/stock',
    component: () => import('../views/StockPage')
  }
]

const router = new VueRouter({
  routes
})

export default router
