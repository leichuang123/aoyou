<template>
  <div class="mine">
    <div class="main">
      <div class="base">
        <div class="user">
          <img src="@/assets/image/mine/default-user-head.webp" alt="">
          <div class="mobile">134****2998</div>
        </div>
        <ul class="list">
          <li :class="[currentPath === '/mine/expense' ? 'active' : '']" @click="jump('/mine/expense')">消费记录 <img src="@/assets/image/icon-arrow-right@2x.webp" alt="" class="icon"> </li>
          <li :class="[currentPath === '/mine/coupon' ? 'active' : '']" @click="jump('/mine/coupon')">我的卡券 <img src="@/assets/image/icon-arrow-right@2x.webp" alt="" class="icon"> </li>
          <li :class="[currentPath === '/mine/setting' ? 'active' : '']" @click="jump('/mine/setting')">个人设置 <img src="@/assets/image/icon-arrow-right@2x.webp" alt="" class="icon"> </li>
          <li :class="[currentPath === '/mine/log' ? 'active' : '']" @click="jump('/mine/log')">操作日志 <img src="@/assets/image/icon-arrow-right@2x.webp" alt="" class="icon"> </li>
        </ul>
      </div>
      <div class="mine-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import userHead from '@/assets/image/mine/default-user-head.webp'
import { useRouter, useRoute } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    function jump (path) {
      router.push(path)
    }

    let currentPath = computed(() => {
      return route.path
    })
    return { jump, currentPath, userHead }   
  }
}
</script>

<style lang="scss" scoped>

.mine {
  padding-top: 58px;
  padding-bottom: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  
  padding-bottom: 20px;
  .main {
    display: flex;
    // align-items: center;
    justify-content: center;
    min-height: 667px;
    background: rgba(251,251,251,0.22);
    backdrop-filter: blur(26px);
    box-shadow: 0px 2px 21px 0px rgba(0,145,255,0.90);
    border-radius: 12px;
    border: 1px solid rgba(0,145,255,0.80);
    @media screen and (max-width: $media-max) {
      min-height: 475px;
    }
    .base {
      text-align: center;
      color: $color-l1-l;
      width: 290px;
      min-height: 745px;
      flex-shrink: 0;
      background: rgba(251,251,251,0.22);
      backdrop-filter: blur(26px);
      border-radius: 12px;
      border: 1px solid rgba(0,145,255,0.80);
      @media screen and (max-width: $media-max) {
        width: 176px;
        min-height: 475px;
      }
      .user {
        font-size: 0;
        margin-top: 38px;
        img {
          width: 62px;
          margin: 0 auto;
          @media screen and (max-width: $media-max) {
            width: 45px;
          }
        }
        .mobile {
          font-size: $fontsize-l4;
          margin-top: 10px;
        }
      }
      .list {
        font-size: $fontsize-l5;
        margin: 0 auto;
        margin-top: 50px;
        @media screen and (max-width: $media-max) {
          margin-top: 45px;
        }
        li {
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 54px;
          border-bottom: solid 1px rgba(255, 255, 255, .4);
          box-sizing: border-box;
          padding: 0 16px;
          cursor: pointer;
          @media screen and (max-width: $media-max) {
            height: 38px;
            font-size: $fontsize-l6;
          }
          .icon {
            width: 7px;
          }
        }
        .active {
          background: $color-primary;
          position: relative;
          &::before {
            content: ' ';
            position: absolute;
            left: 0;
            top: -1px;
            height: 1px;
            display: block;
            width: 100%;
            background-color: $color-primary;
          }
          &::after {
            content: ' ';
            position: absolute;
            left: 0;
            bottom: -1px;
            height: 1px;
            display: block;
            width: 100%;
            background-color: $color-primary;
          }
        }
      }
    }
    .mine-content {
      flex: 1;
      padding-bottom: 30px;
      width: 1200px;
      @media screen and (max-width: $media-max) {
        width: 946px;
      }
    }
  }
}
</style>



