<template>
  <div class="my-contain" :style="getPropsStyle">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "Contain",
  props: {
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '100px'
    }
  },
  computed: {
    getPropsStyle() {
      return `width:${this.width};height:${this.height};`
    }
  }
}
</script>

<style lang="scss" scoped>
.my-contain{
  position:relative;
  // width: 406px;
  // height: 513px;
  min-height: 406px;
  // box-shadow: 0px 2px 21px 0px #0091ff; 
  // border: 1px solid rgba(0,145,255,0.54);
  // border-radius: 13px;
  // overflow: hidden;
  background: rgba(251,251,251,0.36);
  &::before{
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    z-index: -1;
    -webkit-filter: blur(26px);
    filter: blur(26px);
    background: url('../assets/image/icon-31@2x.webp') no-repeat center center;
    background-size: cover;
    background-attachment:fixed;
  }
  
}
</style>