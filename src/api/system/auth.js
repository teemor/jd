import axios from '@/assets/util/axios'
export default {
    // 权限字典用户
    selectAll: function () {
        return axios.get(`/jurisdiction/selectAll`)
    },
    // 查询权限
    selectAuth: function (model) {
        return axios.get(`/jurisdiction/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    },
    // 分配权限
    wholeTree: function () {
        // return axios.get(`/server/wholeTree`)
        return axios.get(`/wholeTree`)
    },
    // 删除权限
    deleteAuth: function (id) {
        return axios.post(`/jurisdiction/delete`, id)
    },
    // 批量删除权限
    deleteAllAuth: function (idBatch) {
        return axios.post(`/jurisdiction/deleteBatch`, idBatch)
    },
    // 新增权限
    addAuth: function (model) {
        return axios.post(`/jurisdiction/insert`, model)
    },
    // 修改权限
    updateAuth: function (model) {
        return axios.post(`/jurisdiction/update`, model)
    }
}
