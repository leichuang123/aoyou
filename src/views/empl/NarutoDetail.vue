<template>
    <div>
        <div class="scroll-white bottom50">
            <div>
                <div class="naruto-name">{{name}}</div>
                <div class="equipment_number" :class="status !=='0'?'isEnabled':'isDisabled'">
                    <i class="dotter" :class="status !=='0'?'dotIsEnabled':'dotIsDisabled'"></i>
                    {{status !=='0'?'启用中':'禁用中'}}
                </div>
            </div>
            <van-cell-group class="naruto-box">
                <van-cell title="角色" is-link :value="roleName" clickable @click="selectRole()">
                </van-cell>
                <van-cell title="手机号" is-link :value="mobile">
                </van-cell>
            </van-cell-group>
            <div class="status-box" v-if="status !=='0'">
                <van-button style="border:none;height:70px" @click="updateStatus('0')">
                    <img class="close_button" src="../../assets/image/close_button.png" />
                    <p class="close_text">停用</p>
                </van-button>
            </div>
            <div class="status-box" v-else>
                <van-button style="border:none;height:70px" @click="updateStatus('1')">
                    <img class="close_button" src="../../assets/image/open_button.png" />
                    <p class="open_text">启用</p>
                </van-button>
            </div>
        </div>
        <van-popup v-model="showPicker" round position="bottom">
            <van-picker show-toolbar title='选择角色' :columns="roleOption" @cancel="showPicker = false" @confirm="onConfirm" />
        </van-popup>
    </div>
</template>
<script>
import { Picker, Popup } from 'vant';

export default {
    name: 'NarutoDetail',
    components: {
        [Picker.name]: Picker,
        [Popup.name]: Popup,
    },
    data() {
        return {
            name: '',
            status: 1,
            roleName: '',
            mobile: '',
            unionId: '',
            roleOption: [],
            showPicker: false,
            roleId: 0,
        };
    },
    mounted() {
        this.name = this.$route.query.name;
        this.status = this.$route.query.status;
        this.roleName = this.$route.query.roleName;
        this.roleId = this.$route.query.roleId;
        this.mobile = this.$route.query.mobile;
        this.unionId = this.$route.query.unionId;
        this.getRoleOption();
    },
    computed: {},
    methods: {
        // 选择角色
        selectRole() {
            this.showPicker = true;
        },
        // 选择角色弹出层回调
        onConfirm(value) {
            this.showPicker = false;
            this.roleName = value.text;
            this.roleId = value.id;
            this.$nextTick(() => {
                this.saveNarutoRole();
            });
        },
        // 保存成员角色
        saveNarutoRole() {
            _api.put('/employee/role/update', {
                unionId: this.unionId,
                roleIds: [this.roleId],
            }).then((res) => {
                if (res.code !== 200) {
                    _g.toastMsg('fail', res.message);
                    return;
                }
                _g.toastMsg('success', '操作成功', 1500);
            });
        },
        // 获取角色下拉选择的数据
        getRoleOption() {
            _api.get('/companyRole/list').then((res) => {
                if (res.code == 200) {
                    res.data.forEach((element) => {
                        let obj = {
                            text: element.name,
                            id: element.id,
                        };
                        this.roleOption.push(obj);
                    });
                }
            });
        },
        // 直接修改员工启用停用状态
        updateStatus(status) {
            let msg = status === '0' ? '是否确认停用该成员？' : '是否确认启用该成员？';
            _g.confirmMsg('', msg, true, () => {
                _api.put('/employee/status/update', {
                    unionId: this.unionId,
                    status: status,
                }).then((res) => {
                    if (res.code !== 200) {
                        _g.toastMsg('fail', res.message);
                        return;
                    }
                    this.status = status;
                    _g.toastMsg('success', '操作成功', 1500);
                });
            });
        },
    },
};
</script>

<style scoped>
.bottom50 {
    bottom: 40px;
}
.naruto-name {
    font-size: 21px;
    font-weight: 500;
    color: #383838;
    padding-left: 20px;
}
.role-name {
    color: #b7b7b7;
    font-size: 14px;
}
.naruto-box {
    width: 100%;
    margin-top: 25px;
}
.equipment_number {
    margin-top: 10px;
    padding-left: 20px;
    font-size: 14px;
}
.isEnabled {
    color: #2cb941;
}
.isDisabled {
    color: #ad5550;
}
.dotter {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    margin-right: 5px;
}
.dotIsEnabled {
    background-color: #2cb941;
}
.dotIsDisabled {
    background-color: #ad5550;
}
.status-box {
    margin-top: 24px;
    width: 100%;
    text-align: center;
    cursor: pointer;
}
.close_button {
    width: 42px;
}
.close_text {
    color: #e47777;
    font-size: 14px;
    margin-top: 6px;
}
.open_text {
    color: #2cb941;
    font-size: 14px;
    margin-top: 6px;
}
</style>
