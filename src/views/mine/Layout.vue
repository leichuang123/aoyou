<template>
  <div class="bg">
    <Nav />
    <router-view></router-view>
    <Foot />
  </div>
</template>

<script>
import Nav from '../../layout/components/Nav'
import Foot from '../../layout/components/Foot'

export default {
  name: "Layout",
  components: {
    Nav,
    Foot,
  }
}
</script>

<style lang="less" scoped>
.bg{
  background: #f9f9f9;
}
</style>