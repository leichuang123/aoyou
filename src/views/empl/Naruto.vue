<template>
    <div>
        <div class="scroll-white bottom50">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list class="equipment_box" v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished" finished-text="暂无更多数据" @load="onLoad">
                    <van-cell-group style="width:100%">
                        <van-cell v-for="(equipmentItem,index) in narutoList" :key="index" clickable :title="equipmentItem.name" @click="setNaruto(equipmentItem)">
                            <template #icon>
                                <img src="../../assets/image/person.png" class="person-icon" />
                            </template>
                            <template #right-icon>
                                <div class="equipment_number" :class="equipmentItem.status?'isEnabled':'isDisabled'">
                                    <i class="dotter" :class="equipmentItem.status?'dotIsEnabled':'dotIsDisabled'"></i>
                                    {{equipmentItem.status?'启用中':'禁用中'}}
                                </div>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Naruto',
    components: {},
    data() {
        return {
            searchData: {
                name: '',
            },
            narutoList: [],
            departmentIds: [],
            employeddIds: [],
            currentPage: 1,
            totalPage: 1,
            loading: false,
            finished: true,
            error: false,
            refreshing: false,
        };
    },
    mounted() {
        if (this.$route.query.departmentIds) {
            let departmentIds = this.$route.query.departmentIds;
            this.initData(departmentIds, 'departmentIds');
        }
        if (this.$route.query.employeddIds) {
            let employeddIds = this.$route.query.employeddIds;
            this.initData(employeddIds, 'employeddIds');
        }
        this.getNarutoList();
    },
    computed: {
        // 分页参数
        pageSize() {
            return this.$store.state.pageSize;
        },
    },
    methods: {
        // 点击查看成员详情
        setNaruto(row) {
            this.$router.push({
                path: '/naruto-detail',
                query: {
                    name: row.name,
                    status: row.status,
                    roleName: row.roleName,
                    mobile: row.mobile,
                    unionId: row.unionId,
                    roleId: row.roleList ? row.roleList[0].id : 0,
                },
            });
        },
        // 搜索栏搜索
        onSearch() {
            this.currentPage = 1;
            this.narutoList = [];
            //this.getNewsList();
        },
        // 根据已选的部门和成员获取列表数据
        getNarutoList() {
            let parmas = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                departmentIds: this.departmentIds,
                employeeIds: this.employeddIds,
            };
            this.loading = false;
            this.refreshing = false;
            _api.post('/employee/mobile/ding/listByPage', parmas).then((res) => {
                if (res.code == 200) {
                    this.narutoList = [...this.narutoList, ...res.data.dataList];
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
            this.getNarutoList();
        },
        // 上拉刷新列表
        onRefresh() {
            this.totalPage = 1;
            // 清空列表数据
            this.refreshing = true;
            this.currentPage = 1;
            this.narutoList = [];
            this.getNarutoList();
        },
        // 根据数据类型保存初始化数据
        initData(current, target) {
            if (typeof current === 'object') {
                this[target] = current;
            } else {
                this[target].push(current);
            }
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
    min-height: 93px;
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
.person-icon {
    width: 20px;
    height: 20px;
    margin-right: 18px;
}
.equipment_item_inner {
    margin-bottom: 11px;
}
.equipment_number {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 11px;
    font-family: PingFangSC, PingFangSC-Semibold;
    text-align: center;
    color: #a9a9a9;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.join_equipment_ground {
    width: 119px;
    height: 29px;
    opacity: 1;
    background: #ffffff;
    border: 1px solid #5298f9;
    border-radius: 19px;
    color: #4e9ffb;
    font-size: 11px;
}
.mart28 {
    position: absolute;
    right: 15px;
    bottom: 12px;
}
.isFlex {
    display: flex;
    justify-content: space-between;
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
.isDisabled {
    color: #ad5550;
}
.isConfirmed {
    color: #505ead;
}
.isEdit {
    color: #757575;
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
.dotIsConfirmed {
    background-color: #505ead;
}
</style>
