import axios from '@/assets/util/axios'

export default {
  // 登录 admin yz@123
  login: function (model) {
    return axios.post(`/login`, model)
    // return axios.post(`/login`, model)
  }
}
