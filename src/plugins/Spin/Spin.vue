<template>
    <div class="ivu-spin ivu-spin-large ivu-spin-fix">
      <div class="ivu-spin-main">
        <span class="ivu-spin-dot"></span> 
        <div class="ivu-spin-text"></div>
      </div>
    </div>
</template>
 
<script>
    export default {
        name: "BaseSpin"
    }
</script>
 
<style scoped lang="less">
  .ivu-spin-fix {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 12306;
    width: 100%;
    height: 100%;
    background-color: hsla(0,0%,100%,.9);
  }
  .ivu-spin {
    color: #2d8cf0;
    vertical-align: middle;
    text-align: center;
  }

  .ivu-spin-fix .ivu-spin-main {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  } 

  .ivu-spin-large .ivu-spin-dot {
    width: 32px;
    height: 32px;
  }

  .ivu-spin-dot {
    position: relative;
    display: block;
    border-radius: 50%;
    background-color: #2d8cf0;
    width: 20px;
    height: 20px;
    -webkit-animation: ani-spin-bounce 1s 0s ease-in-out infinite;
    animation: ani-spin-bounce 1s 0s ease-in-out infinite;
  }
  .ivu-spin-fix .ivu-spin-dot {
    display: inline-block;
  }

  @keyframes ani-spin-bounce {
    0% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 0;
    }
  }
</style>