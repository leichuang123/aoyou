<template>
  <v-dialog v-model="show" width="400" :persistent="true">
      <div class="change-name">
        <div class="close">
          <v-icon @click="onClose" class="close">mdi-close</v-icon>
        </div>
        <div class="title">修改昵称</div>
        <!-- 内容 -->
        <div class="content">
          <YForm ref="yform">
            <div class="underline-input">
              <YInput :defaultVal="defaultName" name="username" placeholder="请输入您要修改的昵称" :rules="rules.username"></YInput>
            </div>
          </YForm>
        </div>
        <div class="btn-box" @click="check">
          <button>确认</button>
        </div>
      </div>
    </v-dialog>
  
</template>

<script>
import YForm from "@/components/public/YForm.vue"
import YInput from "@/components/public/YInput.vue"
import { userInfoUpdate } from "@/server/api.js"
import store from '@/store/index'

export default {
  name: "ChangeUserName",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      show: false,
      defaultName: "",
      rules: {
        username: [{required:true,msg:'昵称不能为空'},{maxLen: 15,msg: "不能超过15位"}],
      }
    }
  },
  components: {
    YForm,
    YInput,
  },
  mounted() {
    this.defaultName = store.getters.getUserInfo.userNickName
  },
  methods: {
    check() {
      this.$refs.yform.check((state,valList) => {
        if(state) {
          this.userInfoUpdate(valList.username.value)
        }
      });
    },
    onClose() {
      this.$emit('close','name',false)
    },
    async userInfoUpdate(userNickName) {
      // let params = {
      //   deviceNo: "",
      //   userEmail: "",
      //   userName: "",
      //   userNickName: "",
      //   userPicture: "",
      // }
      console.log(store)
      let userInfo = store.getters.getUserInfo
      let params = {
        deviceNo: "",
        userNickName: userNickName,
        userPicture: userInfo.userPicture,
        userName: userInfo.userName,
        userEmail: userInfo.userEmail,
      }
      let response = await userInfoUpdate(params);
      if(response.code === 200) {
        this.$message.success("操作成功");
        this.$store.dispatch('updateUserInfo', {token: store.getters.getToken})
        this.onClose();
      } else {
        this.$message.error(response.message);
      }
    },
  },
  watch: {
    isShow(val) {
      this.show = val
    }
  }
}
</script>

<style lang="less" scoped>
.change-name{
  padding: 15px;
  height: 370px;
  background: #fff;
  .close{
    display: flex;
    justify-content: flex-end;
  }
  .title{
    color: #11A0FE;
    font-size: 24px;
    height: 33px;
    line-height: 33px;
    text-align: center;
  }
  .btn-box{
    button{
      background-image: linear-gradient(270deg, #27CEFF 0%, #11A0FE 100%);
      border-radius: 25px;
      width: 125px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #fff;
      display: block;
      margin: 0 auto;
    }
  }
  .content{
    height: 220px;
    display: flex;
    justify-content: center;
    padding-top: 30px;
    // align-items: center;
  }
}
.underline-input{
  width: 300px;
  height: 40px;
  border-bottom: 1px solid #e8e8e8;
}
.close{
  cursor: pointer;
}
</style>