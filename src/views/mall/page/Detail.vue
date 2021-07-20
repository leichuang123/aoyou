<template>
  <div class="mall-detail" v-if="productInfo !== null">
   
    <img class="top-cover" :src="productInfo.topImage.url" />
    <div class="content">
      <div class="bread">
        <span class="pointer" @click="toMall()" >商城 </span>
        <span class="diver">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        <template v-if="name !== ''">
          <span class="pointer" @click="toMallList()" > {{name}} </span>
          <span class="diver">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        </template>
        <span class="current">详情</span>
      </div>
      <div class="base-info">
        <div class="cover" :style="{backgroundImage: `url(${productInfo.coverImage.url})`}"></div>
        <div class="m-info">
          <div class="name">{{productInfo.productName}}</div>
          <div class="price item">
            <div class="label">价格</div>
            <div class="value">
              <img class="icon" src="@/assets/images/mall/icon-7.png" v-if="payType === 0" />
              <span class="sign" v-else>￥</span>
              <span class="text">{{(payType === 0 ? exchange_rate : 1) * getPayPrice}}</span>
            </div>
          </div>
          <div class="duration item">
            <div class="label">选择时长</div>
            <div class="value">
              <span 
                class="value-item" 
                :class="{'active': selectedTimeCardId === item.id}" 
                @click="timeCardChoose(item)" 
                v-for="(item, index) in productInfo.shortcutDurationVOList" 
                :key="index">
                {{item.duration}}{{item.durationUnitName}}
              </span>
            </div>
          </div>
          <div class="pay-type item">
            <div class="label">支付方式</div>
            <div class="value">
              <!-- <span :class="['value-item', payType === 0 ? 'active' : '']" @click="switchPayType(0)">
                <img class="icon" src="@/assets/images/mall/icon-7.png" />
                水晶
              </span> -->
              <span :class="['value-item', payType === 1 ? 'active' : '']" @click="switchPayType(1)">
                <img class="icon zfb" src="@/assets/images/mall/icon-9.png" />
                支付宝
              </span>
              <span :class="['value-item', payType === 2 ? 'active' : '']" @click="switchPayType(2)">
                <img class="icon" src="@/assets/images/mall/icon-10.png" />
                微信
              </span>
            </div>
          </div>
          <!-- <div class="price item">
            <div class="label">优惠券</div>
            <div class="value">
              <v-select
                :dense="true"
                no-data-text="暂无可用优惠券"
                :items="productInfo.userVoucherList"
                :item-disabled:="disableCoupons"
                item-text="name"
                item-value="userCardId"
                v-model="selectedCouponId"
                @change="couponChange"
              >
              </v-select>
            </div>
          </div> -->
          <div class="buy" :class="[stockInfo !== null && stockNum <= 0 ? 'disable' : '']" @click="preBuy">购&nbsp;&nbsp;买</div>
        </div>
      </div>

      <div class="base-specs">
        <div class="title">基础参数</div>
        <div class="list">
          <div class="item">
            <div class="label">
              显卡
            </div>
            <div class="value">
              {{productInfo.graphicsMemoryName}}
            </div>
          </div>
          <div class="item">
            <div class="label">
              CPU
            </div>
            <div class="value">
              {{productInfo.cpu}}v
            </div>
          </div>
          <div class="item">
            <div class="label">
              内存
            </div>
            <div class="value">
              {{productInfo.memory}}G
            </div>
          </div>
          <div class="item">
            <div class="label">
              硬盘空间
            </div>
            <div class="value">
              {{productInfo.hardDiskName}}
            </div>
          </div>
          <!-- <div class="item">
            <div class="label">
              出口宽带
            </div>
            <div class="value">
              50 Mbps
            </div>
          </div> -->
          <div class="item">
            <div class="label">
              预装软件
            </div>
            <div class="value">
              <span v-for="(item, index) of productInfo.preinstallSoftwareList" :key="index">
                  {{item.name}}
                </span>
            </div>
          </div>
          <div class="item">
            <div class="label">
              操作系统
            </div>
            <div class="value">
              {{productInfo.operateSystemName}}
            </div>
          </div>
          <div class="item">
            <div class="label">
              使用说明
            </div>
            <div class="value">
              {{productInfo.instructions}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Pay v-if="isShowPayDialog" :payInfo="payInfo" @close="closePay" @crystalPaySuccess="crystalPaySuccess"/>
    <QiMoService />
    <v-dialog
      v-model="tipLogin"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">您还未登录，请先登录</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="tipLogin = false"
          >
            取消
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="toLogin"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
  IMAGE_PREFIX,
  TIME_UNIT_LIST,
  EXCHANGE_RATE,
} from '@/config/public_config'

import Pay from '../components/Pay.vue'
import QiMoService from '@/components/public/QiMoService.vue'
import store from '@/store/index'

import {
  queryDicList,
  queryVMDetails,
  queryVMDetailsNotUerNo,
  getStock,
  getTimeChargeInfo,
  crystalBuyVm,
  rmbBuyVm,
  paylogState,
} from '@/server/api.js'

export default {
  name: 'MallDetail',
  components: {
    Pay,
    QiMoService,
  },
  data () {
    return {
      payType: 1,
      couponIndex: -1,
      productNo: '',
      exchange_rate: EXCHANGE_RATE,
      selectedTimeCardId: 0,
      productInfo: null,
      isShowPayDialog: false,
      payInfo: null,
      timeChargeInfo: null,
      selectedCoupon: null,
      selectedCouponId: 0,
      systemDiskList: [],
      hardList: [],
      graphicList: [],
      operateSystemList: [],
      stockNum: 0,
      stockInfo: null,
      crystalOrderNo: '',
      orderStateTimer: -1,
      name: '',
      en: '',
      typeNo: '',
      tipLogin: false,
    }
  },
  async mounted () {
    this.typeNo = this.$route.query.typeNo
    this.name = decodeURIComponent(this.$route.query.name || '')
    this.en = decodeURIComponent(this.$route.query.en || '').toUpperCase()
    this.productNo = this.$route.query.productNo || ''
    if (!this.productNo) {
      this.$message.error('页面参数异常')
      setTimeout(() => {
        this.$router.push('/mall')
      }, 1500);
      return
    }
    await this.getDicList(SYSEM_DISK_ID)
    await this.getDicList(HARD_DISK_ID)
    await this.getDicList(GRAPHIC_MEMORY_ID)
    await this.getDicList(OPERATE_SYSTEM_ID)
    this.queryVMDetails();
  },
  beforeDestroy () {
    if (this.orderStateTimer !== -1) {
      clearInterval(this.orderStateTimer)
    }
  },
  methods: {
    toLogin() {
      this.$router.push("/login?from=" + encodeURIComponent(window.location.href))
    },
    switchPayType (payType) {
      this.payType = payType
    },
    async getDicList (codeTypeNo) {
      let res = await queryDicList({
        codeTypeNo,
        pageSize: 9999,
      })
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      switch (codeTypeNo) {
        case SYSEM_DISK_ID:
          this.systemDiskList = res.data.dataList
          break;
        case HARD_DISK_ID:
          this.hardList = res.data.dataList
          break;
        case GRAPHIC_MEMORY_ID:
          this.graphicList = res.data.dataList
          break;
        case OPERATE_SYSTEM_ID:
          this.operateSystemList = res.data.dataList
          break;
        default:
          break;
      }
    },
    toMall () {
      this.$router.push('/mall')
    },
    toMallList () {
      this.$router.push(`/mall/list?typeNo=${this.typeNo}&name=${encodeURIComponent(this.name)}&en=${encodeURIComponent(this.en)}`)
    },
    async getStock(vmType = 0) {
      let params = {
        vmType: vmType,
        deviceNo: this.$store.state.deviceNo
      }
      let response = await getStock(params);
      if(response.code !== 200) {
        return false;
      }
      this.stockInfo = response
      // data 字段就是库存数量
      if(response.data && response.data > 0) {
        this.stockNum = response.data;
      }
    },
    closePay () {
      this.isShowPayDialog = false
      if (this.orderStateTimer !== -1) {
        clearInterval(this.orderStateTimer)
        this.orderStateTimer = -1
      }
    },
    looplogState () {
      this.orderStateTimer = setInterval(async () => {
        let res = await paylogState({
          deviceNo: this.$store.state.deviceNo,
          crystalOrderNo: this.crystalOrderNo
        })
        if (res.code !== 200) {
          this.$message.error(res.message)
          return
        }
        if (res.data.state !== 1) {
          return
        }
        store.dispatch('updateUserInfo',{token: store.getters.getToken})
        clearInterval(this.orderStateTimer)
        this.isShowPayDialog = false
        this.orderStateTimer = -1
        this.$message.success('支付成功')
        setTimeout(() => {
          this.$router.push(`/mall/loading?type=1`)
        }, 1500)
      }, 5 * 1000)
    },
    async preBuy () {
      // if (this.stockInfo !== null && this.stockNum <= 0) {
      //   return
      // }
      if (!store.getters.getToken) {
        this.tipLogin = true;
        return
      }
      this.buy()
    },
    async buy () {
      let param = {
        shortcutDurationId: this.selectedTimeCardId,
        timeChargeId: this.productInfo.timeChargeId,
        productNo: this.productNo,
        userCardId: this.selectedCoupon === null ? '' : this.selectedCoupon.userCardId,
      }
      let shortcutDurationName = ''
      this.productInfo.shortcutDurationVOList.forEach(item => {
        if (+item.id === +this.selectedTimeCardId) {
          shortcutDurationName = item.duration + item.durationUnitName
        }
      })
      let payInfo =  {
        payType: this.payType,
        productName: this.productInfo.productName,
        productNo: this.productNo,
        timeChargeId: this.productInfo.timeChargeId,
        shortcutDurationId: this.selectedTimeCardId,
        shortcutDurationName: shortcutDurationName,
        price: this.getProductPrice,
        config: `${this.productInfo.cpu} / ${this.productInfo.systemDiskName} / ${this.productInfo.hardDiskName} / ${this.productInfo.graphicsMemoryName} / ${this.productInfo.operateSystemName}`,
        voucherID: this.selectedCoupon === null ? -1 : this.selectedCoupon.userCardId,
        voucherType: this.selectedCoupon === null ? -1 : this.selectedCoupon.awardType,
        discountAmount: this.selectedCoupon === null ? 0 : this.selectedCoupon.waiverAmount
        // discountAmount: this.getCouponPrice,
      }
      if (this.payType === 0) {
        this.payInfo = payInfo
        this.isShowPayDialog = true
        return
      }

      param.payChannel = this.payType === 1 ? 0 : 2
      this.$Spin.show()
      let res = this.payType === 0 ? await crystalBuyVm(param) : await rmbBuyVm(param)
      this.$Spin.hide()
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      this.crystalOrderNo = res.data.crystalOrderNo
      this.looplogState()
      
      payInfo.codeUrl = res.data.url
      this.payInfo = payInfo
      this.isShowPayDialog = true
    },
    timeCardChoose(item) {
      this.selectedTimeCardId = item.id;
      this.selectedCoupon = null;
      this.selectedCouponId = 0;
    },
    
    async queryVMDetails() {

      let params = {
        productNo: this.productNo,
        deviceNo: this.$store.state.deviceNo
      };
      this.$Spin.show()
      let response = this.$store.state.userInfo === null ? await queryVMDetailsNotUerNo(params) : await queryVMDetails(params);
      this.$Spin.hide()
      if(response.code !== 200) {
        this.$message.error(response.message)
        return false;
      }
      // this.getStock(response.data.vmType);
      this.timeChargeInfo = await this.getTimeChargeInfo(response.data.timeChargeId);
      let topImage = {}
      let coverImage = {}
      response.data.productPictureList.forEach(element => {
        element.url = `${IMAGE_PREFIX}/${element.url}`
        if (element.type === 1) {
          coverImage = element
        } else if (element.type === 2) {
          topImage = element
        }
      });
      response.data.topImage = topImage
      response.data.coverImage = coverImage
      response.data.shortcutDurationVOList.forEach(element => {
        element.durationUnitName = typeof TIME_UNIT_LIST[element.durationUnit] !== 'undefined' ? TIME_UNIT_LIST[element.durationUnit].name : ''
      })
      this.selectedTimeCardId = response.data.shortcutDurationVOList[0].id;
      this.systemDiskList.forEach(obj => {
        if (obj.serialNo === +response.data.systemDisk) {
          response.data.systemDiskName = obj.name
        }
      })
      this.hardList.forEach(obj => {
        if (obj.serialNo === +response.data.hardDisk) {
          response.data.hardDiskName = obj.name
        }
      })
      this.graphicList.forEach(obj => {
        if (obj.serialNo === +response.data.graphicsMemory) {
          response.data.graphicsMemoryName = obj.name
        }
      })
      this.operateSystemList.forEach(obj => {
        if (obj.serialNo === +response.data.operateSystem) {
          response.data.operateSystemName = obj.name
        }
      })
      // response.data.userVoucherList = [{
      //   "awardType": 3,
      //   "name": "库测试代金券自有",
      //   "awardId": 5,
      //   "waiverAmount": 1,
      //   "minCost": 1,
      //   "userCardId": 306
      // },
      // {
      //   "awardType": 3,
      //   "name": "库测试",
      //   "awardId": 4,
      //   "waiverAmount": 1,
      //   "minCost": 1,
      //   "userCardId": 280
      // }]
      response.data.userVoucherList = this.filterCoupon(response.data.userVoucherList)
      response.data.userVoucherList.splice(0, 0, {userCardId: 0, name: '不使用优惠券'})
      this.productInfo = response.data
    },
    // 过滤优惠群列表，只显示 水晶券2 现金券3
    filterCoupon(list = []) {
      return list.filter((item) => {
        return item.awardType === 2 || item.awardType === 3;
      })
    },
    async getTimeChargeInfo(timeChargeId) {
      let params = {
        id: timeChargeId
      }
      let res = await getTimeChargeInfo(params);
      return res.code === 200 ? res.data : null
    },
    couponChange(userCardId) {
      // this.selectedCoupon = option.data.attrs.item
      if (userCardId === 0) {
        this.selectedCoupon = null
        return
      }
      this.productInfo.userVoucherList.forEach(item => {
        if (item.userCardId === userCardId) {
          this.selectedCoupon = item
        }
      })
    },
    crystalPaySuccess () {
      this.isShowPayDialog = false
      this.$router.push('/mall/loading?type=1')
    }
  },
  computed: {
    disableCoupons () {
      let list = []
      if (this.selectedTimeCardId === 0 || !this.productInfo) {
        return list
      }
      list = this.productInfo.userVoucherList.filter(item => {
        // 2 水晶，3.现金
        if (this.getProductPrice * (item.awardType === 2 ? 1 : 1 / EXCHANGE_RATE) < item.minCost) {
          list.push(item.id)
        }
      })
      return list
    },
    getProductPrice() {
      // let timeChargeId = this.productInfo.timeChargeId;
      let timeChargeList = [
        {name: ''},
        {name: 'daily'},
        {name: 'monthly'},
        {name: 'annually'}
      ]
      if(this.productInfo && this.timeChargeInfo) {
        let shortcutDurationVOList = this.productInfo.shortcutDurationVOList;
        let timeInfo = null;
        shortcutDurationVOList.forEach(item => {
          if( this.selectedTimeCardId === item.id) {
            timeInfo = item;
          }
        })
        // 数量 × 单位水晶

        return (timeInfo.duration * this.timeChargeInfo[timeChargeList[timeInfo.durationUnit].name]) / EXCHANGE_RATE;
      } else {
        return 0;
      }
    },
    getCouponPrice() {
      let selectedCoupon = this.selectedCoupon;
      let couponPrice = 0;
      if(selectedCoupon) {
        // let minCost = selectedCoupon.awardType === 2 ? (selectedCoupon.minCost / 1000) : selectedCoupon.minCost;
        let waiverAmount = selectedCoupon.awardType === 2 ? (selectedCoupon.waiverAmount / 1000) : selectedCoupon.waiverAmount;
        couponPrice = waiverAmount;
      }
      return couponPrice
    },
    getPayPrice() {
      let price = this.getProductPrice - this.getCouponPrice;
      return price >= 0 ? price : 0;
    }
  },
}
</script>

<style lang="less" scoped>
.mall-detail {
  text-align: center;
  .top-cover {
    max-width: 100%;
    max-height: 300px;
    margin: 0 auto;
    vertical-align: top;
  }
  .content {
    width: 1200px;
    margin: 0 auto;
    .bread {
      font-size: 18px;
      color: #666666;
      padding-top: 16px;
      text-align: left;
      .pointer {
        cursor: pointer;
      }
    }
    .base-info {
      display: flex;
      align-items: center;
      .cover {
        width: 420px;
        height: 420px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
      }
      .m-info {
        margin-left: 40px;
        padding-top: 10px;
        padding-bottom: 50px;
        .item {
          margin-top: 40px;
          display: flex;
        }
        .label {
          width: 104px;
          text-align: left;
          font-size: 14px;
          color: #666666;
          line-height: 20px;
        }
        .value {
          display: flex;
          align-items: center;

        }
        .name {
          font-size: 24px;
          color: #444444;
          font-weight: bold;
          text-align: left;
        }
        .price {
          .value {
            font-size: 30px;
              color: #FF5435;
            .icon {
              width: 24px;
              margin-right: 5px;
            }
          }
        }
        .value-item {
          cursor: pointer;
        }
        .duration {
          .value {
            .value-item {
              width: 90px;
              text-align: center;
              height: 34px;
              line-height: 34px;
              color: #666;
              border: 1px solid #DFDFDF;
              margin-left: 40px;
              &:first-child {
                margin-left: 0;
              }
            }
            .active {
              border: 2px solid #19A5FE;
              color: #19A5FE;
            }
          }
        }
        .pay-type {
          .value {
            .value-item {
              width: 90px;
              text-align: center;
              height: 34px;
              line-height: 34px;
              color: #666;
              border: 1px solid #DFDFDF;
              margin-left: 40px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              &:first-child {
                margin-left: 0;
              }
              .icon {
                width: 20px;
                margin-right: 6px;
              }
              .zfb {
                width: 18px;
              }
            }
            .active {
              border: 2px solid #19A5FE;
              color: #19A5FE;
            }
          }
        }
        .buy {
          background-image: linear-gradient(132deg, #0F9FFE 0%, #5CC0FF 100%);
          border-radius: 5px;
          width: 230px;
          height: 60px;
          text-align: center;
          color: white;
          line-height: 60px;
          margin-top: 60px;
          font-size: 24px;
          cursor: pointer;
        }
        .buy.disable {
          cursor: not-allowed;
          background: #DFDFDF;
        }
      }
    }
    .base-specs {
      padding-bottom: 70px;
      .title {
        background: #F7F7F7;
        height: 40px;
        text-align: left;
        padding-left: 20px;
        font-size: 24px;
        line-height: 40px;
        color: #666666;
        border-left: solid 10px #11A0FE;
      }
      .list {
        .item {
          display: flex;
          padding: 20px  0  20px 30px;
          border-bottom: solid 1px #E8E8E8;
          font-size: 18px;
          &:last-child {
            border-bottom: none;
          }
          .label {
            width: 200px;
            text-align: left;
            color: #888888;
          }
          .value {
            color: #444444;
          }
        }
      }
    }
  }
  
}
</style>
