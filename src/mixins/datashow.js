
import request from "@/api/data/reportonline";

export default {
    data() {
        return {
            datashow: {
                header: [
                    {
                        prop: "name",
                        value: "项目名称"
                    },
                    {
                        prop: "record",
                        value: "数值"
                    }
                ],
                tableData: [
                ]
            }
        }
    },


    methods: {
        // 平台字典表
        //查看
        scanTable(data) {
            request.deviceData(data.deviceid).then(res => {
                this.datashow.tableData = res.data.tableData
            });
        },
    }
}