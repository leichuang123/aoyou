import Vue from "vue";
import Vuex from "vuex";
import VueCookies from "vue-cookies";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        // 分页参数
        pageSize: process.env.VUE_PAGE_SIZE ? process.env.VUE_PAGE_SIZE : 10,
        // 项目标题
        itemTitle: process.env.VUE_APP_NAME,
        useInfo: {},
        // 企业id
        corpId: "dingb5333b8c08fbe16b35c2f4657eb6378f",
        // 微应用id
        appId: process.env.VUE_APP_ID,
        userToken: ""
    },
    getters: {
        /**
         * 获取企业应用id
         *
         * @returns {String}
         */
        getCorpId(state) {
            return state.corpId;
        },
        /**
         * 获取微应用id
         *
         * @returns {String}
         */
        getAppId(state) {
            return state.appId;
        }
    },
    mutations: {
        /**
         * 缓存企业应用id
         */
        saveCorpId(state, corpId) {
            this.state.corpId = corpId;
            localStorage.setItem("corpId", corpId);
        },
        /**
         * 缓存Token
         */
        saveUserToken(state, data) {
            this.state.userToken = data;
            localStorage.setItem("userToken", JSON.stringify(data));
            const expire = "30d";
            VueCookies.set("userToken", data, expire);
        },
        /**
         * 缓存当前用户信息
         */
        saveUserInfo(state, data) {
            this.state.useInfo = data;
        }
    },
    actions: {
        /**
         * 异步缓存企业应用id
         */
        cacheCorpId(context, data) {
            context.commit("saveCorpId", data);
        },
        /**
         * 缓存Token
         */
        cacheToken(context, data) {
            context.commit("saveUserToken", data);
        }
    }
});
