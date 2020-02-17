
import axios from '@/assets/util/axios'

export default {
    // 查询监测记录列表
    getTestMonitor: function(model) {
        return axios.post(`thirdParty/showPage`, model)
    },
    // 搜索监测记录
    searchMonitor: function(model) {
        return axios.post(`thirdParty/find`, model)
    },
    // 删除监测记录
    delMonitor: function(model) {
        return axios.post(`thirdParty/delete`, model)
    },
    // 新增
    addSave: function(model) {
        return axios.post(`thirdParty/insert`, model)
    },
    // 修改
    dealSave: function(model) {
        return axios.post(`thirdParty/update`, model)
    },
    // 提交
    dealCommit: function(model) {
        return axios.post(`thirdParty/commit`, model)
    },
    // 获取排污口名称
    getDrain: function(model) {
        return axios.post(`thirdParty/findName`, model)
    },
    // 搜索排污口数据
    searchDrain: function(model) {
        return axios.post(`thirdParty/findDetails`, model)
    }
}
