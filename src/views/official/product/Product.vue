<template>
  <div class="product">
    <ul class="tabs">
      <li class="tab-items" @click="tabsOnchange(item)" :class="{'tab-items-active':activeKey === item.key}" v-for="(item,index) of tabs" :key="index">
        <img :src="item.icon" alt="icon">
        <p class="name">{{item.name}}</p>
        <div class="line"></div>
      </li>
    </ul>
    <div class="move-top" v-if="activeKey === 0">
      <div class="bg1">
        <Sbanner :titleList="sbanner[0].titleList" :pic="sbanner[0].pic" />
      </div>
      <Title2 title="为什么选择云之盒" />
      <div class="p1-list">
        <div class="p1-ite" v-for="(item, index) of whyList" :key="index">
          <img :src="item.img" alt="">
          <div>
            <p class="t1">{{item.t1}}</p>
            <p class="t2">{{item.t2}}</p>
          </div>
        </div>
      </div>
      <Title2 title="多元化的应用场景" />
      <img src="@/assets/images/product/icon-28.png" alt="" class="sereen">
    </div>
    <div class="move-top" v-if="activeKey === 1">
      <div class="p2">
        <div class="p2-item">
          <div class="text">
            <div class="t1"><img class="icon" src="@/assets/images/product/icon-1.png" /><span>云电脑商务版</span></div>
            <p class="t2">商务办公首选</p>
            <ul class="list">
              <li>属于你个人的云端PC</li>
              <li>数据安全不丢失</li>
              <li>随时随地移动办公</li>
            </ul>
          </div>
          <div class="linear-gradient">
            <div class="dashed-line"></div>
          </div>
          <img class="right-img" src="@/assets/images/product/picture-4.png" alt="">
        </div>
        <div class="p2-item">
           
          <div class="text">
            <div class="t1"> <img class="icon" src="@/assets/images/product/icon-2.png" /><span>云电脑游戏标准版</span></div>
            <p class="t2">游戏挂机必选</p>
            <ul class="list">
              <li>游戏24小时在线</li>
              <li>永不离线，轻松挂机</li>
              <li>升级快人一步</li>
            </ul>
          </div>
          <div class="linear-gradient">
            <div class="dashed-line"></div>
          </div>
          <img class="right-img" src="@/assets/images/product/picture-5.png" alt="">
        </div>
        <div class="p2-item">
          <div class="text">
            <div class="t1"><img class="icon" src="@/assets/images/product/icon-3.png" /><span>云电脑游戏高级版</span></div>
            <p class="t2">头号玩家甄选</p>
            <ul class="list">
              <li>游戏无需下载</li>
              <li>即开即玩</li>
              <li>低配电脑也能畅玩大型3D游戏</li>
            </ul>
          </div>
          <div class="linear-gradient">
            <div class="dashed-line"></div>
          </div>
          <img class="right-img" src="@/assets/images/product/picture-6.png" alt="">
        </div>
      </div>
    </div>
    <div class="move-top" v-if="activeKey === 2">
      <div class="bg1">
        <Sbanner :titleList="sbanner[1].titleList" :pic="sbanner[1].pic" />
      </div>
      <Title2 title="云之本优势" />
      <div class="p3">
        <ul class="p3-list">
          <li>
            <img src="@/assets/images/product/icon-29.png" alt="">
            <div class="t1">多模式切换</div>
            <p class="p1">针对企业及个人，提供商务版与家庭版。商务版管理更便捷，家庭版家长模式更省心。</p>
          </li>
          <div class="diver">
            <div class="line line-120"></div>
          </div>
          <li>
            <img src="@/assets/images/product/icon-30.png" alt="">
            <div class="t1">性能强大</div>
            <p class="p1">云端强大的计算能力，轻松应对各岗位办公及家用需求。</p>
          </li>
        </ul>
        <ul class="p3-list">
          <li>
            <img src="@/assets/images/product/icon-31.png" alt="">
            <div class="t1">数据安全</div>
            <p class="p1">重要文件、数据云端保存，杜绝泄露丢失，不怕意外发生。</p>
          </li>
          <div class="diver">
            <div class="line line-180"></div>
          </div>
          <li>
            <img src="@/assets/images/product/icon-32.png" alt="">
            <div class="t1">按需升级</div>
            <p class="p1">不同需求选择不同配置，不用换电脑也能提升性能。</p>
          </li>
          <div class="diver">
            <div class="line line-180"></div>
          </div>
          <li>
            <img src="@/assets/images/product/icon-33.png" alt="">
            <div class="t1">绿色节能</div>
            <p class="p1">低能耗，节能省电。无噪音，安静运行。</p>
          </li>
        </ul>
      </div>
      <Title2 title="家庭教育系统" />
      <div class="p4">
        <div class="text">
          <div>特有的家庭系统，让家长不再担心孩子用电脑。</div>
          <div>教育模式下，只能使用家长指定功能，</div>
          <div>孩子的行为尽在掌控。</div>
          <div>输入密码退出教育模式，家长办公娱乐随心用。</div>
        </div>
        <img src="@/assets/images/product/picture-11.png" alt="">
      </div>
    </div>
    <QiMoService />
  </div>
</template>

<script>
import Sbanner from '@/components/product/Sbanner.vue'
import Title2 from '@/components/public/Title2.vue'
import QiMoService from '@/components/public/QiMoService.vue'
export default {
  name: "Product",
  data() {
    return {
      tabs:[
        {
          icon:require('@/assets/images/product/icon-48.png'),
          name: '云之盒',
          key:0
        },
        {
          icon:require('@/assets/images/product/icon-49.png'),
          name: '云之趣',
          key:1
        },
        {
          icon:require('@/assets/images/product/icon-50.png'),
          name: '云之本',
          key:2
        }
      ],
      activeKey: 0,
      sbanner:[
        {
          titleList: {
            t1: '云之盒电脑主机',
            t2: '小云盒，大智慧',
            t3: '可连接显示器替代传统PC办公的终端设备',
          },
          pic:require('@/assets/images/product/picture-9.png'),
        },
        {
          titleList: {
            t1: '',
            t2: '云之本笔记本主机',
            t3: '可替代传统笔记本电脑的终端设备',
          },
          pic:require('@/assets/images/product/picture-10.png'),
        }
      ],
      whyList: [
        {
          img: require('@/assets/images/product/icon-22.png'),
          t1: '节省成本',
          t2: '轻资产创业，减少设备配置与维护成本。',
        },
        {
          img: require('@/assets/images/product/icon-23.png'),
          t1: '省时高效',
          t2: '安装便捷，部署迅速，统一集中自动化管理维护。',
        },
        {
          img: require('@/assets/images/product/icon-24.png'),
          t1: '性能卓越',
          t2: '云端机计算能力卓越，可流畅办公和运作大型软件',
        },
        {
          img: require('@/assets/images/product/icon-25.png'),
          t1: '安全可靠',
          t2: '应用、数据存储在云端，杜绝泄露与丢失',
        },
        {
          img: require('@/assets/images/product/icon-26.png'),
          t1: '弹性扩展',
          t2: '轻松扩容，可灵活集成第三方软件、系统',
        },
        {
          img: require('@/assets/images/product/icon-27.png'),
          t1: '绿色低碳',
          t2: '功率低，节能省电，噪音小，运行安静',
        },
      ],
    }
  },
  components: {
    Sbanner,
    Title2,
    QiMoService
  },
  methods: {
    tabsOnchange(item) {
      this.activeKey = item.key
    }
  }
}
</script>

<style lang="less" scoped>
.product{
  background: #fff;
  .tabs{
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 20px 0;
    position: relative;
    z-index: 2;
    .tab-items{
      width: 198px;
      height: 179px;
      
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #888888;
      cursor: pointer;
      img{
        height: 32px;
        margin-bottom: 25px;
        filter: grayscale(100%);
      }
      .line{
        width: 54px;
        height: 4px;
        background: #19A5FE;
        margin-top: 10px;
        opacity: 0;
      }
    }
    .tab-items-active{
      box-shadow: 0 2px 14px 0 rgba(0,0,0,0.12);
      color: #444;
      background: #fff;
      img{
        filter: grayscale(0%);
      }
      .line{
        opacity: 1;
      }
    }
  }
  .move-top{
    transform: translateY(-45px);
  }
  .bg1{
    background: #F9FAFE;
  }
  .p1-list{
    display: flex;
    justify-content: space-between;
    width: 1000px;
    margin: 0 auto;
    flex-wrap: wrap;
    .p1-ite{
      display: flex;
      // justify-content: space-between;
      align-items: center;
      height: 50px;
      width: 50%;
      margin: 0 0 80px 0px;
      padding-left: 80px;
      img{
        width: 50px;
        margin-right: 20px;
      }
      .t1{
        font-size: 20px;
       
        color: #333333;
        letter-spacing: 0;
        line-height: 20px;
        margin-bottom: 8px;
      }
      .t2{
        font-size: 16px;
        color: #555555;
        letter-spacing: 0;
        line-height: 26px;
        height: 26px;
      }
    }
  }
}
.sereen{
  height: 372px;
  display: block;
  margin: 0 auto 130px;
}
.p2{
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  .p2-item{
    width: 100%;
    height: 413px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    .right-img{
      width: 465px;
      margin-right: 100px;
    }
    .text{
      margin-left: 100px;
      .t1{
        font-size: 18px;
        color: #333333;
        letter-spacing: 0;
        line-height: 23px;
        width: 314px;
        padding-bottom: 14px;
        border-bottom: dashed #19A5FE 2px;
        display: flex;
        align-items: center;
        .icon {
          height: 16px;
          vertical-align: middle;
          margin-right: 10px;
          flex-shrink: 0;
        }
        span {
          flex: 1;
        }
      }
      .t2{
        font-size: 30px;
        color: #333333;
        letter-spacing: 0;
        line-height: 30px;
        margin-top: 40px;
        padding-bottom: 20px;
      }
      .list{
        font-size: 16px;
        color: #444444;
        letter-spacing: 0;
        line-height: 26px;
        li{
           list-style: none;
           &::before {
             content: ' ';
             vertical-align: middle;
             display: inline-block;
             width: 5px;
             height: 5px;
             background: rgba(102, 102, 102, .6);
             border-radius: 50%;
             margin-right: 10px;
           }
        }
      }
    }
    .linear-gradient {
      width: 100px;
      height: 100px;
      position: relative;
      margin-top: -31px;
      display: flex;
      align-items: center;
      transform: rotate(45deg) scaleX(1.3);
      .dashed-line {
        width: 100%;
        height: 2px;
        border-top: dashed 2px #19A5FE;
      }
    }
  }
}
.p3{
  padding-top: 30px;
  .p3-list{
    display: flex;
    justify-content: center;
    // margin-bottom: 100px;
    width: 1200px;
    margin:0 auto 100px;
    li{
      width: 224px;
      margin: 0 50px;
      img{
        // width: 62px;
        height: 60px;
        display: block;
        margin: 0 auto 23px;
      }
      .t1{
        font-size: 20px;
        color: #2C2D3B;
        letter-spacing: 0;
        height: 20px;
        line-height: 20px;
        margin-bottom: 30px;
        text-align: center;
      }
      .p1{
        font-size: 16px;
        color: #444444;
        letter-spacing: 0;
        line-height: 26px;
      }
    }
    .diver{
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1px;
      height: 211px;
      .line {
        width: 1px;
        background: #DFDFDF;
      }
      .line-120 {
        height: 120px;
      }
      .line-180 {
        height: 180px;
      }
    }
  }
}
.p4{
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 1200px;
  padding: 100px 0 140px;
  .text{
    font-size: 20px;
    color: #333333;
    letter-spacing: 0;
    line-height: 40px;
    width: 420px;
    margin-right: 169px;
  }
  img{
    width: 461px;
  }
}
</style>
