<template>
  <div class="login-contain">
    <div class="login-form">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import LoginForm from '../components/login/LoginForm'
export default {
  name: 'Login',
  components: {
    LoginForm,
  }
}
</script>

<style lang="less" scoped>
.login-contain{
  height: 866px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(../assets/images/login/login-bg.png) no-repeat;
  background-size: 1030px 737px;
  background-position: left bottom;
}
.login-form{
  margin-left: 660px;
}
</style>