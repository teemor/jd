import request from "@/api/data/environmentdata";
import * as type from '@/store/mutation/data';
import commonUtils from "@/assets/util/commonUtil";

const state = {
  tableData: {
    header: [
      {
        prop:"recordNum",
        value:"记录号"
      },{
        prop:"deviceId",
        value:"编号"
      },{
        prop:"name",
        value:"名称"
      },{
        prop:"process",
        value:"工艺段"
      },{
        prop:"stu",
        value:"状态"
      },{
        prop:"deadline",
        value:"截止监测日期"
      },{
        prop:"handler",
        value:"经手人"
      },{
        prop:"testItem",
        value:"检测项目"
      },{
        prop:"company",
        value:"监测单位"
      },{
        prop:"cycle",
        value:"监测时间"
      },{
        prop:"reportNum",
        value:"报告编号"
      }
    ],
    tableData: [],
    total: 0
  },
  modifyData: {},
  page: 1,
  pageSize: 10,
  attachment: [],//附件
  testData: [],//监测项目数据
  options: [],//排污口名称
  sign: 'deal',
  addForm:{
    name: "",
    process: "",
    handler: "",
    company: "",
    cycle: "",
    reportNum: "",
    testItem: "",
    reportCon: "",
  },
}

const mutations = {
  [type.TEST_MONITOR_DATA](state, tableData) {
    state.tableData.tableData = tableData.data
    state.tableData.total = tableData.count
  },
  [type.TEST_MONITOR_PAGE](state, { page, pageSize }) {
    state.page = page
    state.pageSize = pageSize
  },
  getModify(state, data) {
    state.modifyData = data.data
    state.item = data.item
    state.testData = data.item
  },
  upload(state, attachment) {
    state.attachment = attachment
  },
  getName(state, options) {
    state.options = options
  },
  signChange(state, sign) {
    state.sign = sign
  },
  clear(state, item) {
    state.testData = item
  },
  updateUser(state, name) {
    state.modifyData.handler = name
    state.addForm.handler = name
  },
  updateTime(state, time) {
    state.addForm.cycle = time;
  } 
}

const getters = {
  modifyData: state => state.modifyData,
  item: state => state.testData,
  options: state => state.options,
  sign: state => state.sign,
  addForm: state => state.addForm
}

const actions = { 
  // 查询监测记录列表
  getTestMonitor: function({ state, commit }) {
    request.getTestMonitor({ page: state.page, pageSize: state.pageSize }).then(res => {
      if(res.data.data === '无') {
        commonUtils.setMessage('warning', '目前无监测记录')
      } else {
        commit(type.TEST_MONITOR_DATA, res.data)
      }
    })
  },
  // 搜索监测记录
  searchMonitor: function({ commit }, model) {
    request.searchMonitor(model).then(res => {
      if(res.data.data == '无') {
        commonUtils.setMessage("warning", '无符合条件监测记录')
        state.tableData.tableData = [];
      } else {
        commit(type.TEST_MONITOR_DATA, res.data)
      }
    })
  },
  // 删除检测记录
  delMonitor: function({ dispatch }, model) {
    request.delMonitor({ recordNum: model }).then(res => {
      dispatch('getTestMonitor')
    })
  },
  // 保存
  dealSave: function({ dispatch }, modifyData) {
    let form = {}
    form.recordNum = modifyData.recordNum;
    form.deviceId = modifyData.deviceId;
    form.name = modifyData.name;
    form.process = modifyData.process;
    form.handler = modifyData.handler;
    form.company = modifyData.company;
    form.cycle = modifyData.cycle;
    form.reportNum = modifyData.reportNum;
    form.deadline = modifyData.deadline;
    let Item = []
    state.testData.map((item) => {
      Item.push(item.name)
    })
    form.testItem = Item.join(',');
    form.reportCon = state.attachment.join(',');
    form.testData = state.testData;
    if(state.sign === 'add') {
      request.addSave(form).then(res => {
        commonUtils.setMessage('success', '保存成功')
        dispatch('getTestMonitor')
      })
    } else {
      request.dealSave(form).then(res => {
        commonUtils.setMessage('success', '修改成功')
        dispatch('getTestMonitor')
      })
    }
    
  },
  // 提交
  dealCommit: function({ dispatch }, modifyData) {
    request.dealCommit(modifyData).then(res => {
      commonUtils.setMessage('success', '提交成功')
      dispatch('getTestMonitor')
    })
  },
  // 获取排污口名称
  getDrain: function({ commit }) {
    request.getDrain().then(res => {
      if(res.data.data !== '无') {
        commit('getName', res.data.data)
      } 
    })
  },
  // 搜索排污口数据
  searchDrain: function({ commit }, data) {
    request.searchDrain({ name : data }).then(res => {
      let drain =  res.data
      if(state.sign === 'deal') {
        state.modifyData.name = drain.data[0].name
        state.modifyData.process = drain.process
        state.modifyData.company = drain.company
        state.modifyData.deviceId = drain.data[0].deviceId
        state.modifyData.cycle = drain.cycle
        state.testData = [];
        drain.name.map((res) => {
          state.testData.push({
            name: res,
            value: ''
          })
        })
      } else {
        state.addForm.name = drain.data[0].name
        state.addForm.process = drain.process
        state.addForm.company = drain.company
        state.addForm.deviceId = drain.data[0].deviceId
        state.addForm.cycle = drain.cycle
        state.testData = [];
        drain.name.map((res) => {
          state.testData.push({
            name: res,
            value: ''
          })
        })
      }
    })
  },
  // 获取当前登录用户信息
  getUser: function({ commit }) {
    commonUtils.getCookie('id').replace(/{/g,'').replace(/}/g,'').replace(/"/g,'').split(',').map((res) => {
      if(res.split(":")[0] == 'fname'){
        let name = res.split(':')[1]
        commit('updateUser', name) 
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