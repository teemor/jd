import axios from '@/assets/util/axios'

export default {
    getProcess: function(model) {
        return axios.post('freeTask/showPage', model)
    },
    searchProcess: function(model) {
        return axios.post('freeTask/findDetail', model)
    },
    dealSave: function(model) {
        return axios.post('freeTask/handle', model)
    },
}