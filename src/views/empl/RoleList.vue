<template>
    <div>
        <div class="scroll-white bottom50">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list class="equipment_box" v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished" finished-text="暂无更多数据" @load="onLoad">
                    <div class="equipment_item" v-for="(equipmentItem,index) in roleList" :key="index">
                        <div class="equipment_number" :class="equipmentItem.status?'isEnabled':'isDisabled'">
                            <i class="dotter" :class="equipmentItem.status?'dotIsEnabled':'dotIsDisabled'"></i>
                            {{equipmentItem.status?'可用':'禁用'}}
                        </div>
                        <div class="equipment_item_inner">
                            名称：{{equipmentItem.name}}
                        </div>
                        <div class="equipment_item_inner">
                            角色说明：{{equipmentItem.description}}
                        </div>
                        <!-- <div class="equipment_item_inner isFlex">
                            <span>加入时间：{{equipmentItem.roleName}}</span>
                        </div> -->
                        <div class="button-box">
                            <van-button type="default" style="width:50%;border-left:none;border-right:none;border-bottom:none;color: #4e9ffb;" @click="editCurrentRolePermissions(equipmentItem.id)">权限配置</van-button>
                            <van-button type="default" style="width:50%;border-right:none;border-bottom:none;color: #4e9ffb;" class="isEdit" @click="editCurrentRole(equipmentItem.id)">编辑</van-button>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
        <div class="addRole">
            <van-button type="primary" block class="equipment_button_ground" @click="addRole">添加角色</van-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'RoleList',
    components: {},
    data() {
        return {
            roleList: [],
            currentPage: 1,
            totalPage: 1,
            loading: false,
            finished: true,
            error: false,
            refreshing: false,
        };
    },
    mounted() {
        this.getRoleList();
    },
    computed: {
        // 分页参数
        pageSize() {
            return this.$store.state.pageSize;
        },
    },
    methods: {
        // 编辑角色
        editCurrentRole(roleId) {
            this.$router.push({
                path: '/edit-role',
                query: {
                    roleId: roleId,
                },
            });
        },
        // 编辑角色的权限
        editCurrentRolePermissions(roleId) {
            this.$router.push({
                path: '/edit-role-permissions',
                query: {
                    roleId: roleId,
                },
            });
        },
        // 获取角色列表
        getRoleList() {
            let parmas = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
            };
            this.loading = false;
            this.refreshing = false;
            _api.post('/companyRole/listByPage', parmas).then((res) => {
                if (res.code == 200) {
                    this.roleList = [...this.roleList, ...res.data.dataList];
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
            this.getRoleList();
        },
        // 上拉刷新列表
        onRefresh() {
            this.totalPage = 1;
            // 清空列表数据
            this.refreshing = true;
            this.currentPage = 1;
            this.roleList = [];
            this.getRoleList();
        },
        // 新增角色
        addRole() {
            this.$router.push({
                path: '/edit-role',
            });
        },
    },
};
</script>

<style scoped>
.bottom50 {
    bottom: 60px;
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
.addRole {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 20px;
    margin-top: 40px;
    display: flex;
    justify-content: center;
}
.equipment_button_ground {
    width: 50%;
}
</style>
