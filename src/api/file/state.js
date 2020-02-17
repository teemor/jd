import axios from '@/assets/util/axios'
export default {
    // 显示选择
    state: function (id) {
        return axios.get(`/statistical/state?id=${id}`)
    },
    // 文档字典用户
    selectAll: function () {
        return axios.get(`/statistical/selectAll`)
    },
    // 查询文档
    selectStatistical: function (model) {
        return axios.get(`/statistical/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    },
    // 删除文档
    deleteStatistical: function (id) {
        return axios.post(`/statistical/delete`, id)
    },
    // 批量删除文档
    deleteAllStatistical: function (idBatch) {
        return axios.post(`/statistical/deleteBatch`, idBatch)
    },
    // 新增文档

    addStatistical: function (model) {
        return axios.post(`/statistical/insert`, model)
    },
    // 修改文档
    updateStatistical: function (model) {
        return axios.post(`/statistical/update`, model)
    }
}
