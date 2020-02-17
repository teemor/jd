import request from '@/api/system/system'
import * as type from '@/store/mutation'
import commonUtils from '@/assets/util/commonUtil'
import router from '@/router'
const state = {
  operationCol: []
  //运维部门数据
}
const getters = {
  operationCol: state => state.operationCol
}
const mutations = {
  [type.OPERATION_COL](state, operationCol) {
    state.operationCol = operationCol
  },
}
const actions = {
    operationColList: function ({ commit }) {
    request.operationCol().then(res => {
      commit(type.OPERATION_COL,res.data)
      console.log(res.data)
    })
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
