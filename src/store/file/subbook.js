import request from "@/api/file/ledger";
import * as type from '@/store/mutation/file'
import commonUtils from "@/assets/util/commonUtil";

// 初始化变量
const state = {
    tableData: {
        header: [
            {
                prop: "name",
                value: "总名称"
            },
            {
                prop: "abbreviation",
                value: "分表名称"
            },
            {
                prop: "num",
                value: "编号"
            },
            {
                prop: "edition",
                value: "版本号"
            },
            {
                prop: "category",
                value: "类别"
            },
            // {
            //     prop: "creation",
            //     value: "更新日期"
            // },
            // {
            //     prop: "establish",
            //     value: "更新人"
            // },
            {
                prop: "person",
                value: "负责人"
            },
            {
                prop: "position",
                value: "位置"
            }
        ],
        tableData: [],
        total: 0
    },
    page: 1,
    pageSize: 10,
    modifyModel: {
        name:'',
        abbreviation:'',
        number:'',
        edition:'',
        position:'',
        person:'',
        category:'',
        creation:'',
        levelid:'',
        approval:'',
        calculation:'',
        police:'',
        report:'',
        archives:''
    },
    uploadData: {}, // 上传需要的id
    id: '',// 总表id
    updisabled: true,//禁用上传
}

// 改变state状态
const mutations = {
    // 获取列表数据，修改状态
    [type.BOOK_LIST_DATA](state, tableData) {
        state.tableData.tableData = tableData.tableData
        state.tableData.total = tableData.totalItem
    },
    // 获取分页数据
    [type.FILE_PAGE_SIZE](state, { page, pageSize }) {
        console.log({ page, pageSize })
        state.page = page
        state.pageSize = pageSize
    },
    getModifyBookData(state, modifyModel) {
        state.modifyModel.abbreviation = modifyModel.abbreviation
        state.modifyModel.name = modifyModel.name
        state.modifyModel.number = modifyModel.number
        state.modifyModel.edition = modifyModel.edition
        state.modifyModel.position = modifyModel.position
        state.modifyModel.person = modifyModel.person
        state.modifyModel.category = modifyModel.category
        state.modifyModel.creation = modifyModel.creation
        state.modifyModel.levelid = modifyModel.levelid
        state.modifyModel.approval = modifyModel.approval
        state.modifyModel.calculation = modifyModel.calculation
        state.modifyModel.police = modifyModel.police
        state.modifyModel.report = modifyModel.report
        state.modifyModel.archives = modifyModel.archives
    },
    updisabled(state, data) {
        state.updisabled = data
    },
    getId(state, id) {
        state.id = id // 总表id
    },
    // 更新修改Model
    [type.FILE_MODEIFY_MODEL](state, modifyModel) {
        state.modifyModel = modifyModel
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
    // 初始化获取展示列表
    getbookData: function ({ state, commit }, id) {
        request.selectLedger({ page: state.page, pageSize: state.pageSize, id: id })
            .then(res => {
                commit('getId', { id: id })
                commit(type.BOOK_LIST_DATA, res.data)
            })
    },

    // 新增
    addBookData: function ({ commit, dispatch }, model) {
        request.addLedger(model).then(res => {
            if (res.data === "insert") {
                commonUtils.setMessage('success', '新增成功')
                dispatch('getbookData')
            } else if (res.data === "repeat") {
                commonUtils.setMessage("info", "重复字段");
                commit('updisabled', true)
            }
        });

    },

    // 修改确认
    EditFile: function ({ dispatch, commit }, modifyModel) {
        request.updateLedger(modifyModel)
            .then(res => {
                if (res.data === 'update') {
                    commonUtils.setMessage('success', '修改成功')
                    // commit('updisabled', false)
                    dispatch('getbookData', modifyModel.id)
                } else {
                    // commit('updisabled', true)
                    commonUtils.setMessage('warnning', '修改失败')

                }
            })

    },
    // 删除
    delData: function ({ dispatch }, id) {
        request.deleteLedger({ id: id })
            .then(res => {
                if (res.data === 'delete') {
                    commonUtils.setMessage('success', '删除成功')
                    console.log(this.state.subbook.id)
                    dispatch('getbookData', this.state.subbook.id.id)
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
