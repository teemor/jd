import axios from '@/assets/util/axios'

export default {
    // 整改审核列表
    getAudit: function(model) {
        return axios.post(`patrolTask/zgListDisplay`, model)
    },
    // 整改审核保存
    editSaveAudit: function(model) {
        return axios.post(`patrolTask/taskAudit`, model)
    }
}