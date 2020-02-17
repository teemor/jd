import axios from '@/assets/util/axios'

export default {
  secondMenuData: function (id) {
    return axios.get(`/submenuTree?id=${id}`)
  },
  // 登录 admin yz@123
  menuData: function () {
    return axios.get(`/menuTree`)
    // return axios.get(`/menuTree`)
  },
  // 查询用户
  selectUser: function (model) {
    return axios.get(`/user/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
  },
  // 查询条件查询用户
  selectUserModel: function (model) {
    return axios.get(`/user/findByName?uname=${model.uname}&page=${model.page}&pageSize=${model.pageSize}`)
  },
  // 启停用户
  statusUser: function (model) {
    return axios.post(`/user/status`, model)
  },
  // 新增用户
  addUser: function (model) {
    return axios.post(`/user/insert`, model)
  },
  // 修改用户
  updateUser: function (model) {
    return axios.post(`/user/update`, model)
  },
  // 删除用户
  deleteUser: function (id) {
    return axios.post(`/user/delete`, id)
  },
  // 批量删除用户
  deleteAllUser: function (idBatch) {
    return axios.post(`/user/deleteBatch`, idBatch)
  },
}
