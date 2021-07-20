<template>
  <div class="pic-list">
    <img v-if="type === 'crystal'" src="../../assets/images/mine/icon-18.png" alt="水晶">
    <img v-if="type === 'rmb'" src="../../assets/images/mine/icon-17.png" alt="￥">
    <li style="display:flex;" v-for="(item, index) of getNumber" :key="index">
      <img v-if="+item === 0" src="../../assets/images/mine/0.png" alt="0">
      <img v-if="+item === 1" src="../../assets/images/mine/1.png" alt="1">
      <img v-if="+item === 2" src="../../assets/images/mine/2.png" alt="2">
      <img v-if="+item === 3" src="../../assets/images/mine/3.png" alt="3">
      <img v-if="+item === 4" src="../../assets/images/mine/4.png" alt="4">
      <img v-if="+item === 5" src="../../assets/images/mine/5.png" alt="5">
      <img v-if="+item === 6" src="../../assets/images/mine/6.png" alt="6">
      <img v-if="+item === 7" src="../../assets/images/mine/7.png" alt="7">
      <img v-if="+item === 8" src="../../assets/images/mine/8.png" alt="8">
      <img v-if="+item === 9" src="../../assets/images/mine/9.png" alt="9">
    </li> 
   
  </div>
</template>

<script>

export default {
  name: "TicketNum",
  data() {
    return {
      numList: [
        require('../../assets/images/mine/0.png')
      ],
      list: [],
    }
  },
  props: {
    value: {
      default: "0",
    },
    type: {
      type: String,
      default: ""
    }
  },
  mounted() {
    // this.list = this.getNum(this.value);
  },
  methods: {
    // getNum(val = "") {
    //   let arr = [];
    //   for(let item of val) {
    //     arr.push({
    //       val:item,
    //       img: require(`../../assets/images/mine/${item}.png`)
    //     });
    //   }
    //   console.log(arr)
    //   return arr;
    // }
  },
  computed: {
    getNumber() {
      console.log(typeof this.value === 'number' ? this.value.toString() : this.value)
      return typeof this.value === 'number' ? this.value.toString() : this.value;
    }
  }
}
</script>

<style lang="less" scoped>
.pic-list {
  display: flex;
  img{
    height: 25px;
    margin-right: 4px;
  }
}  
</style>