<template>
    <div>
        <div class="scroll-white bottom50">
            <div class="equipment_box">
                <van-button type="primary" block class="equipment_button" @click="goToDevice">设备</van-button>
            </div>
            <div class="equipment_box mart21">
                <van-button type="primary" block class="equipment_button_ground" @click="goToCompany">企业</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import * as dd from 'dingtalk-jsapi';
import VueCookies from 'vue-cookies';

export default {
    name: 'CustomerHome',
    components: {},
    data() {
        return {
            authCode: '',
        };
    },
    computed: {
        currentCorpId() {
            return this.$store.getters.getCorpId || this.$route.query.corpid;
        },
        currentAppId() {
            return this.$store.getters.getAppId;
        },
    },
    mounted() {
        this.hasToken();
        // this.$store.dispatch(
        //     'cacheToken',
        //     'eyJhbGciOiJIUzI1NiJ9.eyJjb21wYW55Q29kZSI6ImFveW91IiwidW5pb25JZCI6ImJGTEtjUmJpUEJBVERmZ2xMTU9maWk1Z2lFaUUiLCJleHAiOjE2MjI3MTQ5NzF9.ND0yPZNRkjDqYvtadihC6xnBIU6pDZHT-SRM6a3V2RQ'
        // );
    },
    methods: {
        // 跳转至首页
        goToCompany() {
            this.$router.push('/management-equipment');
        },
        // 查看设备
        goToDevice() {
            this.$router.push('/my-equipment');
        },
        // 判断是否存在token
        hasToken() {
            let token = VueCookies.get('userToken') || localStorage.getItem('userToken');
            if (!token) {
                let corpid = this.$route.query.corpid || localStorage.getItem('corpId') || this.currentCorpId;
                this.$store.dispatch('cacheCorpId', corpid).then(() => {
                    this.getAuthCode();
                });
            }
        },
        // 获取临时凭证
        getAuthCode() {
            // 先判断是否是在钉钉中运行此应用
            if (dd.env.platform === 'notInDingTalk') {
                _g.toastMsg('fail', '请在钉钉中访问本应用!');
                return;
            }
            var _that = this;
            dd.ready(() => {
                dd.runtime.permission.requestAuthCode({
                    corpId: _that.currentCorpId,
                    onSuccess: function (info) {
                        _that.authCode = info.authCode; // 通过该免登授权码可以获取用户身份
                        _that.getUserInfoByCode();
                    },
                    onFail: function (err) {
                        _g.toastMsg('fail', JSON.stringify(err));
                    },
                });
            });
        },
        // 通过临时凭证获取用户信息和token
        getUserInfoByCode() {
            let loginParam = {
                corpId: this.currentCorpId,
                authCode: this.authCode,
            };
            let loginUrl = '/login/dingtalk/autoLogin' + _g.stringifyQuery(loginParam);
            _api.post(loginUrl).then((res) => {
                if (res.code == 200) {
                    this.$store.dispatch('cacheToken', res.data.token);
                    return;
                } else {
                    _g.toastMsg('fail', res.message);
                }
            });
        },
    },
};
</script>

<style scoped>
.bottom50 {
    bottom: 40px;
}
.mart5 {
    margin-top: 5px;
}
.equipment_box {
    width: 100%;
    display: flex;
    justify-content: center;
}
.mart21 {
    margin-top: 21px;
}
.equipment_button {
    width: 329px;
    height: 84px;
    opacity: 0.84;
    background: linear-gradient(270deg, #7174f7, #7073fa);
    border-radius: 50px;
    z-index: 999;
    font-size: 16px;
}
.equipment_button_ground {
    width: 329px;
    height: 84px;
    opacity: 0.84;
    background: rgba(59, 122, 226, 0.9);
    border-radius: 50px;
    font-size: 16px;
}
</style>
