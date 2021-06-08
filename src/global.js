/**
 * 全局函数
 */
import * as dd from "dingtalk-jsapi";
const commonFn = {
    /**
     * 钉钉loading，需要在钉钉环境中使用
     * @param {String} loadingText 钉钉loading文字
     */
    ddLoading(loadingText = "加载中") {
        dd.device.notification.showPreloader({
            text: loadingText,
            showIcon: true
        });
    },
    /**
     * 钉钉loading关闭，需要在钉钉环境中使用
     */
    ddLoadingClear() {
        dd.device.notification.hidePreloader({});
    },
    /**
     * 钉钉消息提示框，需要在钉钉环境中使用
     * @param {String} title 钉钉消息提示框标题
     * @param {String} message 钉钉消息提示框文本内容
     * @param {String} buttonName 按钮名称
     * @param {Function} successCallback 点击确认按钮成功回调
     * @param {Function} errorCallback  点击确认按钮异常捕获
     */
    ddAlertMsg(
        title = "",
        message,
        buttonName = "确定",
        successCallback,
        errorCallback
    ) {
        dd.device.notification.alert({
            message: message,
            title: title,
            buttonName: buttonName,
            onSuccess: function() {
                if (typeof callback == "function") {
                    successCallback();
                }
            },
            onFail: function(err) {
                if (typeof callback == "function") {
                    errorCallback();
                }
            }
        });
    },
    /**
     * 钉钉消息确认框，需要在钉钉环境中使用
     * @param {String} title 钉钉消息确认框标题
     * @param {String} message 钉钉消息确认框文本内容
     * @param {Array} buttonLabels  按钮组名称
     * @param {Function} successCallback 点击按钮成功回调
     * @param {Function} errorCallback  点击确认按钮异常捕获
     */
    ddConfirmAlert(
        title = "",
        message,
        buttonLabels = ["确定", "取消"],
        successCallback,
        errorCallback
    ) {
        dd.device.notification.confirm({
            message: message,
            title: title,
            buttonLabels: buttonLabels,
            onSuccess: function(result) {
                if (typeof callback == "function") {
                    successCallback(result.buttonIndex);
                }
            },
            onFail: function(err) {
                if (typeof callback == "function") {
                    errorCallback();
                }
            }
        });
    },
    /**
     * 钉钉轻提示，需要在钉钉环境中使用
     * @param {String} text 钉钉轻提示内容
     * @param {Number} duration 钉钉轻提示持续事件
     * @param {Function} callBack  轻提示回调函数
     */
    ddToast(text, duration, callBack) {
        dd.device.notification.toast({
            icon: "",
            text: text, //提示信息
            duration: duration, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
            delay: 0, //延迟显示，单位秒，默认0
            onSuccess: function() {
                if (typeof callback == "function") {
                    callBack();
                }
            }
        });
    },
    /**
     * vant ui 提示
     * @param {String} type 可选值为loading/success/fail/html
     * @param {String} msg 文本内容，支持通过\n换行
     * @param {Number} time 停留时间，默认3秒消失
     * @param {Boolean} mask 是否显示背景遮罩层
     * @param {Function} callback
     */
    toastMsg(type = "success", msg, time = 3000, mask = false, callback) {
        return bus.$toast({
            type: type,
            message: msg,
            duration: time,
            mask: mask ? mask : false,
            onClose: function() {
                if (typeof callback == "function") {
                    callback();
                }
            }
        });
    },
    /**
     * vant ui 确认框
     * @param {String} title 确认框标题
     * @param {String} message 内容，支持通过\n换行
     * @param {Boolean} showCancelButton 是否显示取消按钮
     * @param {Function} success 点击确认按钮回调
     * @param {Function} cancel 点击取消按钮回调
     * @param {String} confirmButtonColor 确定按钮颜色
     */
    confirmMsg(
        title,
        message,
        showCancelButton,
        success,
        cancel,
        confirmButtonColor = "#57968B",
    ) {
        bus.$dialog({
            title: title,
            message: message,
            showCancelButton: showCancelButton ? showCancelButton : false,
            confirmButtonColor: confirmButtonColor,
            confirmButtonText: "确定"
        })
            .then(() => {
                if (typeof success == "function") {
                    success();
                }
            })
            .catch(() => {
                if (typeof cancel == "function") {
                    cancel();
                }
            });
    },
    /**
     * 表单验证
     */
    validationRule: {
        /**
         * 手机号码
         *
         * @param {string} val
         * @returns bool
         */
        chinaMobileNumber(val) {
            return /^1[3456789]\d{9}$/.test(val);
        },
        /**
         * 身份证号码
         *
         * @param {string} val
         * @returns bool
         */
        chinaIdCard(value) {
            /// 18位 xxxxxx yyyy MM dd 75 0
            let idCard18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
                value
            );
            // 15位 xxxxxx yy MM dd 75 0
            let idCard15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(
                value
            );
            return idCard18 || idCard15;
        }
    },
    /**
     * @todo 将对象转成字符串params
     *
     * @param {object} obj
     * @returns {string} 解析后的string params
     */
    stringifyQuery(obj) {
        const encodeReserveRE = /[!'()*]/g;
        const encodeReserveReplacer = c => "%" + c.charCodeAt(0).toString(16);
        const commaRE = /%2C/g;
        const encode = str =>
            encodeURIComponent(str)
                .replace(encodeReserveRE, encodeReserveReplacer)
                .replace(commaRE, ",");

        const res = obj
            ? Object.keys(obj)
                  .map(key => {
                      const val = obj[key];

                      if (val === undefined) {
                          return "";
                      }
                      if (val === null) {
                          return encode(key);
                      }

                      if (Array.isArray(val)) {
                          const result = [];
                          val.forEach(val2 => {
                              if (val2 === undefined) {
                                  return;
                              }
                              if (val2 === null) {
                                  result.push(encode(key));
                              } else {
                                  result.push(encode(key) + "=" + encode(val2));
                              }
                          });
                          return result.join("&");
                      }

                      return encode(key) + "=" + encode(val);
                  })
                  .filter(x => x.length > 0)
                  .join("&")
            : null;
        return res ? `?${res}` : "";
    },
    /**
     * 日期格式化，只支持：yyyy mm dd hh ii ss 格式
     * 格式化参数见：https://www.php.net/manual/zh/function.date.php
     * 简化自：http://locutus.io/php/datetime/date/
     *
     *
     * @param {string} format
     * @param {int} timestamp
     * @return {string}
     */
    formatDate(format = "Y-m-d", timestamp) {
        var jsdate, f;
        // trailing backslash -> (dropped)
        // a backslash followed by any character (including backslash) -> the character
        // empty string -> empty string
        var formatChr = /\\?(.?)/gi;
        var formatChrCb = function(t, s) {
            return f[t] ? f[t]() : s;
        };
        var _pad = function(n, c) {
            n = String(n);
            while (n.length < c) {
                n = "0" + n;
            }
            return n;
        };
        f = {
            // Day
            d: function() {
                // Day of month w/leading 0; 01..31
                return _pad(f.j(), 2);
            },

            j: function() {
                // Day of month; 1..31
                return jsdate.getDate();
            },

            m: function() {
                // Month w/leading 0; 01...12
                return _pad(f.n(), 2);
            },

            n: function() {
                // Month; 1...12
                return jsdate.getMonth() + 1;
            },

            Y: function() {
                // Full year; e.g. 1980...2010
                return jsdate.getFullYear();
            },

            g: function() {
                // 12-Hours; 1..12
                return f.G() % 12 || 12;
            },
            G: function() {
                // 24-Hours; 0..23
                return jsdate.getHours();
            },

            H: function() {
                // 24-Hours w/leading 0; 00..23
                return _pad(f.G(), 2);
            },
            i: function() {
                // Minutes w/leading 0; 00..59
                return _pad(jsdate.getMinutes(), 2);
            },
            s: function() {
                // Seconds w/leading 0; 00..59
                return _pad(jsdate.getSeconds(), 2);
            }
        };

        var _date = function(format, timestamp) {
            jsdate =
                timestamp === undefined
                    ? new Date() // Not provided
                    : timestamp instanceof Date
                    ? new Date(timestamp) // JS Date()
                    : new Date(timestamp); // JS timestamp
            return format.replace(formatChr, formatChrCb);
        };

        return _date(format, timestamp);
    }
};

export default commonFn;
