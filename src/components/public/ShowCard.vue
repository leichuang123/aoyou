<template>
  <div class="why-item" :style="{'height': height + 'px'}">
    <div class="icon" :style="{backgroundImage: `url(${val.icon})`}">
      <div class="squre"></div>
    </div>
    <div class="item-title">{{val.name}}</div>
    <div class="item-desc">
      <p v-for="(item,index) of val.content" :key="index">{{item}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowCard",
  props: {
    val: {
      type: Object,
      default: () => {
        return {}
      }
    },
    height: {
      type: Number,
      default: () => {
        return 340
      }
    }
  }
}
</script>

<style lang="less" scoped>
.why-item {
  width: 264px;
  height: 340px;
  box-sizing: border-box;
  padding: 30px 20px;
  // margin-right: 30px;
  box-shadow: 0 2px 14px 0 rgba(25,165,254,0.10);
  transition: all 0.3s;
  .icon {
    width: 70px;
    height: 70px;
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      width: 33px;
    }
    .squre {
      width: 70px;
      height: 70px;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 5px;
      border: dashed 1px #dfdfdf;
      transition: all 0.3s;
    }
    
  }
  .item-title {
    font-size: 20px;
    color: #333333;
    margin-top: 20px;
    line-height: 28px;
    padding-bottom: 8px;
    position: relative;
    text-align: left;
    transition: all 0.3s;
    &::after {
      content: ' ';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 2px;
      background: #e5e5e5;
      transition: all 0.3s;
    }
  }
  .item-desc {
    font-size: 14px;
    color: #444444;
    line-height: 25px;
    margin-top: 16px;
    height: 150px;
    text-align: left;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
  }
  &:hover {
    border-radius: 10px;
    box-shadow: 0 2px 14px 0 rgba(25,165,254,0.31);
    .icon {
      .squre {
        transform: rotate(-225deg);
        border: 1px dashed #19A5FE;
        border-radius: 5px;
      }
    }
    .item-title {
      color: #19A5FE;
      &::after {
        background: #19A5FE;
      }
    }
  }
}

</style>