<template>
  <div class="tickets">
    <ul class="tabs flex">
      <li @click="tabsClick(item)" v-for="(item) of tabsList" :class="{'tabs-item-active': tabsActive === item.key}" :key="item.key" class="tabs-item">{{item.name}}</li>
    </ul>
    <ul class="card-list" style="padding-left: 0">
      <template v-if="tabsActive === 2 || tabsActive === 3">
        <li v-for="(item,index) of ticketList" :key="index" class="card-item">
          <div class="ticket-face">
            <div class="ticket-face-num">
              <TicketNum type="crystal" :value="item.waiverAmount" />
            </div>
            <p class="ticket-name">{{item.name}}</p>
            <p class="ticket-desc">{{item | getCrystalConsRules}}</p>
          </div>
          <div class="ticket-body">
            <ul class="ticket-tip-list">
              <li class="ticket-tip-item">
                <p class="tti-name">使用条件：</p>
                <p>{{item | getCrystalConsRules}}</p>
              </li>
              <li class="ticket-tip-item">
                <p class="tti-name">有效时间：</p>
                <p>{{item | getTime}}</p>
              </li>
              <li class="ticket-tip-item">
                <p class="tti-name">限定商品：</p>
                <p>{{item.productName || '不限定商品'}}</p>
              </li>
              <li class="ticket-tip-item">
                <p class="tti-name">使用说明：</p>
                <p>{{item.content}}</p>
              </li>
            </ul>
            <button class="btn" @click="toMall">去使用</button>
          </div>
        </li>
      </template>
      <template v-if="tabsActive === 1">
        <li :class="['card-item-jh', item.cardState === 1 ? 'card-item-jh-disable' : '']" v-for="(item,index) of ticketList" :key="index">
          <p class="title">激活卡</p>
          <div class="desc">
            <span>限定商品：{{item.productName || '不限定商品'}}</span>
            <button>去使用</button>
          </div>
        </li>
        <!-- <li class="card-item-jh card-item-jh-disable">
          <p class="title">激活卡</p>
          <div class="desc">
            <span>限定商品：游戏云主机</span>
            <button>去使用</button>
          </div>
        </li> -->
      </template>
      <template v-if="tabsActive === 4">
        <li class="card-item-jh card-item-ty" :class="[item.cardState === 1 ? 'card-item-jh-disable' : '']" v-for="(item,index) of ticketList" :key="index">
          <p class="title">体验卡</p>
          <div class="desc">
            <span>限定商品：{{item.productName || '不限定商品'}}</span>
            <button>去使用</button>
          </div>
        </li>
        <!-- <li class="card-item-jh card-item-ty card-item-jh-disable">
          <p class="title">激活卡</p>
          <div class="desc">
            <span>限定商品：游戏云主机</span>
            <button>去使用</button>
          </div>
        </li> -->
      </template>
      <template v-if="ticketList.length === 0">
        <Empty :type="5" />
      </template>
    </ul>
  </div>
</template>

<script>
import TicketNum from './TicketNum.vue'
import Empty from './Empty'
import { userCardInfo } from "@/server/api.js"
import { PAGE_SIZE } from '@/config/public_config.js'

export default {
  name: "Tickets",
  data() {
    return {
      tabsList: [
        {name: "代金券", key: 3},
        {name: "水晶券", key: 2},
        {name: "激活卡", key: 1},
        {name: "体验卡", key: 4},
      ],
      tabsActive: 2,
      pageSize: PAGE_SIZE,
      currentPage: 1,
      ticketList: [],
    }
  },
  components: {
    TicketNum,
    Empty,
  },
  mounted() {
    this.userCardInfo(this.tabsActive);
  },
  filters: {
    getTime(itemObj) {
      if(!itemObj) {
        return '' 
      }
      if(itemObj.validityBegin && itemObj.validityEnd) {
        return `${itemObj.validityBegin.split(' ')[0]}至${itemObj.validityEnd.split(' ')[0]}`
      } else {
        return '不限时间'
      }
    },
    getCrystalConsRules(itemObj) {
      if(!itemObj) {
        return '' 
      }
      return `满${itemObj.minCost}水晶可用`
    },
    getCashConsRules(itemObj) {
      if(!itemObj) {
        return '' 
      }
      return `满${itemObj.minCost}元可用`
    }
  },
  methods: {
    toMall () {
      this.$router.push('/mall')
    },
    tabsClick(item) {
      this.tabsActive = item.key;
      this.ticketList = []
      this.userCardInfo(item.key);
    },
    async userCardInfo(type = 1) {
      let params = {
        type: type,
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        deviceNo: ""
      }
      let response = await userCardInfo(params);
      if(response.code !== 200) {
        this.$message.error(response.message);
        return false;
      }
      this.ticketList = response.data.data.dataList;
    }
  }
}
</script>

<style lang="less" scoped>
.tickets{
  .tabs{
    margin: 22px 0 40px;
    .tabs-item{
      padding: 0 15px;
      height: 22px;
      line-height: 22px;
      background: #fff;
      color: #19A5FE;
      border-radius: 11px;
      cursor: pointer;
      margin-right: 25px;
      color: #888;
    }
    .tabs-item-active{
      background: #19A5FE;
      color: #fff;
    }
  }
  .card-list{
    display: flex;
  }
  .card-item{
    width: 264px;
    // height: 158px;
    // background: #fff000;
    .ticket-face{
      width: 264px;
      height: 158px;
      background: url("../../assets/images/mine/picture-1.png") no-repeat;
      background-size: contain;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .ticket-face-num{
        height: 26px;
        margin-bottom: 20px;
      }
      .ticket-name{
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        height: 22px;
        line-height: 22px;
        margin-bottom: 4px;
      }
      .ticket-desc{
        font-size: 13px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        height: 18px;
        line-height: 18px;
      }
    }
    .ticket-body{
      width: 264px;
      height: 239px;
      background: url("../../assets/images/mine/picture-2.png") no-repeat;
      background-size: contain;
      padding: 20px;
      .ticket-tip-item {
        display: flex;
        // justify-content: space-between;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        margin-bottom: 10px;
      }
      .tti-name{
        width: 60px;
        flex-grow: 0;
        flex-shrink: 0;
      }
    }
    margin: 0 10px 20px;
  }
  .btn{
    display: block;
    background: #19A5FE;
    border-radius: 17px;
    width: 120px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    margin: 0 auto;
    margin-top: 10px;
  }
  .card-item-jh{
    width: 360px;
    height: 172px;
    cursor: pointer;
    margin: 0 10px 20px;
    background: url("../../assets/images/mine/picture-4.png") no-repeat;
    background-size: contain;
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title{
      height: 40px;
      line-height: 40px;
      font-size: 28px;
      color: #FFFFFF;
    }
    .desc{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      span{
        font-size: 13px;
        color: #FFFFFF;
        display: block;
      }
      button{
        width: 90px;
        height: 30px;
        border-radius: 15px;
        font-size: 14px;
        color: #004CAA;
        background: #fff;
      }
    }
  }
  .card-item-ty{
    background: url("../../assets/images/mine/picture-6.png") no-repeat;
    background-size: contain;
  }
  .card-item-jh-disable{
    filter: grayscale(100%);
    filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    cursor: auto;
  }
}
.ticket-tip-list{
  height: 140px;
}
</style>