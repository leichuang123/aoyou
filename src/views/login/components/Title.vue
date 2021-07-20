<template>
  <div class="title">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "Title"
}
</script>

<style lang="scss" scoped>
.title{
  border-bottom: 1px solid $color-line;
  font-size: $fontsize-l3;
  text-align: center;
  color: $color-l1-l;
  padding-bottom: 15px;
}
</style>