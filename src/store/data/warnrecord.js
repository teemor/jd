import request from "@/api/data/warning";
import * as type from '@/store/mutation/data';
import commonUtils from "@/assets/util/commonUtil";


// 初始化变量
const state = {
  tableData: {
    header:[
      {
        prop: "warnNum",
        value: "报警编号"
      },{
        prop: "type",
        value: "报警类型"
      },{
        prop: "num",
        value: "编号"
      },{
        prop: "name",
        value: "名称"
      },{
        prop: "excessive",
        value: "报警内容"
      },{
        prop: "warnTime",
        value: "报警时间"
      },{
        prop: "reason",
        value: "问题原因"
      },{
        prop: "handleMethod",
        value: "处理方法"
      },{
        prop: "handleTime",
        value: "处理时间"
      },{
        prop: "handler",
        value: "处理人"
      },{
        prop: "status",
        value: "状态"
      }
    ],
    tableData:[],
    total: 0
  },
  modifyData: {},
  page: 1,
  pageSize: 10,
}
  // 改变state状态
const mutations = {
  [type.RECORD_LIST_DATA](state, tableData) {
    state.tableData.tableData = tableData.data
    state.tableData.total = tableData.count
  },
  [type.RECORD_PAGE_SIZE](state, { page, pageSize }) {
    state.page = page
    state.pageSize = pageSize
  },
  getModify(state, modifyData) {
    state.modifyData = modifyData;
  },
}

const getters = {
  modifyData: state => state.modifyData
}

const actions = {
  // 获取处理记录
  getRecord: function({ state, commit }) {
    request.getRecord({ page: state.page, pageSize: state.pageSize }).then(res => {
      commit(type.RECORD_LIST_DATA, res.data)
      console.log(res.data,'data')
    })
  },
  // 保存
  dealSave: function({ dispatch }, modifyData) {
    let dealForm = {};
    dealForm.id = modifyData.id;
    dealForm.warnNum = modifyData.warnNum;
    dealForm.type = modifyData.type;
    dealForm.num = modifyData.num;
    dealForm.name = modifyData.name;
    dealForm.excessive = modifyData.excessive;
    dealForm.warnTime = modifyData.warnTime;
    dealForm.reason = modifyData.reason;
    dealForm.handleMethod = modifyData.handleMethod;
    dealForm.handler = modifyData.handler;
    request.dealSave(dealForm).then(res => {
      commonUtils.setMessage('success', '处理成功')
      dispatch('getRecord')
    })
  },
  // 搜索处理记录
  searchRecord: function({ dispatch, commit }, model) {
    request.searchRecord(model).then(res => {
      if(res.data.data == '无符合条件任务') {
        commonUtils.setMessage("warning", res.data.data)
        state.tableData.tableData = [];
      } else {
        commit(type.RECORD_LIST_DATA, res.data)
      }
    })
  },
  // 获取当前登录用户信息
  getUser() {
    commonUtils.getCookie('id').replace(/{/g,'').replace(/}/g,'').replace(/"/g,'').split(',').map((res) => {
      if(res.split(":")[0] == 'fname'){
        state.modifyData.handler = res.split(":")[1];
      }
    })
  },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}