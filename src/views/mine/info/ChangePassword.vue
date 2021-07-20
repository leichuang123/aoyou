<template>
  <v-dialog v-model="isShow" width="400" :persistent="true">
      <div class="change-name">
        <div class="close">
          <v-icon @click="onClose" class="close">mdi-close</v-icon>
        </div>
        <div class="title">修改密码</div>
        
        <!-- 内容 -->
        <div class="content">
          <YForm ref="yform">
            
            <div class="part">
              <div class="plabel">旧手机号：</div>
              <div class="outline-input">
                {{getPhoneNumber}}
              </div>
            </div>
            <div class="part">
              <div class="plabel">输入验证码：</div>
              <div class="outline-input">
                <YInput name="vcode" placeholder="请输入验证码" :rules="rules.vcode">
                  <div class="send-code" slot="foot">
                    <v-btn :disabled="VcodeDisable" @click="getVcode()" style="color:#fff;" block small  color="#11A0FE" height="24" rounded>{{getCountTime}}</v-btn>
                  </div>
                </YInput>
              </div>
            </div>
            
            <div class="part">
              <div class="plabel">输入新密码：</div>
              <div class="outline-input">
                <YInput name="password" type="password" placeholder="请输入新密码" :rules="rules.password"></YInput>
              </div>
            </div>
            <div class="part">
              <div class="plabel">再次确认新密码：</div>
              <div class="outline-input">
                <YInput name="passwordrepeat" type="password" placeholder="请再次确认密码" :rules="rules.password"></YInput>
              </div>
            </div>
          </YForm>
        </div>
        <div class="btn-box">
          <button @click="confirmChange">确定修改</button>
        </div>
      </div>
    </v-dialog>
  
</template>

<script>
import YForm from "@/components/public/YForm.vue"
import YInput from "@/components/public/YInput.vue"
import { mapGetters } from 'vuex'
import { getVcode, checkoutNode, changePassWord } from '@/server/api.js'
import { PHONE_NUMBER_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, VCODE_LENGTH, VCODE_TIME } from '@/config/public_config.js'
import md5 from 'js-md5';

export default {
  name: "ChangePassword",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      countTime: 0,
      show: false,
      phoneNumber:"",
      timeid: null,
      rules: {
        username: [{required:true,msg:'手机号不能为空'},{ len:PHONE_NUMBER_LENGTH,msg: `手机号为${PHONE_NUMBER_LENGTH}位`}],
        vcode: [{required:true,msg:'验证码不能为空'},{ len:VCODE_LENGTH,msg: `验证码为${VCODE_LENGTH}位`}],
        password: [{required:true,msg:'密码不能为空'},{ minLen:PASSWORD_MIN_LENGTH,msg: `密码为${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}位`},{ maxLen:PASSWORD_MAX_LENGTH,msg: `密码为${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}位`}],
      }
    }
  },
  components: {
    YForm,
    YInput,
  },
  mounted() {
    
  },
  computed: {
    ...mapGetters(['getUserBalance','getUserInfo']),
    currentPath () {
      return this.$route.path
    },
    VcodeDisable() {
      return this.countTime > 0
    },
    getCountTime() {
      return this.countTime > 0 ? `${this.countTime}s` : '获取验证码'
    },
    getPhoneNumber() {
      let phoneNumber = this.getUserInfo.mobile
      const reg = phoneNumber.substr(3,4)
      return phoneNumber ? phoneNumber.replace(reg, '****') : "";
    }
  },
  methods: {
    onClose() {
      this.$emit('close','password',false)
    },
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
    async getVcode() {
      let params = {
        mobile: this.getUserInfo.mobile,
        type: 2,
      }
      this.$Spin.show();
      let response = await getVcode(params);
      if(response.code == 200) {
        this.$message.success("发送成功")
        this.countDownTimt('timeid', 'countTime')
      } else {
        this.$message.error(response.message);
      }
      this.$Spin.hide();
    },
    confirmChange() {
      this.$refs.yform.check(async (state, valList) => {
        if(valList.password.value !== valList.passwordrepeat.value) {
          this.$message.error("两次密码不一致")
          return false;
        }
        let params = {
          mobile: this.getUserInfo.mobile,
          code: valList.vcode.value,
          type: 2,
        }
        let checkres = await checkoutNode(params);
        if(checkres.code !== 200) {
          this.$message.error(checkres.message);
          return false;
        }
        let updateRes = await changePassWord({
          marking: checkres.data.marking,
          password: md5(valList.password.value),
          mobile: this.getUserInfo.mobile,
        })
        if(updateRes.code !== 200) {
          this.$message.error(updateRes.message);
          return false;
        }
        this.onClose();
        this.$message.success("修改成功");
        this.$store.dispatch('logout')
      });
    }
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
  height: 600px;
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
    min-height: 220px;
    display: flex;
    justify-content: center;
    padding-top: 30px;
    // align-items: center;
  }
}
.outline-input{
  width: 320px;
  height: 36px;
  line-height: 36px;
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