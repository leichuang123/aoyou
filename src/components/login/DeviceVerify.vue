<template>
    
    <v-dialog
      v-model="dialog"
      max-width="520"
    >
    <div class="verify-device">
      <img alt="关闭" src="../../assets/images/public/close.png" class="close" @click="close" />
      <div class="title">手机号校验</div>
      <div class="mobile">手机号： {{mobile}}</div>
      <div class="code">
        <span>验&nbsp;证&nbsp;码</span>
        <input type="phone" placeholder="请输入" class="input" v-model="code" maxlength="6" />
        <div :class="['btn', count !== 60 ? 'disable' : '']" @click="sendCode">{{count !== 60 ? (count + 's后重新获取') : '获取验证码' }}</div>
      </div>
      <div class="sure-c">
        <div :class="['sure', code === '' ? 'disable' : '']" @click="sure">确定</div>
      </div>
    </div>
    

      <!-- <v-card>
        <v-card-title class="headline">退出登录？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            取消
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="logout"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card> -->
    </v-dialog>
</template>

<script>
import {
  getVcode,
  checkoutNode,
  getToken,
} from '../../server/api'

export default {
  name: 'DeviceVerify',
  props: {
    mobile: {
      type: String,
      default: '13750803526',
    }
  },
  data () {
    return {
      dialog: true,
      count: 60,
      code: '',
      timer: -1,
    }
  },
  methods: {
    async sendCode () {
      if (this.count !== 60) {
        return
      }
      if (this.timer !== -1) {
        clearInterval(this.timer)
      }
      let res = await getVcode({
        mobile: this.mobile,
        type: 6,
      })
      if (res.code !== 200) {
        this.toast(res.message)
        return
      }
      this.timer = setInterval(() => {
        this.count--
        if (this.count <=0 ) {
          clearInterval(this.timer)
          this.timer = -1
          this.count = 60
        }
      }, 1000)
    },
    /**
     * 点击确认按钮
     */
    async sure() {
      if (this.code === '') {
        return
      }
      let res = await checkoutNode({
        mobile: this.mobile,
        code: this.code,
        type: 6,
      })
      if (res.code !== 200) {
        this.toast(res.message)
        return
      }
      let tokenInfo = await getToken({
        marking: res.data.marking,
        mobile: this.mobile
      })
      if (tokenInfo.code !== 200) {
        this.toast(tokenInfo.message)
        return
      }
      
      this.$emit('success', tokenInfo.data.token)
    },
    close () {
      this.$emit('close')
    }
  },
  mounted() {
    
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/style/common.less';
.verify-device {
  height: 424px;
  width: 520px;
  box-sizing: border-box;
  padding: 24px 74px;
  line-height: 1.5;
  position: relative;
  background: white;
  .close {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 16px;
    cursor: pointer;
  }
  .title {
    text-align: center;
    font-size: 24px;
    color: #11a0fe;
    line-height: 33px;
    padding-top: 30px;
    padding-bottom: 60px;
  }
  .mobile {
    font-size: 14px;
    color: #888;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
  }
  .code {
    margin-top: 30px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #888;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    .input {
      flex: 1;
      color: #444;
      margin-left: 16px;
    }
    .btn {
      background: #11a0fe;
      border-radius: 15px;
      min-width: 104px;
      color: #fff;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      cursor: pointer;
      text-align: center;
    }
    .disable {
      cursor: not-allowed;
      background: #ddd;
    } 
  }
  .sure-c {
    padding-top: 58px;
    padding-bottom: 30px;
    text-align: center;
    .sure {
      width: 126px;
      height: 40px;
      line-height: 40px;
      background-image: -webkit-gradient(linear,right top,left top,from(#27ceff),to(#11a0fe));
      background-image: linear-gradient(270deg,#27ceff,#11a0fe);
      border-radius: 25px;
      text-align: center;
      margin: 0 auto;
      cursor: pointer;
      color: #fff;
    }
    .disable {
      cursor: not-allowed;
      background: #ddd;
    }
  }
}
</style>