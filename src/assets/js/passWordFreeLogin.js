import * as dd from "dingtalk-jsapi";
import store from "../../store";

const passWordFreeLogin = {
    corpId: "",
    authCode: "",
    // 根据企业id调用钉钉免密流程获取临时凭证
    getAuthCodeByCorpId() {
        this.corpId = store.getters.getCorpId || localStorage.getItem("corpId");
        // 先判断是否是在钉钉中运行此应用
        if (dd.env.platform === "notInDingTalk") {
            _g.toastMsg("fail", "请在钉钉中访问本应用！");
            return false;
        }
        var _that = this;
        dd.ready(() => {
            dd.runtime.permission.requestAuthCode({
                corpId: corpId, // 企业id
                onSuccess: function(info) {
                    _that.authCode = info.code;
                },
                onFail: function(err) {
                    _g.toastMsg("fail", JSON.stringify(err));
                }
            });
        });
        return _that.authCode;
    },
    // 通过临时凭证获取token
    async getUserInfoByCode() {
        let loginParam = {
            corpId: this.corpId,
            authCode: await this.getAuthCodeByCorpId()
        };
        if (!this.authCode) {
            return;
        }
        let loginUrl =
            "/login/dingtalk/autoLogin" + _g.stringifyQuery(loginParam);
        _api.post(loginUrl).then(res => {
            if (res.code != 200) {
                _g.toastMsg("fail", res.message);
                return;
            }
            store.dispatch("cacheToken", res.data.token);
            return new Promise((resolve, reject) => {
                resolve(res.data.token);
            });
        });
    }
};

export { passWordFreeLogin };
