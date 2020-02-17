import axios from '@/assets/util/axios'
export default {
    // 查询报表
    selectReport: function (model) {
        return axios.get(`/report/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    },
    selectAll: function () {
        return axios.get(`/report/selectAll`)
    },
    // 删除报表
    deleteReport: function (id) {
        return axios.post(`/report/delete`, id)
    },
    // 批量删除报表
    deleteAllReport: function (idBatch) {
        return axios.post(`/report/deleteBatch`, idBatch)
    },
    // 新增报表
    addReport: function (model) {
        return axios.post(`/report/insert`, model)
    },
    // 修改报表
    updateReport: function (model) {
        return axios.post(`/report/update`, model)
    },

}
