import axios from '@/assets/util/axios'

export default {
    // 发布信息
    getAss: function(model) {
        return axios.post(`inspectiontask/getAllTask`, model)
    },
    // 获取部门
    department: function() {
        return axios.get(`department/selectAll`)
    },
    // 获取接收人
    person: function(model) {
        return axios.post(`inspectiontask/getUserNameBydpid`, model)
    },
    // 新增发布信息
    addSaveAss: function(model) {
        return axios.post(`inspectiontask/insert`, model)
    },
}
