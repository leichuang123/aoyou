<template>
  <div class="my-contain" :style="getPropsStyle">
    <Blur>
      <slot/>
    </Blur>
  </div>
</template>

<script>
import Blur from './Blur.vue'
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
  components: {
    Blur,
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
  min-height: 406px;
  box-shadow: 0px 2px 21px 0px #0091ff; 
  border: 1px solid rgba(0,145,255,0.54);
  border-radius: 13px;
  overflow: hidden;
  z-index: 2;
}
</style>