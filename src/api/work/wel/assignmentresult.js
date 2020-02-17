import axios from '@/assets/util/axios'

export default {
    // 获取检查结果
    getResult: function(model) {
        return axios.post(`inspectiontask/showTaskList`, model)
    },
    // 编辑检查结果
    editSaveResult: function(model) {
        return axios.post(`inspectiontask/insertReform`, model)
    },
    // 提交检查结果
    commitResult: function(model) {
        return axios.post(`inspectiontask/commitReform`, model)
    }
}
