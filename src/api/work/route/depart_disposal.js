import axios from '@/assets/util/axios'

export default {
    // 查询部门处置
    getDis: function(model) {
        return axios.post(`patrolTask/userListDisplay`, model)
    },
    // 整改保存
    editSaveDis: function(model) {
        return axios.post(`patrolTask/zgInsert`, model)
    },
    // 整改提交
    commitDis: function(model) {
        return axios.post(`patrolTask/zgCommit`, model)
    }
}