// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import scan from './scanFile'
import axios from 'axios'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios
require('./element-variables.scss')
// import 'element-ui/lib/theme-chalk/index.css'
import './style/index.scss'
import store from './store'
import commonUtils from '@/assets/util/commonUtil'
Vue.config.productionTip = false
Vue.prototype.$commonUtils = commonUtils

router.beforeEach((to, from, next) => {
  const LOGIN = commonUtils.getCookie('code');
  if (to.path == '/login' || LOGIN) {
    next()
  }
  if (!LOGIN && to.path !== '/login') {
    next({ path: '/login' })
  }
})
Vue.use(Antd)
Vue.use(scan)
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
