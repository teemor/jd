import axios from '@/assets/util/axios'

export default {
    // 三级联动
    selectLinkage: function(id){
        return axios.get(`fileManagement/selectLinkage?id=${id}`)
    },
    // 树形展示
    selectAll: function() {
        return axios.get(`fileManagement/selectAll`)
    },
    // 新增档案级别
    addSaveFile: function(model) {
        return axios.post(`fileManagement/insert`, model)
    },
    // 修改档案级别
    editSaveFile: function(model) {
        return axios.post(`fileManagement/update`, model);
    },
    // 删除档案级别
    jugdeFile: function(model) {
        return axios.post(`fileManagement/findSj`, model)
    },
    deleteFile: function(model) {
        return axios.post(`fileManagement/delete`, model)
    },
    
}