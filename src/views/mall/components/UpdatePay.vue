<template>
    <v-dialog
      v-model="dialog"
      max-width="590"
      :persistent="true"
      >
      <div class="up-cnt">
        <div class="k-close" @click="close"></div>
        <div class="steps">
          <img class="img" v-show="step === 1" src="@/assets/images/mall/jindu-1.png" />
          <img  class="img" v-show="step === 2" src="@/assets/images/mall/jindu-2.png" />
        </div>
        <div class="step1-content" v-if="step === 1">
          <div class="k-title">
            <img class="icon" src="@/assets/images/mall/shengjitishi.png" />
            升级须知
          </div>
          <div class="msgs">
            <div>1.升级后的主机不支持降低配置。</div>
            <div>2.升级价格=主机差价*主机剩余时长。</div>
            <div>3.不足一天按照一天计算。</div>
          </div>
          <div class="next-btn" @click="changeStep(2)">下一步</div>
        </div>
        <div class="content" v-if="payInfo !== null && step === 2">
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
          <v-row class="item"  no-gutters>
            <div class="label">购买时长</div>
            <v-col class="value flex-center">
              <div class="day">{{payInfo.price.days}}天</div>
              <div class="day-tip">
                <img src="@/assets/images/mall/zhuyi.png" class="icon" />
                (购买时长=主机剩余时长）
              </div>
            </v-col>
          </v-row>
          <!-- <v-row class="item duration" align="center" no-gutters>
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
          </v-row> -->
          <v-row class="item"  no-gutters>
            <div class="label">价   格：</div>
            <v-col class="value flex-center">
              <div class="price">￥{{payInfo.price.handle}}</div>
              <div class="price-tip">
                <img src="@/assets/images/mall/zhuyi.png" class="icon" />
                (升级补差价*主机剩余时长）
              </div>
            </v-col>
          </v-row>
          <div class="pay-code-c">
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
            <div class="code-c">
              <div class="code" id="renewcode"></div>
              <template v-if="codeUrl !== ''">
                <img class="icon" v-if="payType === 1" src="@/assets/images/mall/icon-9.png" />
                <img class="icon" v-else src="@/assets/images/mall/icon-10.png" />
              </template>
              <div class="code-tip">（扫码进行支付）</div>
            </div>
          </div>
          
          
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
            <div class="cancel" @click="changeStep(1)">上一步</div>
          </div>  
          <div class="btns" v-else>
            <div class="cancel" @click="changeStep(1)">上一步</div>
            <div class="sure" @click="sure">确定</div>
          </div>
        </div>
      </div>
    </v-dialog>
</template>

<script>
import QRCode from 'qrcodejs2'
import {
  getTimeChargeInfo,
  // renewalByMoney,
  renewalByCrystal,
  paylogState,
  upgradeByMoney
} from '@/server/api.js'

export default {
  name: 'Pay',
  props: {
    // payInfo: {
    //   type: Object,
    //   default: () => {
    //     return null
    //   }
    // }
  },
  data () {
    return {
      dialog: false,
      payType: 0,
      selectedTimeCard: null,
      timeChargeInfo: null,
      orderStateTimer: -1,
      crystalOrderNo: '',
      codeUrl: '',
      payInfo: null,
      timeCardException: '续费时长异常，请联系客服',
      step: 1,
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
  },
  methods: {
    async init(val) {
      this.dialog = true
      this.payInfo = val
      // if (this.payInfo.shortcutDurationVOList.length > 0) {
      //   this.selectedTimeCard = this.payInfo.shortcutDurationVOList[0]
      // }
      let res = await getTimeChargeInfo({id: this.payInfo.timeChargeId});
      if (res.code !== 200) {
        this.$meeesage.error(res.message)
        return
      }
      this.timeChargeInfo = res.data
      this.switchPayType(1)
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
        this.$message('支付成功')
        clearInterval(this.orderStateTimer)
        this.orderStateTimer = -1
        // this.$emit('paySuccess', true)
        // window.location.reload()
        this.$router.push(`/mall/loading?type=8&upgradeNo=${this.payInfo.upgradeNo}&orderNo=${res.data.durationOrderNo}`)
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
    changeStep (step) {
      this.step = step
       if (this.orderStateTimer !== -1) {
        clearInterval(this.orderStateTimer)
        this.orderStateTimer = -1
      }
      if (step === 2) {
        this.switchPayType(this.payType)
      }
    },
    async switchPayType (payType) {
      // if (this.selectedTimeCard === null) {
      //   this.$message.error(this.timeCardException)
      //   return
      // }
      if (this.orderStateTimer !== -1) {
        clearInterval(this.orderStateTimer)
        this.orderStateTimer = -1
      }
      this.payType = payType
      
      let param = {
        // shortcutDurationId: this.selectedTimeCard.id,
        // timeChargeId: this.payInfo.timeChargeId,
        // // productNo: this.payInfo.productNo,
        // machineKey: this.payInfo.machineKey,
        // userCardId: "",
        // payChannel: this.payType === 1 ? 0 : 2,
        "machineKey":this.payInfo.machineKey,//机器用户名
        "upgradeNo": this.payInfo.upgradeNo, //升级包ID
        "upgradeChargeId": this.payInfo.upgradeChargeId,//升级时长计费id(升级包的时长计费ID)
        "upgradeVmId": this.payInfo.upgradeVmId,  //升级虚机id不能为空（升级包的虚机）
        "payChannel": this.payType === 1 ? 0 : 2 // 支付渠道0-支付宝pc 1-支付宝h5 2-微信pc 3-微信h5 4-微信公众号
      }
      this.$Spin.show()
      let res = await upgradeByMoney(param)
      this.$Spin.hide()
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      this.codeUrl = res.data.url
      this.crystalOrderNo = res.data.crystalOrderNo
      if (!document.getElementById('renewcode')) {
        return
      }
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
      this.dialog = false
      this.step = 1
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
.flex-center {
  display: flex;
  align-items: center;
}

.up-cnt {
  min-height: 520px;
  background: white;
  position: relative;
  .k-close {
    position: absolute;
    right: 0;
    top: 0;
    width: 40px;
    height: 40px;
    background-image: url('../../../assets/images/icon/guanbi.png');
    // background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    background-size: 40%;
  }
  .steps {
    padding: 28px 0;
    .img {
      width: 100%;
    }
  }
  .step1-content {
    padding-left: 40px;
    .k-title {
      display: flex;
      align-items: center;
      font-size: 24px;
      
      color: #666;
      .icon {
        width: 24px;
        margin-right: 10px;
      }
    }
    .msgs {
      font-size: 16px;
      line-height: 40px;
      color: #555555;
      margin-top: 26px;
      padding-bottom: 48px;
    }
    .center {
      text-align: center;
    }
    .next-btn {
      background-image: linear-gradient(270deg, #5CC0FF 0%, #11A0FE 100%);
      border-radius: 25px;
      width: 125px;
      height: 40px;
      line-height: 40px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      position: absolute;
      bottom: 20px;
      left: 50%;
      margin-left: -63px;
      text-align: center;
    }
  }
}
.content {
  // width: 400px;
  background: white;
  box-sizing: border-box;
  padding: 30px;
  padding-bottom: 0;
  padding-top: 0;
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
    margin-top: 18px;
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
  
.pay-code-c {
  position: relative;
  .code-c {
    text-align: center;
    width: 113px;
    height: 113px;
    position: absolute;
    right: 0;
    top: 0;
    margin: 0 auto;
    // margin-top: 30px;
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
}

  .center {
    text-align: center;
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
      margin-top: 80px;
      cursor: pointer;
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
        width: 113px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        color: #666;
        border: 1px solid #DFDFDF;
        margin-left: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        border-radius: 5px;
        &:first-child {
          margin-left: 0;
        }
        .icon {
          width: 18px;
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
}
.price-tip, .day-tip {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666666;
  margin-left: 16px;
  .icon {
    height: 12px;
    margin-right: 4px;
  }
}
.code-tip {
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>