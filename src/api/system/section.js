import axios from '@/assets/util/axios';

export default {
    // 工艺段
  getTech: function(model) {
    return axios.get(`technology/selectPage?page=${model.page}&pageSize=${model.pageSize}`,model)
  },
  // 新增工艺段
  addSaveTech: function(model) {
    return axios.post(`technology/insert`,model)
  },
  // 修改工艺段
  editSaveTech: function(model) {
    return axios.post(`technology/update`,model)
  },
  // 删除工艺段
  deleteTech: function(model) {
    return axios.post(`technology/delete`,model)
  },
  // 停启用工艺段
  statusTech: function(model) {
    return axios.post(`technology/changeState`,model)
  },
  // 批量删除
  deleteBatchTech: function(model) {
    return axios.post(`technology/deleteBatch`,model)
  }
}