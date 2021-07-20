<template>
  <div class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="icon-c">
        <img class="icon-index" :src="item.icon" />
      </div>
      
      <div class="diver"></div>
      <div class="inc-info">
        <div class="title">{{item.title}}</div>
        <div class="desc">
          <div class="desc-item" v-for="(obj, idx) in item.desc" :key="idx" >
            {{obj}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Industry',
  components: {
  },
  data () {
    return {
      list: [
        {
          icon: require('../../../../assets/images/about/icon-51.png'),
          title: '重新定义小微ICT公有云',
          desc: [
            '·面向中小型企业提供小微ICT公有云解决方案。'
          ]
        },
        {
          icon: require('../../../../assets/images/about/icon-52.png'),
          title: '重新定义智能融合套餐',
          desc: [
            '·面向小微企业、工作室开展智能宽带、智能融合套餐合作推广。'
          ]
        },
        {
          icon: require('../../../../assets/images/about/icon-53.png'),
          title: '重新定义智能宽带',
          desc: [
            '·面向家庭娱乐用户，提供高性能“云游戏”服务；',
            '·增加高速宽带的应用与内涵。'
          ]
        },{
          icon: require('../../../../assets/images/about/icon-54.png'),
          title: '重新定义5G时代',
          desc: [
            '·抢滩5G应用，在高校市场共同推进“云之本”，为5G推波助澜；',
            '·彻底颠覆高校学生中的笔记本市场，兼顾“轻便本”的轻薄之便和“游戏本”的性能之厉，为即将到来的5G时代发起第一波冲击。'
          ]
        },{
          icon: require('../../../../assets/images/about/icon-55.png'),
          title: '共同建设“云之趣”平台',
          desc: [
            '·与运营平台，运营商提供ICT、IDC一体化解决方案支持。'
          ]
        }
      ]
    }
  },
}
</script>
<style lang="less" scoped>
  .list {
    width: 1000px;
    margin: 0 auto;
    padding-bottom: 120px;
    .item {
      background: #FFFFFF;
      box-shadow: 0 2px 14px 0 rgba(0,0,0,0.14);
      padding: 28px 38px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
      .icon-c {
        width: 30px;
      }
      .icon-index {
        height: 42px;
      }
      .diver {
        width: 2px;
        height: 63px;
        margin-left: 32px;
        margin-right: 42px;
        background: #EFEFEF;
      }
      .inc-info {
        flex: 1;
        .title {
          font-size: 20px;
          color: #444444;
          font-weight: bold;
        }
        .desc {
          margin-top: 15px;
          .desc-item {
            font-size: 16px;
            color: #666666;
            line-height: 25px;
          }
        }
      }
    }
  }
</style>
