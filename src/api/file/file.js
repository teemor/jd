import axios from '@/assets/util/axios'
export default {
    // 文档字典用户
    selectAll: function () {
        return axios.get(`/archives/selectAll`)
    },
    // 查询文档
    selectArchives: function (model) {
        return axios.get(`/archives/selectPage?page=${model.page}&pageSize=${model.pageSize}&spid=${model.spid}`)
    },
    // 删除文档
    deleteArchives: function (id) {
        return axios.post(`/archives/delete`, id)
    },
    // 批量删除文档
    deleteAllArchives: function (idBatch) {
        return axios.post(`/archives/deleteBatch`, idBatch)
    },
    // 新增文档
    
    addArchives: function (model) {
        return axios.post(`/archives/insert`, model)
    },
    // 修改文档
    updateArchives: function (model) {
        return axios.post(`/archives/update`, model)
    }


}
