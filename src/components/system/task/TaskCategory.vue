<template>
<!-- 任务类别 -->
  <div id="task-category">
    <div>
      <el-button size="mini" type="primary" @click="addCategory">新增</el-button>
      <general-table 
        :body="tableData" 
        :showPagination="true" 
        :total="tableData.total" 
        :showcheck="false"
        @paginationChange="paginationChange"
      >
         <el-table-column label="停启用" width="200px" align="center">
          <template slot-scope="scope">
            <el-popconfirm
              @onConfirm="changeState(scope.row)"
              :title="scope.row[scope.column.property]=='停用'?'确定启用':'确定停用'+'用户吗'"
            >
              <el-button
                type="text"
                slot="reference"
                size="small"
              >已{{scope.row.stu}}</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="small" @click="editCategory(scope.row)">
              <template>编辑</template>
            </el-button>
            <el-button type="text" icon="el-icon-delete" size="small" @click="delCategory(scope.row)">
              <template>删除</template>
            </el-button>
          </template>
        </el-table-column>
      </general-table>
    </div>
    <el-dialog :title="title" :visible.sync="dialog">
      <el-form :model="form" label-width="150px" ref="form" :rules="rules">
        <el-form-item  label="名称" prop="name">
          <el-input v-model="form.name" placeholder="名称" size="mini"></el-input>
        </el-form-item>
        <!-- <el-form-item label="编码" prop="num">
          <el-input v-model="form.num" placeholder="编码"></el-input>
        </el-form-item> -->
        <el-form-item label="功能模块" prop="model">
          <el-select v-model="form.model" placeholder="请选择功能模块" size="mini">
            <el-option label="迎检任务" value="迎检任务"></el-option>
            <el-option label="巡检任务" value="巡检任务"></el-option>
            <el-option label="专项任务" value="专项任务"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序码" prop="sort">
          <el-input v-model="form.sort" placeholder="排序码" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="stu">
          <el-radio-group v-model="form.stu" size="mini">
            <el-radio value="1" label="启用">启用</el-radio>
            <el-radio value="0" label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSave">保 存</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/api/system/task'
const formData = {
  name: '',//名称
  sort: '',//排序码
  stu: '',//状态
  model: ''//功能模块
}
export default {
  data() {
    return {
      tableData: {
        header: [
          {
            prop: 'name',
            value: '名称'
          },
          {
            prop: 'id',
            value: '编码'
          },
          {
            prop: 'sort',
            value: '排序码'
          },
        ],
        tableData: [],
        total: 0
      },
      form: Object.assign({}, formData),
      dialog: false,
      title: '',
      tip: '',
      rules: {
        name: { required: true, message: '请输入名称', trigger: 'blur' },
        sort: { required: true, message: '请输入排序码', trigger: 'blur' },
      }, 
      pageForm: {
        page: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getCategory({});
  },
  methods: {
    getCategory(model) {
      request.getCategory(JSON.stringify(model) == "{}" ? this.pageForm : model).then(res => {
        console.log(res)
        this.tableData.tableData = res.data.list;
        this.tableData.total = res.data.count;
      })
    },
    addCategory() {
      this.dialog = true;
      this.title = '新增任务类别';
      this.tip = 'add';
      this.form = Object.assign({}, formData)
    },
    addSave() {
      if(this.tip === 'add') {
        console.log(this.form,'新增')
        request.addSave(this.form).then(res => {
          console.log(res)
          this.getCategory({});
          this.dialog = false;
          this.$commonUtils.setMessage("success", "保存成功");
        })
      } else {
        console.log(this.form,'编辑')
        request.editSave(this.form).then(res => {
          console.log(res)
          this.getCategory({});
          this.dialog = false;
          this.$commonUtils.setMessage("success", "编辑成功");
        })
      }
    },
    editCategory(data) {
      this.dialog = true;
      this.title = '编辑任务类别';
      this.tip = 'edit';
      this.form = Object.assign({}, data);
      this.form.id = data.id;
    },
    delCategory(data) {
      this.$confirm("是否删除?","提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        request.delCategory({ id: data.id }).then(res => {
          console.log(res)
          this.getCategory({})
          this.$commonUtils.setMessage("success", "删除成功");
        })
      })
    },
    changeState(data) { 
      request.changeState({ stu: data.stu,id: data.id }).then(res => {
        this.$message({
          type: "success",
          message: `${data.stu == "停用" ? "启用" : "停用"}成功!`
        });
        this.getCategory({});
      });
    },
    // 分页查询
    paginationChange(page,pageSize) {
      this.getCategory({ page: page, pageSize: pageSize });
    },
  }
}
</script>

<style>

</style>