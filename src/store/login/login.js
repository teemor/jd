import request from '@/api/Login/Login'
import menu from '@/api/system/system'
import * as type from '@/store/mutation/index'
import commonUtils from '@/assets/util/commonUtil'
import router from '@/router'
const state = {
  // 登录
  loginForm: {
    uname: '',
    pass: ''
  }
}
const getters = {
  // 登录form表单
  loginForm: state => state.loginForm
}
const mutations = {
  [type.LOGIN_FORM](state, loginForm) {
    state.loginForm = loginForm
  },
  // setMenu(state, arr) {
  //   state.menuList = arr
  //   let json = {
  //     data: arr.map(n => {
  //       return {
  //         isUsed: n.isUsed,
  //         parentId: n.parentId,
  //         resourceId: n.resourceId,
  //         resourceName: n.resourceName,
  //         resourceType: n.resourceType,
  //         resourceUrl: n.resourceUrl
  //       }
  //     })
  //   }
  //   sessionStorage.setItem('menu', JSON.stringify(json))
  // }
}
const actions = {
  login: function ({
    state,
    commit
  }) {

    request.login(state.loginForm).then(res => {
      if (res.data.code == -1) {
        commonUtils.setMessage('error', '登录失败')
      } else if (res.data.code === 1) {

        menu.menuData().then(res => {
          let path = res.data.data[0].to
          if (res.data.data[1].to = 'data') {
            router.push({
              path: 'data'
            })
          } else {
            router.push({
              path: path
            })
          }
        })
        // localStorage.setItem('userId', res.data.code)
        commonUtils.setCookie('code', JSON.stringify(res.data.code))
        commonUtils.setCookie('id', JSON.stringify(res.data.userinfo[0]))
      } else {
        commonUtils.setMessage('error', res.data.message)
      }
      console.log(res)
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
