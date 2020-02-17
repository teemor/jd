// 图形编辑系统后台
import axios from '@/assets/util/axios'
export default {
    // 树形前台展示
    selectTreeGraphic: function () {
        return axios.get(`/graphic/selectiog`)
    },
    findById: function (id) {
        return axios.get(`/graphic/findById?id=${id}`)
    },
    // 图形字典用户
    selectAll: function () {
        return axios.get(`/graphic/selectAll`)
    },
    // 查询图形
    selectGraphic: function (model) {
        return axios.get(`/graphic/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    },
    // 图形状态
    state: function (id) {
        return axios.get(`/graphic/state?id=${id}`)
    },
    // 删除图形
    deleteGraphic: function (id) {
        return axios.post(`/graphic/delete`, id)
    },
    // 批量删除图形
    deleteAllGraphic: function (idBatch) {
        return axios.post(`/graphic/deleteBatch`, idBatch)
    },
    // 新增图形
    addGraphic: function (model) {
        return axios.post(`/graphic/insert`, model)
    },
    // 修改图形
    updateGraphic: function (model) {
        return axios.post(`/graphic/update`, model)
    }
}
