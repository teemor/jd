import request from "@/api/file/platform_report";
import * as type from '@/store/mutation/file'
import commonUtils from "@/assets/util/commonUtil";

// 初始化变量
const state = {
    tableData: {
        header: [
            {
                prop: "platformname",
                value: "平台"
            },
            {
                prop: "reportname",
                value: "报表名称"
            },
            {
                prop: "cycle",
                value: "填报周期"
            },
            // {
            //     prop: "",
            //     value: "截止日期"
            // },
            // {
            //     prop: "",
            //     value: "填报状态"
            // },
            // {
            //     prop: "",
            //     value: "末次填报日期"
            // },
            // {
            //     prop: "",
            //     value: "末次填报人"
            // },
            // {
            //     prop: "",
            //     value: "历史记录"
            // }
        ],
        tableData: [],
        total: 0
    },
    page: 1,
    pageSize: 10,
    modifyModel: {
        platformid:'',
        reportid:'',
        archivesid:'',
        person:'',
        cycle:'',
        expect:'',
    },
    uploadData: {}, // 上传需要的id
    id: '',// 总表id
    updisabled: true,//禁用上传
}

// 改变state状态
const mutations = {
    // 获取列表数据，修改状态
    [type.PLATFORM_REPORT_LIST_DATA](state, tableData) {
        state.tableData.tableData = tableData.tableData
        state.tableData.total = tableData.totalItem
    },
    // 获取分页数据
    [type.FILE_PAGE_SIZE](state, { page, pageSize }) {
        console.log({ page, pageSize })
        state.page = page
        state.pageSize = pageSize
    },
    getModifyPlatformReportData(state, modifyModel) {
        state.modifyModel.platformid = modifyModel.platformid
        state.modifyModel.reportid = modifyModel.reportid
        state.modifyModel.archivesid = modifyModel.archivesid
        state.modifyModel.person = modifyModel.person
        state.modifyModel.cycle = modifyModel.cycle
        state.modifyModel.expect = modifyModel.expect

    },
    updisabled(state, data) {
        state.updisabled = data
    },
    getId(state, id) {
        state.id = id // 总表id
    }
}
const getters = {
    modifyModel: state => state.modifyModel, // 修改文件model
    uploadData: state => state.uploadData, // 上传需要的id
    id: state => state.id,
    updisabled: state => state.updisabled
}
// 提交mutation改变状态
const actions = {
    // 初始化获取展示列表
    getPlatformReportData: function ({ state, commit }, id) {
        request.selectReportAssociation({ page: state.page, pageSize: state.pageSize, id: id })
            .then(res => {
                commit('getId', { id: id })
                commit(type.PLATFORM_REPORT_LIST_DATA, res.data)
            })
    },

    // 新增
    addPlatformReportData: function ({ commit, dispatch }, model) {
        request.addReportAssociation(model).then(res => {
            if (res.data === "insert") {
                commonUtils.setMessage('success', '新增成功')
                dispatch('getPlatformReportData')
            } else if (res.data === "repeat") {
                commonUtils.setMessage("info", "重复字段");
                commit('updisabled', true)
            }
        });

    },

    // 修改确认
    EditPlatformReport: function ({ dispatch, commit }, modifyModel) {
        request.updateReportAssociation(modifyModel)
            .then(res => {
                if (res.data === 'update') {
                    commonUtils.setMessage('success', '修改成功')
                    // commit('updisabled', false)
                    dispatch('getPlatformReportData', modifyModel.id)
                } else {
                    commonUtils.setMessage('warnning', '修改失败')
                }
            })

    },
    // 删除
    delData: function ({ dispatch }, id) {
        request.deleteReportAssociation({ id: id })
            .then(res => {
                if (res.data === 'delete') {
                    commonUtils.setMessage('success', '删除成功')
                    console.log(this.state.subbook.id)
                    dispatch('getPlatformReportData', this.state.subbook.id.id)
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
