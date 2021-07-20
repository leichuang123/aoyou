<template>
  <div class="login">
    <Contain width="406px" height="513px">
      <LoginForm @onChange="typeChange" v-if="loginType === 0"/>
      <RegForm @onChange="typeChange" v-if="loginType === 1" />
      <FindPwdForm @onChange="typeChange" v-if="loginType === 2"/>
    </Contain>
  </div>
</template>

<script>
import Contain from '../../components/Contain.vue'
import LoginForm from './components/LoginForm.vue'
import RegForm from './components/RegForm.vue'
import FindPwdForm from './components/FindPwdForm.vue'
export default {
  name: "Login",
  setup() {
    
  },
  data() {
    return {
      loginType: 0, // 0 登录， 1 注册， 2 找回密码， 3 绑定手机号
    }
  },
  components: {
    Contain,
    LoginForm,
    RegForm,
    FindPwdForm,
  },
  mounted(){
    this.loginType = this.getLoginType();
  },
  methods: {
    typeChange(val = 0) {
      this.loginType = val;
    },
    getLoginType() {
      return +this.$route.query.loginType || 0;
    },
    login() {
      this.$myLoading.show()
      this.$myLoading.show()
      setTimeout(() => {
        this.$myLoading.hide()
      }, 2000);
    }
  },
  watch: {
    '$route.query': function(val) {
      let type = +val.loginType
      if(typeof type === 'number') {
        this.loginType = type;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: #fff000;
  // padding: 148px 0;
}
</style>


