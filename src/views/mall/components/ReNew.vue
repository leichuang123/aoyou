<template>
    <v-dialog
      v-model="dialog"
      max-width="400"
      :persistent="true"
      >
      <div class="content" v-if="payInfo !== null">
        <div class="title">
          <img src="@/assets/images/mall/icon-13.png" />
          <span>订单确认</span>
        </div>
        <v-row class="item" align="center" no-gutters>
          <div class="label">主机类型：</div>
          <v-col class="value">{{payInfo.productName}}</v-col>
        </v-row>
        <v-row class="item" align="center" no-gutters>
          <div class="label">主机配置：</div>
          <v-col class="value">{{payInfo.config}}</v-col>
        </v-row>
        <v-row class="item duration" align="center" no-gutters>
          <div class="label">购买时长：</div>
          <v-col class="value">
              <span 
                class="value-item" 
                :class="{'active': selectedTimeCard !== null && selectedTimeCard.id === item.id}" 
                @click="timeCardChoose(item)" 
                v-for="(item, index) in payInfo.shortcutDurationVOList" 
                :key="index">
                {{item.duration}}{{item.durationUnitName}}
              </span>
          </v-col>
        </v-row>
        <v-row class="item pay-type" align="center" no-gutters>
          <div class="label">支付方式：</div>
          <v-col class="value">
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
          </v-col>
        </v-row>
        <v-row class="item" align="center" no-gutters>
          <div class="label">价   格：</div>
          <v-col class="value price">
            <template v-if="payType === 0">
              <img src="@/assets/images/mall/icon-7.png"  />
              <span>{{ getPrice * 1000 }}</span>
            </template>
            <template v-else>￥{{selectedTimeCard === null ? 0 : getPrice}}</template>
            
          </v-col>
        </v-row>
        <!-- <v-row class="item" align="center" no-gutters>
          <div class="label">优惠：</div>
          <v-col class="value">
            <template v-if="payInfo.payType === 0">
              -{{payInfo.discountAmount * 1000}}
            </template>
            <template v-else>
              -￥{{payInfo.discountAmount}}
            </template>
          </v-col>
        </v-row>
        <v-row class="item" align="center" no-gutters>
          <div class="label">实付金额：</div>
          <v-col class="value price">
            <template v-if="payInfo.payType === 0">
              <img src="@/assets/images/mall/icon-7.png"  />
              <span>{{ (payInfo.price - payInfo.discountAmount) * 1000 }}</span>
            </template>
            <template v-else>
              ￥{{payInfo.price - payInfo.discountAmount}}
            </template>
          </v-col>
        </v-row> -->
        <div class="center" v-if="payType !== 0">
          <div class="code-c">
            <div class="code" id="renewcode"></div>
            <template v-if="codeUrl !== ''">
              <img class="icon" v-if="payType === 1" src="@/assets/images/mall/icon-9.png" />
              <img class="icon" v-else src="@/assets/images/mall/icon-10.png" />
            </template>
            
          </div>
          <div class="cancel" @click="close">取消</div>
        </div>  
        <div class="btns" v-else>
          <div class="cancel" @click="close">取消</div>
          <div class="sure" @click="sure">确定</div>
        </div>
      </div>
    </v-dialog>
</template>

<script>
import QRCode from 'qrcodejs2'
import {
  getTimeChargeInfo,
  renewalByMoney,
  renewalByCrystal,
  paylogState,
} from '@/server/api.js'

export default {
  name: 'Pay',
  props: {
    payInfo: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data () {
    return {
      dialog: true,
      payType: 0,
      selectedTimeCard: null,
      timeChargeInfo: null,
      orderStateTimer: -1,
      crystalOrderNo: '',
      codeUrl: '',
      timeCardException: '续费时长异常，请联系客服'
    }
  },
  computed: {
    getPrice () {
      let price = 0
      if (this.selectedTimeCard === null || this.timeChargeInfo === null) {
        return price
      }
      let timeChargeList = [
        {name: ''},
        {name: 'daily'},
        {name: 'monthly'},
        {name: 'annually'}
      ]
      // 数量 × 单位水晶
      return (this.selectedTimeCard.duration * this.timeChargeInfo[timeChargeList[this.selectedTimeCard.durationUnit].name]) / 1000;
    }
  },
  components: {

  },
  async mounted () {
    if (this.payInfo.shortcutDurationVOList.length > 0) {
      this.selectedTimeCard = this.payInfo.shortcutDurationVOList[0]
    }
    let res = await getTimeChargeInfo({id: this.payInfo.timeChargeId});
    if (res.code !== 200) {
      this.$meeesage.error(res.message)
      return
    }
    this.timeChargeInfo = res.data
    this.switchPayType(1)
  },
  methods: {
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
        clearInterval(this.orderStateTimer)
        this.orderStateTimer = -1
        this.crystalOrderNo = ''
        this.$emit('paySuccess', true)
      }, 5 * 1000)
    },
    sleep (t = 1500) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true)
        }, t)
      })
    },
    timeCardChoose(item) {
      this.selectedTimeCard = item;
    },
    async switchPayType (payType) {
      if (this.selectedTimeCard === null) {
        this.$message.error(this.timeCardException)
        return
      }
      if (this.orderStateTimer !== -1) {
        clearInterval(this.orderStateTimer)
      }
      this.payType = payType
      if (this.payType === 0) {
        return
      }
      let param = {
        shortcutDurationId: this.selectedTimeCard.id,
        timeChargeId: this.payInfo.timeChargeId,
        // productNo: this.payInfo.productNo,
        machineKey: this.payInfo.machineKey,
        userCardId: "",
        payChannel: this.payType === 1 ? 0 : 2,
      }
      this.$Spin.show()
      let res = await renewalByMoney(param)
      this.$Spin.hide()
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      this.codeUrl = res.data.url
      this.crystalOrderNo = res.data.crystalOrderNo
      document.getElementById('renewcode').innerHTML = ''
      new QRCode('renewcode', {
        width: 113,
        height: 113,
        text: res.data.url
      })
      this.looplogState()
    },
    // overlayclick (event) {
    //   this.$emit('close')
    //   event.stopPropagation()
    //   return false
    // },
    close () {
      if (this.orderStateTimer !== -1) {
        clearInterval(this.orderStateTimer)
      }
      this.$emit('close')
    },
    async sure () {
      if (this.selectedTimeCard === null) {
        this.$message.error(this.timeCardException)
        return
      }
      let param = {
        shortcutDurationId: this.selectedTimeCard.id,
        timeChargeId: this.payInfo.timeChargeId,
        // productNo: this.payInfo.productNo,
        machineKey: this.payInfo.machineKey,
        userCardId: "",
      }
      let res = await renewalByCrystal(param)
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      this.$emit('paySuccess')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 400px;
  background: white;
  box-sizing: border-box;
  padding: 30px;
  .title {
    display: flex;
    align-items: center;
    font-size: 24px;
    color: #666666;
    padding-bottom: 15px;
    img {
      width: 30px;
      margin-right: 10px;
    }
  }
  .item {
    margin-top: 14px;
    .label {
      width: 110px;
      font-size: 16px;
      color: #666666;
    }
    .value {
      font-size: 16px;
      color: #444444;
      line-height: 22px;
    }
    .price {
      display: flex;
      align-items: center;
      img {
        width: 14px;
        margin-right: 6px;
      }
    }
  }
  
  .center {
    text-align: center;
    .code-c {
      text-align: center;
      width: 113px;
      height: 113px;
      position: relative;
      margin: 0 auto;
       margin-top: 30px;
      .code {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: block;
      }
      .icon {
        width: 28px;
        background: white;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -14px;
        margin-left: -14px;                                                                                 
      }
    }
    
    .cancel {
      margin: 0 auto;
      background-image: linear-gradient(270deg, #5CC0FF 0%, #11A0FE 100%);
      border-radius: 25px;
      font-size: 16px;
      color: #FFFFFF;
      text-align: center;
      width: 140px;
      height: 40px;
      line-height: 40px;
      margin-top: 20px;
    }
  }
  .btns {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 60px;
    .cancel {
      background: #DDDDDD;
      border: 1px solid #DFDFDF;
      border-radius: 25px;
      width: 140px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      font-size: 16px;
      color: #777777;
    }
    .sure {
      background-image: linear-gradient(270deg, #5CC0FF 0%, #11A0FE 100%);
      border-radius: 25px;
       width: 140px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: white;
      font-size: 16px;
      cursor: pointer;
      margin-left: 40px;
    }
  }
  .duration {
    .value {
      .value-item {
        display: inline-block;
        width: 70px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        color: #666;
        border: 1px solid #DFDFDF;
        margin-left: 10px;
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
        width: 70px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        color: #666;
        border: 1px solid #DFDFDF;
        margin-left: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;

        &:first-child {
          margin-left: 0;
        }
        .icon {
          width: 14px;
          margin-right: 6px;
        }
        .zfb {
          width: 12px;
        }
      }
      .active {
        border: 2px solid #19A5FE;
        color: #19A5FE;
      }
    }
  }
}
</style>