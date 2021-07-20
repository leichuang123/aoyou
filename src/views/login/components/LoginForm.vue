<template>
  <div class="login-contain">
    <LoginType @onChange="logintypeChange" :type="loginType" />
    <Space h="20px" />
    <div class="space" v-if="loginType === 0">
      <Title>登 录</Title>
      <Space h="19px" />
      <YForm>
        <YInput name="username" placeholder="请输入用户名/手机号">
          <template v-slot:head>
            <div class="icon">
              <img src="../../../assets/image/icon/icon-41@2x.webp" alt="用户名">
            </div>
          </template>
          
          <!-- <div class="send-code" slot="foot">
            <v-btn :disabled="VcodeDisable" @click="getVcode()" style="color:#fff;" block small  color="#11A0FE" height="24" rounded>{{getCountTime}}</v-btn>
          </div> -->
        </YInput>
        <Space h="20px" />
        <YInput name="password" type="password" placeholder="请输入密码">
          <template v-slot:head>
            <div class="icon">
              <img src="../../../assets/image/icon/icon-42@2x.webp" alt="密码">
            </div>
          </template>
        </YInput>
      </YForm>
      <Space h="22px" />
      <div class="flex-space">
        <span class="cursor" @click="typeChange(2)">忘记密码?</span>
        <div class="flex-center">
          <img class="tipimg" src="../../../assets/image/icon/icon-46@2x.webp" alt="公共场所不建议勾选">
          <input class="check cursor" type="checkbox" name="check" id="check">
          <label for="check">
            <span class="cursor">30天免登录</span>
          </label>
        </div>
      </div>
      <Space h="27px" />
      <div class="flex-space">
        <span></span>
        <div class="flex-center">
          <span>还没有账号？</span>
          <span class="click-text cursor" @click="typeChange(1)">注册</span>
        </div>
      </div>
      <Space h="40px" />
      <Btn>登 录</Btn>
    </div>
    <div class="space" v-if="loginType === 1">
      <div>二维码</div>
      <div class="flex-space">
        <span></span>
        <div class="flex-center">
          <span>还没有账号？</span>
          <span class="click-text cursor" @click="typeChange(1)">注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from './Title.vue'
import Btn from './Btn.vue'
import YForm from '../../../components/YForm.vue'
import YInput from '../../../components/YInput.vue'
import Space from './Space.vue'
import LoginType from './LoginType.vue'

export default {
  name: "LoginForm",
  components: {
    Title,
    Btn,
    YForm,
    YInput,
    Space,
    LoginType,
  },
  data() {
    return {
      loginType: 0, // 0: 账号密码，1：二维码
    }
  },
  methods: {
    typeChange(val) {
      console.log('?')
      this.$emit('onChange', val)
    },
    logintypeChange(val) {
      this.loginType = val;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./form.scss";
</style>