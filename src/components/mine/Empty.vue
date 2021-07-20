<template>
  <div class="empty" :style="style">
    <img :src="getImgUrl" alt="">
    <p>{{tipList[type]}}</p>
  </div>
</template>

<script>
export default {
  name: "Empty",
  props: {
    type: {
      type:Number,
      default: 1,
    },
    width: {
      type:Number,
      default: 400
    },
    height: {
      type:Number,
      default: 300
    }
  },
  data() {
    return {
      tipList:[
        "",
        "您暂未购买主机，请到商城能购买",
        "暂无已到期主机！",
        "暂无消费记录！",
        "暂无推送消息！",
        "暂无优惠券！",
      ],
      style: {
        height: this.height+'px'
      }
    }
  },
  computed: {
    getImgUrl() {
      let index = this.type > 4 ? 1 : this.type
      return require(`@/assets/images/empty/picture-${index}.png`)
    }
  }
}
</script>

<style lang="less" scoped>
.empty{
  // height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  img{
    height: 200px;
    display: block;
    margin: 0 auto 39px;
  }
  p{
    // font-family: PingFangSC-Medium;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #999999;
    letter-spacing: 0;
  }
}
</style>