import axios from '@/assets/util/axios'
export default {
    // 查询设备
    selectDevice: function (model) {
        return axios.get(`/device/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    },
    // 删除设备
    deleteDevice: function (id) {
        return axios.post(`/device/delete`, id)
    },
    // 批量删除设备
    deleteAllDevice: function (idBatch) {
        return axios.post(`/device/deleteBatch`, idBatch)
    },
    // 新增设备
    addDevice: function (model) {
        return axios.post(`/device/insert`, model)
    },
    // 修改设备
    updateDevice: function (model) {
        return axios.post(`/device/update`, model)
    }
}
