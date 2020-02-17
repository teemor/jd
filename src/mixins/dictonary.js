import department from "@/api/system/department";
import file from "@/api/system/file";
import dic from '@/api/system/dictionary'
import ledger from "@/api/file/ledger";
import report from "@/api/system/report";
import platform from "@/api/file/platform";
export default {
    data() {
        return {
            optionProps: { label: "name", value: "id", key: "id" },
            fileDataOptions: [], // 档案级别联动
            fileDpOptions: [],//部门级别联动
            RunningState: [
                { "id": 0, "label": "正常" },
                { "id": 1, "label": "损坏" },
                { "id": 2, "label": "维修" },
                { "id": 3, "label": "报废" }
            ], // 运行状态
            TestState: [
                { "id": 0, "label": "正常" },
                { "id": 1, "label": "待检测" }, // 检测状态
            ],
            rules_platform_report_edit: {
                reportid: [{ required: true, message: "请输入关联报表", trigger: "blur" }],
                platformid: [{ required: true, message: "请输入关联平台", trigger: "blur" }],
                archivesid: [{ required: true, message: "请输入关联档案", trigger: "blur" }],
                cycle: [{ required: true, message: "请输入上报周期", trigger: "blur" }, { type: 'number', message: '必须为数字值' }],
                expect: [{ required: true, message: "请输入报警预期", trigger: "blur" }, { type: 'number', message: '必须为数字值' }],
                person: [{ required: true, message: "请输入负责人", trigger: "blur" }],
            },
            dic_rules: {
                name: [{ required: true, message: "请输入名称", trigger: "blur" }],
                classification: [
                    { required: true, message: "请输入分类", trigger: "blur" }
                ],
                deviceId: [
                    { required: true, message: "请输入设备编号", trigger: "blur" }
                ],
                // correlationId: [
                //     { required: true, message: "请选择检测项目", trigger: "change" }
                // ],
                line: [
                    { required: true, message: "请选择是否在线", trigger: "change" }
                ],
                process: [
                    { required: true, message: "请选择工艺段", trigger: "change" }
                ],
                company: [
                    { required: true, message: "请选择监测单位", trigger: "change" }
                ],
                warehouse: [
                    { required: true, message: "请输入数据仓编号", trigger: "blur" }
                ],
                specifications: [
                    { required: true, message: "请输入规格型号", trigger: "blur" }
                ],
                archivingPerson: [
                    { required: true, message: "请输入建档人", trigger: "blur" }
                ],
                cycle: [{ required: true, message: "请选择末次监测时间", trigger: "blur" }],
                filingTime: [{ required: true, message: "请选择建档时间", trigger: "blur" }],
                department: [{ required: true, message: "请输入运维部门", trigger: "blur" }],
                earlyWarning: [{ required: true, message: "请输入预警天数", trigger: "blur" }, { type: 'number', message: '必须为数字值' }],
                stateid: [{ required: true, message: "请输入运行状态", trigger: "change" }, { type: 'number', message: '必须为数字值' }],
                project: [{ required: true, message: "请输入监测周期", trigger: "blur" }, { type: 'number', message: '必须为数字值' }],
                lastCycle: [{ required: true, message: "请输入检测状态", trigger: "change" }, { type: 'number', message: '必须为数字值' }]
            },
            rules_book_edit: {
                name: [{ required: true, message: "请选择台账名称", trigger: "blur" }],
                abbreviation: [{ required: true, message: "请输入台账简称", trigger: "blur" }],
                number: [{ required: true, message: "请输入编号", trigger: "blur" }, { type: 'number', message: '必须为数字值' }],
                edition: [{ required: true, message: "请输入版本号", trigger: "blur" }],
                position: [{ required: true, message: "请选择位置", trigger: "blur" }],
                person: [{ required: true, message: "请选择负责人", trigger: "blur" }],
                category: [{ required: true, message: "请选择类别", trigger: "blur" }],
                creation: [{ required: true, message: "请选择创建时间", trigger: "blur" }],
                levelid: [{ required: true, message: "请选择上级台账", trigger: "blur" }],
                approval: [{ required: true, message: "请选择是否审批", trigger: "blur" }],
                calculation: [{ required: true, message: "请选择计算周期", trigger: "blur" }, { type: 'number', message: '必须为数字值' }],
                police: [{ required: true, message: "请选择报警预期", trigger: "blur" }],
                reportid: [{ required: true, message: "请选择关联报表", trigger: "change" }],
                archivesid: [{ required: true, message: "请选择关联档案", trigger: "blur" }]
            },
            rules_file_edit: {
                spid: [{ required: true, message: "请选择档案类别", trigger: "blur" }],
                name: [{ required: true, message: "请输入名称", trigger: "blur" }],
                // abbreviation: [{ required: true, message: "请输入档案简称", trigger: "blur" }],
                number: [{ required: true, message: "请输入部门编码", trigger: "blur" }],
                edition: [{ required: true, message: "请输入编号", trigger: "blur" }],
                position: [{ required: true, message: "请输入位置", trigger: "blur" }],
                person: [{ required: true, message: "请输入负责人", trigger: "blur" }],
                // device: [{ required: true, message: "请选择关联设备", trigger: "change" }],
                // sewage: [{ required: true, message: "请选择关联排污口", trigger: "change" }],
                experienced: [{ required: true, message: "请输入经手人", trigger: "blur" }],
                establish: [{ required: true, message: "请输入创建时间", trigger: "blur" }],
                modify: [{ required: true, message: "请输入修改时间", trigger: "blur" }]
            }, // 文件管理
            lineData: [{ label: "是", value: 0 }, { label: "否", value: 1 }], //设备排污口，是否在线
            DepartData: {},//部门
            defaultProps: {//部门
                children: "children",
                label: "name"
            },
            process: [],//工艺段
            company: [],//监测单位
            associatedDrain: [],//排污口
            equipmentDrain: [],//设备
            correlationId: [],// 检测项目
            depSecond: [],
            depFirst: [],
            depThird: [],
            bookLevel: [],
            ReportList: [],//报表字典表
            platformList: [] //平台报表
        }
    },
    watch: {
        // 部门
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },

    methods: {
        // 平台字典表
        selectPlatform() {
            platform.selectAll().then(res => {
                this.platformList = res.data.tableData
            })
        },
        // 报表字典表
        selectReport() {
            report.selectAll().then(res => {
                this.ReportList = res.data.tableData
            })
        },
        // 台账字典表
        selectBook() {
            ledger.selectAll().then(res => {
                this.bookLevel = res.data.tableData
                this.bookLevel.unshift({ id: 0, name: '无' })
            })
        },
        // 档案树形
        selectFile() {
            file.selectAll().then(res => {
                this.fileDataOptions = res.data.data
            })
        },
        // 部门树形
        selectDpTree() {
            department.selectAll().then(res => {
                this.fileDpOptions = res.data.data
            })
        },
        // 部门字典表
        selectDepId(id) {
            department.selectDpall(id).then(res => {
                this.depFirst = res.data.data
                this.depFirst.unshift({ id: -1, name: '无' })
            })
        },
        firstDep(id) {
            department.selectDpall(id).then(res => {
                this.depSecond = res.data.data
                this.depSecond.unshift({ id: -1, name: '无' })
            })
        },
        secondDep(id) {
            department.selectDpall(id).then(res => {
                this.depThird = res.data.data
                this.depThird.unshift({ id: -1, name: '无' })
            })
        },
        thirdDep() {

        },
        // 工艺段字典表
        selectTech() {
            dic.technology().then(res => {
                this.process = res.data
            })
        },
        // 监测单位字典表
        selectUnit() {
            dic.unitManagement().then(res => {
                this.company = res.data
            })
        },
        // 排污口
        selectAsso() {
            dic.associatedDrain().then(res => {
                this.associatedDrain = res.data.tableData
            })
        },
        // 设备
        selectAllEquip() {
            dic.equipmentDrain().then(res => {
                this.equipmentDrain = res.data.tableData
            })
        },
        // 检测项目
        selectItems() {
            dic.selectItems().then(res => {
                console.log(res.data, '检测')
                this.correlationId = res.data.tableData
            })
        },
        // 部门节点点击
        handleNodeClick(data) {
            // this.dataLine = data;
            // 部门管理

        },
        // 部门查询
        selectDep() {
            department.selectAll().then(res => {
                this.DepartData = res.data.data;
                console.log(this.DepartData, "depaertdata");
            });
        },
        // 部门节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
    }
}