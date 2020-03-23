<template>
<!-- 工艺段 -->
  <div>
    <!-- 新增工艺段 -->
    <div class="btn_contain">
      <el-button size="mini" type="primary" @click="addTech">新增工艺段</el-button>
      <el-button size="mini" type="primary" @click="deleteBatchTech">批量删除</el-button>
    </div>
    <el-dialog title="新增工艺段" :visible.sync="addDialog">
      <el-form :model="add_tech_form" label-width="150px" ref="addForm" :rules="rules">
        <el-form-item  label="名称" prop="name">
          <el-input v-model="add_tech_form.name" placeholder="名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="add_tech_form.code" placeholder="编码" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="排序码" prop="sort">
          <el-input v-model="add_tech_form.sort" placeholder="排序码" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="add_tech_form.state" size="mini">
            <el-radio value="1" label="启用">启用</el-radio>
            <el-radio value="0" label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSaveTech('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 工艺段表格 -->
    <div>
      <general-table
        @state="state"
        :body="tableData"
        :showPagination="true"
        :total="tableData.total"
        @paginationChange="paginationChange"
        @handleSelectionChange = "handleSelectionChange"
      >
        <el-table-column label="详情" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" size="small" @click="detailsTech(scope.row)">
              <template>详情</template>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editTech(scope.row)">
              <template>修改</template>
            </el-button>
            <el-button type="text" icon="el-icon-delete" size="small" @click="deleteTech(scope.row)">
              <template>删除</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <!-- 工艺段详情 -->
    <el-dialog title="工艺段详情" :visible.sync="detailsDialog"> 
      <el-form :model="tech_form" label-width="150px">
        <el-form-item  label="名称" prop="name">
          <el-input v-model="tech_form.name" placeholder="名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="tech_form.code" placeholder="编码" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="排序码" prop="sort">
          <el-input v-model="tech_form.sort" placeholder="排序码" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="tech_form.state" size="mini">
            <el-radio value="1" label="启用">启用</el-radio>
            <el-radio value="0" label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsDialog = false" type="primary">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 修改工艺段 -->
    <el-dialog title="修改工艺段" :visible.sync="editDialog"> 
      <el-form :model="edit_tech_form" label-width="150px" ref="editForm" :rules="rules">
        <el-form-item  label="名称" prop="name">
          <el-input v-model="edit_tech_form.name" placeholder="名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="edit_tech_form.code" placeholder="编码" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="排序码" prop="sort">
          <el-input v-model="edit_tech_form.sort" placeholder="排序码" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="edit_tech_form.state" size="mini">
            <el-radio value="1" label="启用">启用</el-radio>
            <el-radio value="0" label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSaveTech('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/system/section';
export default {
  data() {
    return {
      add_tech_form: {
        name: "",
        code: "",
        sort: "",
        state: "启用"
      },
      addDialog: false,
      tableData: {
        header: [
          {
            prop: "name",
            value: "名称"
          },
          {
            prop: "code",
            value: "编码"
          },
          {
            prop: "sort",
            value: "排序码"
          },
          {
            prop: "state",
            value: "状态"
          }
        ],
        tableData: [],
        total :0
      },
      form: {
        page: 1,
        pageSize: 10
      },
      editDialog: false,
      edit_tech_form: {
        name: "",
        code: "",
        sort: "",
        state: ""
      },
      detailsDialog: false,
      tech_form: {
        name: "",
        code: "",
        sort: "",
        state: ""
      },
      idBatch: [],
      rules: {
        name: [
          { required: true, message: '请输入工艺段名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序码', trigger:'blur' }
        ]
      }
    };
  },
  mounted() {
    this.getTech({});
  },
  methods: {
    // 工艺段表格
    getTech(model) {
      request.getTech(JSON.stringify(model) == "{}" ? this.form : model)
      .then(res => {
        this.tableData.tableData = res.data.list;
        this.tableData.total = res.data.total;
      })
    },
    // 工艺段详情
    detailsTech(data) {
      this.tech_form = data;
      this.detailsDialog = true;
    },
    // 新增工艺段
    addTech() {
      this.addDialog = true;
    },
    addSaveTech(formName) {
      this.$refs[formName].validate((pass) => {
        if(pass){
          request.addSaveTech(this.add_tech_form).then(res => {
            this.getTech({});
            this.add_tech_form = { state: "启用" };
            this.addDialog = false;
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          })
        } else {
          this.$commonUtils.setMessage("error", "请正确填写信息");
        }
      })
    },
    // 修改工艺段
    editTech(data) {  
      this.edit_tech_form = data;
      this.editDialog = true;
    },
    editSaveTech(formName) {
      this.$refs[formName].validate((pass) => {
        if(pass){
           request.editSaveTech(this.edit_tech_form).then(res => {
            this.getTech({});
            this.editDialog = false;
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          })
        } else {
          this.$commonUtils.setMessage("error", "请正确填写信息");
          this.getTech({});
        }
      })
    },
    // 删除工艺段
    deleteTech(data) {
      this.$confirm('此操作将删除该工艺段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.deleteTech(data).then(res => {
            if(res.data === 1) {
              this.getTech({});
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'error',
                message: '此工艺段正在被设备使用!'
              });
            }
          })  
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 停启用
    state(data) {
      request.statusTech({ id:data.id,state: data.state }).then(res => {
        this.getTech({});
        this.$message({
          type: 'success',
          message: '状态更改成功!'
        });
      })
    },
    // 分页查询
    paginationChange(page, pageSize) {
      this.getTech({ page: page, pageSize: pageSize });
    },
    // 批量删除
    handleSelectionChange(data) {
      this.idBatch = data.map(res => {
        return res.id
      })
    },
    deleteBatchTech() {
      if (this.idBatch.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择删除的工艺段!"
        });
      } else {
        this.$confirm('此操作将删除该工艺段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.deleteBatchTech({ idBatch:this.idBatch.join() }).then(res => {
            this.getTech({});
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        })
      }
    }
  }
}
</script>
<style>

</style>