<template>
  <div class="header">
    <img class="back" @click="back" src="@/assets/image/mine/icon-91@2x.webp" />
    <img class="step-img" v-if="step === 0" src="@/assets/image/mine/icon-103@2x.webp" />
    <img class="step-img" v-else src="@/assets/image/mine/icon-104@2x.webp" />
  </div>
  <div class="content mine-change-mobile">
    <div class="title">{{step === 0 ? '第一步：确认旧手机号码' : '第二步：输入新手机号码'}}</div>
    <div class="input-label">{{step === 0 ? '输入旧手机号：' : '输入新手机号：'}}</div>
    <div class="input-c">
      <el-input class="input" maxlength="11" v-model="mobile" placeholder="" @input="inputMobile" :readonly="step === 0"/>
    </div>
    <div class="input-label code-label">输入验证码：</div>
    <div class="input-c code-c">
      <el-input class="input" maxlength="6"  v-model="code" placeholder="" />
      <div :class='["code-btn", count !== 60 ? "disable" : ""]' @click="sendCode">{{count === 60 ? '发送验证码' : count + 's'}}</div>
    </div>
    <div class="btn-c">
      <div :class="['btn', code === '' || mobile === '' ? 'disable' : '']" @click="btnClick" >{{step === 0 ? '下一步' : '确定修改'}}</div>
    </div>
    <div class="tip">
      (如果旧手机号码无法接收验证码请<span class="to-contact-service">联系客服</span>)
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import { ElButton, ElInput } from 'element-plus'
import { useRouter } from 'vue-router'
import api from '@/config/api.js'
export default {
  components: {
    ElButton,
    ElInput
  },
  setup () {
    const { ctx } = getCurrentInstance()
    let step = ref(0)
    let count = ref(60)
    let mobile = ref(ctx.$store.state.user.mobile)
    let code = ref('')
    let router = useRouter()
    let timer = -1
    let oldMobile = ref(ctx.$store.state.user.mobile)
    let oldMarking = ref('')
    function back () {
      if (step.value === 1) {
        step.value = 0
        count.value = 0
        if (timer !== -1) {
          clearinterval(timer)
          timer = -1
        }
        return
      }
      router.back()
    }
    async function btnClick() {
      if (mobile === '' || code === '') {
        return
      }
      let resCode = await ctx.$axios.post(api.checkoutNode, {
        type: 2,
        code: code.value,
        mobile: mobile.value
      })
      if (resCode.code !== 200) {
        ElMessage.error(resCode.message)
        return
      }
      if (step.value === 0) {
        step.value = 1
        oldMobile.value = mobile.value
        oldMarking = resCode.data.marking
        return
      }
      const params = {
        oldMobile: oldMobile.value,
        oldMarking: oldMarking.value,
        newMobile: mobile.value,
        newMarking: resCode.data.marking
      }
      let res = await ctx.$axios.post(api.mobileUpdate, params)
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      ElMessage.success('手机号修改成功')
      router.push('/login')
    }

    function sendCode() {
      if (count.value !== 60) {
        return
      }
      if (timer !== -1) {
        clearinterval(timer)
        timer = -1
        return
      }
      timer = setInterval(() => {
        if (count.value === 1) {
          clearInterval(timer)
          timer = -1
          count.value = 60
          return
        }
        count.value -= 1
      }, 1000);
    }
    return { step, mobile, code, count, back, btnClick, sendCode,
      inputMobile(value) {
        mobile.value = value.replace(/[^\d]/g,'')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 94px;
  position: relative;
  text-align: left;
  border-bottom: solid 1px rgba(255, 255, 255, .4);
  // border-bottom: solid #fff 1px;
  @media screen and (max-width: $media-max) {
    height: 66px;
  }
  .back {
    width: 40px;
    margin-top: 30px;
    margin-left: 38px;
    cursor: pointer;
    @media screen and (max-width: $media-max) {
      width: 29px;
      margin-left: 30px;
      margin-top: 20px;
    }
  }
  .step-img {
    height: 40px;
    position: absolute;
    left: 40px;
    bottom: -20px;
    @media screen and (max-width: $media-max) {
      height: 28px;
      bottom: -14px;
      left: 35px;
    }
  }
}
.content {
  padding-left: 40px;
  padding-top: 50px;
  color: $color-l1-l;
  text-align: left;
  @media screen and (max-width: $media-max) {
    padding-left: 30px;
    padding-top: 40px;
  }
  .title {
    font-size: $fontsize-l3;
    padding-bottom: 40px;
    @media screen and (max-width: $media-max) {
      font-size: $fontsize-l4;
    }
  }
  .input-label {
    font-size: $fontsize-l6;
    padding-bottom: 9px;
    @media screen and (max-width: $media-max) {
      font-size: 13px;
    }
  }
  .code-label {
    margin-top: 20px;
  }
  .input-c {
    width: 340px;
    height: 46px;
    border: 1px solid #ffffff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    @media screen and (max-width: $media-max) {
      width: 242px;
      height: 32px;
      line-height: 32px;
    }
    .input {
      font-size: $fontsize-l5;
      background: transparent;
    }
  }
  .code-c {
    .input {
      flex: 1;
      margin-right: 12px;
    }
    .code-btn {
      width: 84px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      font-size: $fontsize-l7;
      margin-right: 12px;
      color: $color-l1-l;
      cursor: pointer;
      border-radius: 16px;
      background-color: $color-primary;
      @media screen and (max-width: $media-max) {
        width: 72px;
        height: 18px;
        line-height: 18px;
      }
    }
    .disable {
      background: #fff;
      cursor: not-allowed;
      color: $color-l1-d;
    }
  }
  .btn-c {
    margin-top: 60px;
    @media screen and (max-width: $media-max) {
      margin-top: 43px;
    }
    .btn {
      width: 126px;
      height: 40px;
      line-height: 40px;
      background: linear-gradient(270deg,#27ceff, #11a0fe);
      border-radius: 25px;
      text-align: center;
      cursor: pointer;
      color: $color-l1-l;
      @media screen and (max-width: $media-max) {
        width: 89px;
        height: 29px;
        line-height: 29px;
        font-size: $fontsize-l6;
      }
    }
    .disable {
      background: #fff;
      cursor: not-allowed;
      color: $color-l1-d;
    }
  }
  .tip {
    margin-top: 10px;
    color: $color-l1-l;
    font-size: $fontsize-l7;
    .to-contact-service {
      color: #0BCDFF;
      font-size: $fontsize-l7;
    }
  }
}
</style>


