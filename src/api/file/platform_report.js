import axios from '@/assets/util/axios'
export default {
    // 平台报表字典用户
    selectAll: function () {
        return axios.get(`/reportAssociation/selectAll?id=0`)
    },
    selectReportAssociation:function(model){
        if (model.id == undefined) {
            return axios.get(`/reportAssociation/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
        } else {
            return axios.get(`/reportAssociation/findPlatform?page=${model.page}&pageSize=${model.pageSize}&id=${model.id}`)
        }
        // return axios.get(`/reportAssociation/findPlatform?page=${model.page}&pageSize=${model.pageSize}&id=${model.id}`)
    },
    // 查询平台报表
    // selectReportAssociation: function (model) {
    //     if (model.id == undefined) {
    //         return axios.get(`/reportAssociation/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    //     } else {
    //         return axios.get(`/reportAssociation/selectPage?page=${model.page}&pageSize=${model.pageSize}&id=${model.id}`)
    //     }

    // },
    // 删除平台报表
    deleteReportAssociation: function (id) {
        return axios.post(`/reportAssociation/delete`, id)
    },
    // 批量删除平台报表
    deleteAllReportAssociation: function (idBatch) {
        return axios.post(`/reportAssociation/deleteBatch`, idBatch)
    },
    // 新增平台报表
    addReportAssociation: function (model) {
        return axios.post(`/reportAssociation/insert`, model)
    },
    // 修改平台报表
    updateReportAssociation: function (model) {
        return axios.post(`/reportAssociation/update`, model)
    }
}
