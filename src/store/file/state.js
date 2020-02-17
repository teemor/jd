import request from "@/api/file/state";
import * as type from '@/store/mutation/file'
import commonUtils from "@/assets/util/commonUtil";

// 初始化变量
const state = {
    tableData: {
        header: [
            {
                prop: "name",
                value: "报表名称"
            },
            {
                prop: "num",
                value: "编号"
            },
            {
                prop: "classification",
                value: "分类"
            },
            {
                prop: "founder",
                value: "创建人"
            },
            {
                prop: "creation",
                value: "创建日期"
            }
        ],
        tableData: [],
        total: 0
    },
    page: 1,
    pageSize: 10,
    uploadData: {}, // 上传需要的id
    id: '',// 总表id
    updisabled: true,//禁用上传
    allTree: [],
    modifyModel: {
        num: '',
        abbreviation: '',
        relationid: '',
        founder: '',
        classification: '',
        creation: '',
        name: '',
    },
}

// 改变state状态
const mutations = {
    // 获取列表数据，修改状态
    [type.PLATFORM_LIST_DATA](state, tableData) {
        state.tableData.tableData = tableData.tableData
        state.tableData.total = tableData.totalItem
    },
    // 获取分页数据
    [type.STATE_PAGE_SIZE](state, { page, pageSize }) {
        console.log({ page, pageSize })
        state.page = page
        state.pageSize = pageSize
    },
    getModifyStatisticalData(state, modifyModel) {
        state.modifyModel.num = modifyModel.num
        state.modifyModel.abbreviation = modifyModel.abbreviation
        state.modifyModel.relationid = modifyModel.relationid
        state.modifyModel.founder = modifyModel.founder
        state.modifyModel.classification = modifyModel.classification
        state.modifyModel.creation = modifyModel.creation
        state.modifyModel.name = modifyModel.name
    },
    updisabled(state, data) {
        state.updisabled = data
    },
    getAllTree(state, data) {
        state.allTree = data
    },
    getId(state, id) {
        state.id = id // 总表id
    },
}
const getters = {
    modifyModel: state => state.modifyModel, // 修改文件model
    uploadData: state => state.uploadData, // 上传需要的id
    id: state => state.id,
    updisabled: state => state.updisabled
}
// 提交mutation改变状态
const actions = {
    // 显示列表树形
    getAllTree: function ({ commit }) {
        request.selectAll().then(res => {
            commit('getAllTree', res.data.tableData)
        })
    },
    // 初始化获取展示列表
    getStatisticalData: function ({ state, commit }, id) {
        request.selectStatistical({ page: state.page, pageSize: state.pageSize, id: id })
            .then(res => {
                commit('getId', { id: id })
                commit(type.PLATFORM_LIST_DATA, res.data)
            })
    },

    // 新增
    addStatistical: function ({ commit, dispatch }, model) {
        request.addStatistical(model).then(res => {
            if (res.data === "insert") {
                commonUtils.setMessage('success', '新增成功')
                dispatch('getStatisticalData')
            } else if (res.data === "repeat") {
                commonUtils.setMessage("info", "重复字段");
                commit('updisabled', true)
            }
        });

    },

    // 修改确认
    editState: function ({ dispatch, commit }, modifyModel) {
        request.updateStatistical(modifyModel)
            .then(res => {
                if (res.data === 'update') {
                    commonUtils.setMessage('success', '修改成功')
                    // commit('updisabled', false)
                    dispatch('getStatisticalData')
                } else {
                    commonUtils.setMessage('warnning', '修改失败')

                }
            })

    },
    // 删除
    deleteState: function ({ dispatch }, id) {
        request.deleteStatistical({ id: id })
            .then(res => {
                if (res.data === 'delete') {
                    commonUtils.setMessage('success', '删除成功')
                    console.log(this.state.subbook.id)
                    dispatch('getStatisticalData')
                } else {
                    commonUtils.setMessage('warnning', '删除失败')
                }
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
