<template>
  <div class="resolve">
    <div class="top">
      <div class="vendor-title">
        <img src="../../assets/images/proxy/icon-20.png" />
        <span class="text">应用场景</span>
        <img src="../../assets/images/proxy/icon-21.png" />
      </div>
      <div class="list">
        <div class="item">
          <img class="icon" src="../../assets/images/resolve/icon-37.png" />
          <div class="title">
            <span>商务办公</span>
            <span class="en">Business office</span>
          </div>
          <div class="desc">
            任何终端都登录云端个人主机，随时随地畅通工作。商务人士与企业办公的不二之选。
          </div>
        </div>
        <div class="item">
          <img class="icon" src="../../assets/images/resolve/icon-38.png" />
          <div class="title">
            <span>游戏娱乐</span>
            <span class="en">Game entertainment</span>
          </div>
          <div class="desc">
            挂机游戏、大型3D游戏、休闲小游戏，想怎么玩就怎么玩。集合当下热门游戏，无需下载即开即玩。适合休闲游戏玩家、资深高端玩家。
          </div>
        </div>
        <div class="item">
          <img class="icon" src="../../assets/images/resolve/icon-39.png" />
          <div class="title">
            <span>企事业办公部署</span>
            <span class="en">Office Disposition</span>
          </div>
          <div class="desc">
            企业轻量化办公、多媒体电算化教室、电商客服团队等，多人办公部署即插即用，高效便捷。专为中小型企业定制的新型办公部署。
          </div>
        </div>
      </div>
    </div>

    <div class="advantage">
       <div class="vendor-title">
        <img src="../../assets/images/proxy/icon-20.png" />
        <span class="text">优势</span>
        <img src="../../assets/images/proxy/icon-21.png" />
      </div>
      <div class="advantage-info">
        <div class="deploy item">
          <div class="title">部署快</div>
          <div class="desc">任何终端都可以一键快速登录云端主机，无需复杂的设备连接与使用培训。</div>
        </div>
        <div class="run item">
          <div class="title">运行稳定</div>
          <div class="desc">云端主机拥有高稳定性，长时间使用、24小时待机，依然运行流畅不死机。</div>
        </div>
        <div class="data item">
          <div class="title">数据安全</div>
          <div class="desc">云端主机保存数据文件，不用再担心数据丢失或泄露，让隐私更安全。</div>
        </div>
        <div class="cost item">
          <div class="title">成本低</div>
          <div class="desc">任何一台低配置电脑都可以使用高配置云端主机，大大降低设备成本，再也不用因为配置低而更换电脑。</div>
        </div>
      </div>
    </div>

    <div class="plan">
      <div class="vendor-title">
        <img src="../../assets/images/proxy/icon-20.png" />
        <span class="text">实施方案</span>
        <img src="../../assets/images/proxy/icon-21.png" />
      </div>
      <img class="img" src="../../assets/images/resolve/picture-biao.png"/>
    </div>

    <div class="example">
      <div class="vendor-title">
        <img src="../../assets/images/proxy/icon-20.png" />
        <span class="text">成功案例</span>
        <img src="../../assets/images/proxy/icon-21.png" />
      </div>
      <div class="list">
        <div class="item mobile">
          <img class="img" src="../../assets/images/resolve/picture-2.png" />
          <div class="title">手游工作室</div>
          <div class="desc">
            <div class="desc-item">临海市的一家手游工作室致力于为客户量身定游戏的专业工作室，服务包括中小型游戏工作室游戏项目咨询与策划、网游联运，并为客户提供技术、软件、调试等一站式服务。</div>
            <div class="desc-item">随着网游对电脑配置越来越高的要求，手游工作室批量采购了翱游云之盒。云之盒的高性能配置，充分满足了临海手游工作室的配置要求，大幅度提高了游戏用户的使用感受。</div>
            <div class="desc-item">翱游云之盒，助力网游，让网游更快更简单！</div>
          </div>
        </div>
        <div class="item job">
          <div class="title">挚诚猎头</div>
          <div class="desc">
            <div class="desc-item">台州黄岩挚诚企业管理咨询有限公司是一家专业从事人力资源咨询、猎头服务、职业规划和人才测评的一流人力资源服务机构。</div>
            <div class="desc-item">随着公司规模和人员不断扩大，公司批量采购了翱游云之盒，满足了公司更高的数据储存管理要求及计算机配置要求。</div>
            <div class="desc-item">翱游云之盒，助力企业发展，让企业成本更低数据更安全！</div>
          </div>
          <img class="img" src="../../assets/images/resolve/picture-3.png" />
        </div>
      </div>
    </div>
    <QiMoService />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QiMoService from '@/components/public/QiMoService.vue'
export default {
  name: 'Resolve',
  components: {
    QiMoService,
  },
  computed: {
    ...mapGetters([
      'getCount'
    ])
  },
  methods: {
    add() {
      this.$store.dispatch('editCount',{count:122})
    }
  }
}
</script>
<style lang="less" scoped>
.resolve {
  padding-bottom: 90px;
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
  .top {
    padding-bottom: 120px;
    background: white;
    .list {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      .item {
        width: 360px;
        height: 278px;
        padding: 0 40px;
        border-right: solid 1px rgba(176, 176, 176, .2);
        &:last-child {
          border-right: none;
        }
        &:last-child {
          padding-right: 0;
        }
        .icon {
          width: 100px;
        }
        .title {
          display: flex;
          align-items: center;
          font-size: 24px;
          color: #333333;
          margin-top: 45px;
          .en {
            font-size: 16px;
            color: #666666;
            margin-left: 10px;
          }
        }
        .desc {
          font-size: 14px;
          color: #444444;
          line-height: 26px;
          margin-top: 22px;
        }
      }
    }
  }
  .advantage {
    background: #F9FAFE;
    text-align: center;
    padding-bottom: 66px;
    .advantage-info {
      width: 770px;
      height: 432px;
      margin: 0 auto;
      background-image: url('../../assets/images/resolve/picture-13.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      position: relative;
      .item {
        position: absolute;
        text-align: left;
        .title {
          font-size: 18px;
          line-height: 18px;
          color: #333333;
        }
        .desc {
          font-size: 14px;
          color: #444444;
          margin-top: 10px;
          line-height: 20px;
        }
      }
      .deploy {
        top: 148px;
        left: -50px;
        width: 258px;
      }
      .run {
        top: 0;
        right: -157px;
        width: 205px;
      }
      .data {
        bottom: 34px;
        right: -190px;
        width: 225px;
      }
      .cost {
        left: 148px;
        bottom: 0;
        width: 238px;
      }
    }
  }
  .plan {
    text-align: center;
    background: white;
    background-image: url('../../assets/images/resolve/picture-14.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    box-sizing: border-box;
    padding-top: 20px;
    height: 650px;
    .img {
      width: 1080px;
      margin: 0 auto;
      margin-top: 20px;
    }
  }
  .example {
    .list {
      display: flex;
      align-items: center;
      justify-content: center;
      .item {
        width: 496px;
        height: 540px;
        box-sizing: border-box;
        padding: 20px;
        box-shadow: 0 2px 26px 0 rgba(0,0,0,0.04);
        .img {
          width: 100%;
          vertical-align: top;
        }
        .title {
          padding: 30px 0;
          text-align: left;
          position: relative;
          font-size: 26px;
          line-height: 26px;
          &::after {
            content: ' ';
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 22px;
            height: 5px;
            background: #19A5EF;
          }
        }
        .desc {
          margin-top: 12px;
          min-height: 210px;
          .desc-item {
            font-size: 14px;
            line-height: 30px;
            color: #333;
          }
        }
      }
      .job {
        margin-left: 50px;
      }
    }
  }
}
</style>

