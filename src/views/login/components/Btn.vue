<template>
  <button class="btn">
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'Btn'
}
</script>

<style lang="scss" scoped>
.btn{
  width: 334px;
  height: 47px;
  opacity: 1;
  background: linear-gradient(270deg,#27ceff, #11a0fe);
  border-radius: 33px;
  color: $color-line;
  font-size: $fontsize-l6;
}
</style>