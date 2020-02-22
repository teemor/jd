import axios from '@/assets/util/axios'

export default {
    getCategory: function(model) {
        return axios.post('assignment/selectPage ', model)
    },
    addSave: function(model) {
        return axios.post('assignment/insert', model)
    },
    editSave: function(model) {
        return axios.post('assignment/update', model)
    },
    changeState: function(model) {
        return axios.post('assignment/changeState', model)
    },
    // 删除
    delCategory: function(model) {
        return axios.post('assignment/delete', model)
    },
}