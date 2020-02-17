
import axios from '@/assets/util/axios'

export default {
    // 大气主排口
    getonLinePage: function (model) {
        return axios.get(`sewage/onLinePage?page=${model.page}&pageSize=${model.pageSize}&id=${model.id}`)
    },
    // 根据设备查询数据
    deviceData: function (num) {
        return axios.get(`online/query?num=${num}`)
    },
    // 大气无组织
    // 大气数据
    // 中水数据
    // 土壤数据
    // 噪声数据
    // 油烟数据
    // 辐射数据
    // 设备在线数据
    getOnlieData: function (model) {
        return axios.get(`device/onLinePage?page=${model.page}&pageSize=${model.pageSize}&id=${model.id}`)
    }
}
