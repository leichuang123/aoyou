<template>
  <div class="login">
    <!-- <div class="qr-login">
       <template v-if="false">
        <img src="../../assets/images/login/qrcode-tip.png" class="qrcode-tip" />
        <img src="../../assets/images/login/icon-63.png" class="qrcode" @click="switchFormtype(3)" />
      </template>

      <img src="../../assets/images/login/icon-72.png" v-else class="qrcode" @click="switchFormtype(0)" />
    </div> -->
    <!-- 登录 -->
    <div v-if="formType === 0" class="login-content">
      <div class="login-type"></div>
      <!-- <v-tabs v-model="loginType" height="52" grow color="#11A0FE">
          <v-tab>账号登录</v-tab>
          <v-tab>验证码登录</v-tab>
        </v-tabs> -->
      <section v-if="loginType === 0">
        <div class="input-area">
          <MyForm ref="login">
            <LoginInput :defaultVal="defaultusername" :maxLen="usernameLength" name="username" key="11"
              :picList="picList.userName" :rules="rules.userName" placeholder="请输入用户名/手机号" @onChange="usernameChange"
              style="margin-bottom: 20px"></LoginInput>
            <LoginInput :maxLen="pwdLength" :defaultVal="defaultpasswd" @onEnter="login" name="password" key="12"
              :picList="picList.passWord" :rules="rules.passWord" placeholder="请输入密码" @onChange="passwdChange"
              style="margin-bottom: 33px" :type="getInputType">
              <div class="toggle-pwd" slot="foot" @click="toggleInputType(showPwd)">
                <img v-if="!showPwd" src="../../assets/images/icon/icon-66.png" alt="显示密码" />
                <img v-if="showPwd" src="../../assets/images/icon/icon-70.png" alt="隐藏密码" />
              </div>
            </LoginInput>
          </MyForm>
        </div>
        <section style="height: 143px">
          <div class="passwd-about">
            <p class="forget-pwd" @click="formType = 2">忘记密码？</p>
            <div class="remember-passwd">
              <input v-model="rememberPW" type="checkbox" name="rempwd" id="rempwd" />
              <label for="rempwd">记住密码</label>
            </div>
          </div>
          <div class="toreg">
            <p>
              <span>还没有账号？</span>
              <span class="reg-btn" @click="formType = 1">注册</span>
            </p>
          </div>
        </section>
      </section>
      <section v-if="loginType === 1">
        <div class="input-area">
          <LoginInput key="21" :maxLen="usernameLength" :picList="picList.userName" :rules="rules.userName"
            placeholder="请输入手机号" @onChange="usernameChange" style="margin-bottom: 20px"></LoginInput>
          <LoginInput key="22" :maxLen="pwdLength" :picList="picList.vcode" :rules="rules.vCode" placeholder="请输入验证码"
            @onChange="vcodeChange" style="margin-bottom: 33px">
            <div class="send-code" slot="foot">
              <v-btn dark block small depressed color="#11A0FE" height="24" rounded>获取验证码</v-btn>
            </div>
          </LoginInput>
        </div>
        <section style="height: 143px">
          <div class="toreg">
            <p>
              <span>还没有账号？</span>
              <span class="reg-btn" @click="formType = 1">注册</span>
            </p>
          </div>
        </section>
      </section>
      <v-btn @click="login" dark block depressed color="#11A0FE" height="50" rounded>登录</v-btn>
    </div>
    <!-- 注册 -->
    <div v-if="formType === 1" class="login-content">
      <section>
        <div class="input-area">
          <MyForm ref="regin">
            <LoginInput name="username" :maxLen="usernameLength" key="31" :picList="picList.userName"
              :rules="rules.userName" placeholder="请输入手机号" @onChange="usernameChange" style="margin-bottom: 20px">
            </LoginInput>
            <LoginInput :maxLen="6" name="vcode" key="32" :picList="picList.vCode" :rules="rules.vCode"
              placeholder="请输入验证码" @onChange="vcodeChange" style="margin-bottom: 33px">
              <div class="send-code" slot="foot">
                <v-btn :disabled="VcodeDisable" @click="getVcode(1)" style="color: #fff" block small color="#11A0FE"
                  height="24" rounded>{{ getCountTime }}</v-btn>
              </div>
            </LoginInput>
            <LoginInput :maxLen="pwdLength" name="password" type="password" key="33" :picList="picList.passWord"
              :rules="rules.passWord" placeholder="请输入新密码" @onChange="passwdChange" style="margin-bottom: 33px">
            </LoginInput>
            <LoginInput :maxLen="pwdLength" @onEnter="regin" name="passwordrepeat" type="password" key="34"
              :picList="picList.passWord" :rules="rules.passWord" placeholder="再次确认密码" @onChange="passwd2Change"
              style="margin-bottom: 33px"></LoginInput>
          </MyForm>
          <!-- 选择地区 -->
          <div class="login-cascader">
            <div class="region">
              <img src="../../assets/images/icon/map.svg" v-show="!dataCenterAddressId" />
              <img src="../../assets/images/icon/map2.svg" style="height:27px;margin-left: -5px;margin-right: 12px;"
                v-show="dataCenterAddressId" />
              <el-cascader @focus="cascaderFocus" placeholder="请选择地区" class="cascader" :options="areaList"
                @change="cascaderChange" @blur="lose" clearable :props="{ expandTrigger: 'hover' } ">
              </el-cascader>
            </div>
            <span class="line"></span>
            <p v-if="mapHide">地区不能为空</p>
            <!-- <button @click="aa">试试</button> -->
          </div>

        </div>
        <!-- <div class="login-cascader">
            <el-cascader class="cascader" :options="options" clearable></el-cascader>
          </div> -->
        <v-btn @click="regin" dark block depressed color="#11A0FE" height="50" rounded>注册</v-btn>
        <section>
          <div class="toreg">
            <p style="float: left; margin-top: 20px">
              <span>已有账号？</span>
              <span @click="formType = 0" class="reg-btn">登录</span>
            </p>
          </div>
        </section>
      </section>
    </div>
    <!-- 忘记密码 -->
    <div v-if="formType === 2" class="login-content">
      <section>
        <div class="input-area">
          <MyForm ref="forget">
            <LoginInput name="username" :maxLen="usernameLength" key="41" :picList="picList.userName"
              :rules="rules.userName" placeholder="请输入手机号" @onChange="usernameChange" style="margin-bottom: 20px">
            </LoginInput>
            <LoginInput :maxLen="6" name="vcode" key="42" :picList="picList.vCode" :rules="rules.vCode"
              placeholder="请输入验证码" @onChange="vcodeChange" style="margin-bottom: 33px">
              <div class="send-code" slot="foot">
                <v-btn :disabled="VcodeDisable" @click="getVcode(5)" style="color: #fff" block small color="#11A0FE"
                  height="24" rounded>{{ getCountTime }}</v-btn>
              </div>
            </LoginInput>
            <LoginInput :maxLen="pwdLength" name="password" type="password" :picList="picList.passWord" key="43"
              :rules="rules.passWord" placeholder="请输入新密码" @onChange="passwdChange" style="margin-bottom: 33px">
            </LoginInput>
            <LoginInput :maxLen="pwdLength" @onEnter="findPW" name="passwordrepeat" type="password"
              :picList="picList.passWord" key="44" :rules="rules.passWord" placeholder="再次确认密码"
              @onChange="passwd2Change" style="margin-bottom: 33px"></LoginInput>
          </MyForm>
        </div>
        <v-btn @click="findPW" dark block depressed color="#11A0FE" height="50" rounded>找回密码</v-btn>
        <section>
          <div class="toreg">
            <p style="float: left; margin-top: 20px">
              <span>已有账号？</span>
              <span @click="formType = 0" class="reg-btn">登录</span>
            </p>
          </div>
        </section>
      </section>
    </div>
    <div v-if="formType === 3" class="qrcode-content login-content">
      <div class="scancode-c">
        <div id="scancode" class="scancode"></div>
      </div>

      <div class="toreg">
        <p>
          <span>还没有账号？</span>
          <span class="reg-btn" @click="formType = 1">注册</span>
        </p>
      </div>
    </div>

    <div v-if="formType === 4" class="login-content bind-mobile">
      <section>
        <div class="input-area">
          <MyForm ref="bindMobile">
            <LoginInput name="username" :maxLen="usernameLength" key="31" :picList="picList.userName"
              :rules="rules.userName" placeholder="请输入手机号" @onChange="usernameChange" style="margin-bottom: 20px">
            </LoginInput>
            <LoginInput :maxLen="6" name="vcode" key="32" :picList="picList.vCode" :rules="rules.vCode"
              placeholder="请输入验证码" @onChange="vcodeChange" style="margin-bottom: 33px">
              <div class="send-code" slot="foot">
                <v-btn :disabled="VcodeDisable" @click="getVcode(8)" style="color: #fff" block small color="#11A0FE"
                  height="24" rounded>{{ getCountTime }}</v-btn>
              </div>
            </LoginInput>
            <div class="password-area">
              <template v-if="!userIsExist">
                <LoginInput :maxLen="pwdLength" name="password" type="password" key="33" :picList="picList.passWord"
                  :rules="rules.passWord" placeholder="请输入密码" @onChange="passwdChange" style="margin-bottom: 33px">
                </LoginInput>
                <LoginInput :maxLen="pwdLength" @onEnter="regin" name="passwordrepeat" type="password" key="34"
                  :picList="picList.passWord" :rules="rules.passWord" placeholder="再次确认密码" @onChange="passwd2Change"
                  style="margin-bottom: 33px"></LoginInput>
              </template>
            </div>
          </MyForm>
        </div>
        <v-btn @click="bindmobile" dark block depressed color="#11A0FE" height="50" rounded>确定</v-btn>
      </section>
    </div>
    <DeviceVerify v-if="isShowVerify" @close="hideVerify" @success="loginSuccess" :mobile="username.value" />
  </div>
</template>

<script>
import LoginInput from "./LoginInput";
import MyForm from "./MyForm.vue";
import DeviceVerify from "./DeviceVerify";
import {
  PHONE_NUMBER_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  VCODE_LENGTH,
  VCODE_TIME,
} from "../../config/public_config.js";
import {
  login,
  getVcode,
  register,
  checkoutNode,
  changePW,
  scanningLoginCallBack,
  mobileBinding,
  getDataCenterAddress,
  getAreaList,
} from "@/server/api";
import md5 from "js-md5";
import { mapGetters } from "vuex";

export default {
  name: "LoginForm",
  data() {
    return {
      // valid: true,
      // selected: 'Jacob',
      usernameLength: PHONE_NUMBER_LENGTH,
      pwdLength: PASSWORD_MAX_LENGTH,
      timeid: 0,
      countTime: 0,
      formType: 0, // 表单类型 : 0登录 1注册 2忘记密码 3微信扫码登录 4绑定手机号
      loginType: 0, // 登录类型：0 账号登录，1 验证码登录
      accountInfo: null,
      defaultpasswd: null,
      defaultusername: null,
      showPwd: false,
      username: "",
      passwd: "",
      passwd2: "",
      phoneNumber: "",
      rememberPW: true,
      vcode: "",
      rules: {
        userName: [
          { required: true, msg: "手机号不能为空" },
          { len: PHONE_NUMBER_LENGTH, msg: `手机号为${PHONE_NUMBER_LENGTH}位` },
        ],
        passWord: [
          { required: true, msg: "密码不能为空" },
          {
            minLen: PASSWORD_MIN_LENGTH,
            msg: `密码为${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}位`,
          },
          {
            maxLen: PASSWORD_MAX_LENGTH,
            msg: `密码为${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}位`,
          },
        ],
        vCode: [
          { required: true, msg: "验证码不能为空" },
          { len: VCODE_LENGTH, msg: `验证码为${VCODE_LENGTH}位` },
        ],
      },
      picList: {
        userName: [
          require("@/assets/images/icon/icon-64.png"),
          require("@/assets/images/icon/icon-68.png"),
        ],
        passWord: [
          require("@/assets/images/icon/icon-65.png"),
          require("@/assets/images/icon/icon-69.png"),
        ],
        vCode: [
          require("@/assets/images/icon/icon-73.png"),
          require("@/assets/images/icon/icon-74.png"),
        ],
      },
      isShowVerify: false,
      valObj: null,
      userIsExist: true,
      openid: "",
      wechatUnionid: "",
      areaList: [], //根据用户ip信息选择主机地址
      dataCenterAddressId: 0, //绑定地区
      mapHide: false,//是否提示地区为空
      regionalTips: -1,//默认ip的id
      jia: [{ value: 1, label: "浙江省", level: 1, children: [{ label: "丽江", level: 2, parentId: 37, value: 38 }] }],

    };
  },
  components: {
    LoginInput,
    MyForm,
    DeviceVerify,
  },
  computed: {
    ...mapGetters(["getToken"]),
    getInputType() {
      return this.showPwd ? "text" : "password";
    },
    getCountTime() {
      return this.countTime > 0 ? `${this.countTime}s` : "获取验证码";
    },
    VcodeDisable() {
      return this.countTime > 0;
    },
  },
  methods: {
    async bindmobile() {
      let state = true;
      let valObj = {};
      this.$refs.bindMobile.$children.forEach((item) => {
        console.log(item);
        let itemCheck = item.checkVal();
        valObj[itemCheck.name] = itemCheck;
        if (this.userIsExist && (item.name === "" || item.name === "")) {
          console.log("此种情况不需要校验");
        } else {
          if (!itemCheck.state) {
            state = false;
          }
        }
      });
      if (!state) {
        return false;
      }
      if (
        !this.userIsExist &&
        valObj.password.value !== valObj.passwordrepeat.value
      ) {
        this.$message.error("两次密码不一致");
        return false;
      }
      let params = {
        code: valObj.vcode.value,
        mobile: valObj.username.value,
        type: 8,
      };
      let checkoutRes = await checkoutNode(params);
      if (checkoutRes.code !== 200) {
        this.$message.error(checkoutRes.message);
        return false;
      }
      let marking = checkoutRes.data.marking;
      let params2 = {
        mobile: valObj.username.value,
        password: this.userIsExist ? "" : md5(valObj.password.value),
        marking,
        openid: this.openid,
        wechatUnionid: this.wechatUnionid,
      };
      let res = await mobileBinding(params2);
      if (res.code !== 200) {
        this.$message.error(res.message);
        return;
      }
      this.loginSuccess(res.data.token);
    },
    switchFormtype(type) {
      this.formType = type;
      if (type === 3) {
        let redirect_uri = `https://yunzhiqu.cn/www.html`;
        // 带#号会导致样式不生效
        this.isShowCodeDialog = true;
        this.$nextTick(() => {
          // eslint-disable-next-line
          new WxLogin({
            self_redirect: false,
            id: "scancode",
            appid: "wx8bf598d0ef79b5e7",
            scope: "snsapi_login",
            redirect_uri,
            response_type: "code",
            href: encodeURIComponent(
              "https://yunny.yunzhiqu.cn/yunny_login_qrcode_style.css"
            ),
          });
        });
      }
    },
    toggleInputType(type) {
      this.showPwd = !type;
    },
    getInputIsEmpty(type) {
      try {
        return this[type].length === 0;
      } catch (error) {
        console.error("找不到该属性，请检查", error);
        return true;
      }
    },
    usernameChange(val) {
      this.username = val;
    },
    passwdChange(val) {
      this.passwd = val;
    },
    passwd2Change(val) {
      this.passwd2 = val;
    },
    phoneChange(val) {
      this.phoneNumber = val;
    },
    vcodeChange(val) {
      this.vcode = val;
    },
    hideVerify() {
      this.isShowVerify = false;
    },
    async cascaderFocus() {
      this.getDataCenterAddress();
    },
    // 根据ip信息解析用户地址
    async getDataCenterAddress() {
      //果如没有选择地区，则获取默认地区
      if (!this.dataCenterAddressId) {
        let res = await getDataCenterAddress();
        if (res.code == 200) {
          let sz = []
          sz.push(res.data);
          this.areaList = sz;
          // this.areaList = this.jia;
          this.regionalTips = this.areaList[0].children[0].value
          // console.log(this.regionalTips)

          // ip地址解析失败，需要用户手动选择地址
        } else {
          this.$message.error(res.message);
          let resData = await getAreaList();
          if (resData.code == 200) {
            this.areaList = resData.data;
          } else {
            this.$message.error(resData.message);
          }
        }
      } else {
        //选择了地区还想手动修改
        let resData = await getAreaList();
        if (resData.code == 200) {
          this.areaList = resData.data;
        } else {
          this.$message.error(resData.message);
        }
      }
    },
    async cascaderChange(value) {
      this.mapHide = false;
      this.dataCenterAddressId = value[value.length - 1];
      // console.log(this.dataCenterAddressId)
      // console.log(this.regionalTips)
      if (this.dataCenterAddressId !== this.regionalTips && this.dataCenterAddressId !== undefined && this.regionalTips !== -1) {
        this.$message.error("您所选择的地址与检测到地址不统一可能会导致网络延迟");
      }
      if (!this.dataCenterAddressId) {
        this.mapHide = true;
      }
    },
    async lose() {
      if (!this.dataCenterAddressId) {
        this.mapHide = true;
      }
    },
    async login() {
      let state = true;
      let valObj = {};
      this.$refs.login.$children.forEach((item) => {
        let itemCheck = item.checkVal();
        valObj[itemCheck.name] = itemCheck;
        if (!item.checkVal().state) {
          state = false;
        }
      });
      if (!state) {
        return false;
      }
      let params = {
        mobile: valObj.username.value,
        password: md5(valObj.password.value),
      };
      this.valObj = valObj;
      let response = await login(params);
      if (response.code !== 200) {
        if (response.code === 10110016) {
          this.isShowVerify = true;
          return;
        }
        this.$message.error(response.message);
        return;
      }

      this.loginSuccess(response.data.token);
    },
    loginSuccess(token) {
      this.isShowVerify = false;
      this.$message.success("登录成功");
      this.$store.dispatch("editToken", { token });
      if (
        this.valObj &&
        this.valObj.username &&
        this.valObj.password &&
        this.formType !== 3 &&
        this.formType !== 4
      ) {
        if (this.rememberPW) {
          window.localStorage.setItem(
            "rmaccount",
            JSON.stringify({
              username: this.valObj.username.value,
              password: this.valObj.password.value,
              rememberPW: true,
            })
          );
        } else {
          window.localStorage.removeItem("rmaccount");
        }
      }

      if (typeof this.$route.query.from !== "undefined") {
        let fromType = this.$route.query.fromType || 0;
        let url = decodeURIComponent(this.$route.query.from);
        if (fromType === 0) {
          window.location.href = url;
        } else {
          this.$router.push(url);
        }
        return;
      }
      this.$router.push("/");
    },
    async getVcode(type) {
      if (!this.username) {
        this.$message.error("请输入手机号");
        return false;
      }
      if (!this.username.state) {
        this.$message.error("手机号格式不正确");
        return false;
      }
      let params = {
        mobile: this.username.value,
        type: type,
      };
      let response = await getVcode(params);
      if (response.code == 200) {
        this.$message.success("发送成功");
        this.countDownTimt(VCODE_TIME);
        if (type === 8) {
          this.userIsExist = response.data.isExist;
        }
      } else {
        this.$message.error(response.message);
      }
    },
    countDownTimt(time = 0) {
      let ctime = time;
      this.countTime = ctime;
      this.timeid = setInterval(() => {
        if (ctime > 0) {
          this.countTime = --ctime;
        } else {
          clearInterval(this.timeid);
        }
      }, 1000);
    },
    async regin() {
      //地区校验
      if (!this.dataCenterAddressId) {
        //显示地区为空
        this.mapHide = true;
      }
      let state = true;
      let valObj = {};
      this.$refs.regin.$children.forEach((item) => {
        let itemCheck = item.checkVal();
        valObj[itemCheck.name] = itemCheck;
        if (!itemCheck.state) {
          state = false;
        }
      });
      // console.log(valObj)
      if (!state) {
        return false;
      }
      //地区校验
      if (!this.dataCenterAddressId) {
        console.log("地区没填")
        return;
      }
      if (valObj.password.value !== valObj.passwordrepeat.value) {
        this.$message.error("两次密码不一致");
        return false;
      }
      let params = {
        code: valObj.vcode.value,
        mobile: valObj.username.value,
        type: 1,
      };
      //验证验证码是否有效
      let checkoutRes = await checkoutNode(params);
      if (checkoutRes.code !== 200) {
        this.$message.error(checkoutRes.message);
        return false;
      }
      let marking = checkoutRes.data.marking;
      let params2 = {
        mobile: valObj.username.value,
        password: md5(valObj.password.value),
        marking,
        channelNo: 2,
        dataCenterAddressId: this.dataCenterAddressId,
      };
      console.log(this.dataCenterAddressId)
      let registerRes = await register(params2);
      if (registerRes.code !== 200) {
        this.$message.error(registerRes.message);
        return false;
      }
      this.$message.success("注册成功");
      setTimeout(() => {
        this.formType = 0;
      }, 1000);
    },
    async findPW() {
      let state = true;
      let valObj = {};
      this.$refs.forget.$children.forEach((item) => {
        let itemCheck = item.checkVal();
        valObj[itemCheck.name] = itemCheck;
        if (!itemCheck.state) {
          state = false;
        }
      });
      if (!state) {
        return false;
      }
      if (valObj.password.value !== valObj.passwordrepeat.value) {
        this.$message.error("两次密码不一致");
        return false;
      }
      let params = {
        code: valObj.vcode.value,
        mobile: valObj.username.value,
        type: 5,
      };
      let checkoutRes = await checkoutNode(params);
      if (checkoutRes.code !== 200) {
        this.$message.error(checkoutRes.message);
        return false;
      }
      let marking = checkoutRes.data.marking;
      let params2 = {
        mobile: valObj.username.value,
        password: md5(valObj.password.value),
        marking,
        channelNo: 2,
      };
      let changeRes = await changePW(params2);
      if (changeRes.code !== 200) {
        this.$message.error(changeRes.message);
        return false;
      }
      this.$message.success("密码找回成功");
      setTimeout(() => {
        this.formType = 0;
      }, 1000);
    },
    fillAccountInfo() {
      this.rememberPW = this.accountInfo.rememberPW;
      if (this.accountInfo.rememberPW) {
        this.defaultusername = this.accountInfo.username;
        this.defaultpasswd = this.accountInfo.password;
      }
    },
  },
  async mounted() {
    // this.formType = 4
    if (this.$route.query.code) {
      let res = await scanningLoginCallBack({
        appos: 0,
        code: this.$route.query.code,
        state: "",
      });
      if (res.code !== 200) {
        if (res.data && res.data.openid) {
          this.formType = 4;
          this.openid = res.data.openid;
          this.wechatUnionid = res.data.unionid;
        }
        return;
      }
      this.loginSuccess(res.data.token);
    }

    let accountInfo = localStorage.getItem("rmaccount");
    if (accountInfo) {
      try {
        this.accountInfo = JSON.parse(accountInfo);
        this.fillAccountInfo();
      } catch (error) {
        console.log(error);
      }
    }
    // 获取数据中心地区列表
    // this.getDataCenterAddress()
  },
  watch: {
    formType() {
      this.username = null;
      this.passwd = null;
      this.phoneNumber = null;
      this.vcode = null;
      this.dataCenterAddressId = 0;
      this.mapHide = false;
      clearInterval(this.timeid);
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  background: #ffffff;
  box-shadow: 0 2px 14px 0 rgba(0, 28, 78, 0.17);
  border-radius: 10px;
  width: 460px;
  // padding: 30px 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 600px;
  .qr-login {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 2;
    .qrcode-tip {
      height: 28px;
    }
    .qrcode {
      width: 66px;
      cursor: pointer;
    }
  }
  .login-content {
    width: 360px;
    margin: 0 auto;

    .login-type {
      position: absolute;
      top: 0;
      right: 0;
      .lt-img-box {
        width: 66px;
        height: 66px;
        position: relative;
        .lt-img {
          width: 100%;
          cursor: pointer;
        }
        .lt-tip {
          height: 28px;
          position: absolute;
          right: 59px;
          top: 16px;
        }
      }
    }
    .input-area {
      margin-top: 50px;
      .head-icon {
        width: 50px;
        height: 22px;
        border-right: 1px solid #e8e8e8;
        flex-grow: 0;
        flex-shrink: 0;
      }
    }

    .login-cascader {
      .region {
        height: 30px;
        margin-bottom: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          margin-right: 10px;
          width: 35px;
          height: 35px;
          margin-left: -7px;
        }
      }
      .cascader {
        width: 100%;
      }
      .line {
        width: 100%;
        display: block;
        border-bottom: 1px solid #e8e8e8;
        margin-bottom: 33px;
        margin-top: -8px;
      }
      p {
        position: absolute;
        bottom: 125px;
        font-size: 12px;
        color: #ff2112;
      }
    }
    .passwd-about {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #666666;
      margin-bottom: 20px;
      .forget-pwd {
        cursor: pointer;
      }
      .remember-passwd {
        display: flex;
        justify-content: center;
        align-items: center;
        input {
          width: 17px;
          height: 17px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 2px;
          cursor: pointer;
          margin-right: 10px;
        }
        label {
          cursor: pointer;
          height: 35px;
          line-height: 35px;
        }
      }
    }
    .toreg {
      font-size: 14px;
      p {
        float: right;
        color: #666;
        .reg-btn {
          color: #11a0fe;
          cursor: pointer;
        }
      }
    }
  }
  .qrcode-content {
    .scancode-c {
      text-align: center;
      padding-bottom: 90px;
      .scancode {
        width: 220px;
        height: 220px;
        margin: 0 auto;
      }
    }
    .toreg {
      position: absolute;
      right: 50px;
      bottom: 110px;
      z-index: 2;
    }
  }
  .toggle-pwd {
    width: 20px;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
  .send-code {
    width: 84px;
    height: 24px;
    color: #fff;
  }
  .bind-mobile {
    .password-area {
      // min-height: 133px;
      min-height: 103px;
    }
  }
}
</style>