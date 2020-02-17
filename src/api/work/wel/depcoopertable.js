import axios from '@/assets/util/axios'
export default {
    // 获取档案
    file: function() {
        return axios.get(`fileManagement/selectAll`)
    },
    // 部门配合
    getCooper: function(model) {
        return axios.post(`inspectiontask/getTaskByUser`, model)
    },
    // 修改状态
    receiveState: function(model) {
        return axios.post(`inspectiontask/changeStateById`, model)
    },
    //编辑部门协同
    editSaveCooper: function(model) {
        return axios.post(`inspectiontask/insertTask`, model)
    },
    // 提交部门协同
    commitCooper: function(model) {
        return axios.post(`inspectiontask/commit`, model)
    },
    // 获取历史记录
    getHistory: function(model) {
        return axios.post(`inspectiontask/history`, model)
    },
}
