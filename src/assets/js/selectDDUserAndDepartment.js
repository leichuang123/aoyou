// 引入钉钉SDK
import * as dd from "dingtalk-jsapi";
import { mapState } from "vuex";

const dingDingSelectTreeMixin = {
    data() {
        return {
            // 选择的部门id集合
            departmentIds: [],
            // 选择的人员id集合
            employeddIds: []
        };
    },
    computed: {
        ...mapState({
            currentCorpId: state => state.currentCorpId,
            currentAppId: state => state.currentAppId
        })
    },
    methods: {
        // 调用钉钉原生的选择企业部门和用户的api
        selectCorporateDepartmentsAndUsers() {
            let that = this;
            dd.biz.contact.complexPicker({
                title: "选择部门成员", //标题
                corpId: that.currentCorpId, //企业的corpId
                multiple: true, //是否多选
                limitTips: "超出了", //超过限定人数返回提示
                pickedUsers: that.employeddIds, //已选用户
                pickedDepartments: that.departmentIds, //已选部门
                disabledUsers: [], //不可选用户
                disabledDepartments: [], //不可选部门
                requiredUsers: [], //必选用户（不可取消选中状态）
                requiredDepartments: [], //必选部门（不可取消选中状态）
                appId: that.currentAppId, //微应用Id，企业内部应用查看AgentId
                permissionType: "GLOBAL", //可添加权限校验，选人权限，目前只有GLOBAL这个参数
                responseUserOnly: false, //返回人，或者返回人和部门
                startWithDepartmentId: 0, //仅支持0和-1
                onSuccess: function(result) {
                    return that.processResult(result);
                },
                onFail: function(err) {
                    _g.toastMsg("fail", JSON.parse(err.err.errorMessage));
                }
            });
            // let result = {
            //     selectedCount: 19,
            //     departments: [
            //         {
            //             number: 17,
            //             name: "技术部",
            //             id: 137212162
            //         }
            //     ],
            //     users: [
            //         {
            //             emplId: "285058470524335654",
            //             name: "徐文丽",
            //             avatar: ""
            //         },
            //         {
            //             emplId: "204718381237616286",
            //             name: "陈云勇",
            //             avatar:
            //                 "https://static.dingtalk.com/media/lADPD2eDKAAL3WTNATrNATo_314_314.jpg"
            //         }
            //     ]
            // };
            // return this.processResult(result);
        },
        // 处理已选的数据
        processResult(data) {
            this.departmentIds = data.departments.map(department => {
                return department.id;
            });
            this.employeddIds = data.users.map(employedd => {
                return employedd.emplId;
            });
            return new Promise((resolve, reject) => {
                resolve(this.departmentIds, this.employeddIds);
            });
        }
    }
};

export { dingDingSelectTreeMixin };
