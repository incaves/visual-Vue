import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
axios.defaults.baseURL = 'http:127.0.0.1:3333/api/'
Vue.prototype.$http = axios // 挂载到原型
Vue.prototype.$echarts = window.echarts // 挂载到原型
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
