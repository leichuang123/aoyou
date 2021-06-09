<template>
    <div>
        <div class="scroll-white bottom50">
            <div class="isFlex">
                <van-checkbox-group v-model="rolePermission">
                    <van-cell-group class="equipment_grid">
                        <van-cell v-for="(item, index) in pagePermission" clickable :key="item.id" :title="item.name" @click="toggle(index)">
                            <template #icon>
                                <van-checkbox :name="item.id" ref="checkboxes" style="margin-right:10px" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-checkbox-group>
            </div>
            <div class="button-box">
                <van-button type="default" class="join_equipment_ground" @click="saveRolePermissions">确定</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'EditRolePermissions',
    data() {
        return {
            pagePermission: [],
            rolePermission: [],
            roleId: 0,
        };
    },
    created() {
        this.roleId = this.$route.query.roleId;
    },
    mounted() {
        this.getAllPermissions();
    },
    methods: {
        // 获取角色已有的权限
        getRoleDetail() {
            _api.post('/companyRoleResource/roleHaveResourceList', { roleId: this.roleId }).then((res) => {
                if (res.code == 200) {
                    this.rolePermission = res.data.map((item) => {
                        return item.id;
                    });
                    return;
                }
                _g.toastMsg('fail', res.message);
            });
        },
        // 获取所有权限展示
        getAllPermissions() {
            _api.get('/companyResource/child/list').then((res) => {
                if (res.code == 200) {
                    this.pagePermission = res.data;
                    this.getRoleDetail();
                    return;
                }
                _g.toastMsg('fail', res.message);
            });
        },
        // 权限多选
        toggle(index) {
            this.$refs.checkboxes[index].toggle();
        },
        // 保存编辑角色权限
        saveRolePermissions() {
            _g.confirmMsg('', '是否确认修改该角色权限？', true, () => {
                let updateParams = {
                    roleId: this.roleId,
                    resourceIdList: this.rolePermission,
                };
                _api.post('/companyRoleResource/endowResource', updateParams).then((res) => {
                    if (res.code !== 200) {
                        _g.toastMsg('fail', res.message);
                        return;
                    }
                    // 角色权限设置成功跳完主页
                    _g.toastMsg('success', '操作成功', 1500);
                    this.$router.push('/management-equipment');
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
    min-height: 135px;
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
    padding-top: 6px;
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
