<template>
  <div class="userinfo">
    <div class="part flex">
      <img v-if="getUserInfo" class="avatar" :src="getUserPicture" alt="">
      <div v-if="getUserInfo">
        <div class="name flex">
          <p>{{getUserInfo.userNickName}} </p>
          <v-btn dark small depressed color="#11A0FE" @click="jumpToInfo" width="112" height="26" rounded>修改个人信息</v-btn>
        </div>
        <p class="tel">{{getPhoneNumber}}</p>
      </div>
    </div>
    <div class="part part-info" v-if="getUserInfo">
      <div class="pl">
        <p class="pl-t">我的主机</p>
        <p class="pl-c">{{totalCount}}</p>
      </div>
      <div class="pl" style="display: none">
        <div class="pl-t flex flexcenter">
          <p>水晶余额</p>
          <!-- <button class="cz">充值</button> -->
        </div>
        <p class="pl-c">{{getUserBalance.crystalBalance}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { IMAGE_PREFIX } from '@/config/public_config'
import { getVmInfoList } from '@/server/api.js'
export default {
  name: "UserInfo",
  data() {
    return {
      totalCount:0
    }
  },
  computed:{
    ...mapGetters(['getUserBalance','getUserInfo']),
    getUserPicture() {
      return `${IMAGE_PREFIX}${this.getUserInfo.userPicture}`
    },
    getPhoneNumber() {
      let phoneNumber = this.getUserInfo.mobile
      const reg = phoneNumber.substr(3,4)
      return phoneNumber ? phoneNumber.replace(reg, '****') : "";
    },
  },
  mounted() {
    this.getVmInfoList();
  },
  methods: {
    jumpToInfo() {
      this.$router.push("/mine/info")
    },
    async getVmInfoList() {
      let params = {
        currentPage: 1,
        pageSize: 9999,
        deviceNo: "",
        productName: ""
      }
      let response = await getVmInfoList(params);
      if(response.code === 200) {
        console.log(response.data);
        this.totalCount = response.data.page.totalCount;
      }
    },
  }
}
</script>

<style lang="less" scoped>
.userinfo{
  background: #FFFFFF;
  box-shadow: 0 2px 9px 0 rgba(0,0,0,0.10);
  border-radius: 5px;
  min-height: 150px;
  display: flex;
  justify-content: space-between;
  padding: 38px;
  margin-bottom: 10px;
  .part{
    .avatar{
      width: 74px;
      height: 74px;
      overflow: hidden;
      border-radius: 50%;
      margin-right: 20px;
    }
    .name{
      font-size: 20px;
      color: rgba(0,0,0,0.85);
      line-height: 28px;
      height: 28px;
      margin: 7px 0 10px;
      p{
        margin-right: 20px;
      }
    }
    .tel{
      font-size: 16px;
      color: #666666;
    }
  }
  .pl{
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .pl-t{
      font-size: 18px;
      color: #444444;
      line-height: 22px;
      height: 22px;
      margin-bottom: 14px!important;
    }
    .pl-c{
      font-size: 32px;
      color: #444444;
      letter-spacing: 2px;
      line-height: 38px;
      height: 38px;
    }
    .cz{
      display: block;
      border: 1px solid #0DC0B5;
      font-size: 12px;
      color: #0DC0B5;
      border-radius: 8px;
      height: 16px;
      line-height: 16px;
      width: 38px;
      margin-left: 10px;
    }
  }
  .border-right{
    border-right: 1px solid #E9E9E9;;
  }
}
.part-info{
  display: flex;
}
</style>