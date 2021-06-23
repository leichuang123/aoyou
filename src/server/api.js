import axios from "axios";
import VueCookies from "vue-cookies";
import { Toast } from "vant";

// 请求拦截器
axios.interceptors.request.use(
    config => {
        //加载动画
        _g.toastMsg("loading", "加载中");
        let token =
            VueCookies.get("userToken") || localStorage.getItem("userToken");
        if (token) {
            // 设置统一的请求header
            config.headers.token = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// 响应拦截器
axios.interceptors.response.use(
    response => {
        Toast.clear(); //关闭加载动画
        // token过期或者缺失
        if (response.data.code == 401 || response.data.code == 1000) {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userInfo");
            VueCookies.remove("userToken");
            VueCookies.remove("userInfo");
            _g.toastMsg("fail", "当前登录已失效！", 1500, false, () => {
                router.push("/customer-home"); //让用户从新回到登录页面
            });
            return;
        }
        return response;
    },
    error => {
        Toast.clear(); // 关闭加载动画
        return Promise.resolve(error.response);
    }
);
function checkStatus(response) {
    return new Promise((resolve, reject) => {
        if (
            response &&
            (response.status === 200 ||
                response.status === 304 ||
                response.status === 400)
        ) {
            resolve(response.data);
        } else {
            return response
                ? _g.confirmMsg("", JSON.stringify(response), true)
                : null;
        }
    });
}
export default {
    /**
     * 发送POST请求
     *
     * @param {string} url 请求地址
     * @param {object} data 提交数据
     */
    post(url, data) {
        return axios.post(url, data).then(response => {
            return checkStatus(response);
        });
    },
    /**
     * 发送GET请求
     *
     * @param {string} url 请求地址
     * @param {object} data 提交数据
     */
    get(url, params) {
        const data = {
            params: params
        };
        return axios.get(url, data).then(response => {
            return checkStatus(response);
        });
    },
    /**
     * 发送PUT请求
     *
     * @param {string} url 请求地址
     * @param {object} data 提交数据
     */
    put(url, data) {
        return axios.put(url, data).then(response => {
            return checkStatus(response);
        });
    }
};
