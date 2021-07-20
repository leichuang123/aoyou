<template>
  <div class="proxy">
    <div class="top">
      <div class="yinfo">
        <div class="title">云之趣合伙人计划</div>
        <div class="desc">携手并进，共同成长</div>
        <div class="join" @click="joinus">加入我们</div>
      </div>
    </div>
    <div class="content">
      <div class="vendor-title">
        <img src="../../assets/images/proxy/icon-20.png" />
        <span class="text">为什么要成为合伙人？</span>
        <img src="../../assets/images/proxy/icon-21.png" />
      </div>
      <div class="why-list showcard">
        <ShowCard v-for="(item, index) of cardList" :key="index" :val="item" />
        <!-- <div class="why-item">
          <div class="icon" :style="{backgroundImage: `url(${require('../../assets/images/proxy/icon-41.png')})`}">
            <div class="squre"></div>
          </div>
          <div class="item-title">新行业新风口</div>
          <div class="item-desc">云之趣/云之本/云电脑 是翱游公司在云电脑领域的领先开拓产品，以桌面虚拟化、GPU虚拟化等核心技术，使用户脱离传统物理电脑的不轻便不共享等弱点。</div>
        </div>
        <div class="why-item">
          <div class="icon" :style="{backgroundImage: `url(${require('../../assets/images/proxy/icon-42.png')})`}">
            <div class="squre"></div>
          </div>
          <div class="item-title">低成本投资</div>
          <div class="item-desc">低成本加入顶尖互联网高新行业，实现0门槛创业</div>
        </div>
        <div class="why-item">
          <div class="icon" :style="{backgroundImage: `url(${require('../../assets/images/proxy/icon-43.png')})`}">
            <div class="squre"></div>
          </div>
          <div class="item-title">一对一培训</div>
          <div class="item-desc">成为翱游代理商后，公司提供线上线下一对一专业培训，了解公司产品及如何拓展客户，快速实现线上线下营销</div>
        </div>
        <div class="why-item">
          <div class="icon" :style="{backgroundImage: `url(${require('../../assets/images/proxy/icon-44.png')})`}">
            <div class="squre"></div>
          </div>
          <div class="item-title">高效收益</div>
          <div class="item-desc">加入翱游代理商后，不仅可免费体验公司高新产品云之趣、云之盒、云之本等，更可以享受公司提供的高额收益</div>
        </div> -->
      </div>
      <div class="vendor-title">
        <img src="../../assets/images/proxy/icon-20.png" />
        <span class="text">市场支持，立体合作</span>
        <img src="../../assets/images/proxy/icon-21.png" />
      </div>
      <div class="market">
        <img src="../../assets/images/proxy/picture-16.png" />
        <div class="intro-list">
          <div class="intro-item">主动分享机会，互惠互利</div>
          <div class="intro-item">专业的人力、技术支持</div>
          <div class="intro-item">建立组织保障，确保培训计划落地</div>
          <div class="intro-item">统一接口人，定期沟通合作计划</div>
          <div class="intro-item">针对售前、售后人员全方位培训</div>
        </div>
      </div>
      <div class="vendor-title">
        <img src="../../assets/images/proxy/icon-20.png" />
        <span class="text">营销支持</span>
        <img src="../../assets/images/proxy/icon-21.png" />
      </div>
      <div class="support-list">
        <div class="support-item">
          <img class="icon" src="../../assets/images/proxy/icon-45.png" />
          <div class="item-title">品牌认可</div>
          <div class="item-desc">品牌活动、媒体广告、宣传资料</div>
        </div>
        <div class="support-item">
          <img class="icon" src="../../assets/images/proxy/icon-46.png" />
          <div class="item-title">产品认可</div>
          <div class="item-desc">技术活动、产品测评、第三方报告</div>
        </div>
        <div class="support-item">
          <img class="icon" src="../../assets/images/proxy/icon-47.png" />
          <div class="item-title">客户关心</div>
          <div class="item-desc">客户答谢会、总部参观、公关支持</div>
        </div>
      </div>
      <div class="join-proxy">
        <div class="btn" @click="joinus">成为代理商</div>
      </div>
    </div>
    <QiMoService />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ShowCard from '@/components/public/ShowCard.vue'
import QiMoService from '@/components/public/QiMoService.vue'
export default {
  name: 'Proxy',
  computed: {
    ...mapGetters([
      'getCount'
    ])
  },
  data () {
    return {
      cardList: [
        {
          key: 1,
          name: '新行业新风口',
          content:['云之趣/云之本/云电脑 是翱游公司在云电脑领域的领先开拓产品，以桌面虚拟化、GPU虚拟化等核心技术，使用户脱离传统物理电脑的不轻便不共享等弱点。'],
          icon: require('../../assets/images/proxy/icon-41.png'),
        },
        {
          key: 2,
          name: '低成本投资',
          content: ['低成本加入顶尖互联网高新行业，实现0门槛创业'],
          icon: require('../../assets/images/proxy/icon-42.png'),
        },
        {
          key: 3,
          name: '一对一培训',
          content:['成为翱游代理商后，公司提供线上线下一对一专业培训，了解公司产品及如何拓展客户，快速实现线上线下营销'],
          icon: require('../../assets/images/proxy/icon-43.png'),
        },
        {
          key: 4,
          name: '高效收益',
          content: ['加入翱游代理商后，不仅可免费体验公司高新产品云之趣、云之盒、云之本等，更可以享受公司提供的高额收益'],
          icon: require('../../assets/images/proxy/icon-44.png'),
        }
      ]
    }
  },
  components: {
    ShowCard,
    QiMoService,
  },
  methods: {
    add() {
      this.$store.dispatch('editCount',{count:122})
    },
    joinus() {
      this.$router.push("/contact")
    }
  }
}
</script>
<style lang="less" scoped>
.proxy {
  text-align: center;
  .top {
    background-image: url('../../assets/images/proxy/picture-15.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    text-align: center;
    height: 480px;
    .yinfo {
      width: 1200px;
      margin: 0 auto;
      height: 100%;
      padding: 150px 0 90px 40px;
      color: white;
      text-align: left;
      .title {
        font-size: 40px;
        line-height: 56px;
        text-align: left;
      }
      .desc {
        font-size: 28px;
        line-height: 32px;
        margin-top: 30px;
        text-align: left;
      }
      .join {
        margin-top: 112px;
        background: white;
        width: 170px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        border-radius: 5px;
        font-size: 18px;
        color: #0056DE;
        cursor: pointer;
      }
    }
  }
  .content {
    width: 1200px;
    margin: 0 auto;
    .vendor-title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 64px 0;
      img {
        width: 100px;
      }
      .text {
        display: inline;
        padding: 0 50px;
        font-size: 26px;
        color: #444444;
      }
    }
    .showcard{
      width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding-bottom: 100px;
    }
    // .why-list {
    //   display: flex;
    //   align-items: center;
    //   padding-bottom: 100px;
    //   .why-item {
    //     width: 264px;
    //     height: 340px;
    //     box-sizing: border-box;
    //     padding: 30px 20px;
    //     margin-right: 30px;
    //     box-shadow: 0 2px 14px 0 rgba(25,165,254,0.10);
    //     .icon {
    //       width: 70px;
    //       height: 70px;
    //       background-size: 50%;
    //       background-repeat: no-repeat;
    //       background-position: center center;
    //       .squre {
    //         width: 100%;
    //         height: 100%;
    //         border-radius: 5px;
    //         border: dashed 1px #dfdfdf;
    //       }
          
    //     }
    //     .item-title {
    //       font-size: 20px;
    //       color: #333333;
    //       margin-top: 20px;
    //       line-height: 28px;
    //       padding-bottom: 8px;
    //       position: relative;
    //       text-align: left;
    //       &::after {
    //         content: ' ';
    //         position: absolute;
    //         bottom: 0;
    //         left: 0;
    //         width: 50px;
    //         height: 2px;
    //         background: #e5e5e5;
    //       }
    //     }
    //     .item-desc {
    //       font-size: 14px;
    //       color: #444444;
    //       line-height: 25px;
    //       margin-top: 16px;
    //       text-align: left;
    //     }
    //     &:hover {
    //       border-radius: 10px;
    //       box-shadow: 0 2px 14px 0 rgba(25,165,254,0.31);
    //       .icon {
    //         .squre {
    //           transform: rotate(-225deg);
    //           border: 1px dashed #19A5FE;
    //           border-radius: 5px;
    //         }
    //       }
    //       .item-title {
    //         color: #19A5FE;
    //         &::after {
    //           background: #19A5FE;
    //         }
    //       }
    //     }
    //   }
    // }
    .market {
      display: flex;
      margin: 0 auto;
      align-items: center;
      justify-content: center;
      padding-bottom: 100px;
      img {
        width: 460px;
      }
      .intro-list {
        margin-left: 180px;
        
        .intro-item {
          text-align: left;
          font-size: 20px;
          line-height: 20px;
          color: #444444;
          margin-top: 40px;
          position: relative;
          &:first-child {
            margin-top: 0;
          }
          &::before {
            content: ' ';
            width: 10px;
            height: 10px;
            border: solid 2px #FF8100;
            display: inline-block;
            margin-right: 10px;
            border-radius: 50%;
          }
        }
      }
    }
    .support-list {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 70px;
      .support-item {
        width: 270px;
        height: 284px;
        background: #FFFFFF;
        box-shadow: 0 4px 14px 0 rgba(44,45,59,0.15);
        border-radius: 9px;
        margin-left: 60px;
        text-align: center;
        &:first-child {
          margin-left: 0;
        }
        .icon {
          width: 52px;
          margin: 0 auto;
          margin-top: 40px;
        }
        .item-title {
          font-size: 20px;
          line-height: 20px;
          color: #2C2D3B;
          margin-top: 20px;
        }
        .item-desc {
          padding: 40px 37px 0 37px;
          font-size: 16px;
          color: #444444;
          line-height: 26px;
          text-align: left;
        }
      }
    }
    .join-proxy {
      text-align: center;
      padding-bottom: 50px;
      .btn {
        background: #19A5FE;
        border: 2px solid #19A5FE;
        border-radius: 10px;
        width: 160px;
        height: 45px;
        text-align: center;
        line-height: 45px;
        color: white;
        cursor: pointer;
        margin: 0 auto;
      }
    }
  }
  
}
</style>

