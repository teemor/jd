import axios from '@/assets/util/axios'

export default {
    // 获取整改内容
    getContent(model) {
        return axios.post(`inspectiontask/getReformByUser`, model)
    },
    // 修改整改内容
    editSaveContent(model) {
        return axios.post(`inspectiontask/reformSave`, model)
    },
    // 提交整改内容
    commitResult(model) {
        return axios.post(`inspectiontask/reformSub`, model)
    }
}
