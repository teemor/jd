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
    </div>
    <div v-else>
      暂未上传
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