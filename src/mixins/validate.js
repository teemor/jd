/**
 * 验证手机号
 * 
 */
export default {
  data: function () {
    return {
      // 验证手机号加电话号码
      telephone: (rule, value, callback) => {
        let a = /^(0[0-9]{2,3}-?)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/g
        let b = /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6])|(17[1-8])|(18[0-9])|(19[8-9]))\d{8}$/g
        if (value === '') {
          callback(new Error('请输入联系方式'))
        } else {
          if (!a.test(value) && !b.test(value)) {
            callback(new Error('请输入正确的联系方式'))
          }
          callback()
        }
      },
      standvalue: (rule, value, callback) => {
        let num = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
        // let num = /^\d{1,2}(.\d{1,2})?$/
        if (value === '') {
          callback(new Error('请输入标准值'))
        } else {
          if (!num.test(value)) {
            callback(new Error('保留两位小数'))
          }
          callback()
        }
      },
      formateDate: function (time) {
        let date = new Date(time)
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate();
        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + ' ' + h + m + s
      },
    }
  }
}
