<template>
  <div class="contain">
    <Nav/>
    <div class="content">
      <router-view></router-view>
      <Tabs />
    </div>
    <!-- <Foot/> -->
  </div>
</template>

<script>
import Nav from './components/layout/Nav.vue'
import Foot from './components/layout/Foot.vue'
import Tabs from './components/Tabs.vue'
export default {
  name: 'App',
  components: {
    Nav,
    Foot,
    Tabs,
  }
}
</script>

<style lang="scss">
body{
  background: url('./assets/image/icon-31@2x.webp') no-repeat center center #000;
  background-size: cover;
  background-attachment:fixed;
  width: 100vw;
  height: 100vh;
  background: url('./assets/image/icon-31@2x.webp') no-repeat center center #000;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}
.mine-transparent-table {
  background: transparent!important;
  
  @media screen and (max-width: $media-max) {
    
  }
  .is-scrolling-none {
    &::-webkit-scrollbar {
      // background: transparent!important;
    }
  }
  .cell {
    color: $color-l1-l;
  }
  
  thead {
    th {
      padding-top: 30px!important;
      padding-bottom: 24px!important;
      border-bottom: solid 1px rgba(255, 255, 255, .4)!important;
      @media screen and (max-width: $media-max) {
        padding-top: 19px!important;
        padding-bottom: 17px!important;
      }
    }
  }
  tbody {
    td {
      padding-top: 24px!important;
      padding-bottom: 24px!important;
      border-bottom: solid 1px rgba(255, 255, 255, .4)!important;
      @media screen and (max-width: $media-max) {
        padding-top: 13px!important;
        padding-bottom: 13px!important;
      }
    }
  }
  tr {
    background: transparent!important;
    &:hover {
      background: transparent!important;
      td {
        background: transparent!important;
      }
    }
  }
  th {
    background: transparent!important;
  }
}

.mine-reboot-dialog {
  .el-dialog__body {
    padding: 10px 2px!important;
  }
}

.mine-transparent-table::before {
  display: none!important;
}

.mine-el-pagin {
  margin-top: 40px;
  color: $color-l1-l;
  .el-pagination__total, .el-pagination__jump{
     color: $color-l1-l!important;
  }
  .el-pagination__jump {
    .el-input__inner {
      background: transparent!important;
      color: $color-l1-l;
    }
  }
  .btn-prev, .btn-next {
    background: transparent!important;
  }
  .el-pager {
    li {
      background: transparent!important;
      color: $color-l1-l;
    }
  }
  
  .select-trigger {
    .el-input__inner {
      background: transparent!important;
      color: $color-l1-l;
    }
  }
}
.border-bottom-opacity-4-line {
  border-bottom: solid 1px rgba(255, 255, 255, .4);
}

.mine-tabs {
  .el-tabs__nav-wrap{
    &::after {
      height: 1px;
      background-color: $color-primary;
    }
  }

  .el-tabs__nav {
    
    .el-tabs__item {
      // background-color: red;
      height: 46px!important;
      line-height: 46px!important;
      @media screen and (max-width: $media-max) {
        height: 33px!important;
        line-height: 33px!important;
        font-size: $fontsize-l5!important;
      }
      &:nth-child(2) {
        margin-left: 40px!important;
        @media screen and (max-width: $media-max) {
          margin-left: 33px;
        }
      }
      
    }
  }
  
  .el-tabs__item {
    .tab-pane-name {
      color: rgba(255, 255, 255, .7)!important;
      padding: 0 15px;
      font-size: $fontsize-l3;
      @media screen and (max-width: $media-max) {
        padding: 0 8px!important;
        font-size: $fontsize-l5!important;
      }
    }
  }

  .is-active {
    .tab-pane-name {
      color: $color-l1-l!important;
      text-align: center;
      background-color: $color-primary;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      font-weight: 600;
    }
  }

  .el-tabs__active-bar {
    display: none!important;
  }
}

.transparent-input {
  input {
    background: transparent;
    border: none;
    color: #fff;
  }
}

.transparent-select {
  .el-input__inner {
    background: transparent;
    color: #fff;
    border: solid 1px #fff!important;
    &:focus {
      border: solid 1px #fff!important;
    }
  }
}

.mine-change-mobile {
  .input {
    input {
      background: transparent;
      border: none;
      color: $color-l1-l;
      &::-webkit-outer-spin-button {
        display: none!important;
      }
      &::-webkit-inner-spin-button {
        display: none!important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>

.contain{
  display: flex;
  flex-direction: column;
}
.content{
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
}
</style>
