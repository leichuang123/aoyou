<template>
  <div class="login-type">
    <div class="tip">
      <img v-if="type === 0" src="../../../assets/image/icon/icon-40@2x.webp" alt="微信扫码登录">
    </div>
    <div class="icon">
      <img v-if="type != 1" @click="typeChange(1)" src="../../../assets/image/icon/icon-39@2x.webp" alt="二维码登录">
      <img v-if="type != 0" @click="typeChange(0)" src="../../../assets/image/icon/icon-47@2x.webp" alt="账号密码登录">
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginType",
  props: {
    type: {
      type: Number,
      default: 0,
    }
  },
  methods: {
    typeChange(val = 0) {
      this.$emit('onChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.login-type{
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .icon{
    cursor: pointer;
    img{
      width: 80px;
    }
  }
  .tip{
    height: 28px;
    transform: translateY(-10px);
    img{
      height: 100%;
    }
  }
}
</style>