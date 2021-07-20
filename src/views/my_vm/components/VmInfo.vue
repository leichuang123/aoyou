<template>
  <div class="vm-info">
    <div class="top">
      <div class="vm-renew cursor">
        <img src="../../../assets/image/icon/icon-9@2x.webp" alt="主机续费">
        主机续费
      </div>
      <p class="top-tip cursor" @click="showConfig">主机详情<i class="el-icon-d-arrow-right"></i></p>
    </div>
    <div class="center">
      <!-- title -->
      <div class="title">
        <span>云电脑标准版</span>
        <img class="rename cursor" src="../../../assets/image/icon/icon-11@2x.webp" alt="重命名">
      </div>
      <!-- time -->
      <ul class="time">
        <li>
          <img src="../../../assets/image/icon/icon-12@2x.webp" alt="购买时间">
          <span>购买时间：2019-04-18 16:00</span>
        </li>
        <li>
          <img src="../../../assets/image/icon/icon-12@2x.webp" alt="有效期至">
          <span>有效期至：2019-04-18 16:00</span>
        </li>
      </ul>
      <div class="btn-box">
        <button class="btn1">
          <img src="../../../assets/image/icon/icon-14@2x.webp" alt="连接">
          <span>连 接</span>
        </button>
        <button>
          <span>重 启</span>
        </button>
        <button>
          <span>一键还原</span>
        </button>
      </div>
      <div class="cover">
        <img src="../../../assets/image/icon/vm.webp">
      </div>
    </div>
    
    <div class="bottom cursor">
      您也可以通过微信公众号连接主机
      <i class="el-icon-d-arrow-right"></i>
    </div>
    <!-- 升级 -->
    <div class="update cursor">
      <img src="../../../assets/image/icon/icon-15@2x.webp" alt="升级">
      <span>升级</span>
    </div>
  </div>
</template>

<script>
import { ElIcon } from 'element-plus'

export default {
  name: "VmInfo",
  components: {
    ElIcon,
  },
  methods: {
    showConfig() {
      this.$emit('onChange', true);
    }
  }
}
</script>

<style lang="scss" scoped>
.vm-info{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  // transform: scale(0.81);
}
.top, .bottom{
  flex-grow: 0;
  flex-shrink: 0;
  color: $color-l1-l;
  font-size: 10px;
}
.top{
  height: 25px;
  line-height: 25px;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  .top-tip{
    padding-right: 12px;
  }
}
.bottom{
  height: 30px;
}
.vm-renew{
  padding:0 7px;
  height: 25px;
  background: #DDDDDD;
  border-radius: 0 13px 13px 0;
  img{
    width: 10px;
    margin-right: 4px;
  }
}
.center{
  padding-top: 25px;
  color: $color-l1-l;
}
.title{
  height: 30px;
  line-height: 30px;
  font-size: $fontsize-l3;
  text-align: center;
  .rename{
    width: 19px;
    margin-left: 3px;
  }
}
.time{
  margin-top: 6px;
  font-size: $fontsize-l6;
  height: 110px;
  li{
    list-style: none;
    margin-bottom: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      width: 11px;
      height: 11px;
      margin-right: 8px;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }
}
.btn-box{
  height: 62px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  button{
    background: none;
    font-size: $fontsize-l7;
    color: $color-l1-l;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid $color-l1-l;
    height: 28px;
    border-radius: 14px;
    width: 74px;
    margin: 0 6px;
    img{
      width: 14px;
      margin-right: 5px;
    }
  }
  .btn1{
    background: $color-l1-l;
    color: $color-btn;
    
  }
}
.cover{
  width: 221px;
  height: 135px;

  margin: 0 auto;
  img{
    width: 100%;
  }
}
.update{
  position: absolute;
  top: 247px;
  right: 0;
  background-color: $color-btn;
  color: $color-l1-l;
  font-size: $fontsize-l7;
  padding: 0 3px;
  height: 16px;
  border-radius: 8px 0 0 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    width: 9px;
    height: 12px;
    flex-grow: 0;
    margin-right: 3px;
  }
}
</style>