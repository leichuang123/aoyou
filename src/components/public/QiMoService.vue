<template>
  <div class="contact-service" :style="{'top': top}">
      <div class="service" @click="openService">
        <img class="icon" src="../../assets/images/proxy/icon-6.png" />
        <div>联</div>
        <div>系</div>
        <div>客</div>
        <div>服</div>
      </div>

      <div class="to-top" @click="toTop">
        <img src="../../assets/images/proxy/icon-7.png" />
      </div>
    </div>
</template>

<script>
export default {
  name: "ShowCard",
  props: {
    top: {
      type: String,
      default: () => {
        return '50%'
      }
    }
  },
  methods: {
    openService () {
      window.qimoChatClick()
    },
    toTop () {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="less" scoped>
.contact-service {
    position: fixed;
    right: 20px;
    width: 44px;
    transform: translateY(-50%);
    z-index: 3;
    .service {
      display: flex;
      background: white;
      flex-direction: column;
      align-items: center;
      padding-top: 10px;
      font-size: 14px;
      line-height: 17px;
      color: #19A5FE;
      width: 100%;
      height: 128px;
      box-shadow: 0 2px 5px 0 rgba(0,0,0,0.08);
      .icon {
        width: 24px;
        margin-bottom: 8px;
      }
      cursor: pointer;
    }
    .to-top {
      margin-top: 8px;
      width: 100%;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: white;
      box-shadow: 0 2px 5px 0 rgba(0,0,0,0.08);
      img {
        width: 24px;
      }
      cursor: pointer;
    }
  }

</style>