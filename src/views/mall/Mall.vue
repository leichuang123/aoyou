<template>
  <div>
    <Nav/>
      <router-view></router-view>
    <Foot/>
  </div>
</template>

<script>
import Nav from './components/Nav'
import Foot from '../../layout/components/Foot'

export default {
  name: 'MallLayout',
  components: {
    Nav,
    Foot,
  }
}
</script>