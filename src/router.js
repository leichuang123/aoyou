import Vue from "vue";
import Router from "vue-router";
import Home from "Eviews/Home.vue";
import Error from "Eviews/Error.vue";

/**
 * 引入二级路由
 *
 * 为便于维护，相应子级路由放在不同的文件中维护
 *
 *
 */

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            component: Home,
            meta: {
                title: "首页"
            },
            redirect: "/customer-home",
            children: [
                {
                    path: "customer-home",
                    name: "CustomerHome",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Eviews/empl/CustomerHome.vue"
                        ),
                    meta: {
                        title: "设备管理"
                    }
                },
                {
                    path: "management-equipment",
                    name: "ManagementEquipment",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Eviews/empl/ManagementEquipment.vue"
                        ),
                    meta: {
                        title: "企业"
                    }
                },
                {
                    path: "my-equipment",
                    name: "MyEquipment",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Eviews/empl/MyEquipment.vue"
                        ),
                    meta: {
                        title: "设备列表"
                    }
                },
                {
                    path: "use-restriction",
                    name: "UseRestriction",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Eviews/empl/UseRestriction.vue"
                        ),
                    meta: {
                        title: "使用限制"
                    }
                },
                {
                    path: "naruto",
                    name: "Naruto",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Eviews/empl/Naruto.vue"
                        ),
                    meta: {
                        title: "成员"
                    }
                },
                {
                    path: "naruto-detail",
                    name: "NarutoDetail",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Eviews/empl/NarutoDetail.vue"
                        ),
                    meta: {
                        title: "成员详情"
                    }
                },
                {
                    path: "role-list",
                    name: "RoleList",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Eviews/empl/RoleList.vue"
                        ),
                    meta: {
                        title: "角色"
                    }
                },
                {
                    path: "edit-role",
                    name: "EditRole",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Eviews/empl/EditRole.vue"
                        ),
                    meta: {
                        title: "编辑角色"
                    }
                },
                {
                    path: "edit-role-permissions",
                    name: "EditRolePermissions",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Eviews/empl/EditRolePermissions.vue"
                        ),
                    meta: {
                        title: "角色权限"
                    }
                },
                {
                    path: "refresh",
                    name: "Refresh",
                    component: () =>
                        import(
                            /* webpackChunkName: "empl-base" */ "Ecomponents/Refresh.vue"
                        ),
                    meta: {
                        title: ""
                    }
                }
            ]
        },

        {
            path: "*",
            component: Error,
            name: "error"
        }
    ]
});
