<template>
  <div class="vendor-title">
    <img src="../../assets/images/proxy/icon-20.png" />
    <span class="text">{{title}}</span>
    <img src="../../assets/images/proxy/icon-21.png" />
  </div>
</template>

<script>
export default {
  name: "Title2",
  props: {
    title: {
      type: String,
      default: "标题"
    }
  }
}
</script>

<style lang="less" scoped>
.vendor-title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  img {
    width: 100px;
  }
  .text {
    display: inline;
    padding: 0 50px;
    font-size: 26px;
    color: #444444;
  }
}
</style>