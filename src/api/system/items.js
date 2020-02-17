import axios from '@/assets/util/axios'
export default {
    // 查询项目
    selectItems: function (model) {
        return axios.get(`/items/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    },
    // 删除项目
    deleteItems: function (id) {
        return axios.post(`/items/delete`, id)
    },
    // 批量删除项目
    deleteAllItems: function (idBatch) {
        return axios.post(`/items/deleteBatch`, idBatch)
    },
    // 新增项目
    addItems: function (model) {
        return axios.post(`/items/insert`, model)
    },
    // 修改项目
    updateItems: function (model) {
        return axios.post(`/items/update`, model)
    },

}
