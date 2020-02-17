<template>
  <div class="main">
    <div class="exception">
      <div class="img">
        <img src="../../assets/img/404.svg" />
      </div>
      <div class="content">
        <h1>404</h1>
        <div class="desc">抱歉，你访问的页面仍在开发中</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.exception .content {
  display: inline-block;
  flex: auto;
}
.exception {
  min-height: 500px;
  height: 80%;
  -ms-flex-align: center;
  align-items: center;
  text-align: center;
  margin-top: 150px;
}
.exception .img {
  display: inline;
  padding-right: 52px;
  zoom: 1;
}
.exception .img img {
  height: 360px;
  max-width: 430px;
}
img {
  vertical-align: middle;
  border-style: none;
}
.exception .content h1 {
  color: #434e59;
  font-size: 72px;
  font-weight: 600;
  line-height: 72px;
  margin-bottom: 24px;
}
.exception .content .desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 20px;
  line-height: 28px;
  margin-bottom: 16px;
}
</style>