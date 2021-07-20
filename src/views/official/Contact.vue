<template>
  <div class="contact">
    <img class="map" src="../../assets/images/contact/picture-20.png" alt="地图" >
    <div class="yinfo">
      <div class="title">联系我们</div>
      <div class="title-en">Contact Us</div>
      <img class="icon-phone" src="../../assets/images/contact/icon-61.png" />
      <div class="tel">400-962-0288</div>
      <div class="diver"></div>
      <div class="email">office@yunzhiqu.com</div>
      <img class="icon-location" src="../../assets/images/contact/icon-62.png" >
      <div class="address">杭州市西湖区 蒋村商务中心 B2幢408</div>
    </div>
    <QiMoService />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QiMoService from '@/components/public/QiMoService.vue'
export default {
  name: 'Contact',
  computed: {
    ...mapGetters([
      'getCount'
    ])
  },
  components: {
    QiMoService
  },
  methods: {
    add() {
      this.$store.dispatch('editCount',{count:122})
    }
  }
}
</script>
<style lang="less" scoped>
.contact {
  padding-top: 236px;
  position: relative;
  .map {
    width: 100%;
    vertical-align: top;
  }
  .yinfo {
    position: absolute;
    left: 50%;
    top: 90px;
    margin-left: -480px;
    width: 960px;
    height: 560px;
    background: rgba(256, 256, 256, 0.88);
    box-shadow: 0 2px 14px 0 rgba(0,0,0,0.14);
    border-radius: 5px;
    text-align: center;
    box-sizing: border-box;
    padding-top: 70px;
    padding-bottom: 92px;
    .title {
      font-size: 26px;
      color: #666666;
    }
    .title-en {
      font-size: 16px;
      color: #666666;
      margin-top: 6px;
    }
    .icon-phone {
      width: 40px;
      margin: 0 auto;
      margin-top: 50px;
    }
    .tel {
      font-size: 18px;
      color: #333333;
      margin-top: 30px;
    }
    .diver {
      width: 18px;
      height: 2px;
      background: #19A5FE;
      margin: 0 auto;
      margin-top: 12px;
      margin-bottom: 16px;

    }
    .email {
      font-size: 18px;
      color: #333333;
    }
    .icon-location {
      margin: 0 auto;
      margin-top: 50px;
      width: 30px;
    }
    .address {
      font-size: 18px;
      color: #333333;
      padding-top: 24px;
    }
  }
}
</style>

