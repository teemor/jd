<template>
  <div id="file">
    <div class="fl treebg" style="min-width:230px;width:10%;">
      <el-tree
        @node-click="handleNodeClick"
        class="filter-tree"
        :data="$store.state.state.allTree"
        default-expand-all
        :props="defaultProps"
        ref="tree2"
      ></el-tree>
    </div>
    <div class="fl" style="width:70%;margin:20px 15px">
      <el-row>
        <el-form ref="file" :model="searchData" label-width="80px">
          <el-col :span="8">
            <el-form-item label="时间" prop="abbreviation">
              <el-date-picker  type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-top:7px;margin-left:50px">
            <el-button size="mini" type="primary" @click="addFile">查询</el-button>
          </el-col>
        </el-form>
      </el-row>

      <div v-if="exceldata.name">
        {{exceldata.name}}
        <div v-if="exceldata.storage">
          <iframe
            :src="'https://view.officeapps.live.com/op/embed.aspx?src=http://yz.c.ic.ci/'+exceldata.storage"
            width="1366px"
            height="623px"
            frameborder="0"
          ></iframe>
        </div>
      </div>
      <div v-else>暂未上传</div>
      <div></div>
    </div>
    <el-dialog :visible.sync="pdfbox">
      <file-pdf :url="url" />
    </el-dialog>
  </div>
</template>
<script>
import tree from "@/api/system/file";
import request from "@/api/file/ledger";
export default {
  data() {
    return {
      exceldata: {},
      pdfbox: false,
      url: "",
      searchData: {
        abbreviation: "",
        sewage: "",
        device: "",
        number: "",
        position: ""
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      fileData: []
    };
  },

  mounted() {
    this.$store.dispatch("state/getAllTree");
    // this.selectAll();
  },
  methods: {
    handleNodeClick(data) {
      let page = 1;
      let pageSize = 10;
      request.findById(data.relationid).then(res => {
        this.exceldata = res.data;
        console.log(res, "内容");
      });
      this.$store.dispatch("file/selectArchives", { spid: data.id });
      this.$store.commit("file/spid", { spid: data.id });
    },
    // 档案级别树形
    selectAll() {
      tree.selectAll().then(res => {
        this.fileData = res.data.data;
      });
    },
    scan(url) {
      console.log("hehe");
      this.pdfbox = true;
      this.url = url;
      // this.$emit("scan",url)
    },
    // 添加文档
    addFile() {
      this.$emit("add");
    },
    // 分页
    paginationChange(page, pageSize) {
      this.$store.commit("file/FILE_PAGE_SIZE", { page, pageSize });
      console.log(this.$store.state);
      this.$store.dispatch("file/selectArchives", {
        spid: this.$store.state.file.spid
      });
    },
    // 修改
    editFile(data) {
      this.$emit("edit");
      this.$store.commit("file/getModifyCodeData", data);
      this.$store.commit("file/getId", { id: data.id });
    },
    // 删除
    delFile(data) {
      this.$store.dispatch("file/delData", data.id);
    }
  }
};
</script>
<style>
#file .treebg {
  width: 200px;
  border-right: 1px solid #e8e8e8;
  padding: 40px;
  height: 600px;
  background: #f4f4f5;
}
#file .el-tree {
  background: #f4f4f5;
}
</style>