import axios from '@/assets/util/axios'
export default {
    //查询内容
    findById(id) {
        return axios.get(`/report/findById?id=${id}`)
     },
    // 台账字典用户
    selectAll: function () {
        return axios.get(`/ledger/selectAll?id=0`)
    },
    // 查询台账
    selectLedger: function (model) {
        return axios.get(`/ledger/selectPage?page=${model.page}&pageSize=${model.pageSize}&id=${model.id}`)
    },
    // 删除台账
    deleteLedger: function (id) {
        return axios.post(`/ledger/delete`, id)
    },
    // 批量删除台账
    deleteAllLedger: function (idBatch) {
        return axios.post(`/ledger/deleteBatch`, idBatch)
    },
    // 新增台账
    addLedger: function (model) {
        return axios.post(`/ledger/insert`, model)
    },
    // 修改台账
    updateLedger: function (model) {
        return axios.post(`/ledger/update`, model)
    }
}
