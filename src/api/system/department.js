import axios from '@/assets/util/axios'

const serverPath = `http://172.16.0.252:8080/jdem/jdTesting/department/selectAll`
export default {
    // 部门字典用户
    selectAll: function () {
        return axios.get(`/department/selectAll`)
    },
    // 联动部门
    selectDpall:function(id){
        return axios.get(`/department/selectLinkage?id=${id}`)
    },
    // 查询部门
    selectdp: function (model) {
        return axios.get(`/department/selectPage?page=${model.page}&pageSize=${model.pageSize}`)
    },
    // 删除部门
    deletedp: function (id) {
        return axios.post(`/department/delete`, id)
    },
    // 批量删除部门判断
    deleteAll: function (idBatch) {
        return axios.post(`/department/deleteAll`, idBatch)
    },
    // 新增部门
    adddp: function (model) {
        return axios.post(`/department/insert`, model)
    },
    // 修改部门
    updatedp: function (model) {
        return axios.post(`/department/update`, model)
    }
}
