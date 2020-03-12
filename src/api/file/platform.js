import axios from '@/assets/util/axios'
import api from '@/jsapi'

export default {
    picUrl:`${api.picUrl}`,
    // 平台字典用户
    selectAll: function () {
        return axios.get(`/platformManagement/selectAll?id=0`)
    },
    // 查询平台
    selectPlatformManagement: function (model) {
        return axios.get(`/platformManagement/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    },
    // 删除平台
    deletePlatformManagement: function (id) {
        return axios.post(`/platformManagement/delete`, id)
    },
    // 批量删除平台
    deleteAllPlatformManagement: function (idBatch) {
        return axios.post(`/platformManagement/deleteBatch`, idBatch)
    },
    // 新增平台
    addPlatformManagement: function (model) {
        return axios.post(`/platformManagement/insert`, model)
    },
    // 修改平台
    updatePlatformManagement: function (model) {
        return axios.post(`/platformManagement/update`, model)
    }
}
