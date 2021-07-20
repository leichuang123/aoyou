<template>
  <div class="service">
    <div class="side">
      <div class="side-item right">
        <div class="key">01</div>
        <span class="title">场景多元</span>
        <span class="desc">适合更多个人和企业</span>
      </div>
      <div class="side-item right">
        <div class="key">02</div>
        <span class="title">数据安全</span>
        <span class="desc">重要资料保密不丢失</span>
      </div>
    </div>
    <div class="center"></div>
    <div class="side">
      <div class="side-item left">
        <div class="key">03</div>
        <span class="title">降低成本</span>
        <span class="desc">大幅减少固定资产开支</span>
      </div>
      <div class="side-item left">
        <div class="key">04</div>
        <span class="title">运行稳定</span>
        <span class="desc">出现故障只需一键重启</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Service",
}
</script>
<style lang="less" scoped>
.service{
  display: flex;
  width: 760px;
  justify-content: space-between;
  .side{
    display: flex;
    flex: 0;
    flex-direction: column;
    justify-content: space-between;
    .side-item{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 105px;
      width: 180px;
      .key{
        background: #FFFFFF;
        box-shadow: 0 2px 14px 0 rgba(25,165,254,0.15);
        border-radius: 10px;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-weight: bold;
        font-family: PingFangSC-Semibold;
        font-size: 18px;
        color: #19A5FE;
        letter-spacing: 1.8px;
        margin-bottom: 14px;
      }
      .title{
        font-size: 19px;
        color: #333333;
        letter-spacing: 0;
        margin-bottom: 16px;
      }
      .desc{
        font-size: 16px;
        color: #444444;
        letter-spacing: 0;
      }
    }
    .left{
      align-items: flex-start;
    }
    .right{
      align-items: flex-end;
    }
  }
  .center{
    width: 200px;
    height: 267px;
    background: url('../../../assets/images/index/picture-1.png') no-repeat;
    background-size: contain;
  }
}
</style>