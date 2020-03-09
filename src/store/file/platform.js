import request from "@/api/file/platform";
import * as type from '@/store/mutation/file'
import commonUtils from "@/assets/util/commonUtil";

// 初始化变量
const state = {
    tableData: {
        tableData: [],
        total: 0
    },
    page: 1,
    pageSize: 10,
    uploadData: {}, // 上传需要的id
    id: '',// 总表id
    updisabled: true,//禁用上传
    modifyModel: {
        name: "",
        abbreviation: "",
        boundary: "",
        person: "",
        address: "",
    }
}

// 改变state状态
const mutations = {
    // 获取列表数据，修改状态
    [type.PLATFORM_LIST_DATA](state, tableData) {
        state.tableData.tableData = tableData.tableData
        state.tableData.total = tableData.totalItem
    },
    // 获取分页数据
    [type.FILE_PAGE_SIZE](state, { page, pageSize }) {
        console.log({ page, pageSize })
        state.page = page
        state.pageSize = pageSize
    },
    getModifyPlatformData(state, modifyModel) {
        state.modifyModel.id = modifyModel.id
        state.modifyModel.name = modifyModel.name
        state.modifyModel.abbreviation = modifyModel.abbreviation
        state.modifyModel.boundary = modifyModel.boundary
        state.modifyModel.person = modifyModel.person
        state.modifyModel.address = modifyModel.address
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
    picUrl:state=>request.picUrl,
    modifyModel: state => state.modifyModel, // 修改文件model
    uploadData: state => state.uploadData, // 上传需要的id
    id: state => state.id,
    updisabled: state => state.updisabled
}
// 提交mutation改变状态
const actions = {
    // 初始化获取展示列表
    getPlatformData: function ({ state, commit }, id) {
        request.selectPlatformManagement({ page: state.page, pageSize: state.pageSize, id: id })
            .then(res => {
                commit('getId', { id: id })
                commit(type.PLATFORM_LIST_DATA, res.data)
            })
    },

    // 新增
    addPlatformData: function ({ commit, dispatch }, model) {
        request.addPlatformManagement(model).then(res => {
            if (res.data.code === "insert") {
                commonUtils.setMessage('success', '新增成功')
                dispatch('getPlatformData')
            } else if (res.data === "repeat") {
                commonUtils.setMessage("info", "重复字段");
                commit('updisabled', true)
            }
        });

    },

    // 修改确认
    EditPlatform: function ({ dispatch, commit }, modifyModel) {
        request.updatePlatformManagement(modifyModel)
            .then(res => {
                if (res.data.code === 'update') {
                    commonUtils.setMessage('success', '修改成功')
                    // commit('updisabled', false)
                    dispatch('getPlatformData', modifyModel.id)
                } else {
                    commonUtils.setMessage('warnning', '修改失败')

                }
            })

    },
    // 删除
    delData: function ({ dispatch }, id) {
        request.deletePlatformManagement({ id: id })
            .then(res => {
                if (res.data === 'delete') {
                    commonUtils.setMessage('success', '删除成功')
                    console.log(this.state.subbook.id)
                    dispatch('getPlatformData', this.state.subbook.id.id)
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
