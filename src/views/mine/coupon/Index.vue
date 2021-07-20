
<template>
  <el-tabs class="mine-tabs" @tab-click="tabClick">
    <el-tab-pane v-for="tab in tabs" :key="tab.type" >
      <template #label>
        <div class="tab-pane-name">{{tab.name}}</div>
      </template>

      <div class="list list-style-2" v-if="tab.type === 1">
        <div :class="['item', item.cardState === 1 ? 'disable' : '']" v-for="(item, index) in list[activeTab]" :key="index">
          <div class="disable-label" v-if="item.cardState === 1">已过期</div>
          <div class="title">激活卡</div>
          <div class="rule">限定商品：{{item.productName || '不限定商品'}}</div>
          <div class="btn">去使用</div>
        </div>
      </div>

      <div class="list list-style-1" v-if="tab.type === 2 || tab.type === 3">
        <div :class="['item', item.cardState === 1 ? 'disable' : '']" v-for="(item, index) in list[activeTab]" :key="index">
          <div class="top">
            <div class="price crystal">
              <img src="@/assets/image/mine/icon-94@2x.webp" v-if="item.type === 2"/>
              <span>{{item.waiverAmount}}</span>
            </div>
            <div class="rule">云主机{{tab.name}}</div>
          </div>
          <div class="bottom">
            <el-row class="b-item" type="flex">
              <span class="label">使用条件：</span>
              <span class="value">满{{item.minCost}}{{tab.type === 2 ? '水晶' : '元'}}可用`</span>
            </el-row>
            <el-row class="b-item">
              <span class="label">有效时间：</span>
              <span class="value">
                <template v-if="item.validityBegin && item.validityEnd">
                  {{item.validityBegin.split(' ')[0]}}至{{item.validityEnd.split(' ')[0]}}
                </template>
                <template v-else>不限时间</template>
              </span>
            </el-row>
            <el-row class="b-item">
              <span class="label">限定商品：</span>
              <span class="value">{{item.productName || '不限定商品'}}</span>
            </el-row>
            <el-row class="b-item hidden">
              <span class="label">使用说明：</span>
              <span class="value"></span>
            </el-row>
          </div>
          <div class="expire" v-if="item.cardState === 1">
            已过期
          </div>
          <div type="primary" class="btn">去使用</div>
        </div>
      </div>
      <div class="list list-style-3" v-if="tab.type === 4">
        <div :class="['item', item.cardState === 1 ? 'disable' : '']" v-for="(item, index) in list[activeTab]" :key="index">
          <div class="title">体验卡</div>
          <div class="disable-label" v-if="item.cardState === 1">已过期</div>
          <div class="rule">

            <div class="rule-item">有效时间： 
              <template v-if="item.validityBegin && item.validityEnd">
                  {{item.validityBegin.split(' ')[0]}}至{{item.validityEnd.split(' ')[0]}}
                </template>
                <template v-else>不限时间</template></div>
            <div class="rule-item hidden">限制时段：</div>
            <div class="rule-item">限定商品：{{item.productName || '不限定商品'}}</div>
          </div>
          <div class="btn">去使用</div>
        </div>
        
      </div>

      <div v-if="list[activeTab].length === 0" class="empty" :style="{marginTop: tab.type === 1 || tab.type === 4 ? '-10px' : '0'}">
        <img src="@/assets/image/mine/empty_coupon@2x.webp" />
        <div class="text">暂无可用优惠券！</div>
      </div>
    </el-tab-pane>
</el-tabs>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import api from '@/config/api.js'
import { ElTabs, ElTabPane, ElRow, ElCol, ElButton } from 'element-plus'
export default {
  components: {
    ElTabs,
    ElTabPane,
    ElRow,
    ElCol,
    ElButton
  },
  setup () {
    const { ctx } = getCurrentInstance()
    const activeTab = ref(0)
    let tabs = ref([{
      name: '代金券',
      type: 3,
    },{
      name: '水晶券',
      type: 2,
    },{
      name: '激活卡',
      type: 1,
    },{
      name: '体验卡',
      type: 4,
    }])
    let list = ref(new Array(tabs.value.length).fill([]))
    async function getList(type) {
      let res = await ctx.$axios.post(api.userCardInfo, {
        type: activeTab.value * 1,
        currentPage: 1,
        pageSize: 9999
      })
      // res.data = {data: {}}
      // res.data.data.dataList = [{
      //   waiverAmount: 9999,
      //   cardState: 0,
      //   name: '测试',
      //   minCost: 10,
      //   validityBegin: '2020-04-21 14:19:35',
      //   validityEnd: '2020-04-21 14:19:37',
      //   productName: '测试商品'
      // },{
      //   waiverAmount: 9999,
      //   cardState: 1,
      //   name: '测试',
      //   minCost: 10,
      //   validityBegin: '2020-04-21 14:19:35',
      //   validityEnd: '2020-04-21 14:19:37',
      //   productName: '测试商品'
      // }]
      // console.log(res)
      if (res.code !== 200 || !res.data) {
        return
      }
      let tabList = JSON.parse(JSON.stringify(list.value))
      tabList[activeTab.value] = res.data.data.dataList
      list.value = tabList
    }
    getList()
    return { list, tabs, activeTab, getList, 
      tabClick (tab) {
        activeTab.value = tab.index
        getList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden {
  visibility: hidden;
}
.mine-tabs {
  box-sizing: border-box;
  padding-top: 60px;
  @media screen and (max-width: $media-max) {
    padding-top: 40px;
  }
  .tab-pane-name {
    padding: 0 15px;
    font-size: $fontsize-l3;
  }
}

.list {
  margin-left: 30px;
  margin-right: 20px;
  text-align: left;
  margin-top: 10px;
  .item {
    display: inline-block;
    position: relative;
    margin-right: 20px;
    @media screen and (max-width: $media-max) {
      margin-right: 0;
    }
  }
}

.list-style-1 {
  text-align: left;
  font-size: 0;
  @media screen and (max-width: $media-max) {
    margin-top: 0;
    margin-left: 10px;
  }
  .item {
    text-align: center;
    width: 284px;
    height: 417px;
    background-image: url('@/assets/image/mine/icon-92@2x.webp');
    background-size: 99% 97%;
    background-position: center center;
    background-repeat: no-repeat;
    @media screen and (max-width: $media-max) {
      width: 276px;
      height: 368px;
      margin-top: 0;
    }
    .top {
      height: 158px;
      display: flex;
      align-content: center;
      justify-content: center;
      flex-direction: column;
      color: $color-l1-l;
      position: relative;
      top: 10px;
      .price {
        font-size: 40px;
      }
      .crystal {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          font-size: 40px;
        }
        img {
          height: 26px;
          margin-right: 4px;
        }
      }
      .rule {
        margin-top: 10px;
        font-size: $fontsize-l5;
      }
    }
    .bottom {
      padding-top: 20px;
      height: 240px;
      position: relative;
      .b-item {
        margin-top: 10px;
        box-sizing: border-box;
        color: $color-l2;
        padding: 0 30px;
        .label {
          width: 60px;
          font-size: $fontsize-l7;
          text-align: left;
        }
        .value {
          font-size: $fontsize-l7;
          text-align: left;
          flex: 1;
        }
      }
    }
    .expire {
      display: none;
    }
    .btn {
      position: absolute;
      bottom: 30px;
      left: 50%;
      margin-left: -60px;
      width: 120px;
      height: 34px;
      line-height: 34px;
      color: $color-l1-l;
      font-size: $fontsize-l6;
      background-color: $color-primary;
      border-radius: 17px;
      cursor: pointer;
    }
  }
  .disable {
    background-image: url('@/assets/image/mine/icon-93@2x.webp');
    .bottom {
      .label {
        color: #888;
      }
      .value {
        color: #888;
      } 
    }
    .expire {
      position: absolute;
      top: 25px;
      right: 25px;
      display: inline-block;
      width: 60px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      
      font-size: $fontsize-l7;
      background-color: #fff;
      border-radius: 10px;
      border-bottom-left-radius: 0;
      color: #888;
    }
    .btn {
      background-color: $color-disable;
      cursor: not-allowed;
    }
  }
}

.list-style-2 {
  .item {
    background-image: url('@/assets/image/mine/icon-95@2x.webp');
    background-size: cover;
    background-repeat: no-repeat;
    width: 360px;
    height: 172px;
    @media screen and (max-width: $media-max) {
      width: 335px;
      height: 160px;
      margin-right: 20px;
    }
    .title {
      font-size: $fontsize-l1;
      position: absolute;
      color: $color-l1-l;
      position: absolute;
      top: 15px;
      left: 20px;
      @media screen and (max-width: $media-max) {
        font-size: 22px;
      }
    }
    .rule {
      position: absolute;
      left: 20px;
      bottom: 15px;
      font-size: $fontsize-l6;
      color: $color-l1-l;
    }
    .btn {
      width: 90px;
      height: 30px;
      line-height: 30px;
      color: #004caa;
      text-align: center;
      position: absolute;
      right: 20px;
      bottom: 15px;
      background-color: #fff;
      border-radius: 20px;
      cursor: pointer;
      @media screen and (max-width: $media-max) {
        font-size: $fontsize-l6;
      }
    }
    .disable-label {
      display: none;
    }
  }
  .disable {
    background-image: url('@/assets/image/mine/icon-96@2x.webp');
    .disable-label {
      display: inline-block;
      width: 80px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
      color: $color-l1-l;
      font-size: $fontsize-l7;
    }
    .btn {
      color: #777;
      cursor: not-allowed;
    }
  }
}

.list-style-3 {
  .item {
    background-image: url('@/assets/image/mine/icon-97@2x.webp');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 360px;
    height: 172px;
    margin-right: 20px;
    .title {
      font-size: $fontsize-l1;
      position: absolute;
      color: $color-l1-l;
      position: absolute;
      top: 15px;
      left: 20px;
      @media screen and (max-width: $media-max) {
        font-size: 22px;
      }
    }
    .rule {
      position: absolute;
      left: 20px;
      bottom: 15px;
      font-size: $fontsize-l6;
      max-width: 220px;
      .rule-item {
        margin-top: 4px;
        font-size: $fontsize-l7;
        color: $color-l1-l;
      }
    }
    .btn {
      width: 90px;
      height: 30px;
      line-height: 30px;
      color: #FF8901;
      text-align: center;
      position: absolute;
      right: 20px;
      bottom: 15px;
      background-color: #fff;
      border-radius: 20px;
      cursor: pointer;
      @media screen and (max-width: $media-max) {
        font-size: $fontsize-l6;
      }
    }
    .disable-label {
      display: none;
    }
  }
  .disable {
    background-image: url('@/assets/image/mine/icon-98@2x.webp');
    .disable-label {
      font-size: $fontsize-l7;
      display: inline-block;
      width: 80px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
      color: $color-l1-l;
      border-radius: 25px;
      background-color: $color-l3;
      border-bottom-right-radius: 0;
    }
    .btn {
      color: #777;
      cursor: not-allowed;
    }
  }
}

.empty {
  text-align: center;
  padding-top: 54px;
  img {
    width: 375px;
    margin: 0 auto;
  }
  .text {
    font-size: $fontsize-l5;
    margin-top: 30px;
    color: $color-l1-l;
  }
}
</style>

