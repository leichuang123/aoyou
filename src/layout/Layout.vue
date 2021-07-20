<template>
  <div class="bg">
    <Nav/>
    <router-view />
    <Foot/>
  </div>
</template>

<script>
import Nav from './components/Nav'
import Foot from './components/Foot'

export default {
  name: 'Layout',
  components: {
    Nav,
    Foot,
  }
}
</script>

<style lang="less" scoped>

</style>