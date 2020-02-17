import request from "@/api/data/selfmonitor";
import equ from "@/api/data/thirdoperations";
import * as type from '@/store/mutation/data';
import commonUtils from "@/assets/util/commonUtil";

const state = {
  tableData: {
    header: [
      {
        prop:"recordNum",
        value:"记录号"
      },{
        prop:"num",
        value:"编号"
      },{
        prop:"name",
        value:"名称"
      },{
        prop:"process",
        value:"工艺段"
      },{
        prop:"status",
        value:"状态"
      },{
        prop:"handler",
        value:"经手人"
      },{
        prop:"type",
        value:"维护类型"
      },{
        prop:"content",
        value:"维护内容"
      },{
        prop:"department",
        value:"维护科室"
      },{
        prop:"time",
        value:"维护时间"
      }
    ],
    tableData: [],
    total: 0
  },
  modifyData: {},
  page: 1,
  pageSize: 10,
  sign: 'deal',
  addForm: {
    type: "",
    name: "",
    process: "",
    num: "",
    time: "",
    department: "",
    handler: "",
    content: "" 
  },
  options: [] // 设备名称
}

const mutations = {
  [type.SELF_MONITOR_DATA](state, tableData) {
    state.tableData.tableData = tableData.data
    state.tableData.total = tableData.count
  },
  [type.SELF_MONITOR_PAGE](state, { page, pageSize }) {
    state.page = page
    state.pageSize = pageSize
  },
  getModify(state, data) {
    state.modifyData = data
  },
  signChange(state, sign) {
    state.sign = sign
  },
  getEquName(state, options) {
    state.options = options
  },
  updateValue(state, value) {
    state.modifyData.name = value.name
    state.modifyData.process = value.process
    state.addForm.name = value.name
    state.addForm.process = value.process
  },
  updateUser(state, value) {
    state.modifyData.handler = value
    state.addForm.handler = value
  },
  updateDp(state, value) {
    state.modifyData.department = value
    state.addForm.department = value
  },
  reset(state, data) {
    state.addForm = data
  },
  updateTime(state, time) {
    state.addForm.time = time
  }
}

const getters = {
  modifyData: state => state.modifyData,
  addForm: state => state.addForm,
  sign: state =>  state.sign,
  options: state => state.options
}

const actions = { 
  getSelf: function({ state, commit }) {
    request.getSelf({ page: state.page, pageSize: state.pageSize }).then(res => {
      console.log(res.data)
      if(res.data.data === '无') {
        commonUtils.setMessage('warning', '目前无监测记录')
      } else {
        commit(type.SELF_MONITOR_DATA, res.data)
      }
    })
  },
  searchSelf: function({ commit }, model) {
    request.searchSelf(model).then(res => {
      if(res.data.data == 'false') {
        commonUtils.setMessage("warning", '无符合条件监测记录')
        state.tableData.tableData = [];
      } else {
        commit(type.SELF_MONITOR_DATA, res.data)
      }
    })
  },
  delSelf: function({ commit, dispatch }, model) {
    request.delSelf({ recordNum: model }).then(res => {
      dispatch('getSelf')
    })
  },
  save: function({ dispatch }, model) {
    if(state.sign === 'add') {
      request.monitorAdd(model).then(res => {
        commonUtils.setMessage('success', '保存成功')
        dispatch('getSelf')
      })
    } else {
      request.monitorDeal(model).then(res => {
        commonUtils.setMessage('success', '修改成功')
        dispatch('getSelf')
      })
    }
  },
  selfCommit: function({ dispatch }, model) {
    request.selfCommit(model).then(res => {
      commonUtils.setMessage('success', '提交成功')
      dispatch('getSelf')
    })
  },
  // 获取设备
  getEqu: function({ commit }) {
    equ.getEqu().then(res => {
      console.log(res.data)
      if(res.data.data !== '无') {
        commit('getEquName', res.data.data)
      } 
    })
  },
  // 获取设备数据
  searchEqu: function({ commit }, data) {
    equ.searchEqu({ name : data }).then(res => {
      let equData =  res.data
      commit('updateValue', equData)
    })
  },
  // 获取当前登录用户信息
  getUser: function({ commit }) {
    commonUtils.getCookie('id').replace(/{/g,'').replace(/}/g,'').replace(/"/g,'').split(',').map((res) => {
      if(res.split(":")[0] == 'fname'){
        let name = res.split(":")[1] 
        commit('updateUser', name)
      }
      if(res.split(":")[0] == 'dp'){
        let department = res.split(":")[1]
        commit('updateDp', department)
      }
    })
  },
  // 获取当前时间
  getTime: function({ commit }) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var date = year + '-' + month + '-' + strDate;
    commit('updateTime', date) 
  },
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}