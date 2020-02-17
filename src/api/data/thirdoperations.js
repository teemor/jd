import axios from '@/assets/util/axios'


export default {
    // 获取监测记录列表
    getOperations: function(model) {
        return axios.post(`equipment/showPage`, model)
    },
    // 搜索监测记录
    searchOperations: function(model) {
        return axios.post(`equipment/find`, model)
    },
    // 删除监测记录
    delOperations: function(model) {
        return axios.post(`equipment/delete`, model)
    },
    // 获取设备名称
    getEqu: function(model) {
        return axios.post(`equipment/findName`, model)
    },
    // 获取设备数据
    searchEqu: function(model) {
        return axios.post(`equipment/findDetails`, model)
    },
    // 新增监测记录
    saveAdd: function(model) {
        return axios.post(`equipment/insert`, model)
    },
    // 修改监测记录
    saveDeal: function(model) {
        return axios.post(`equipment/update`, model)
    },
    // 提交
    dealCommit: function(model) {
        return axios.post(`equipment/commit`, model)
    }
}