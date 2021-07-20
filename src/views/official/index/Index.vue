<template>
  <div class="home">
    <div class="banner">
      <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide>
          <div class="banner-item">
            <img src="@/assets/images/index/index_loop_0.png" alt="" />
          </div>
        </swiper-slide>
         <swiper-slide>
          <div class="banner-item">
            <img src="@/assets/images/index/index_loop_1.png" alt="" />
          </div>
        </swiper-slide>
         <swiper-slide>
          <div class="banner-item">
            <img src="@/assets/images/index/index_loop_2.png" alt="" />
          </div>
        </swiper-slide>
        
      </swiper>
      <div class="masking">
        <img class="icon" src="@/assets/images/icon/icon-1.png"/>
      </div>
      <div class="swiper-pagination">
        <span v-for="(item , index) in [0, 1, 2]" :key="index" :class="['bullet', index === swiperIndex ? 'active' : '']"></span>
      </div>
    </div>
    <div class="home-body">
      <div class="part1">
        <div class="home-title">
          <Title title="产品中心"/>
        </div>
        <div class="showcard">
          <ShowCard v-for="(item, index) of cardList" :key="index" :val="item" />
        </div>
      </div>
      <div class="part2">
        <div class="home-title">
          <Title title="服务优势"/>
        </div>
        <div class="showcard">
          <Service />
        </div>
      </div>
      <div class="part1">
        <div class="home-title">
          <Title title="合作伙伴"/>
        </div>
        <div class="showcard">
          <div class="index-pp">
            <div class="pp-list">
              <img src="@/assets/images/index/icon-8.png" alt="中国移动">
              <img src="@/assets/images/index/icon-9.png" alt="中国电信">
              <img src="@/assets/images/index/icon-10.png" alt="戴尔">
              <img src="@/assets/images/index/icon-11.png" alt="思杰">
              <img src="@/assets/images/index/icon-12.png" alt="微软">
            </div>
            <button @click="joinus">加入我们</button>
          </div>
        </div>
      </div>
      <div class="part2">
        <div class="home-title">
          <Title title="成功案例"/>
        </div>
        <div class="showcard" style="width:1100px">
          <div class="success-item">
            <img style="width:100%" src="../../../assets/images/index/picture-2.png" alt="">
            <div class="s-title">
              <div class="s-bg">01</div>
              <div class="st-name">手游工作室</div>
            </div>
            <div class="s-desc">
              <p> 临海市的一家手游工作室致力于为客户量身定游戏的专业工作室，服务包括中小型游戏工作室游戏项目咨询与策划、网游联运，并为客户提供技术、软件、调试等一站式服务。</p>
              <p>随着网游对电脑配置越来越高的要求，手游工作室批量采购了翱游云之盒。云之盒的高性能配置，充分满足了临海手游工作室的配置要求，大幅度提高了游戏用户的使用感受。</p>
              <p>翱游云之盒，助力网游，让网游更快更简单！</p>
            </div>
          </div>
          <div class="success-item">
            <div class="s-title">
              <div class="s-bg">02</div>
              <div class="st-name">挚诚猎头</div>
            </div>
            <div class="s-desc">
              <p> 台州黄岩挚诚企业管理咨询有限公司是一家专业从事人力资源咨询、猎头服务、职业规划和人才测评的一流人力资源服务机构。</p>
              <p>随着公司规模和人员不断扩大，公司批量采购了翱游云之盒，满足了公司更高的数据储存管理要求及计算机配置要求。</p>
              <p>翱游云之盒，助力企业发展，让企业成本更低数据更安全！</p>
            </div>
            <img style="width:100%" src="../../../assets/images/index/picture-3.png" alt="">
          </div>
        </div>
      </div>
      <div class="part1">
        <div class="home-title">
          <Title title="媒体关注"/>
        </div>
        <div class="showcard friends-imgs">
          <!-- <div class="index-pp">
            <div class="pp-list f-center">
              <img v-for="item of 13" :key="item" src="@/assets/images/index/icon-8.png" alt="中国移动">
            </div>
          </div> -->
          <img src="../../../assets/images/index/icon-13.png" class="friends" />
        </div>
      </div>
    </div>
    <QiMoService />
  </div>
</template>

<script>
// directive
import ShowCard from '@/components/public/ShowCard.vue'
import Title from '@/components/public/Title.vue'
import Service from './Service.vue'
import QiMoService from '@/components/public/QiMoService.vue'

import 'swiper/swiper.less'
let _indexThis = null
export default {
  name: 'Index',
  data() {
    return {
      swiperOptions: {
        // direction:"vertical",
        loop: true, // 有bug
        // pagination:{
        //   el:'.swiper-pagination',
        //   clickable: true
        // },
        // slidesPerView: 3, // 显示的数量
        // spaceBetween: 30, // 每张的间距
        height: 589,
        // loop: true, // 有bug
        autoplay: {
          delay: 5000
        },
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper 
        observeParents: true,
        autoHeight:true,
        on: {
          slideChange () {
            if (_indexThis) {
              _indexThis.swiperIndex = this.activeIndex
            }
          }
        }
      },
      swiperIndex: 0,
      cardList: [
        {
          key: 1,
          name: '云电脑商务版',
          content:['任意终端接入、随时访问、永久数据存储。', '低投入、免维护、低能耗、升级灵活'],
          icon: require('../../../assets/images/index/icon-2.png'),
        },
        {
          key: 2,
          name: '云电脑游戏标准版',
          content: ['个人电脑关机后依然保持游戏在线，挂机不掉线', '满足日常娱乐休闲，24小时游戏挂机，适合休闲游戏玩家'],
          icon: require('../../../assets/images/index/icon-3.png'),
        },
        {
          key: 3,
          name: '云电脑游戏高级版',
          content:['高配云端主机在线游戏，不消耗个人电脑资源','低配电脑也能流畅运行大型3D游戏，适合3D游戏玩家'],
          icon: require('../../../assets/images/index/icon-4.png'),
        },
        {
          key: 4,
          name: '云之盒',
          content: ['小巧轻便，可直接登录云主机，适合中小型企业轻量办公部署', '成本低、无噪音、低能耗'],
          icon: require('../../../assets/images/index/icon-5.png'),
        }
      ]
    }
  },
  components: {
    ShowCard,
    Title,
    Service,
    QiMoService
  },
  mounted () {
    _indexThis = this;

  },
  methods: {
    jump (url) {
      window.location.href = url
    },
    joinus() {
      this.$router.push('/contact');
    }
  }
}
</script>
<style lang="less" scoped>
.banner{
  height: 589px;
  background: #eee;
  position: relative;
  .masking{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    // background: rgba(0,0,0,0.5);
    z-index: 10;
    display:flex;
    justify-content: center;
    align-items: flex-end;
    .icon{
      width: 80px;
      transform: translateY(40px);
    }
  }
  .swiper-pagination {
    position: absolute;
    left: 0;
    bottom: 126px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 3;
    .bullet {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid #DADADA;
      background: rgba(255, 255, 255 , .5);
      margin-left: 11px;
      &:first-child {
        margin-left: 0;
      }
    }
    .active {
      background: white;
    }
  }
  .banner-item{
    height: 589px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow: hidden;
    img{
      height: 100%;
    }
  }
}
.showcard{
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.home-title{
  width: 1200px;
  margin: 54px auto 63px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.index-pp{
  width: 100%;
  .pp-list{
    display: flex;
    justify-content: space-between;
    margin-bottom: 60px;
    flex-wrap: wrap;
    img{
      height: 68px;
    }
  }
  button{
    display: block;
    border: 2px solid #19A5FE;
    border-radius: 10px;
    width: 116px;
    height: 36px;
    font-size: 16px;
    color: #19A5FE;
    margin: 0 auto;
  }
}
.success-item{
  background: #fff;
  padding: 20px;
  width: 496px;
  height: 540px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .s-title{
    position: relative;
    .s-bg{
      font-size: 58px;
      height: 58px;
      line-height: 58px;
      color: rgba(0,0,0,0.05);
      position: absolute;
      top: 0;
      left: 0;
      &::before{
        display: block;
        content: ' ';
        width: 22px;
        height: 5px;
        background: #19A5EF;
        position: absolute;
        bottom: -10px;
      }
    }
    .st-name{
      font-size: 26px;
      color: #2C2D3B;
      letter-spacing: 0;
      height: 58px;
      line-height: 58px;
    }
  }
  .s-desc{
    font-family: STHeitiSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    line-height: 30px;
    p{
      text-indent: 20px;
    }
  }
}
.f-center{
  justify-content: center!important;
  // align-items: center;
  img{
    margin: 10px 10px;
  }
}
.part1{
  padding: 60px 0;
  background: #fff;
}
.part2{
  padding: 60px 0 126px;
  background: #F9FAFE;
}
.friends-imgs {
  text-align: center;
  .friends {
    width: 1280px;
    margin: 0 auto;
  }
}

</style>
