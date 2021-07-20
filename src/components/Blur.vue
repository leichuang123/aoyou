<template>
  <div class="blur">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "Blur"
}
</script>

<style lang="scss" scoped>
.blur{
  width: 100%;
  height: 100%;
  backdrop-filter: blur(20px);
  &::after{
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    z-index: -1;
    background: rgba(251,251,251,0.36);
  }
}
</style>