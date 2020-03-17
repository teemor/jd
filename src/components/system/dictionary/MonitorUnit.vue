<template>
<!-- 检测单位 -->
  <div>
    <!-- 新增检测单位 -->
    <div class="btn_contain">
      <el-button size="mini" type="primary" @click="addUnit">新增监测单位</el-button>
      <el-button size="mini" type="primary" @click="deleteBatchUnit">批量删除</el-button>
    </div>
    <el-dialog title="新增监测单位" :visible.sync="addDialog">
      <el-form :model="add_unit_form" label-width="150px" ref="addForm" :rules="rules">
        <el-form-item  label="单位名称" prop="name">
          <el-input v-model="add_unit_form.name" placeholder="单位名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="photo" 
        :rules="[{ required: true, validator: telephone, trigger: 'blur' }]">
          <el-input v-model="add_unit_form.photo" placeholder="联系电话" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="add_unit_form.contact" placeholder="联系人" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="检测类型" prop="type">
          <el-select v-model="add_unit_form.type" placeholder="请选择检测类型" size="mini">
            <el-option label="设备" value="设备"></el-option>
            <el-option label="环境" value="环境"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="add_unit_form.state" size="mini">
            <el-radio label= "启用"></el-radio>
            <el-radio label= "停用"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSaveUnit('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 检测单位表格 -->
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
            <el-button type="text" icon="el-icon-view" size="small" @click="detailsUnit(scope.row)">
              <template>详情</template>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editUnit(scope.row)">
              <template>修改</template>
            </el-button>
            <el-button type="text" icon="el-icon-delete" size="small" @click="deleteUnit(scope.row)">
              <template>删除</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <!-- 监测单位详情 -->
    <el-dialog title="监测单位详情" :visible.sync="detailsDialog">
      <el-form :model="unit_form" label-width="150px">
        <el-form-item  label="单位名称">
          <el-input v-model="unit_form.name" placeholder="单位名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="unit_form.photo" placeholder="联系电话" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="unit_form.contact" placeholder="联系人" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="检测类型">
          <el-select v-model="unit_form.type" placeholder="请选择检测类型" size="mini">
            <el-option label="设备" value="设备"></el-option>
            <el-option label="环境" value="环境"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="unit_form.state" size="mini">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsDialog = false" type="primary">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 修改监测单位 -->
    <el-dialog title="修改监测单位" :visible.sync="editDialog">
      <el-form :model="edit_unit_form" label-width="150px" ref="editForm" :rules="rules">
        <el-form-item  label="单位名称" prop="name">
          <el-input v-model="edit_unit_form.name" placeholder="单位名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="photo"
          :rules="[{ required: true, validator: telephone, trigger: 'blur' }]">
          <el-input v-model="edit_unit_form.photo" placeholder="联系电话" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="edit_unit_form.contact" placeholder="联系人" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="检测类型">
          <el-select v-model="edit_unit_form.type" placeholder="请选择检测类型" size="mini">
            <el-option label="设备" value="设备"></el-option>
            <el-option label="环境" value="环境"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="edit_unit_form.state" size="mini">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSaveUnit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import request from '@/api/system/units';
import validate from "@/mixins/validate";
export default {
  mixins: [validate],
  data() {
    return{
      tableData:{
        header:[
          {
            prop:"name",
            value:"单位名称"
          },
          {
            prop:"photo",
            value:"电话"
          },
          {
            prop:"contact",
            value:"联系人"
          },
          {
            prop:"type",
            value:"检测类型"
          },
          {
            prop:"state",
            value:"状态"
          }
        ],
        tableData:[],
        total: 0
      },
      edit_unit_form: {
        name: "",
        photo: "",
        contact: "",
        type: "",
        state: ""
      },
      editDialog: false,
      addDialog: false,
      add_unit_form: {
        name: "",
        photo: "",
        contact: "",
        type: "设备",
        state: "启用"
      },
      form: {
        page: 1,
        pageSize: 10
      },
      detailsDialog: false,
      unit_form: {
        name: "",
        photo: "",
        contact: "",
        type: "",
        state: ""
      },
      idBatch: [],
      rules: {
        name: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
      }
    };
  },
  mounted() {
    this.getUnit({});
  },
  methods: {
    // 获取监测单位
    getUnit(model) {
      request.getUnit(JSON.stringify(model) == "{}" ? this.form : model)
      .then(res => {
        this.tableData.tableData = res.data.list;
        this.tableData.total = res.data.total;
      })
    },
    // 监测单位详情
    detailsUnit(data) {
      this.unit_form = data;
      this.detailsDialog = true;
    },
    // 新增监测单位
    addUnit() {
      this.addDialog = true;
    },
    addSaveUnit(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          request.addSaveUnit(this.add_unit_form).then(res => {
            this.getUnit({});
            this.add_unit_form = { state:"启用" };
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
    // 修改检测单位
    editUnit(data) {
      this.edit_unit_form = data;
      this.editDialog = true;
    },
    editSaveUnit(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid){
          request.editSaveUnit(this.edit_unit_form).then(res => {
            this.getUnit({});
            this.editDialog = false;
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          })
        } else {
          this.getUnit({});
          this.$commonUtils.setMessage("error", "请正确填写信息");
        }
      })
      
    },
    // 删除检测单位
    deleteUnit(data) {
      this.$confirm('此操作将删除该监测单位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.deleteUnit(data).then(res => {
            if(res.data === 1){
              this.getUnit({});
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'error',
                message: '此监测单位正在被设备使用!'
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
    // 停启检测单位
    state(data) {
      request.statusUnit({ id: data.id,state: data.state }).then(res =>{
        this.getUnit({});
        this.$message({
          type: 'success',
          message: '状态更改成功!'
        });
      })
    },
    // 分页查询
    paginationChange(page, pageSize) {
      this.getUnit({ page: page, pageSize: pageSize });
    },
    // 批量删除
    handleSelectionChange(data){
      this.idBatch = data.map(res => {
        return res.id;
      })
    },
    deleteBatchUnit(){
      if (this.idBatch.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择删除的单位!"
        });
      } else {
        this.$confirm('此操作将删除该监测单位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request.deleteBatchUnit({ idBatch:this.idBatch.join() }).then(res => {
            this.getUnit({});
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
    },
  }
}
</script>
<style>

</style>