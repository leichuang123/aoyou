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
        <v-row class="item" align="center" no-gutters>
          <div class="label">购买时长：</div>
          <v-col class="value">{{payInfo.shortcutDurationName}}</v-col>
        </v-row>
        <v-row class="item" align="center" no-gutters>
          <div class="label">价   格：</div>
          <v-col class="value price">
            <template v-if="payInfo.payType === 0">
              <img src="@/assets/images/mall/icon-7.png"  />
              <span>{{ payInfo.price * 1000 }}</span>
            </template>
            <template v-else>￥{{payInfo.price}}</template>
            
          </v-col>
        </v-row>
        <v-row class="item" align="center" no-gutters>
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
        </v-row>
        <div class="center" v-if="payInfo.payType !== 0">
          <div class="code-c">
            <div class="code" id="paycode"></div>
            <img class="icon" v-if="payInfo.payType === 1" src="@/assets/images/mall/icon-9.png" />
            <img class="icon" v-else src="@/assets/images/mall/icon-10.png" />
          </div>
          <div class="cancel" @click="close">取消</div>
        </div>  
        <div class="btns" v-else>
          <div class="cancel" @click="close">取消</div>
          <div class="sure" @click="sure">立即购买</div>
        </div>
      </div>
    </v-dialog>
</template>

<script>
import QRCode from 'qrcodejs2'
import {
  crystalBuyVm,
} from '@/server/api.js'

export default {
  name: 'Pay',
  computed: {
    
  },
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
      
    }
  },
  components: {

  },
  mounted () {
    if (this.payInfo.payType !== 0) {
      document.getElementById('paycode').innerHTML = ''
      new QRCode('paycode', {
        width: 113,
        height: 113,
        text: this.payInfo.codeUrl
      })
    }
  },
  methods: {
    // overlayclick (event) {
    //   // console.log(event)
    //   this.$emit('close')
    //   event.stopPropagation()
    //   return false
    // },
    close () {
      this.$emit('close')
    },
    async sure () {
      let param = {
        shortcutDurationId: this.payInfo.shortcutDurationId,
        timeChargeId: this.payInfo.timeChargeId,
        productNo: this.payInfo.productNo,
        userCardId: "",
      }
      let res = await crystalBuyVm(param)
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      this.$emit('crystalPaySuccess')
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
}
</style>