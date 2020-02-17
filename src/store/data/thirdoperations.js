import request from "@/api/data/thirdoperations";
import * as type from '@/store/mutation/data';
import commonUtils from "@/assets/util/commonUtil";

const state = {
  tableData: {
    header: [
      {
        prop:"recordNum",
        value:"记录号"
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
        prop:"deadline",
        value:"截止监测日期"
      },{
        prop:"type",
        value:"运维类型"
      },{
        prop:"handler",
        value:"经手人"
      },{
        prop:"item",
        value:"运维项目"
      },{
        prop:"unit",
        value:"运维单位"
      },{
        prop:"time",
        value:"运维时间"
      },{
        prop:"reportNum",
        value:"报告编号"
      }
    ],
    tableData:[],
    total: 0
  },
  modifyData: {},
  page: 1,
  pageSize: 10,
  addForm: {
    type: "",
    name: "",
    process: "",
    handler: "",
    unit: "",
    time: "",
    reportNum: "",
    item: "",
    reportCon: ""
  },
  sign: 'deal',
  attachment: '',
  options: [], //设备名称
}

const mutations = {
  [type.OPERATIONS_MONITOR_DATA](state, tableData) {
    state.tableData.tableData = tableData.data
    state.tableData.total = tableData.count
  },
  [type.OPERATIONS_MONITOR_PAGE](state, { page, pageSize }) {
    state.page = page
    state.pageSize = pageSize
  },
  getModify(state, data) {
    state.modifyData = data
  },
  signChange(state, sign) {
    state.sign = sign
  },
  upload(state, attachment) {
    state.attachment = attachment
  },
  getEquName(state, options) {
    state.options = options
  },
  reset(state, data) {
    state.addForm = data
  },
  updateTime(state, time) {
    state.addForm.time = time
  },
  updateValue(state, data) {
    state.addForm.handler = data
    state.modifyData.handler = data
  }

}

const getters = {
  modifyData: state => state.modifyData,
  sign: state => state.sign,
  options: state => state.options,
  addForm: state => state.addForm
}

const actions = {
  // 查询监测记录列表
  getOperations: function({ state, commit }) {
    request.getOperations({ page: state.page, pageSize: state.pageSize }).then(res => {
      console.log(res.data)
      if(res.data.data === '无') {
        commonUtils.setMessage('warning', '目前无监测记录')
      } else {
        commit(type.OPERATIONS_MONITOR_DATA, res.data)
      }
    })
  },
  // 搜索监测记录
  searchOperations: function({ commit }, model) {
    request.searchOperations(model).then(res => {
      if(res.data.data === "false") {
        commonUtils.setMessage("warning", '无符合条件监测记录')
        state.tableData.tableData = [];
      } else {
        commit(type.OPERATIONS_MONITOR_DATA, res.data)
      }
    })
  },
  // 删除监测记录
  delOperations: function({ dispatch }, model) {
    request.delOperations({ recordNum: model }).then(res => {
      dispatch('getOperations')
    })
  },
  // 获取设备
  getEqu: function({ commit }) {
    request.getEqu().then(res => {
      if(res.data.data !== '无') {
        commit('getEquName', res.data.data)
      } 
    })
  },
  // 获取设备数据
  searchEqu: function({ commit }, data) {
    request.searchEqu({ name : data }).then(res => {
      if(state.sign === 'deal') {
        state.modifyData.name = res.data.name
        state.modifyData.process = res.data.process
        state.modifyData.unit = res.data.department
      } else {
        state.addForm.name = res.data.name;
        state.addForm.process = res.data.process;
        state.addForm.unit = res.data.department;
      }
    })
  },
  // 保存
  saveOperations: function({ dispatch }, model) {
    let form = {};
    form.recordNum = model.recordNum;
    form.type = model.type;
    form.name = model.name;
    form.process = model.process;
    form.handler = model.handler;
    form.unit = model.unit;
    form.time = model.time;
    form.reportNum = model.reportNum;
    form.item = model.item;
    form.deadline = model.deadline;
    form.reportCon = state.attachment;
    if(state.sign === 'add') {
      request.saveAdd(form).then(res => {
        commonUtils.setMessage('success', '保存成功')
        dispatch('getOperations')
      })
    } else {
      request.saveDeal(form).then(res => {
        commonUtils.setMessage('success', '修改成功')
        dispatch('getOperations')
      })
    }
  },
  // 提交
  dealCommit: function({ dispatch }, modifyData) {
    console.log(modifyData)
    request.dealCommit(modifyData).then(res => {
      commonUtils.setMessage('success', '提交成功')
      dispatch('getOperations')
    })
  },
  // 获取当前登录用户信息
  getUser: function({ commit }) {
    commonUtils.getCookie('id').replace(/{/g,'').replace(/}/g,'').replace(/"/g,'').split(',').map((res) => {
      if(res.split(":")[0] == 'fname'){
        let name = res.split(":")[1]
        commit('updateValue', name) 
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