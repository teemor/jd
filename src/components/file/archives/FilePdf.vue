<template>
  <div id="file">
    <iframe id="previewPdf" :src="url" height="560" width="100%"></iframe>
  </div>
</template>
<script>
import tree from "@/api/system/file";
export default {
  props: {
    url: String
  },
  data() {
    return {
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
  created() {
    this.selectAll();
    // this.$store.dispatch("file/selectArchives");
  },
  methods: {
    handleNodeClick() {},
    // 档案级别树形
    selectAll() {
      tree.selectAll().then(res => {
        this.fileData = res.data.data;
      });
    },
    // 添加文档
    addFile() {
      this.$emit("add");
    },
    // 分页
    paginationChange(page, pageSize) {
      this.$store.dispatch("file/setPageModel", { page, pageSize });
    },
    // 修改
    editFile(data) {
      this.$emit("edit", data);
    },
    // 删除
    delFile(data) {
      this.$confirm("确定删除这条数据么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("file/delData", data.id);
      });
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
</style>