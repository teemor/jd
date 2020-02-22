import axios from '@/assets/util/axios'
 
export default {
    getRelease: function(model) {
        return axios.post('freeTask/seletAll', model)
    },
    searchRelease: function(model) {
        return axios.post('freeTask/find', model)
    },
    addSave: function(model) {
        return axios.post('freeTask/insert', model)
    },
    editSave: function(model) {
        return axios.post('freeTask/update', model)
    },
    delRelease: function(model) {
        return axios.post('freeTask/delete', model)
    }
}