// 引入钉钉SDK
import * as dd from "dingtalk-jsapi";
import { mapState } from "vuex";
import _api from "../../server/api";
import router from "../../router";

const dingDingSelectTreeMixin = {
    data() {
        return {
            // 选择的部门id集合
            departmentIds: [],
            // 选择的人员id集合
            employeddIds: [],
            configData: {
                agentId: "",
                corpId: "",
                timeStamp: "",
                nonceStr: "",
                signature: ""
            }
        };
    },
    computed: {
        ...mapState({
            VUE_CONFIG_URL: state => state.VUE_CONFIG_URL
        })
    },
    created() {
        this.getAuthentication();
    },
    methods: {
        // 钉钉sdk鉴权
        getAuthentication() {
            // 正式服为： window.HOST + "/empl",本地开发用内网穿透工具
            let baseUrl = window.HOST + "/empl";
            //window.HOST + "/";
            //"http://meyv67.natappfree.cc/empl";

            _api.get("/dd/common/signInfo", { url: baseUrl }).then(res => {
                if (res.code !== 200) {
                    _g.toastMsg("fail", res.message);
                    return false;
                }
                this.configData = res.data;
                let that = this;
                dd.config({
                    agentId: that.configData.agentId, // 必填，微应用ID
                    corpId: that.configData.corpId, //必填，企业ID
                    timeStamp: that.configData.timeStamp, // 必填，生成签名的时间戳
                    nonceStr: that.configData.nonceStr, // 必填，自定义固定字符串。
                    signature: that.configData.signature, // 必填，签名
                    type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
                    jsApiList: ["runtime.info", "biz.contact.complexPicker"] // 必填，需要使用的jsapi列表，注意：不要带dd。
                });
            });
        },
        //调用钉钉原生的选择企业部门和用户的api
        selectCorporateDepartmentsAndUsers() {
            // 先判断是否是在钉钉中运行此应用
            if (dd.env.platform === "notInDingTalk") {
                _g.toastMsg("fail", "请在钉钉中访问本应用！");
                return new Promise((resolve, reject) => {
                    resolve();
                });
            }
            let that = this;
            dd.ready(() => {
                dd.biz.contact.complexPicker({
                    title: "选择部门成员", //标题
                    corpId: that.configData.corpId, //企业的corpId
                    multiple: true, //是否多选
                    pickedUsers: that.employeddIds, //已选用户
                    pickedDepartments: that.departmentIds, //已选部门
                    disabledUsers: [], //不可选用户
                    disabledDepartments: [], //不可选部门
                    requiredUsers: [], //必选用户（不可取消选中状态）
                    requiredDepartments: [], //必选部门（不可取消选中状态）
                    appId: that.configData.agentId, //微应用Id，企业内部应用查看AgentId
                    permissionType: "GLOBAL", //可添加权限校验，选人权限，目前只有GLOBAL这个参数
                    responseUserOnly: false, //返回人，或者返回人和部门
                    startWithDepartmentId: 0, //仅支持0和-1
                    onSuccess: function(result) {
                        that.departmentIds = result.departments.map(
                            department => {
                                return department.id;
                            }
                        );
                        that.employeddIds = result.users.map(employedd => {
                            return employedd.emplId;
                        });
                        if (that.needJump) {
                            that.jumpToNaruto();
                        }
                    },
                    onFail: function(err) {
                        _g.toastMsg("fail", JSON.parse(err.err.errorMessage));
                    }
                });
            });
            dd.error(function(err) {
                _g.confirmMsg("", JSON.stringify(err));
            });
        },
        // 跳往成员列表
        jumpToNaruto() {
            router.push({
                path: "/naruto",
                query: {
                    departmentIds: JSON.stringify(this.departmentIds),
                    employeddIds: JSON.stringify(this.employeddIds)
                }
            });
        }
    }
};

export { dingDingSelectTreeMixin };
