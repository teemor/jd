
import commonUtils from "@/assets/util/commonUtil";

export default {
    data() {
        return {
            uname: ""
        }
    },


    methods: {
        // 获取用户名
        showName() {
            let userInfo = JSON.parse(commonUtils.getCookie("id"));
            this.uname = userInfo.uname;
        },
    }
}