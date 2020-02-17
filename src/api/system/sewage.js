import axios from '@/assets/util/axios'
export default {
    // 查询排污口
    selectSewage: function (model) {
        return axios.get(`/sewage/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    },
    // 删除排污口
    deleteSewage: function (id) {
        return axios.post(`/sewage/delete`, id)
    },
    // 批量删除排污口
    deleteAllSewage: function (idBatch) {
        return axios.post(`/sewage/deleteBatch`, idBatch)
    },
    // 新增排污口
    addSewage: function (model) {
        return axios.post(`/sewage/insert`, model)
    },
    // 修改排污口
    updateSewage: function (model) {
        return axios.post(`/sewage/update`, model)
    },
}
