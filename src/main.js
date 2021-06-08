import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import _api from "./server/api";
import _ from "lodash";
import _g from "./global";
import filter from "./filter";
import directive from "./directive";
import "amfe-flexible";
import "vant/lib/index.css";
import "@/assets/css/own.less";
import {
    Row,
    Col,
    Cell,
    CellGroup,
    Button,
    Field,
    Toast,
    Dialog,
    Radio,
    RadioGroup,
    Checkbox,
    CheckboxGroup,
    Icon,
    List,
    PullRefresh,
    Switch
} from "vant";
Vue.use(Row)
    .use(Col)
    .use(Cell)
    .use(CellGroup)
    .use(Button)
    .use(Field)
    .use(Toast)
    .use(Radio)
    .use(RadioGroup)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Icon)
    .use(List)
    .use(PullRefresh)
    .use(Switch)
    .use(Dialog);

window._ = _;
window.axios = axios;
window._api = _api;
window._g = _g;
window.router = router;
// host根据本机配置自行定义
window.HOST = window.location.protocol + "//" + window.location.host;
// axios全局配置
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.headers["Content-Type"] = "application/json";
// 统一调用前缀，根据实际项目情况配置
let baseURL = window.HOST + process.env.VUE_APP_API_PRE;
window.axios.defaults.baseURL = baseURL;
window._api.baseURL = baseURL;

Vue.config.productionTip = false;

//全局实例
const bus = new Vue();
window.bus = bus;

// 页面切换时修改网页标题
router.beforeEach(function(to, from, next) {
    // 设置标题
    document.title = to.meta.title || store.state.itemTitle;

    next();
});

new Vue({
    router,
    store,
    filters: filter,
    directive: directive,
    render: h => h(App)
}).$mount("#app");
