import axios from '@/assets/util/axios'

export default {
    // 获取报警记录
    getWarn: function(model) {
        return axios.post(`alarmRecord/listShow`, model)
    },
    // 搜索报警记录
    searchWarn: function(model) {
        return axios.post(`alarmRecord/search`, model)
    },
    // 获取处理记录
    getRecord: function(model) {
        return axios.post(`alarmRecord/ShowSettle`, model)
    },
    // 保存处理
    dealSave: function(model) {
        return axios.post(`alarmRecord/commit`, model)
    },
    // 搜索处理记录
    searchRecord: function(model) {
        return axios.post(`alarmRecord/searchDetails`, model)
    }
}