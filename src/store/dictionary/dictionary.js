import request from '@/api/system/system'
import * as type from "@/store/mutation"
// 检测单位，工艺段，档案级别
const state = {
    page:1,
    pageSize: 10,
    techPage: 1,
    techPageSize: 10,
}
const getters = {
}
const mutations = {
     // 检测单位分页
     [type.UNIT_PAGE_SIZE](state,{ page,pageSize }){
        state.page = page
        state.pageSize = pageSize
    },
    // 工艺段分页
    [type.TECH_PAGE_SIZE](state,{ page,pageSize }){
        state.techPage = page
        state.techPageSize = pageSize
    },
}
const actions = {
    // 检测单位数据
    getUnit: function({ commit }) {
        request.getUnit({}).then(res => {
            commit(type.UNIT_TABLE,res.data)
        })
    },
    // 新增检测单位
    addSaveUnit: function({ dispatch }, model){
        request.addSaveUnit(model).then(res => {
            console.log(res)
        })
    },
    // 修改检测单位
    editSaveUnit:function({ dispatch }, model) {
        request.editSaveUnit(model).then(res => {
            console.log(res)
        })
    },
    // 删除检测单位
    deleteUnit: function({ dispatch }, model) {
        request.deleteUnit(model).then(res => {
            console.log(res)
        })
    },
    // 停启检测单位
    statusUnit: function({ dispatch }, id) {
        request.statusUnit(id).then(res => {
            console.log(res)
        })
    },
    // 批量删除
    deleteBatchUnit: function({ dispatch }, model ) {
        request.deleteBatchUnit(model).then(res => {
            console.log(res)
        })
    },
    // 工艺段数据
    getTech:function({ commit }) {
        request.getTech({}).then(res =>{
            commit(type.TECH_TABLE,res.data)
        })
    },
    // 新增工艺段
    addSaveTech: function({ dispatch }, model) {
        request.addSaveTech(model).then(res => {
            console.log(res)
        })
    },
    // 修改工艺段
    editSaveTech: function({ dispatch },model) {
        request.editSaveTech(model).then(res => {
            console.log(res)
        })
    },
    // 删除工艺段
    deleteTech: function({ dispatch },model) {
        request.deleteTech(model).then(res => {
            console.log(res)
        })
    },
    // 停启用工艺段
    statusTech: function({ dispatch },id) {
        request.statusTech(id).then(res => {
            console.log(res)
        })
    },
    // 批量删除
    deleteBatchTech: function({ dispatch },model) {
        request.deleteBatchTech(model).then(res => {
            console.log(res)
        })
    },
    // 档案级别树形展示
    selectAll: function({ commit }){
        request.selectAll().then(res => {
            commit(type.FILE_TABLE,res.data)
        })
    },
    // 新增档案级别
    addSaveFile: function({ dispatch },model) {
        request.addSaveFile(model).then(res => {
            console.log(res)
        })
    },
    // 修改档案级别
    editSaveFile: function({ dispatch },model) {
        request.editSaveFile(model).then(res => {
            console.log(res)
        })
    },
    // 删除档案级别
    deleteFile: function({ dispatch },model) {
        request.deleteFile(model).then(res => {
            console.log(res)
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