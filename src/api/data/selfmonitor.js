import axios from '@/assets/util/axios'
 
export default {
    // 获取列表
    getSelf: function(model) {
        return axios.post(`equipmentThird/showPage`, model)
    },
    // 搜索
    searchSelf: function(model) {
        return axios.post(`equipmentThird/find`, model)
    },
    // 删除
    delSelf: function(model) {
        return axios.post(`equipmentThird/delete`, model)
    },
    // 新增
    monitorAdd: function(model) {
        return axios.post(`equipmentThird/insert `, model)
    },
    // 修改
    monitorDeal: function(model) {
        return axios.post(`equipmentThird/update`, model)
    }, 
    // 提交
    selfCommit: function(model) {
        return axios.post(`equipmentThird/commit`, model)
    }
}