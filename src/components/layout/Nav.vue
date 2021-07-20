<template>
  <div class="nav">
    <div class="btns">
      <div class="items">
        <div class="bg">
          <img src="../../assets/image/icon/icon-1@2x.webp" alt="">
        </div>
        <p>亮度</p>
      </div>
      <div class="items">
        <div class="bg">
          <img src="../../assets/image/icon/icon-2@2x.webp" alt="">
        </div>
        <p>刷新</p>
      </div>
      <div class="items">
        <div class="bg">
          <img src="../../assets/image/icon/icon-3@2x.webp" alt="">
        </div>
        <p>音量</p>
        <!-- <el-slider
          v-model="value"
          vertical
          height="200px">
        </el-slider> -->
      </div>
      <div class="items">
        <div class="bg">
          <img src="../../assets/image/icon/icon-4@2x.webp" alt="">
        </div>
        <p>重启</p>
      </div>
    </div>
    <div class="center">
      <img src="../../assets/image/icon/icon-29@2x.webp" alt="logo">
      <span>{{appName}}</span>
    </div>
    <div class="btns">
      <div class="items">
        <div class="bg">
          <img src="../../assets/image/icon/icon-5@2x.webp" alt="">
        </div>
        <p>关机</p>
      </div>
      <div class="items">
        <div class="bg">
          <img src="../../assets/image/icon/icon-6@2x.webp" alt="">
        </div>
        <p>客服</p>
      </div>
      <div class="items">
        <div class="bg">
          <img src="../../assets/image/icon/icon-7@2x.webp" alt="">
        </div>
        <p>应用中心</p>
      </div>
      <div class="items">
        <div class="bg">
          <img src="../../assets/image/icon/icon-8@2x.webp" alt="">
        </div>
        <p>设置</p>
      </div>
    </div>
  </div>
</template>
<script>
import { ElSlider } from 'element-plus';

import { APP_NAME } from '../../config/text'
export default {
  name: "Nav",
  setup() {
    return {
      appName: APP_NAME
    }
  },
  components: {
    ElSlider
  },
  data() {
    return {
      value: 100
    }
  },
}
</script>

<style lang="scss" scoped>
.nav{
  padding: 26px 0 20px;
  display: flex;
  justify-content: space-around;
}
.center{
  font-size: 26px;
  color: $color-l1-l;
  display: flex;
  align-items: flex-end;
  font-weight: 600;
  img{
    height: 35px;
    width: 58px;
    margin-right: 18px;
    display: block;
  }
  
}
.btns{
  display: flex;
  justify-content: center;
  align-items: center;
}
.items{
  width: 34px;
  min-height: 34px;
  margin: 0 12px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  // justify-content: center;
  align-items: center;
  flex-direction: column;
  .bg{
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }
  &:hover{
    .bg{
      background: $color-hover;
    }
  }
  img{
    width: 100%;
    height: 100%;
  }
  p{
    text-align: center;
    font-size: 10px;
    color: $color-l1-l;
    word-break:keep-all; 
    white-space:nowrap; 
  }
}
</style>