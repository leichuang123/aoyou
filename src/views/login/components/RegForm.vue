<template>
  <div class="login-contain">
    <div class="space">
      <Space h="34px" />
      <Title>注 册</Title>
      <Space h="18px" />
      <YForm>
        <YInput name="username" placeholder="请输入手机号码">
          <template v-slot:head>
            <div class="icon">
              <img src="../../../assets/image/icon/icon-48@2x.webp" alt="用户名">
            </div>
          </template>
        </YInput>
        <Space h="20px" />
        <YInput name="vcode" placeholder="请输入验证码">
          <template v-slot:head>
            <div class="icon">
              <img src="../../../assets/image/icon/icon-49@2x.webp" alt="验证码">
            </div>
          </template>
          <template v-slot:foot>
            <VCodeBtn :stdTime="100" />
            <!-- <v-btn :disabled="VcodeDisable" @click="getVcode()" style="color:#fff;" block small  color="#11A0FE" height="24" rounded>{{getCountTime}}</v-btn> -->
          </template>
        </YInput>
        <Space h="20px" />
        <YInput name="password" type="password" placeholder="请输入密码">
          <template v-slot:head>
            <div class="icon">
              <img src="../../../assets/image/icon/icon-42@2x.webp" alt="密码">
            </div>
          </template>
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
      <Space h="60px" />
      <Btn>确 定</Btn>
      <Space h="6px" />
      <div class="text-center">
        登录/注册即代表您已同意
        <span class="cursor">《云之趣用户服务条款》</span>
        和
        <span class="cursor">《隐私权声明》</span>
      </div>
      <Space h="22px" />
      <div class="tologin cursor" @click='typeChange(0)'>
        <i class="el-icon-d-arrow-left"></i>
        <span>已有账号？去登录</span>
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
import VCodeBtn from './VCodeBtn.vue'
import { ElIcon } from 'element-plus'

export default {
  name: "LoginForm",
  components: {
    Title,
    Btn,
    YForm,
    YInput,
    Space,
    LoginType,
    ElIcon,
    VCodeBtn,
  },
  methods: {
    typeChange(val) {
      this.$emit('onChange', val)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./form.scss";
</style>