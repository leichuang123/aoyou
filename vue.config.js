const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}
// 是否为生产环境
const isProd = process.env.NODE_ENV === "production";

module.exports = {
    pages: {
        // 企业管理后台钉钉H5移动端页面
        empl: {
            // page 的入口
            entry: "src/main.js",
            // 模板来源
            template: "public/empl.html",
            // 在 dist/index.html 的输出
            filename: "empl.html",
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ["chunk-common", "chunk-vendors", "empl"]
        }
    },
    // 发布，静态文件输出目录
    assetsDir: "empl-js",
    devServer: {
        // 请求代理
        proxy: {
            "/api": {
                target: process.env.VUE_APP_HOST,
                //target:'localhost:8080',
                changeOrigin: true,
                logLevel: "debug",
                pathRewrite: {
                    "^/api": ""
                }
            },
            "/images": {
                target: process.env.VUE_APP_HOST,
                //target:'localhost:8080',
                changeOrigin: true,
                logLevel: "debug"
            },
            "/uploads": {
                target: process.env.VUE_APP_HOST,
                //target:'localhost:8080',
                changeOrigin: true,
                logLevel: "debug"
            }
        },
        openPage: "empl",
        // 禁用主机检查
        disableHostCheck: true
    },
    // 生产环境不产生map文件
    productionSourceMap: false,
    chainWebpack: config => {
        config.resolve.alias
            .set("@$", resolve("src"))
            .set("Ecomponents", resolve("src/components"))
            .set("Eviews", resolve("src/views"));
    },
    configureWebpack: config => {
        // 生产环境打包优化
        if (isProd) {
            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        vendors: {
                            name: "chunk-vendors",
                            test: /[\\/]node_modules[\\/]/,
                            priority: -10,
                            chunks: "initial"
                        },
                        default: {
                            name: "chunk-common",
                            minChunks: 2,
                            priority: -20,
                            reuseExistingChunk: true,
                            chunks: "initial"
                        }
                    }
                }
            };
        }
    }
};
