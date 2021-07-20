<template>
  <div class="nav">
    <section class="nav-content">
      <div class="left">
        <div class="logo">
          <img src="@/assets/images/public/logo-normal.png" alt="" class="logo-pic">
        </div>
        <ul class="tabs-list">
          <li 
            :class="['tab', item.path === currentPath ? 'active' : '']" 
            v-for="(item, index) in tabs"
            @click="navClick(item)"
            :key="index">
            {{item.name}}
          </li>
        </ul>
      </div>
      <div class="right">
        <button @click="toLogin" class="login-btn" v-if="!getUserInfo">登录/注册</button>
         <div class="user-options" v-if="getUserInfo">
          <div class="part cursor"  @click="pageJump('/mine/message')">
            <img src="@/assets/images/public/icon-81.png" alt="消息" class="icon">
          </div>
          <div class="part cursor" @click="pageJump('/mine')">
            <img src="@/assets/images/public/icon-83.png" alt="用户信息" class="icon">
            <v-tooltip bottom="">
              <template v-slot:activator="{ on, attrs }">
                <p v-bind="attrs" v-on="on">{{getUserInfo.userNickName | nickNameFilter}} {{getPhoneNumber}}</p>
                <!-- <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >Left</v-btn> -->
              </template>
              <span>{{getUserInfo.userNickName}}</span>
            </v-tooltip>
            
          </div>
          <!-- <div class="part" v-if="getUserBalance">
            <img src="@/assets/images/public/icon-82.png" alt="水晶余额" class="icon">
            <p>{{getUserBalance.crystalBalance}}</p>
          </div> -->
          <img @click="logoutConfirm" src="@/assets/images/public/icon-84.png" alt="退出登录" class="icon">
        </div>
      </div>
    </section>
    <!-- <v-app style="width:0;height:0;"> -->
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
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
      </v-card>
    </v-dialog>
    <!-- </v-app> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Nav',
  computed: {
    ...mapGetters(['getUserBalance','getUserInfo']),
    currentPath () {
      return this.$route.path
    },
    getPhoneNumber() {
      let phoneNumber = this.getUserInfo.mobile
      const reg = phoneNumber.substr(3,4)
      return phoneNumber ? phoneNumber.replace(reg, '****') : "";
    }
  },
   filters: {
    nickNameFilter(val) {
      let name = ""
      if(val) {
        name = val.length > 3 ? val.substr(0,5) : val
      }
      return name; 
    }
  },
  data () {
    return {
      dialog: false,
      tabs: [
        {
          name: '商城首页',
          path: '/mall'
        },
        {
          name: '我的主机',
          path: '/mall/my_vm'
        }
      ]
    }
  },
  methods: {
    navClick (item) {
      this.$router.push(item.path || '/')
    },
    logoutConfirm() {
      this.dialog = true;
    },
    logout() {
      this.$store.dispatch('logout')
      this.dialog = false;
    },
    toLogin(){
      if(this.$route.path !== '/login') {
        this.$router.push('/login')
      }
      
    },
    pageJump(path = "/"){
      if(this.$route.path !== path) {
        this.$router.push(path)
      }
      
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/style/common.less';
.nav{
  width: 100%;
  background: @color-dark-2;
  color: @color-white;
  font-size: 13px;
  min-width: 1200px;
  .nav-content{
    width: @page-max-width;
    height: 80px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
      display: flex;
      align-items: center;
      .logo{
        width: 119px;
        margin-right: 50px;
        .logo-pic{
          width: 100%;
        }
      }
      .tabs-list{
        display: flex;
        .tab{
          cursor: pointer;
          margin-right: 33px;
          position: relative;
        }
        .active {
          &::after {
            content: ' ';
            position: absolute;
            left: 0;
            right: 0;
            bottom: -14px;
            background: white;
            height: 2px;
            border-radius: 4px;
          }
        }
      }
    }
    .right{
      .login-btn{
        cursor: pointer;
        background: @color-white;
        color: @color-dark;
        font-size: 14px;
        width: 95px;
        height: 32px;
        border-radius: 9px;
      }
    }
  }
}
.user-options{
  display: flex;
  
  .part{
    height: 20px;
    display: flex;
    justify-content: center;
    line-height: 20px;
    margin-right: 20px;
    p{
      margin-left: 5px;
    }
  }
  .icon{
    height: 20px;
    cursor: pointer;
  }
}
</style>