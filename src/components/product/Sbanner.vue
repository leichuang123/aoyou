<template>
  <div class="s-banner">
    <img v-if="pic" :src="pic" alt="" class="img">
    <div class="text">
      <div v-if="titleList.t1" class="t1">{{titleList.t1}}</div>
      <div v-if="titleList.t2" class="t2">{{titleList.t2}}</div>
      <div v-if="titleList.t3" class="t3">{{titleList.t3}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sbanner",
  props: {
    titleList: {
      type:Object,
      default: () => {
        return {
          t1: null,
          t2: null,
          t3: null,
        };
      }
    },
    pic: {
      type:String,
      default: ""
    }
  }
}
</script>

<style lang="less" scoped>
.s-banner{
  display: flex;
  justify-content: center;
  align-items: center;
  .img{
    width: 577px;
    margin-right: 126px;
  }
  .text{
    .t1{
      font-size: 20px;
      color: #444444;
      letter-spacing: 0;
      line-height: 26px;
      margin-bottom: 13px;
    }
    .t2{
      font-size: 40px;
      color: #333333;
      letter-spacing: 0;
      margin-bottom: 13px;
    }
    .t3{
      font-size: 18px;
      color: #139AF0;
      letter-spacing: 0;
    }
  }
}
</style>