import axios from '@/assets/util/axios'
export default {
  /**
   * 字典表管理
   */
  // 工艺段
  technology: function () {
    return axios.get(`/technology/getAll`)
  },
  // 监测单位
  unitManagement: function () {
    return axios.get(`/unitManagement/getAll`)
  },
  // 设备
  equipmentDrain: function () {
    return axios.get(`/device/selectPage?page=1&pageSize=100`)
  },
  // 排污口 
  associatedDrain: function () {
    return axios.get(`/sewage/selectPage?page=1&pageSize=100`)
  },
  // 检测项目
  selectItems: function () { 
    return axios.get(`/items/selectPage?page=1&pageSize=100`)
  },
}
