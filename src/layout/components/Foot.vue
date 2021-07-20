<!--
 * @Author: your name
 * @Date: 2020-09-09 09:22:41
 * @LastEditTime: 2021-01-19 17:52:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /jkcrawler/Users/kucongyong/Desktop/2020/yunny-official/src/layout/components/Foot.vue
-->
<template>
  <footer class="foot">
    <section class="foot-content">
      <div class="left">
        <ul class="left-list">
          <li>
            <img style="width:18px;" src="../../assets/images/icon/phone.png" alt="">
            <span>联系电话：400-962-0288</span>
          </li>
          <li>
            <img style="width:23px;" src="../../assets/images/icon/email.png" alt="">
            <span>邮箱：office@yunzhiqu.com</span>
          </li>

          <li>
            <a class="gov" href="https://beian.miit.gov.cn/">网站备案/许可证号：浙ICP备17016933号-1</a>
          </li>
        </ul>
      </div>
      <div class="right">
        <section class="text">
          <p>微信搜索公众号：</p>
          <p>
            <img src="../../assets/images/icon/star.png" alt="">
            云之趣官网
          </p>
        </section>
        <section class="qrcode">
          <img src="../../assets/images/public/qrcode.png" alt="">
        </section>
      </div>
    </section>
  </footer>
</template>

<script>
export default {
  name: 'Foot',
}
</script>

<style lang="less" scoped>
@import '../../assets/style/common.less';
.foot{
  width: 100%;
  background: @color-dark-2;
  color: @color-white;
  font-size: 14px;
  min-width: 1200px;
  .foot-content{
    width: @page-max-width;
    height: 134px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background: #f00;
    .left{
      .left-list{
        display: flex;
        li{
          display: flex;
          align-items: center;
          margin-right: 50px;
          img{
            margin-right: 28px;
          }
        }
      }
    }
    .right{
      margin-right: 10px;
      display: flex;
      .text{
        p{
          height: 40px;
          line-height: 40px;
          margin-top: 0;
          margin-bottom: 0;
          display: flex;
          align-items: center;
        }
        img{
          width: 20px;
          margin-right: 13px;
        }
      }
      .qrcode{
        width: 86px;
        height: 86px;
        img{
          width: 100%;
        }
      }
    }
  }
  .gov {
    text-decoration: none;
    color: white;
  }
}
</style>