import axios from '@/assets/util/axios'

export default {
    // 查询所有任务
    getIns: function(model) {
        return axios.post(`patrolTask/listDisplay`, model)
    },
    // 保存巡检任务
    addSaveIns: function(model) {
        return axios.post(`patrolTask/insert`, model)
    },
    // 发布巡检任务
    commitIns: function(model) {
        return axios.post(`patrolTask/commit`, model)
    },
    // 修改巡检任务
    editSaveIns: function(model) {
        return axios.post(`patrolTask/editTask`, model)
    },
    // 删除巡检任务
    delIns: function(model) {
        return axios.post(`patrolTask/delete`, model)
    },
    // 搜索
    searchIns: function(model) {
        return axios.post(`patrolTask/search`, model)
    }
}