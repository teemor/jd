import Vue from 'vue'

export default {
  /**
   * 获取cookie  by Nadia
   */
  getCookie: function (key) {
    if (document.cookie.length > 0) {
      var start = document.cookie.indexOf(key + '=')
      if (start !== -1) {
        start = start + key.length + 1
        var end = document.cookie.indexOf(';', start)
        if (end === -1) end = document.cookie.length
        return unescape(document.cookie.substring(start, end))
      }
    }
    return ''
  },
  /**
   * 保存Cookie by Nadia
   * @param c_name
   * @param value
   * @param expiredays
   */
  setCookie: function (cName, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = cName + '=' + decodeURIComponent(value) +
      ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
  },
  /**
   * 消息提示框
   * 新增、修改、删除、审核、驳回等操作调用该提示框
   * @param type 只有success和warning
   **/
  setMessage: function (type, message) {
    Vue.prototype.$message({
      message: message,
      type: type,
      duration: 1000
    })
  },
  /**
   * 过滤表单每个字段,去掉' byNadia
   * @param objVal
   */
  filterForm: function (objVal) {
    if (typeof objVal === 'object') {
      for (var key in objVal) {
        if (objVal[key]) {
          objVal[key] = this.replace(objVal[key])
        }
      }
    } else {
    }
  },

  /**
   * 正则去掉英文单引号
   */
  replace: function (value) {
    if (value !== '' && value !== undefined) {
      var str = value.replace(/'/g, '')
      return str
    } else {
      return ''
    }
  },
  /**
   * 注销登录
   */
  logout: function () {
    this.setCookie('token', '')
    this.setCookie('accountId', '')
    window.location.reload()
  },

}
