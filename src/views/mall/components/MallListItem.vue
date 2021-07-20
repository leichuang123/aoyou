
<template>
  <div class="item">
    <div class="tag">{{obj.name}}</div>
    <div class='item-cnt'>
        <img class="cover" :src="obj.cover" />
        <div :style="{textAlign: obj.instructions.length > 14 ? 'left' : 'center'}">{{obj.instructions}}</div>
        <div class="price">{{(obj.daily / 1000).toFixed(0)}}元/天～{{obj.annually / 1000}}元/年</div>
        <button class="buy" @click="buy(obj)">立即购买</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MallListItem',
  components: {},
  props: {
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  async mounted () {},
  methods: { 
    buy (info) {
      this.$emit('buy', info.productNo)
      // this.$router.push(`/mall/detail?productNo=${info.productNo}`)
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  display: inline-block;
  vertical-align: top;
  margin-right: 24px;
  position: relative;
  text-align: center;
  background: rgba(251, 251, 251, .7);
  border: 1px solid #EDEDED;
  box-shadow: inset 0 1px 10px 0 rgba(237,236,236,0.50);
  border-radius: 12px;
  margin-top: 40px;
  .item-cnt {
    width: 280px;
    height: 420px;
    box-sizing: border-box;
    padding: 0 20px 20px 20px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
  }
  &:nth-child(4n) {
    margin-right: 0;
  }
  .tag {
    position: absolute;
    left: 0;
    top: 0;
    background-image: linear-gradient(90deg, #5CC0FF 50%, #11A0FE 100%);
    border: 1px solid #EEEEEE; 
    border-radius: 12px 32px 32px 0;
    font-size: 18px;
    color: #FFFFFF;
    min-width: 136px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    padding: 0 20px;
  }
  .cover {
    // width: 211px;
    // max-height: 132px;
    height: 132px;
    margin: 0 auto;
    margin-top: 75px;
  }
  .intro {
    font-size: 16px;
    color: #444444;
    min-height: 60px;
    text-align: center;
    padding-top: 40px;
  }
  .price {
    padding-top: 8px;
    padding-bottom: 18px;
    font-size: 20px;
    color: #FF5435;
    text-align: center;
  }
  .buy {
    background-image: linear-gradient(270deg, #5CC0FF 0%, #11A0FE 100%);
    border-radius: 25px;
    width: 114px;
    height: 30px;
    text-align: center;
    color: white;
    line-height: 30px;
    font-size: 14px;
    margin: 0 auto;
    cursor: pointer;
  }
}
</style>
