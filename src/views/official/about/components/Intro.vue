<template>
  <div class="intro">
    <div class="title">
      <div class="name">浙江翱游科技有限公司</div>
      <div class="slogan">立足云端、开创未来</div>
    </div>
    <div class="desc">
      <p class="desc-item">
        浙江翱游科技有限公司成立于2017年3月22日。云电脑领域的开拓者，坚持“立足云端、开创未来”的理念。以桌面虚拟化、GPU虚拟化等核心技术，为各行业和各领域人士提供云桌面解决方案。
      </p>
      <p class="desc-item">
        在远程桌面连接技术和云平台架构方面取得了丰厚成果，研发的云之趣产品在云游戏方面取得了重大进展，在云计算、移动办公、移动营销、信息安全等方面建立了长远规划。
      </p>
    </div>
    
    <div class="business-title">
      <img class="img" src="../../../../assets/images/about/icon-20.png">
      <span class="text">主要业务</span>
      <img class="img" src="../../../../assets/images/about/icon-21.png">
    </div>
    <div class="business-list showcard">
      <!-- <div class="business-item" v-for="(item, index) in business" :key="index">
        <div class="icon-info" :style="{backgroundImage: `url(${item.icon})`}">
          <div class="bg"></div>
        </div>
        <div>
          <div class="item-title">{{item.title}}</div>
        </div>
        <div class="item-desc">{{item.desc}}</div>
      </div> -->
      <ShowCard v-for="(item, index) of cardList" :key="index" :val="item" :height="380" />
    </div>
  </div>
</template>

<script>
import ShowCard from '@/components/public/ShowCard.vue'
export default {
  name: 'Intro',
  data () {
    return {
      cardList: [
        {
          key: 1,
          name: '云之趣',
          content:['基于个人账户与数据的云电脑自选超市。适合于个人办公或企业办公、24小时在线游戏挂机、在线3D游戏、电商客服、图形图像处理等多元化应用场景，用户可以在IOS、Android和PC等各种终端上使用云电脑。'],
          icon: require('../../../../assets/images/about/icon-48.png'),
        },
        {
          key: 2,
          name: '云之盒',
          content: ['“云之盒”终端设备，可代替传统PC访问云电脑，具有价格便宜、能耗低、运行稳定等优势。'],
          icon: require('../../../../assets/images/about/icon-49.png'),
        },
        {
          key: 3,
          name: '云之本',
          content:['为中小电商行业、小微园区办公、房产中介、工业设计个人工作室、教育领域中小型电算化教室等行业提供标准化云电脑产品，降低中小企业的创业成本，同时降低能耗成本。'],
          icon: require('../../../../assets/images/about/icon-50.png'),
        }
      ]
    }
  },
  components: {
    ShowCard,
  },
}
</script>

<style lang="less" scoped>
  .intro {
    width: 1016px;
    padding-bottom: 62px;
    margin: 0 auto;
    font-size: 0;
    .title {
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-left: solid 5px #19A5FE;
      padding-left: 6px;
      .name {
        font-size: 18px;
        color: #19A5FE;
      }
      .slogan {
        font-size: 28px;
        color: #333333;
      }
    }
    .desc {
      padding-top: 50px;
      padding-bottom: 100px;
      .desc-item {
        text-indent: 2em;
        font-size: 16px;
        color: #444444;
        line-height: 30px;
      }
    }
    .showcard{
      width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
    .business-title {
      display: flex;
      align-items: center;
      justify-content: center;
      .img {
        width: 120px;
      }
      .text {
        font-size: 30px;
        color: #444444;
        display: inline-block;
        padding: 0 50px;
      }
    }
    .business-list {
      width: 1000px;
      padding-top: 80px;
      .business-item {
        flex-grow: 0;
        flex-shrink: 0;
        display: inline-block;
        width: 300px;
        height: 409px;
        margin-left: 58px;
        background: #FFFFFF;
        box-shadow: 0 2px 14px 0 rgba(25,165,254,0.15);
        padding: 35px 30px;
        box-sizing: border-box;
        border-radius: 10px;
        vertical-align: top;
        &:first-child {
          margin-left: 0;
        }
        .icon-info {
          width: 70px;
          height: 70px;
          background-size: 50% 50%;
          background-repeat: no-repeat;
          background-position: center center;
          .bg {
            width: 100%;
            height: 100%;
            border: dashed 1px #DFDFDF;
            border-radius: 5px;
          }
        }
        .item-title {
          display: inline-block;
          font-size: 20px;
          color: #333333;
          border-bottom: solid 1px #E5E5E5;
          padding-top: 20px;
          padding-bottom: 8px;
        }
        .item-desc {
          text-indent: 2em;
          font-size: 14px;
          line-height: 30px;
          padding-top: 16px;
        }
        &:hover {
          box-shadow: 0 2px 14px 0 rgba(25,165,254,0.35);
          .icon-info {
            .bg {
              transform: rotate(-225deg);
              border: 1px solid #19A5FE;
            }
          }
          .item-title {
            color: #19A5FE;
            border-bottom: solid 1px #19A5FE;
          }

        }
      }
    }
    
  }
</style>

