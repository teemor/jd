import axios from '@/assets/util/axios'

export default {
    getCount: function(model) {
        return axios.post(`inspectiontask/taskList`, model)
    },
    searchAssi: function(model) {
        return axios.post(`inspectiontask/searchList`, model)
    }
}
