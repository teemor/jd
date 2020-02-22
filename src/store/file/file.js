import request from "@/api/file/file";
import * as type from '@/store/mutation/file'
import commonUtils from "@/assets/util/commonUtil";

// 初始化变量
const state = {
    tableData: {
        header: [
            {
                prop: "name",
                value: "名称"
            },
            {
                prop: "edition",
                value: "编号"
            },
            {
                prop: "sewage",
                value: "排污号"
            },
            {
                prop: "device",
                value: "设备号"
            },
            {
                prop: "edition",
                value: "版本"
            },
            {
                prop: "establish",
                value: "创建日期"
            },
            {
                prop: "doc",
                value: "word下载"
            },
            {
                prop: "pdf",
                value: "pdf预览"
            },
            {
                prop: "position",
                value: "存放位置"
            }
        ],
        tableData: [],
        total: 0
    },
    page: 1,
    pageSize: 10,
    uploadData: {}, // 上传需要的id
    spid: '',
    updisabled: true,//禁用上传
    addState: true,//是否添加
    editdisabled: true,
    modifyModel: {
        name: '',
        spid: '',
        abbreviation: '',
        edition: '',
        position: '',
        number: '',
        person: '',
        device: '',
        sewage: '',
        experienced: '',
        establish: '',
        modify: '',
    },
}

// 改变state状态
const mutations = {
    // 获取列表数据，修改状态
    [type.FILE_LIST_DATA](state, tableData) {
        state.tableData.tableData = tableData.tableData
        state.tableData.total = tableData.totalItem
    },
    // 获取分页数据
    [type.FILE_PAGE_SIZE](state, { page, pageSize }) {
        console.log({ page, pageSize })
        state.page = page
        state.pageSize = pageSize
    },
    getModifyCodeData(state, modifyModel) {
        state.modifyModel.name = modifyModel.name
        state.modifyModel.spid = modifyModel.spid
        state.modifyModel.abbreviation = modifyModel.abbreviation
        state.modifyModel.number = modifyModel.number
        state.modifyModel.edition = modifyModel.edition
        state.modifyModel.position = modifyModel.position
        state.modifyModel.person = modifyModel.person
        state.modifyModel.device = modifyModel.device
        state.modifyModel.sewage = modifyModel.sewage
        state.modifyModel.experienced = modifyModel.experienced
        state.modifyModel.establish = modifyModel.establish
        state.modifyModel.modify = modifyModel.modify

    },
    spid(state, model) {
        state.spid = model.spid
    },
    addState(state, data) {
        state.addState = data.state
    },
    editdisabled(state, data) {
        state.editdisabled = data
    },
    updisabled(state, data) {
        state.updisabled = data
    },
    getId(state, uploadData) {
        state.uploadData = uploadData // 上传需要的id
    },
    // 更新修改Model
    [type.FILE_MODEIFY_MODEL](state, modifyModel) {
        state.modifyModel = modifyModel
    },

}
const getters = {
    url: () => request.url,
    editdisabled: state => state.editdisabled,//编辑禁用
    modifyModel: state => state.modifyModel, // 修改文件model
    uploadData: state => state.uploadData, // 上传需要的id
    id: state => state.id,
    updisabled: state => state.updisabled
}
// 提交mutation改变状态
const actions = {
    // 初始化获取展示列表
    getListData: function ({ state, commit }, model) {
        request.selectArchives({ page: state.page, pageSize: state.pageSize, spid: model.spid })
            .then(res => {
                // let apiupload = "http://172.16.0.252:8080/"
                let apiupload = "http://yz.c.ic.ci/"
                // let apiupload = "http://localhost:8080/"
                res.data.tableData.map(item => {
                    return item.doc = item.doc == '' ? '暂无' : apiupload + item.doc,
                        item.pdf = item.pdf == '' ? '暂无' : apiupload + item.pdf
                })
                commit('spid', { spid: model.spid })
                commit(type.FILE_LIST_DATA, res.data)
            })
    },

    // 新增
    addFileData: function ({ commit, dispatch }, model) {
        request.addArchives(model).then(res => {
            if (res.data.code === "insert") {
                commonUtils.setMessage('success', '新增成功')
                commit('getId', { id: res.data.id })
                commit('updisabled', false)
                console.log(this.state, 'this')
                dispatch('getListData', { spid: this.state.file.spid })
            } else if (res.data.code === "repeat") {
                commonUtils.setMessage("info", "重复字段");
                commit('updisabled', true)
            }
        });

    },

    // 修改确认
    EditFile: function ({ dispatch, commit }, modifyModel) {
        request.updateArchives(modifyModel)
            .then(res => {
                if (res.data.code === 'insert') {
                    commonUtils.setMessage('success', '修改成功')
                    // commit('updisabled', false)
                    dispatch('getListData', { spid: this.state.file.spid })
                } else {
                    // commit('updisabled', true)
                    commonUtils.setMessage('warnning', '修改失败')

                }
            })

    },
    // 删除
    delData: function ({ dispatch }, id) {
        request.deleteArchives({ id: id })
            .then(res => {
                if (res.data === 'delete') {
                    commonUtils.setMessage('success', '删除成功')
                    dispatch('getListData', { spid: this.state.file.spid })
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
