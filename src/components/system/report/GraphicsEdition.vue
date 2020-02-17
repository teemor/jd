<template>
  <div id="graphics">
    <div class="btn_contain">
      <el-button size="mini" type="primary" @click="add">新增</el-button>
      <el-button size="mini" type="primary" @click="deleteAll">批量删除</el-button>
    </div>
    <div>
      <general-table
        :body="tableData"
        :showPagination="true"
        :total="tableData.total"
        @paginationChange="paginationChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="选择" align="center">
          <template slot-scope="scope">
            <el-popconfirm
              confirmButtonText="好的"
              @onConfirm="stateChoose(scope.row)"
              cancelButtonText="不用了"
              iconColor="red"
              :title="scope.row['state']=== '未选'?'确定选择吗':'取消选择吗'"
            >
              <el-button type="text" size="small" slot="reference">{{scope.row['state']}}</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              size="small"
              @click="editGraphics(scope.row)"
            >
              <template>编辑</template>
            </el-button>
            <el-popconfirm
              confirmButtonText="好的"
              @onConfirm="deleteGraphic(scope.row)"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              title="确定删除吗？"
            >
              <el-button type="text" icon="el-icon-delete" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <el-dialog :visible.sync="GraphicsDialog" width="80%">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        :rules="pic_rules"
        ref="form"
      >
        <el-row style="margin-left:10%">
          <el-form-item label="图形名称" prop="name">
            <el-input size="mini" v-model="formInline.name" placeholder="图形名称"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="num">
            <el-input size="mini" v-model="formInline.num" placeholder="编号"></el-input>
          </el-form-item>
          <el-form-item label="创建人" prop="founder">
            <el-input size="mini" v-model="formInline.founder" placeholder="创建人"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="creation">
            <el-date-picker
              size="mini"
              v-model="formInline.creation"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row style="width:90%;margin-left:7%；">
          <el-col :span="8" v-for="(item,index) in picData" :key="index">
            <img
              :src="item.url"
              @click="picChoose(index ,item.id)"
              style="margin-bottom:20px"
              :class="ind == index?'shadow':''"
            />
          </el-col>
        </el-row>
        <el-row v-if="pieShow" style="width: 80%;margin-left:10%">
          <el-form-item label="时间轴" prop="remarks">
            <el-select size="mini" v-model="formInline.axis" placeholder="时间轴">
              <el-option
                size="mini"
                v-for="item in axis"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row>
          <el-table :data="sourceList" style="width: 80%;margin-left:10%">
            <el-table-column prop="num" label="序号" width="180"></el-table-column>
            <el-table-column prop="name" label="名称" width="180">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.name" placeholder="请输入名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="数据源">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.source" placeholder="请输入数据源"></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, sourceList)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-left:10%">
          <el-button icon="el-icon-plus" size="mini" type="info" @click="addLine"></el-button>
        </el-row>
        <el-row class="fr">
          <el-button size="mini" type="primary" @click="saveALL">保存</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="GraphicsEditDialog" width="80%">
      <el-form
        :inline="true"
        :model="editInline"
        class="demo-form-inline"
        :rules="pic_rules"
        ref="form"
      >
        <el-row style="margin-left:10%">
          <el-form-item label="图形名称" prop="name">
            <el-input size="mini" v-model="editInline.name" placeholder="图形名称"></el-input>
          </el-form-item>
          <el-form-item label="编号" prop="num">
            <el-input size="mini" v-model="editInline.num" placeholder="编号"></el-input>
          </el-form-item>
          <el-form-item label="创建人" prop="founder">
            <el-input size="mini" v-model="editInline.founder" placeholder="创建人"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="creation">
            <el-date-picker
              size="mini"
              v-model="editInline.creation"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row style="width:90%;margin-left:7%；">
          <el-col :span="8" v-for="(item,index) in picData" :key="index">
            <img
              :src="item.url"
              @click="picChoose(index ,item.id)"
              style="margin-bottom:20px"
              :class="ind == index?'shadow':''"
            />
          </el-col>
        </el-row>
        <el-row v-if="pieShow" style="width: 80%;margin-left:10%">
          <el-form-item label="时间轴" prop="remarks">
            <el-select size="mini" v-model="editInline.axis" placeholder="时间轴">
              <el-option
                size="mini"
                v-for="item in axis"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-table :data="editInline.sourceList" style="width: 80%;margin-left:10%">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" label="名称" width="180">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.name" placeholder="请输入名称"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="数据源">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.source" placeholder="请输入数据源"></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, sourceList)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-left:10%">
          <el-button icon="el-icon-plus" size="mini" type="info" @click="addLine"></el-button>
        </el-row>
        <el-row class="fr">
          <el-button size="mini" type="primary" @click="editAll">保存</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/api/system/graphics";

export default {
  data() {
    return {
      GraphicsEditDialog: false,
      editInline: {
        template: "",
        name: "",
        num: "",
        founder: "",
        creation: "",
        axis: "",
        sourceList: ""
      },
      tableData: {
        header: [
          {
            prop: "name",
            value: "图形名称"
          },
          {
            prop: "num",
            value: "编号"
          },
          {
            prop: "templatename",
            value: "图形"
          },
          {
            prop: "founder",
            value: "创建人"
          },
          {
            prop: "creation",
            value: "创建日期"
          }
        ],
        tableData: [],
        total: 0
      },
      form: {
        page: 1,
        pageSize: 10
      },
      ind: 0,
      active: "",
      pieShow: true,
      picData: [
        { url: require("../../../assets/img/bar.png"), id: 2 },
        { url: require("../../../assets/img/line.png"), id: 1 },
        { url: require("../../../assets/img/pie.png"), id: 3 }
      ],
      axis: [
        { name: "年", id: 1 },
        { name: "季", id: 2 },
        { name: "月", id: 3 },
        { name: "周", id: 4 },
        { name: "日", id: 5 },
        { name: "时", id: 6 }
      ], // 时间轴
      pic_rules: {
        name: [{ required: true, message: "请输入图形名称", trigger: "blur" }],
        num: [{ required: true, message: "请输入编号", trigger: "blur" }],
        founder: [{ required: true, message: "请输入创建人", trigger: "blur" }],
        creation: [
          { required: true, message: "请输入创建时间", trigger: "blur" }
        ]
      },
      idBatch: "",
      GraphicsDialog: false,
      editForm: {},
      formInline: {
        template: 1,
        name: "",
        num: "",
        founder: "",
        creation: "",
        axis: ""
      },
      sourceList: [
        {
          num: 1,
          name: "",
          source: ""
        }
      ]
    };
  },
  mounted() {
    this.selectGraphic({});
  },
  methods: {
    // 编辑
    editGraphics(data) {
      this.GraphicsEditDialog = true;
      this.editInline.id = data.id;
      this.editInline.name = data.name;
      this.editInline.num = data.num;
      this.editInline.founder = data.founder;
      this.editInline.creation = data.creation;
      this.editInline.template = data.template;
      // 图形绑定
      if (data.template == 2) {
        this.ind = 0;
      } else if (data.template == 3) {
        this.pieShow = false;
        this.ind = 2;
      } else {
        this.ind = 1;
      }
      this.editInline.sourceList = data.sourceList;
      this.editInline.axis = data.axis;
    },
    // 提交编辑
    editAll() {
      request.updateGraphic(this.editInline).then(res => {
        if (res.data === "update") {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.selectGraphic({});
        }
      });
      this.GraphicsEditDialog = false;
    },
    // 移除数据
    deleteRow(index, rows) {
      console.log(rows, "rows");
      rows.splice(index, 1);
      console.log(rows, "data");
    },
    // 修改图形状态
    stateChoose(data) {
      request.state(data.id).then(res => {
        if (res.data === "success") {
          this.$commonUtils.setMessage("success", "修改成功");
          this.selectGraphic({});
        } else {
          this.$commonUtils.setMessage("info", "更改失败");
        }
      });
    },
    // 删除
    deleteGraphic(data) {
      request.deleteGraphic({ id: data.id }).then(res => {
        if (res.data === "delete") {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.selectGraphic({});
        }
      });
    },
    // 查询所有
    selectGraphic(model) {
      request
        .selectGraphic(JSON.stringify(model) == "{}" ? this.form : model)
        .then(res => {
          console.log(res.data, "康康");
          if (
            res.data.tableData.length === 0 &&
            res.data.totalItem !== 0
          ) {
            this.selectGraphic({ page: 1, pageSize: 10 });
          }
          this.tableData.tableData = res.data.tableData;
          this.tableData.total = res.data.totalItem;
        });
    },

    // 新增一行
    addLine() {
      if (
        this.sourceList[this.sourceList.length - 1].name !== "" &&
        this.sourceList[this.sourceList.length - 1].num !== ""
      ) {
        this.sourceList.push({
          num: this.sourceList[this.sourceList.length - 1].num + 1,
          name: "",
          source: ""
        });
      } else {
        this.$commonUtils.setMessage("error", "请输入数据");
      }
    },
    // 保存
    saveALL() {
      this.formInline.sourceList = this.sourceList.map(item => {
        return {
          name: item.name,
          source: item.source
        };
      });

      this.$refs.form.validate(val => {
        this.formInline.axis =
          this.formInline.axis == ""
            ? this.formInline.template == 3
              ? 0
              : this.formInline.axis
            : this.formInline.axis;
        if (val && this.formInline.axis !== "") {
          request.addGraphic(this.formInline).then(res => {
            if (res.data === "insert") {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.GraphicsDialog = false;
              this.selectGraphic({});
            } else if (res.data === "repeat") {
              this.$commonUtils.setMessage("info", "重复字段");
            }
          });
        } else {
          this.$commonUtils.setMessage("error", "提交错误！请填完整信息");
        }
      });
    },

    // 图形选择
    picChoose(index, data) {
      this.ind = index;
      this.formInline.template = data;
      this.editInline.template = data;
      if (data === 2 || data === 1) {
        this.pieShow = true;
      } else {
        this.pieShow = false;
      }
    },
    // 多选操作
    handleSelectionChange(val) {
      this.idBatch = val.map(item => {
        return item.id;
      });
    },
    // 分页
    paginationChange(page, pageSize) {
      this.form.page = page;
      this.form.pageSize = pageSize;
      this.selectGraphic({ page: page, pageSize: pageSize });
    },
    add() {
      this.formInline.name = "";
      this.formInline.num = "";
      this.formInline.founder = "";
      this.formInline.creation = "";
      this.sourceList = [
        {
          num: 1,
          name: "",
          source: ""
        }
      ];
      this.GraphicsDialog = true;
    },
    deleteAll() {
      if (this.idBatch == "") {
        this.$message({
          type: "warning",
          message: "请选择删除的选项!"
        });
      } else {
        this.$confirm("此操作将永久删除该选项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            request
              .deleteAllGraphic({ idBatch: this.idBatch.join() })
              .then(res => {
                if (res.data === "deleteBatch!!") {
                  this.$commonUtils.setMessage("success", "删除成功");
                  this.selectGraphic({});
                }
              });
          })
          .catch(() => {
            this.$commonUtils.setMessage("info", "已取消删除");
          });
      }
    }
  }
};
</script>

<style>
#graphics .el-dialog__body {
  padding: 10px 20px 60px 30px;
}
.shadow {
  box-shadow: 10px 10px 5px #888888;
}
</style>