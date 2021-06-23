<template>
    <div>
        <div class="scroll-white bottom50">
            <div class="isFlex">
                <van-cell-group class="equipment_grid">
                    <van-cell title="状态" clickable>
                        <template #right-icon>
                            <van-switch v-model="roleForm.status" :active-value='1' :inactive-value='0' size='16px' style="margin-top:4px" />
                        </template>
                    </van-cell>
                    <van-field label="角色名称" label-class='label-color' v-model="roleForm.name" placeholder="输入角色名称" input-align="right" />
                    <van-cell title="角色说明" :border='false'>
                    </van-cell>
                    <van-field v-model="roleForm.description" rows="8" autosize type="textarea" placeholder="输入文字说明..." />
                </van-cell-group>
            </div>
            <div class="button-box">
                <van-button type="default" class="join_equipment_ground" @click="saveEdit">确定</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'EditRole',
    data() {
        return {
            roleForm: {
                name: '',
                status: 1,
                description: '',
                id: 0,
                companyCode: '',
                createTime: null,
                sort: 0,
            },
            isAddRole: false,
        };
    },
    mounted() {
        if (!this.$route.query.roleId) {
            this.isAddRole = true;
            return;
        }
        this.getRoleDetail();
    },
    methods: {
        // 获取角色详情
        getRoleDetail() {
            let roleId = this.$route.query.roleId;
            _api.get('/companyRole/getById', { id: roleId }).then((res) => {
                if (res.code !== 200) {
                    _g.toastMsg('fail', res.message);
                    return;
                }
                this.roleForm = res.data;
            });
        },
        // 新增角色
        addThisRole() {
            let addParams = {
                name: this.roleForm.name,
                description: this.roleForm.description,
                status: this.roleForm.status,
            };
            _api.post('/companyRole/create', addParams).then((res) => {
                if (res.code !== 200) {
                    _g.toastMsg('fail', res.message);
                    return;
                }
                _g.toastMsg('success', '操作成功', 1500, false, () => {
                    this.$router.push('/role-list');
                });
            });
        },
        // 保存编辑角色
        saveEdit() {
            if (this.roleForm.name == '') {
                return _g.toastMsg('fail', '请填写角色名称！', 1500);
            }
            if (this.isAddRole) {
                this.addThisRole();
                return;
            }
            _g.confirmMsg('', '是否确认修改该角色？', true, () => {
                let updateParams = {
                    id: this.roleForm.id,
                    name: this.roleForm.name,
                    description: this.roleForm.description,
                    status: this.roleForm.status,
                };
                _api.post('/companyRole/update', updateParams).then((res) => {
                    if (res.code !== 200) {
                        _g.toastMsg('fail', res.message);
                        return;
                    }
                    _g.toastMsg('success', '操作成功', 1500, false, () => {
                        this.$router.push('/role-list');
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
