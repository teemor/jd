import request from '@/api/system/system'
import * as type from '@/store/mutation/index'
import commonUtils from '@/assets/util/commonUtil'
import router from '@/router'
const state = {
  // 动态菜单
  menuData: [],
  page: 1,
  pageSize: 10,
  userModel: {}
}
const getters = {
  // 登录form表单
  menuData: state => state.menuData,
  userModel: state => state.userModel
}
const mutations = {
  [type.USER_PAGE_SIZE](state, { page, pageSize }) {
    state.page = page
    state.pageSize = pageSize
  },
  [type.MENU_DATA](state, menuData) {
    state.menuData = menuData
  },
}
const actions = {
  menuData: function ({
    commit
  }) {
    request.menuData().then(res => {
      commit(type.MENU_DATA, res.data.data)
    })
  },
  // 查询用户
  selectUser: function ({ commit }) {
    request.selectUser({}).then(res => {
      commit(type.TABLE_USER_TABLE, res.data)
    })
  },
  // 新增用户
  addUser: function ({ dispatch }, model) {
    request.addUser(model).then(res => {
      console.log(res, 'res')
    })
  },
  // 启停用户
  statusUser: function ({ dispatch }, id) {
    request.statusUser(id).then(res => {
      console.log(res, 'res')
    })
  },
  // 修改用户
  updateUser: function ({ dispatch }, model) {
    request.updateUser(model).then(res => {
      console.log(res, 'res')
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
