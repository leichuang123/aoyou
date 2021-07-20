<template>
  <!--<Layout>
     <v-app>
      <router-view></router-view>
    </v-app>
    
  </Layout> -->
  <v-app>
    <router-view></router-view>
  </v-app>
  <!-- <router-view></router-view> -->
</template>

<script>
// import Layout from './layout/Layout'
export default {
  name: 'App',
  components: {
    // Layout,
  },
}
</script>

<style lang="less">
.kcy-service-panels {
  .v-expansion-panel-header {
    padding: 0!important;
  }
  .v-expansion-panel-content__wrap {
    padding: 0!important;
  }
}
body{
  font-size: 14px;
}
.k-vendor-title {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 64px 0;
    img {
      width: 100px;
    }
    .text {
      display: inline;
      padding: 0 50px;
      font-size: 26px;
      color: #444444;
    }
  }
button{
  outline: none;
}
.flex{
  display: flex;
}
.flexcenter{
  justify-content: center;
  align-items: center;
}
.flex0{
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
<style>
.v-application p{
  margin-bottom: 0!important;
}
</style>
