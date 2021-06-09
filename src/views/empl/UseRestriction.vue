<template>
    <div>
        <div class="scroll-white bottom50">
            <div class="isFlex">
                <van-radio-group v-model="strategy">
                    <van-cell-group class="equipment_grid">
                        <van-cell title="指定使用者，限定服务" clickable @click="setUseRestrictionType('1')">
                            <template #icon>
                                <van-radio name="1" class="marl10" checked-color="#5298f9" />
                            </template>
                            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                            <template #right-icon>
                                <van-icon name="warning-o" class="warning-info" />
                            </template>
                        </van-cell>
                        <van-cell title="不指定使用者，不限定服务" @click="setUseRestrictionType('0')">
                            <template #icon>
                                <van-radio name="0" class="marl10" checked-color="#5298f9" />
                            </template>
                            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                            <template #right-icon>
                                <van-icon name="warning-o" class="warning-info" />
                            </template>
                        </van-cell>
                        <van-cell title="免密" @click="setUseRestrictionType('2')">
                            <template #icon>
                                <van-radio name="2" class="marl10" checked-color="#5298f9" />
                            </template>
                            <!-- 使用 right-icon 插槽来自定义右侧图标 -->
                            <template #right-icon>
                                <van-icon name="warning-o" class="warning-info" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
            <div class="tips" v-if="strategy">
                {{strategy==1?'说明：只有指定的成员才能够使用这台盒子，当指定成员，用其他账户密码登录之后，使用的服务为当初在该设备上激活的服务。':strategy==0?"说明：任何人都可以使用此设备进行登录，登录之后，可见到所有关联该账户的服务，主要为激活所关联的。":" 说明：启动该设备，无需登录即可使用，使用的服务为当初在该设备上激活的服务。"}}
            </div>
            <div class="button-box">
                <van-button type="default" class="join_equipment_ground" @click="sureSetUseRestriction">确定</van-button>
            </div>
        </div>
    </div>
</template>
<script>
import { dingDingSelectTreeMixin } from '@/assets/js/selectDDUserAndDepartment.js';

export default {
    name: 'UseRestriction',
    mixins: [dingDingSelectTreeMixin],
    components: {},
    data() {
        return {
            strategy: '',
            deviceNo: '',
        };
    },
    mounted() {
        this.deviceNo = this.$route.query.deviceNo;
        this.getDetail();
    },
    methods: {
        // 获取该设备已经设置过的类型数据
        getDetail() {
            _api.get('/company/device/strategyInfo', { deviceNo: this.deviceNo }).then((res) => {
                if (res.code == 200) {
                    this.deviceNo = res.data.deviceNo;
                    this.strategy = res.data.strategy.toString();
                    this.employeddIds = !res.data.employeeIds ? [] : res.data.employeeIds;
                    this.departmentIds = !res.data.departmentIds ? [] : res.data.departmentIds;
                }
            });
        },
        // 切换设备类型
        setUseRestrictionType(type) {
            this.strategy = type;
            // 如果为指定使用者，限定服务 类型，则调用钉钉sdk选择对应的人
            if (type === '1') {
                this.selectUser();
            }
        },
        // 调用钉钉sdk展示选择人和部门
        selectUser() {
            this.selectCorporateDepartmentsAndUsers();
        },
        // 确认设置设备使用类型
        sureSetUseRestriction() {
            if (this.strategy == '1' && [...this.departmentIds, ...this.employeddIds].length == 0) {
                _g.toastMsg('fail', '请指定使用者！', 1500);
                return;
            }
            let params = {
                strategy: parseInt(this.strategy),
                deviceNo: this.deviceNo,
                departmentIds: this.departmentIds,
                employeeIds: this.employeddIds,
            };
            _g.confirmMsg('', '您确定修改使用限制，修改之后，\n盒子重启可生效！', true, () => {
                _api.post('/company/batchEmployeeAndDevice', params).then((res) => {
                    if (res.code !== 200) {
                        _g.toastMsg('fail', res.message);
                        return;
                    }
                    // 设置成功调回设备列表界面
                    _g.toastMsg('success', '操作成功', 1500, false, () => {
                        this.$router.push('/my-equipment');
                    });
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
.isFlex {
    display: flex;
    justify-content: center;
    margin-top: -37px;
}
.equipment_grid {
    width: 330px;
    height: 135px;
    background: #ffffff;
    border: 1px solid #c6c6c6;
    border-radius: 13px;
    margin-top: 44px;
    overflow: hidden;
}
.marl10 {
    margin-right: 10px;
}
.warning-info {
    color: #ee0a24;
    padding-top: 6px;
}
.tips {
    color: #ee0a24;
    font-size: 12px;
    width: 320px;
    margin: 10px auto;
    line-height: 18px;
}
.button-box {
    width: 100%;
    position: absolute;
    overflow: hidden;
    text-align: center;
    left: 0;
    bottom: 80px;
}
.join_equipment_ground {
    width: 119px;
    height: 29px;
    opacity: 1;
    background: #ffffff;
    border: 1px solid #5298f9;
    color: #5298f9;
    border-radius: 19px;
    font-size: 12px;
}
</style>
