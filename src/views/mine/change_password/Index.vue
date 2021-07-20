<template>
  <div class="change-password">
    <img class="back" @click="back" src="@/assets/image/mine/icon-91@2x.webp" />
    <div class="title">请设置密码</div>
    <div class="input-label">
      输入手机号：
    </div>
    <el-input class="transparent-input" readonly maxlength="11" v-model="mobile" @input="inputMobile"/>
    <div class="input-label">
      输入验证码：
    </div>
    <div class="code-info">
      <el-input class="transparent-input" maxlength="6" v-model="code" @input="inputCode" />
      <div class="code-c">
        <div :class='["code-btn", count !== 60 ? "disable" : ""]' @click="sendCode">{{count === 60 ? '发送验证码' : count + 's'}}</div>
      </div>
    </div>

    <div class="input-label">
      输入新密码：
    </div>
    <el-input class="transparent-input" type="password" maxlength="32" v-model="password" />
    <div class="input-label">
      再次确认新密码：
    </div>
    <el-input class="transparent-input" type="password" maxlength="32" v-model="password_again" />

    <el-button class="save" type="primary" @click="save">确认修改</el-button>
  </div>
</template>

<script>
import { ElInput, ElButton, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import api from '@/config/api.js'
import md5 from 'js-md5'
import { ref, getCurrentInstance } from 'vue'
export default {
  components: {
    ElInput,
    ElButton,
  },
  setup() {
    const { ctx } = getCurrentInstance()
    let mobile = ref(ctx.$store.state.user.mobile)
    let code = ref('')
    let password = ref('')
    let password_again = ref('')
    let count = ref(60)
    let router = useRouter()
    let timer = -1
    async function sendCode() {
      if (count.value !== 60) {
        return
      }
      if (timer !== -1) {
        clearinterval(timer)
        timer = -1
      }
      let res = await ctx.$axios.post(api.getVcode, {
        type: 2,
        mobile: mobile.value
      })
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      ElMessage.success('验证码已发送')
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
    function back () {
      router.back()
    }
    function inputMobile(value) {
      mobile.value = value.replace(/[^\d]/g,'')
    }
    function inputCode(value) {
      code.value = value.replace(/[^\d]/g,'')
    }
    async function save() {
      if (code.value === '') {
        ElMessage.error('请输入验证码')
        return
      }
      if (password.value.trim() === '') {
        ElMessage.error('请输入新密码')
        return
      }
      if (password_again.value.trim() === '') {
        ElMessage.error('请再次输入新密码')
        return
      }
      if (password.value.trim() !== password_again.value.trim()) {
        ElMessage.error('两次密码输入不一致')
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
      let res = await ctx.$axios.post(api.changePW, {
        marking: resCode.data.marking,
        password: md5(password.value),
        mobile: mobile.value,
      })
      if (res.code !== 200) {
        ElMessage.error(res.message)
        return
      }
      ElMessage.success('密码修改成功')
      ctx.$store.commit('logout')
      router.push('/login')
    }
    return { mobile, code, password, password_again, save, count, inputMobile, inputCode, back, sendCode }
  }
}
</script>

<style lang="scss" scoped>
.change-password {
  text-align: left;
  padding-top: 30px;
  padding-left: 40px;
  color: $color-l1-l;
  @media screen and (max-width: $media-max) {
    padding-left: 30px;
    padding-top: 20px;
  }
  .back {
    width: 40px;
    cursor: pointer;
    @media screen and (max-width: $media-max) {
      width: 28px;
    }
  }
  .title {
    margin-top: 40px;
    font-size: $fontsize-l3;
    @media screen and (max-width: $media-max) {
      margin-top: 20px;
      font-size: $fontsize-l4;
    }
  }
  .input-label {
    margin-top: 20px;
    padding-bottom: 10px;
    font-size: $fontsize-l6;
    @media screen and (max-width: $media-max) {
      padding-bottom: 4px;
    }
  }
  .transparent-input {
    width: 340px;
    height: 46px;
    border: 1px solid $color-l1-l;
    border-radius: 6px;
    font-size: $fontsize-l5;
    color: $color-l1-l;
    display: flex;
    align-items: center;
    @media screen and (max-width: $media-max) {
      width: 242px;
      height: 32px;
    }
  }
  .code-info {
    display: flex;
    align-items: center;
    width: 340px;
    border: 1px solid #fff;
    border-radius: 6px;
    @media screen and (max-width: $media-max) {
      width: 242px;
    }
    .transparent-input {
      flex: 1;
      border: none;
    }
  }
  .code-c {
    display: flex;
    align-items: center;
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
        height: 20px;
        line-height: 20px;
      }
    }
    .disable {
      background: #fff;
      cursor: not-allowed;
      color: $color-l1-d;
    }
  }
  .save {
    margin-top: 60px;
    width: 126px;
    height: 40px;
    background: linear-gradient(270deg,#27ceff, #11a0fe);
    border-radius: 25px;
    @media screen and (max-width: $media-max) {
      margin-top: 40px;
      width: 90px;
      height: 30px;
      min-height: 0!important;
      padding: 0!important;
    }
  }
}
</style>



