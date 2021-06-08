<template>
    <div>
        <div class="scroll-white bottom50">
            <div class="equipment_info">
                <div class="equipment_info_row">
                    <span>公司名称：</span>
                    <div class="company_name">
                        <span v-cloak>{{company_name}}</span>
                    </div>
                </div>
            </div>
            <div class="isFlex">
                <van-cell-group class="equipment_grid" v-if="loaded">
                    <van-cell title="设备" v-if="resourceList.includes('/device/list')" is-link to="/my-equipment" />
                    <van-cell title="成员" v-if="resourceList.includes('/employee/list')" is-link @click="selectDepartmentAndUser" />
                    <van-cell title="角色" v-if="resourceList.includes('/role/list')" is-link to="/role-list" />
                </van-cell-group>
            </div>
        </div>
    </div>
</template>
<script>
// 引入钉钉SDK
import * as dd from 'dingtalk-jsapi';
import { dingDingSelectTreeMixin } from '@/assets/js/selectDDUserAndDepartment.js';
import VueCookies from 'vue-cookies';
export default {
    name: 'ManagementEquipment',
    components: {},
    mixins: [dingDingSelectTreeMixin],
    data() {
        return {
            company_name: '',
            authCode: '',
            resourceList: [],
            loaded: false,
        };
    },
    created() {
        this.getUserInfo();
    },
    computed: {
        currentCorpId() {
            return this.$store.getters.getCorpId || this.$route.query.corpid;
        },
        currentAppId() {
            return this.$store.getters.getAppId;
        },
    },
    methods: {
        // 获取当前用户信息
        getUserInfo() {
            _api.get('/employee/info').then((res) => {
                if (res.code == 200) {
                    this.company_name = res.data.companyName;
                    this.resourceList = res.data.resourceList.map((item) => {
                        return item.url;
                    });
                    this.loaded = true;
                    this.$store.commit('saveUserInfo', res.data);
                    return;
                }
                _g.toastMsg('fail', res.message);
            });
        },
        // 判断是否存在token
        hasToken() {
            let token = VueCookies.get('userToken') || localStorage.getItem('userToken');
            if (!token) {
                let corpid = this.$route.query.corpid;
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
                    corpId: _that.currentCorpId || _that.$route.query.corpid, // 企业id
                    onSuccess: function (info) {
                        _that.authCode = info.authCode; // 通过该免登授权码可以获取用户身份
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
                authCode: 'ce346aaafa1e3fe68ee87b60072c4b02',
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
        // 调用钉钉sdk展示选择部门和人
        selectDepartmentAndUser() {
            this.selectCorporateDepartmentsAndUsers().then((departmentIds, employeddIds) => {
                this.jumpToNaruto();
            });
        },
        // 跳往成员列表
        jumpToNaruto() {
            let queryParmas = _g.stringifyQuery({
                departmentIds: this.departmentIds,
                employeddIds: this.employeddIds,
            });
            let path = '/naruto' + queryParmas;
            this.$router.push({
                path: path,
            });
        },
    },
};
</script>

<style scoped>
.bottom50 {
    bottom: 40px;
}
.isFlex {
    display: flex;
    justify-content: center;
}
.equipment_info {
    margin-left: 50px;
}
.equipment_info_row {
    font-size: 11px;
    color: #383838;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 13px;
    align-items: center;
}
.company_name {
    font-size: 14px;
    font-weight: 600;
    color: #000000;
}
.is_edit {
    width: 10px;
    height: 10px;
}
.marl20 {
    margin-left: 12px;
}
.equipment_grid {
    width: 330px;
    /* height: 139px; */
    background: #ffffff;
    /* border: 1px solid #c6c6c6; */
    box-shadow: 0 0 0 1px #c6c6c6;
    border-radius: 13px;
    margin-top: 22px;
    overflow: hidden;
}
</style>
