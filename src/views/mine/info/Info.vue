<template>
  <div class="mine">
    <UserInfo/>
    <div class="context">
      <div class="m-card">
        <div class="left">
          <img class="icon" src="@/assets/images/mine/icon-20.png" alt="">
          <div>
            <p class="name">昵称</p>
            <p class="desc">{{getUserInfo.userNickName}}</p>
          </div>
        </div>
        <button class="btn" @click="toggleDialog('name', true)">修改</button>
      </div>
      <div class="m-card" v-for="(item, index) of cardList" :key="index">
        <div class="left">
          <img class="icon" :src="item.icon" alt="">
          <div>
            <p class="name">{{item.name}}</p>
            <p class="desc">{{item.desc}}</p>
          </div>
        </div>
        <button class="btn" @click="toggleDialog(item.key, true)">修改</button>
      </div>
    </div>
    <ChangeUserName @close="toggleDialog" :isShow="cunShow" />
    <ChangePhone @close="toggleDialog" :isShow="cpShow" />
    <ChangePassword @close="toggleDialog" :isShow="cpdShow" />
  </div>
</template>

<script>
import UserInfo from "@/components/mine/UserInfo.vue"
import ChangeUserName from "./ChangeUserName.vue"
import ChangePhone from './ChangePhone.vue'
import ChangePassword from './ChangePassword.vue'
import { mapGetters } from 'vuex'

export default {
  name: "Info",
  data() {
    return {
      cardList:[
        {
          name:"绑定手机号",
          icon:require("@/assets/images/mine/icon-21.png"),
          desc: "绑定手机可以用于登录云之趣帐号，重置密码或其他安全验证",
          key: "phone"
        },
        {
          name:"账号密码",
          icon:require("@/assets/images/mine/icon-22.png"),
          desc: "用于保护帐号信息和登录安全",
          key: "password"
        }
      ],
      cunShow:false,
      cpShow: false,
      cpdShow: false,
    }
  },
  components: {
    UserInfo,
    ChangeUserName,
    ChangePhone,
    ChangePassword,
  },
  mounted() {
  },
  computed: {
    ...mapGetters(['getUserBalance','getUserInfo']),
  },
  methods: {
    toggleDialog(key,show = false) {
      console.log(key,show)
      switch (key) {
        case 'name':
          this.cunShow = show;
          break;
        case 'phone':
          this.cpShow = show;
          break;
        case 'password':
          this.cpdShow = show;
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.mine{
  width: 1200px;
  margin: 0 auto;
  padding-top: 10px;
  // overflow: hidden;
  .context{
    background: #fff;
    border-radius: 2#11A0FE 100%;
    display: flex;
    // align-items: center;
    // justify-content: space-between;
    flex-wrap: wrap;
    padding: 10px 20px;
    // height: 643px;
  }
}
.m-card{
  width: 540px;
  height: 130px;
  padding: 0 20px;
  background: #FFFFFF;
  border: 1px solid #DFDFDF;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 20px;
  flex-grow: 0;
  flex-shrink: 0;
  .left{
    display: flex;
  }
  .icon{
    display: block;
    height: 42px;
    margin-right: 12px;
  }
  .name{
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #444444;
    line-height: 22px;
    height: 22px;
    margin-bottom: 2px;
  }
  .desc{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    text-align: left;
    line-height: 22px;
    height: 22px;
    max-width: 308px;
  }
  .btn{
    padding: 0 14px;
    height: 30px;
    line-height: 30px;
    background: #11A0FE;
    color: #fff;
    font-size: 14px;
    border-radius: 15px;
    cursor: pointer;
  }
}

</style>