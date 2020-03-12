import axios from 'axios'
import Vue from 'vue'
import commonUtil from '@/assets/util/commonUtil.js'

// axios.defaults.baseURL = 'http://172.16.0.252:8080/jdem/jdTesting'
axios.defaults.baseURL = 'http://39.99.38.237:8888/jdem/jdTesting'
// axios.defaults.baseURL = 'http://10.10.10.252:8080/jdem/jdTesting'
// axios.defaults.baseURL = 'http://localhost:8080/jdem/jdTesting'http://172.16.0.252:8080/
// axios.defaults.baseURL = 'http://yz.c.ic.ci/jdem/jdTesting'
// axios.defaults.baseURL = 'http://172.16.0.196:8080/jdTesting'
// axios.defaults.baseURL = 'http://172.16.0.168:8080/jdTesting'
// axios.defaults.baseURL = '/server'
// axios.defaults.baseURL = '/bai'
axios.defaults.timeout = 60000

axios.defaults.headers.post['Content-type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'application/json;charset=UTF-8'
axios.interceptors.request.use((config) => {
  var token = commonUtil.getCookie('token')
  if (token) {
    config.headers.token = token
  }
  switch (config.method) {
    case 'get':
      if (config.param) {
        if (config.param instanceof Array) {
          for (var p in config.param) {
            config.url += config.param[p] + '/'
          }
        } else {
          config.url += config.param
        }
      }
      break
    case 'post':
      break
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
axios.interceptors.response.use((res) => {
  // console.log('axios', res)
  // if (res.data.StatusCode !== 200) {
  //   Vue.prototype.$message.error({
  //     duration: 1000,
  //     showClose: true,
  //     message: res.data.Message
  //   })
  //   return Promise.reject(res)
  // }
  return res
}, (error) => {
  // console.error(error)
  // if (error.response && error.response.status === 403) {
  //   Vue.prototype.$message.warning({
  //     duration: 1000,
  //     showClose: true,
  //     message: '没有权限'
  //   })
  // }
  // if (error.response && error.response.status === 401) {
  //   commonUtil.logout()
  // }

  try {
    if (error.response) {
      Vue.prototype.$notify.error({
        title: '服务器开小差了',
        message: `刷新页面重试`,
        duration: 0
      })
      // console.error(`${new Date().toLocaleString()} 接口"${error.config.url}"错误`, `参数:${error.config.data || '无'}`, error.response.data)
    } else {
      Vue.prototype.$message.error({
        duration: 2000,
        showClose: true,
        message: '服务器开小差了,刷新页面重试'
      })
    }
  } catch (e) { }
  return Promise.reject(error)
})

export default axios
