import axios from '@/assets/util/axios'

export default {
    // 获取反馈
    getBack: function(model) {
        return axios.post(`inspectiontask/getResult`, model)
    },
    // 完成
    welEnd: function(model) {
        return axios.post(`inspectiontask/finishTask`, model)
    }
}
