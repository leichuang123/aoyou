<template>
    <div>
        <div class="scroll-white bottom50">
            <div class="equipment_info" v-if="loaded">
                <div class="equipment_info_row">
                    <span>公司名称：</span>
                    <div class="company_name">
                        <span v-cloak>{{company_name}}</span>
                    </div>
                </div>
            </div>
            <div class="isFlex">
                <van-cell-group class="equipment_grid" v-if="loaded && resourceList.length">
                    <van-cell title="设备" v-if="resourceList.includes('/device/list')" is-link to="/my-equipment" />
                    <van-cell title="成员" v-if="resourceList.includes('/employee/list')" is-link clickable @click="selectDepartmentAndUser" />
                    <van-cell title="角色" v-if="resourceList.includes('/role/list')" is-link to="/role-list" />
                </van-cell-group>
            </div>
        </div>
    </div>
</template>
<script>
import { dingDingSelectTreeMixin } from '@/assets/js/selectDDUserAndDepartment.js';
export default {
    name: 'ManagementEquipment',
    components: {},
    mixins: [dingDingSelectTreeMixin],
    data() {
        return {
            company_name: '',
            resourceList: [],
            loaded: false,
            needJump: true,
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
                    if (!this.resourceList.length) {
                        _g.toastMsg('fail', '暂无权限', 1500, false, () => {
                            this.$router.push('/customer-home');
                        });
                        return;
                    }
                    this.loaded = true;
                    this.$store.commit('saveUserInfo', res.data);
                    return;
                }
                _g.toastMsg('fail', res.message);
            });
        },
        // 调用钉钉sdk展示选择部门和人
        selectDepartmentAndUser() {
            this.selectCorporateDepartmentsAndUsers();
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
