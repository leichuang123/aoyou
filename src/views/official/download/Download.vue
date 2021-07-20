<template>
  <div class="download">
    <Title2 title="客户端下载" /> 
    <div class="plant">
      <div class="p-item">
        <div class="imgbox">
          <img src="../../../assets/images/download/icon-34.png" alt="">
        </div>
        <p class="name">Windows</p>
        <!-- <a target="_blank" v-if="getUserInfo" href="https://static.yunzhiqu.com/software/YzqBookClient-Desktop.exe" download class="d-btn"> -->
        <a target="_blank" v-if="getUserInfo" href="https://static.yunzhiqu.com/software/YzqBookClient-Desktop.exe" download class="d-btn">
        
          下 &nbsp;&nbsp;&nbsp;载
          <!-- 敬请期待 -->
        </a>
        <a class="d-btn" v-if="!getUserInfo" @click="toLogin">
          下 &nbsp;&nbsp;&nbsp;载
          <!-- 敬请期待 -->
        </a>
      </div>
      <div class="line"></div>
      <div class="p-item">
        <div class="imgbox">
          <img src="../../../assets/images/download/icon-35.png" alt="">
        </div>
        <p class="name">Android</p>
        <!-- <a class="d-btn" type="application/vnd.android.package-archive">敬请期待</a> -->
        <a class="d-btn" type="application/vnd.android.package-archive" target="_blank" href="https://static.yunzhiqu.com/software/yunis_tel.apk" download>下 &nbsp;&nbsp;&nbsp;载</a>
      </div>
      <div class="line"></div>
      <div class="p-item">
        <div class="imgbox">
          <img src="../../../assets/images/download/icon-36.png" alt="">
        </div>
        <p class="name">iOS</p>
        <!-- <a class="d-btn" type="application/vnd.android.package-archive">敬请期待</a> -->
        <a target="_blank" href="https://itunes.apple.com/cn/app/id1514339658?mt=8" download class="d-btn">下 &nbsp;&nbsp;&nbsp;载</a>
      </div>
    </div>
    <div class="bg"></div>
    <QiMoService />
  </div>
</template>

<script>
import Title2 from '@/components/public/Title2.vue'
import QiMoService from '@/components/public/QiMoService.vue'
import { mapGetters } from 'vuex'

export default {
  name: "Download",
  components: {
    Title2,
    QiMoService
  },
  computed: {
    ...mapGetters(['getUserBalance','getUserInfo']),
  },
  methods: {
    toLogin() {
      this.$router.push("/login?from=" + encodeURIComponent(window.location.href))
    }
  }
}
</script>

<style lang="less" scoped>
.download{
  background: #fff;
  .plant{
    display: flex;
    width: 1000px;
    justify-content: space-around;
    margin: 0 auto 92px;
    .line{
        width: 1px;
        height: 132px;
        background: #bebebe;
        opacity: 0.23;
      }
    .p-item{
      .imgbox{
        width: 48px;
        height: 54px;
        display: flex;
        justify-content: center;
        justify-content: center;
        margin: 0 auto 34px;
      }
      .name{
        font-size: 19px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        margin-bottom: 47px;
      }
      .d-btn{
        display: block;
        text-align: center;
        line-height: 40px;
        text-decoration: none;
        width: 140px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid #19A5FE;
        color: #19A5FE;
        cursor: pointer;
        outline: none;
        font-size: 18px;
        transition: all 0.5s;
        // background: #fff;
        &:hover{
          color: #fff;
          background: linear-gradient(270deg, #1CC5F6 0%, #11A0FE 100%);
        }
      }
      img{
        width: 48px;
      }
    }
  }
  .bg{
    width: 688px;
    height: 365px;
    background: url("../../../assets/images/download/picture-12.png") no-repeat;
    background-size: contain;
    margin: 0 auto;
  }
}
</style>