import axios from '@/assets/util/axios'

export default {
    // 检测单位数据
  getUnit: function(model) {
    return axios.get(`unitManagement/selectPage?page=${model.page}&pageSize=${model.pageSize}`,model)
  },
  // 新增检测单位
  addSaveUnit: function(model) {
    return axios.post(`unitManagement/insert`, model)
  },
  // 修改检测单位
  editSaveUnit: function(model) {
    return axios.post(`unitManagement/update`,model)
  },
  // 删除检测单位
  deleteUnit: function(model) {
    return axios.post(`unitManagement/delete`,model)
  },
  // 停启检测单位
  statusUnit: function(model) {
    return axios.post(`unitManagement/changeState`,model)
  },
  // 批量删除
  deleteBatchUnit: function(model) {
    return axios.post(`unitManagement/deleteBatch`,model)
  }
}