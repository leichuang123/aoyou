<template>
  <div class="vmconfig">
    <div class="top">
      <div class="part">
        <p class="label">配置参数</p>
        <p class="content">2vcpu；4G内存；50G硬盘；</p>
      </div>
      <div class="part">
        <p class="label">预装软件</p>
        <p class="content">QQ、微信、微博、百度云、Chrome、钉钉、印象笔记、ACDSee、360解压缩、K-lite、Adobe reader、Adobe flash player；</p>
      </div>
      <div class="part">
        <p class="label">存储说明</p>
        <p class="content">QQ、微信、微博、</p>
      </div>
      <div class="part">
        <p class="label">操作系统</p>
        <p class="content">win100</p>
      </div>
    </div>
    <div class="toggle">
      <i @click="showConfig" class="el-icon-d-arrow-left cursor"></i>
    </div>
  </div>
</template>

<script>
import { ElIcon } from 'element-plus'

export default {
  name: "VmConfig",
  components: {
    ElIcon
  },
  methods: {
    showConfig() {
      this.$emit('onChange', false);
    }
  }
}
</script>

<style lang="scss" scoped>
.vmconfig{
  color: $color-l1-l;
  font-size: $fontsize-l7;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 10px 15px;
}
.top{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow-y: auto;
  .part{
    .label{

    }
    .content{
      margin-top: 11px;
      font-size: 10px;
    }
  }
}
.toggle{
  height: 45px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 15px;
}
</style>