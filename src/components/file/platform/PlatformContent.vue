<template>
  <div>
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
      <div v-else>暂未上传</div>
      <!-- <iframe :src="'http://yz.c.ic.ci/'+exceldata.storage" >
      </iframe>-->
      <!-- <el-button size="mini" type="primary" @click="addContent">新增</el-button>
      <el-button size="mini" type="warning" @click="editContent">修改</el-button>
      <el-button size="mini" type="danger" @click="delContent">删除</el-button>
      <el-button size="mini" type="success" @click="saveContent">存档</el-button>-->
    </div>

    <div></div>
  </div>
</template>

<script>
export default {
  props: {
    exceldata: Object
  }
};
</script>

<style>
</style>