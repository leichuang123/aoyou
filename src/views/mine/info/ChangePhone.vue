<template>
  <v-dialog v-model="isShow" width="400" :persistent="true">
      <div class="change-name">
        <div class="close">
          <v-icon class="close" @click="onClose">mdi-close</v-icon>
        </div>
        <div class="title">{{step === 1 ? "第一步：确认旧手机号码" : "第二步：输入新手机号码"}}</div>
        
        <!-- 内容 -->
        <div class="content">
          <YForm ref="yform">
            <template v-if="step === 1">
              <div class="part">
                <div class="plabel">输入旧手机号：</div>
                <div class="outline-input">
                  <YInput key="1" :defaultVal="defaultOldPhoneNumber" name="oldusername" placeholder="请输入旧手机号" :rules="rules.username"></YInput>
                </div>
              </div>
              <div class="part">
                <div class="plabel">输入验证码：</div>
                <div class="outline-input">
                  <YInput key="2" name="oldvcode" placeholder="请输入验证码" :rules="rules.vcode">
                    <div class="send-code" slot="foot">
                      <v-btn :disabled="oldVcodeDisable" @click="getVcode()" style="color:#fff;" block small  color="#11A0FE" height="24" rounded>{{getOldCountTime}}</v-btn>
                    </div>
                  </YInput>
                </div>
              </div>
            </template>
            <template v-if="step === 2">
              <div class="part">
                <div class="plabel">输入新手机号：</div>
                <div class="outline-input">
                  <YInput key="3" name="newusername" placeholder="请输入旧手机号" :rules="rules.username"></YInput>
                </div>
              </div>
              <div class="part">
                <div class="plabel">输入验证码：</div>
                <div class="outline-input">
                  <YInput  key="4" name="newvcode" placeholder="请输入验证码" :rules="rules.vcode">
                    <div class="send-code" slot="foot">
                      <v-btn :disabled="newVcodeDisable" @click="getVcodeNew()" style="color:#fff;" block small  color="#11A0FE" height="24" rounded>{{getNewCountTime}}</v-btn>
                    </div>
                  </YInput>
                </div>
              </div>
            </template>
          </YForm>
        </div>
        <div class="btn-box">
          <button @click="nextStep" v-if="step === 1">下一步</button>
          <button @click="checkNewPhone" v-if="step === 2">确定</button>
        </div>
        <div v-if="step === 1" class="tip">(如果旧手机号码无法接收验证码
          <span  @click="showCustomer" class="kf">请联系客服</span>
        ）</div>
      </div>
    </v-dialog>
  
</template>

<script>
import YForm from "@/components/public/YForm.vue"
import YInput from "@/components/public/YInput.vue"
import store from '@/store/index'
import { getVcode, checkoutNode, userMobileUpdate } from '@/server/api.js'
import { VCODE_TIME } from '@/config/public_config.js'
import { 
  switchCustomer
} from '@/utils/utils.js'

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
      oldcountTime: 0,
      newcountTime: 0,
      defaultOldPhoneNumber: "",
      step: 1,
      show: false,
      timeidOld:null,
      timeidNew:null,
      oldUsername: null,
      newUsername: null,
      oldMarking: null,
      newMarking: null,
      rules: {
        username: [{required:true,msg:'手机号不能为空'},{maxLen:11,msg:'手机号长度不合法'}],
        vcode: [{required:true,msg:'验证码不能为空'},{maxLen:6,msg:'验证码长度不合法'}],
      }
    }
  },
  components: {
    YForm,
    YInput,
  },
  computed: {
    oldVcodeDisable() {
      return this.oldcountTime > 0
    },
    getOldCountTime() {
      return this.oldcountTime > 0 ? `${this.oldcountTime}s` : '获取验证码'
    },
    newVcodeDisable() {
      return this.newcountTime > 0
    },
    getNewCountTime() {
      return this.newcountTime > 0 ? `${this.newcountTime}s` : '获取验证码'
    },
  },
  mounted() {
    this.defaultOldPhoneNumber = store.getters.getUserInfo.mobile
  },
  methods: {
    showCustomer () {
      switchCustomer(this)
    },
    check() {
      this.$refs.yform.check();
    },
    onClose() {
      this.$emit('close','phone',false)
    },
    getVcode() {
      this.$refs.yform.check(async (state,valList) => {
        if(valList.oldusername.state) {
          let params = {
            mobile: valList.oldusername.value,
            type: 2,
          }
          this.$Spin.show();
          let response = await getVcode(params);
          this.$Spin.hide();
          if(response.code == 200) {
            this.$message.success("发送成功")
            this.countDownTimt('timeidOld', 'oldcountTime')
          } else {
            this.$message.error(response.message);
          }
        }
      },['oldusername']);
    }, 
    getVcodeNew() {
      this.$refs.yform.check(async (state,valList) => {
        if(valList.newusername.state) {
          let params = {
            mobile: valList.newusername.value,
            type: 1,
          }
          let response = await getVcode(params);
          if(response.code == 200) {
            this.$message.success("发送成功")
            this.countDownTimt('timeidNew', 'newcountTime')
          } else {
            this.$message.error(response.message);
          }
        }
      },['newusername']);
    }, 
    nextStep() {
      this.$refs.yform.check(async (state,valList) => {
        if(state) {
          let params = {
            mobile: valList.oldusername.value,
            code: valList.oldvcode.value,
            type: 2,
          }
          this.oldUsername = valList.oldusername.value;
          let codeRes = await checkoutNode(params)
          if(codeRes.code == 200) {
            this.oldMarking = codeRes.data.marking;
            this.step = 2
          } else {
            this.$message.error(codeRes.message);
          }
        }
      });
    },
    async checkNewPhone() {
      this.$refs.yform.check(async (state,valList) => {
        if(state) {
          let params = {
            mobile: valList.newusername.value,
            code: valList.newvcode.value,
            type: 1,
          }
          this.newUsername = valList.newusername.value;
          let codeRes = await checkoutNode(params)
          if(codeRes.code == 200) {
            this.newMarking = codeRes.data.marking;
            this.resetPhoneNumber();
          } else {
            this.$message.error(codeRes.message);
          }
        }
      });
    },
    resetPhoneNumber() {
      this.$refs.yform.check(async (state) => {
        if(state) {
          let params = {
            oldMobile: this.oldUsername,
            oldMarking: this.oldMarking,
            newMobile: this.newUsername,
            newMarking: this.newMarking,
          }
          let response = await userMobileUpdate(params);
          if(response.code === 200) {
            this.$message.success('操作成功')
            store.dispatch('updateUserInfo',{token: store.getters.getToken})
            this.onClose();
          } else {
            this.$message.error(response.message)
          }
        }
      });
    },
    // 1
    countDownTimt(timeid,timeval) {
      let ctime = VCODE_TIME;
      this[timeval] = ctime;
      this.timeid = setInterval( () => {
        if(ctime > 0){
          this[timeval] = --ctime;
        } else {
          clearInterval(this.timeid);
        }
      },1000);
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
  height: 400px;
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
.outline-input{
  width: 320px;
  height: 36px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  padding: 0 10px;
}
.close{
  cursor: pointer;
}
.tip{
  font-size: 12px;
  color: #888888;
  line-height: 22px;
  text-align: center;
  margin-top: 10px;
}
.kf{
  color: #11A0FE;
  cursor: pointer;
}
.part{
  margin-bottom: 30px;
  .plabel{
    font-size: 16px;
    color: #444444;
    line-height: 22px;
    height: 22px;
    margin-bottom: 10px;
  }
}
.send-code{
  width: 84px;
  height: 24px;
  color: #fff;
}
</style>