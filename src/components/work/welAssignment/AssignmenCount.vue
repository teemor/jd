<template>
<!-- 任务统计 -->
  <div id="count">
    <!-- 查询 -->
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="时间">
          <el-date-picker
            v-model="formInline.time"
            type="datetime"
            placeholder="时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查单位">
          <el-input size="mini" v-model="formInline.unit" placeholder="检查单位"></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input size="mini" v-model="formInline.id" placeholder="任务编号"></el-input>
        </el-form-item>
        <el-form-item label="检查结果">
          <el-select v-model="formInline.result" placeholder="请选择结果" size="mini">
            <el-option label="合格" value="合格"></el-option>
            <el-option label="不合格" value="不合格"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchAssi">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="assi-count">
      <div>
        <general-table 
          :body="tableData" 
          :showPagination="true" 
          :total="tableData.total" 
          @paginationChange="paginationChange"
        >
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-view" size="small" @click="countDetail(scope.row)">
                <template>浏览</template>
              </el-button>
            </template>
          </el-table-column>
        </general-table>
      </div>
      <!-- 详情 -->
      <el-dialog :visible.sync="detailDialog">
        <el-form :model="assi_form" label-width="150px" class="assi-form">
          <el-form-item label="任务编号" prop="id" class="form-item">
            <el-input size="mini" v-model="assi_form.id" placeholder="任务编号" disabled></el-input>
          </el-form-item>
          <el-form-item label="任务名称" prop="name" class="form-item">
            <el-input size="mini" v-model="assi_form.name" placeholder="任务名称" disabled></el-input>
          </el-form-item>
          <el-form-item label="检查单位" prop="unit" class="form-item">
            <el-input size="mini" v-model="assi_form.unit" placeholder="检查单位" disabled></el-input>
          </el-form-item>
          <el-form-item label="发布人" prop="person" class="form-item">
            <el-input size="mini" v-model="assi_form.person" placeholder="发布人" disabled></el-input>
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-date-picker
              v-model="assi_form.time"
              type="datetime"
              placeholder="时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任务说明" prop="instruction">
            <el-input type="textarea" v-model="assi_form.instruction" placeholder="请输入任务说明" disabled></el-input>
          </el-form-item>
          <el-form-item label="附件" prop="attachment">
            <el-table :data="assi_form.attachment" class="uplode-table">
              <el-table-column prop="name" label="文件名"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-download" size="small" @click="download(scope.row)">
                    <template>下载</template>
                  </el-button>
                </template>
                
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-table :data="assi_form.dpTable" class="dp-table">
            <el-table-column prop="receiveDp" label="接收部门" align="center" width="150px"></el-table-column>
            <el-table-column prop="receiveName" label="接收人" align="center"></el-table-column>
            <el-table-column prop="list" label="工作清单" align="center"></el-table-column>
          </el-table>
        </el-form>
        <!-- ---------------------------------------------- -->
        <div class="coop-form">
          <el-table :data="coopData">
            <el-table-column prop="receiveDp" label="迎检部门" align="center" width="150px"></el-table-column>
            <el-table-column prop="weldata" label="迎检资料" align="center"></el-table-column>
            <el-table-column prop="welprocess" label="迎检内容" align="center"></el-table-column>
          </el-table>
        </div>
        <!-- ---------------------------------------------- -->
        <el-form :model="result_form" label-width="150px" disabled class="result-form">
          <el-form-item label="总结" prop="summary">
            <el-input type="textarea" v-model="result_form.summary" placeholder="请输入总结" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="结果" prop="result" class="form-item">
            <el-input v-model="result_form.result" size="mini"></el-input>
          </el-form-item>
          <el-table :data="result_form.reformTable" class="reform-table" v-if="result_form.result=='不合格'">
            <el-table-column prop="reformDp" label="迎检部门" align="center" width="150px"></el-table-column>
            <el-table-column prop="reformContent" label="整改内容" align="center"></el-table-column>
            <el-table-column prop="effective" label="整改时效" align="center"></el-table-column>
          </el-table>
          <el-form-item label="总结时间" prop="summaryTime" class="form-item">
            <el-input v-model="result_form.summaryTime" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="经手人" prop="handler" class="form-item">
            <el-input v-model="result_form.handler" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <!-- ----------------------------------------------- -->
        <el-table :data="backData" class="back-table"  v-if="result_form.result=='不合格'">
          <el-table-column prop="reformDp" label="整改部门" width="150px"></el-table-column>
          <el-table-column prop="reformIntroduction" label="整改说明"></el-table-column>
          <el-table-column prop="reformAttachment" label="整改附件">
            <template slot-scope="{row}">
              <p v-for="(item,index) in row.reformAttachment" :key="index">
                <span>{{ item.name }}</span>
                <el-button type="text" icon="el-icon-download" size="small" @click="download(item)">下载</el-button>
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="reformTime" label="整改时间" width="150px"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailDialog=false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
    
  </div>
</template>

<script>
import request from '@/api/work/wel/assignmen_count'

export default {
  data() {
    return {
      tableData: {
        header: [
          {
            prop: "name",
            value: "任务名称"
          },
          {
            prop: "id",
            value: "任务编号"
          },
          {
            prop: "time",
            value: "开始时间"
          },
          {
            prop: "stu",
            value: "状态"
          },
          {
            prop: "unit",
            value: "检查单位"
          },
          {
            prop: "result",
            value: "检查结果"
          }
        ],
        tableData: [],
        total: 0
      },
      formInline: {
        time: '',
        id: '',
        result: '',
        unit: ''
      },
      form: {
        page: 1,
        pageSize: 10
      },
      detailDialog: false,
      assi_form: {
        id: '',
        name: '',
        unit: '',
        time: '',
        person: '',
        personId: '',
        instruction: '',
        attachment: [],
        dpTable: [],
      },
      coopData: [],
      result_form: {
        summary: '',
        result: '',
        reformTable: [],
        summaryTime: '',
        handler: ''
      },
      backData: [],
    }
  },
  mounted() {
    this.getCount({});
  },
  methods: {
    // 任务统计
    getCount(model) {
      request.getCount(JSON.stringify(model) == "{}" ? this.form : model)
      .then(res => {
        console.log(res.data.data)
        this.tableData.tableData = res.data.data;
        this.tableData.total = res.data.count;
      })
    },
    // 浏览
    countDetail(data) {
      console.log(data,'detail')
      this.detailDialog = true;
      this.assi_form.attachment = [];
      this.assi_form.id = data.id;
      this.assi_form.name = data.name;
      this.assi_form.unit = data.unit;
      this.assi_form.time = data.time;
      this.assi_form.person = data.person;
      this.assi_form.personId = data.personId;
      this.assi_form.instruction = data.instruction;
      this.assi_form.dpTable = data.dpTable;
      if(data.attachment !== ''){
        data.attachment.split(',').map((res) => {
          const index = res.replace(/\\/g,"/").lastIndexOf('\/');
          this.assi_form.attachment.push({
            name: res.substring(index+1, res.length),
            url: res
          }) 
        })  
      }
      this.coopData = data.dpTable; 
      this.result_form = data;
      this.backData = data.reformTable;
      this.backData.map((items) => {
        // 处理文件链接
        if(items.reformAttachment !== '') {
          let a = (items.reformAttachment).split(',');  
          let b = [];
          if(a.length > 0) {
            a.forEach(item => {
              var obj = {} 
                let index = item.replace(/\\/g,"/").lastIndexOf('\/');
                let fileName  = item.substring(index + 1, item.length); //最后的文件名截取出来
                this.$set(obj,'name', fileName);
                this.$set(obj,'url', item);  //修改fileList里面的结构（name,url）
                b.push(obj);
            })
          }
          items.reformAttachment = b;
        }
      })
    },
    // 查询任务
    searchAssi() {
      request.searchAssi(this.formInline)
      .then(res => {
        console.log(res)
        this.tableData.tableData = res.data.data
      })
    },
    // 下载附件
    download(data) {
      let url = '';
      if (data.url.indexOf('webapps') !== -1) {
        let index = data.url.lastIndexOf('webapps')
        url = data.url.substr(index+8, data.url.length)
      }
      window.location.href = "http://yz.c.ic.ci/" + url;
    },
    // 分页查询
    paginationChange(page,pageSize) {
      this.getCount({ page: page, pageSize: pageSize });
    },
  }
}
</script>
<style>
#count {
  padding: 10px;
}
#assi-count .assi-form,#assi-count .coop-form,#assi-count .result-form{
  padding-bottom: 20px; 
  border-bottom: 1px rgba(0,0,0,0.2) dashed;
}
#assi-count .coop-form,#assi-count .result-form,#assi-count .back-table{
  padding-top: 20px; 
}
#assi-count .el-form-item{
  margin-bottom: 15px;
  width: 90%;
}
</style>