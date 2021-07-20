<template>
  <div>
    <div class="swiper-box">
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
      <div class="hidden" v-if="vmList.length > 0">
        <swiper :loop="false" :navigation="navigation" :space-between="100" class="swiper" >
          <swiper-slide v-for="(item, index) of vmList" :key="index">
            <Vm />
          </swiper-slide>
          <!-- <swiper-slide>
            <Empty />
          </swiper-slide> -->
        </swiper>
      </div>
      <div class="hidden" v-if="vmList.length === 0">
        <Empty>
          <div class="empty-tip cursor">我有激活卡，<span class="blue">去激活<i class="el-icon-d-arrow-right"></i></span></div>
        </Empty>
      </div>
      <div class="bg"></div>
    </div>
    <!-- <Tabs /> -->
  </div>
</template>

<script>
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { ElIcon } from 'element-plus'

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper.scss';
// import Tabs from '../../components/Tabs.vue'
import Vm from './components/Vm.vue'
import Empty from './components/Empty.vue'

import 'swiper/components/navigation/navigation.scss';
SwiperCore.use([Navigation]);
export default {
  name: "myVm",
  components: {
    // Tabs,
    Vm,
    Swiper,
    SwiperSlide,
    Empty,
    ElIcon,
  },
  data() {
    return {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      vmList: [
        {},
        {},
        {}
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
.bg{
  width: 1052px;
  height: 190px;
  background: url('../../assets/image/icon/icon-30@2x.webp') no-repeat center center;
  background-size: contain;
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -526px;
  z-index: -1;
}
.swiper-box{
  position: relative;
  // margin-bottom: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  // overflow: hidden;
  padding-bottom: 37px;
}
.swiper{
  width: 375px;
  // border: 1px solid #fff;
  margin: 0 auto;
}
.hidden{
  width: 1000px;
  height: 407px;
  /* margin: 0 auto; */
  display: flex;
  justify-content: center;
  border: 1px solid #fff;
  // overflow-x: hidden;
  // overflow-y: visible;
  padding: 40px 0;
}
.empty-tip {
  color: $color-l1-l;
  font-size: $fontsize-l7;
  .blue{
    color: $color-primary;
  }
}
</style>
<style>
.swiper-slide{
  transition: 300ms;
  opacity: 0;
}
.swiper-slide-prev{
  transform: translate3d(230px, -50px, 0)  scale(0.81);
  /* transform: scale(0.81); */
  opacity: 0.4;
}
.swiper-slide-next{
  transform: translate3d(-230px, -50px, 0)  scale(0.81);
  opacity: 0.4;
}
.swiper-slide-active{
  /* transform: scale(1.23); */
  opacity: 1;
}
.swiper-container{
}
.swiper-container{
  overflow: visible;
}
.btn{
  background: #fff;
  width: 25px;
  height: 32px;
}


</style>