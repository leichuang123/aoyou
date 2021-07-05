<template>
    <div>
        <div class="scroll-white bottom50">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list class="equipment_box" v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished" finished-text="暂无更多数据" @load="onLoad">
                    <div class="equipment_item" v-for="(equipmentItem,index) in equipmentList" :key="equipmentItem.deviceNo">
                        <div class="equipment_item_inner">
                            盒子串号：{{equipmentItem.deviceNo}}
                        </div>
                        <div class="equipment_item_inner">
                            绑定手机：{{equipmentItem.mobile}}
                        </div>
                        <div class="equipment_item_inner">
                            激活码：{{equipmentItem.code}}
                        </div>
                        <div class="equipment_item_inner">
                            激活时间：{{equipmentItem.activateTime}}
                        </div>
                        <div class="button-box">
                            <van-button type="default" style="width:50%;border-left:none;border-right:none;border-bottom:none" class="isEnabled" @click="setUseRestriction(equipmentItem.deviceNo)">使用限制</van-button>
                            <van-button type="default" style="width:50%;border-right:none;border-bottom:none" class="isEdit" @click="deleteEquipment(equipmentItem.deviceNo,index)">删除设备</van-button>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MyEquipment',
    components: {},
    data() {
        return {
            equipmentList: [],
            currentPage: 1,
            totalPage: 1,
            loading: false,
            finished: true,
            error: false,
            refreshing: false,
        };
    },
    mounted() {
        this.getEquipmentList();
    },
    computed: {
        // 分页参数
        pageSize() {
            return this.$store.state.pageSize;
        },
    },
    methods: {
        // 设置使用限制
        setUseRestriction(deviceNo) {
            this.$router.push({
                path: '/use-restriction',
                query: {
                    deviceNo: deviceNo,
                },
            });
        },
        // 删除设备
        deleteEquipment(deviceNo, index) {
            _g.confirmMsg('', '您确定删除该设备吗？', true, () => {
                _api.get('/company/deleteByDeviceNo', { deviceNo: deviceNo }).then((res) => {
                    if (res.code !== 200) {
                        _g.toastMsg('fail', res.message);
                        return;
                    }
                    _g.toastMsg('success', '删除成功', 1500, false, () => {
                        this.equipmentList.splice(index, 1);
                    });
                });
            });
        },
        // 获取角色列表
        getEquipmentList() {
            let parmas = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
            };
            this.loading = false;
            this.refreshing = false;
            _api.post('/company/companyDeviceList', parmas).then((res) => {
                if (res.code == 200) {
                    this.equipmentList = [...this.equipmentList, ...res.data.dataList];
                    this.totalPage = res.data.page.totalPage;
                    if (res.data.page.currentPage >= res.data.page.totalPage) {
                        this.finished = true;
                    } else {
                        this.finished = false;
                    }
                    return;
                }
                _g.toastMsg('fail', res.message);
            });
        },
        // 下拉加载更多
        onLoad() {
            if (this.currentPage >= this.totalPage) {
                return;
            }
            this.currentPage++;
            this.getEquipmentList();
        },
        // 上拉刷新列表
        onRefresh() {
            this.totalPage = 1;
            // 清空列表数据
            this.refreshing = true;
            this.currentPage = 1;
            this.equipmentList = [];
            this.getEquipmentList();
        },
    },
};
</script>

<style scoped>
.bottom50 {
    bottom: 40px;
}
.equipment_box {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
}
.equipment_item {
    width: 330px;
    min-height: 157px;
    opacity: 1;
    background: #ffffff;
    border: 1px solid #c6c6c6;
    border-radius: 13px;
    margin-bottom: 27px;
    font-size: 11px;
    color: #383838;
    box-sizing: border-box;
    padding: 17px 26px 0 26px;
    position: relative;
    overflow: hidden;
}
.equipment_item_inner {
    margin-bottom: 11px;
    display: flex;
}
.item_inner_tit {
    width: 90px;
}
.equipment_number {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 11px;
    font-family: PingFangSC, PingFangSC-Semibold;
    text-align: center;
    color: #a9a9a9;
}
.button-box {
    display: flex;
    justify-content: flex-start;
    background: #c6c6c6;
    margin-left: -25px;
    margin-right: -25px;
    border-radius: 13px;
}
.isEnabled {
    color: #2cb941;
}
</style>
