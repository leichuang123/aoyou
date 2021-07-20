import React from 'react';
import { Spin, Result } from 'antd';
import './ding-code.module.scss';
export default class DingCode extends React.Component {
    state = {
        REDIRECT_URI: encodeURIComponent(window.location.origin + '/#/login'),
        suiteKey: 'suitersk0zck7yuqgp6nm',
        loginTempCode: '',
        loadCodeSuccess: false,
    };
    /**
     * 初始化钉钉二维码登录参数，异步加载钉钉二维码
     * @return {Promise}
     */
    initDDcodeLogin = () => {
        let URL = encodeURIComponent(
            `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.state.suiteKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${this.state.REDIRECT_URI}`
        );
        // 实例化钉钉对象
        let ddLoginObj = window.DDLogin({
            id: 'login_container',
            goto: URL,
            style: 'border:none;background-color:#FFFFFF;',
            width: '300',
            height: '350',
        });
        return new Promise((resolve, reject) => {
            resolve(ddLoginObj);
        });
    };
    // 钉钉二维码组件挂载
    componentDidMount() {
        // 加载钉钉登录二维码loading效果
        this.initDDcodeLogin().then(() => {
            setTimeout(() => {
                this.setState({
                    loadCodeSuccess: true,
                });
            }, 500);
        });
        // 监听消息处理方法
        const handleMessage = (event) => {
            // 获取loginTempCode
            const loginTempCode = event.data;
            // 获取消息来源
            const origin = event.origin;
            // 拼接 url
            const url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.state.suiteKey}&response_type=code&scope=snsapi_login&state=dinglogin&redirect_uri=${this.state.REDIRECT_URI}&loginTmpCode=${loginTempCode}`;
            // 如果来源为https://login.dingtalk.com，则在当前窗口打开回调链接
            if (origin === 'https://login.dingtalk.com') {
                this.setState({
                    loginTempCode: loginTempCode,
                });
                this.props.scanCodeCallBack(loginTempCode, url);
            }
        };
        // 监听iframe的消息
        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('message', handleMessage, false);
        } else if (typeof window.attachEvent != 'undefined') {
            window.attachEvent('onmessage', handleMessage);
        }
    }
    render() {
        const { hasScanCode } = this.props;
        return (
            <div>
                <div className="module-qrcode-login-title">登录</div>
                <div className="ddcode-box">
                    {this.state.loadCodeSuccess ? null : <Spin className="ddcode-load" tip="加载中" />}
                    <div
                        id="login_container"
                        className={!this.state.loadCodeSuccess ? 'loadCodeing' : 'loadCodeSuccess'}
                    ></div>
                </div>

                {hasScanCode && (
                    <div className="ddcode-has-scan">
                        <div className="out-date-text">
                            <div style={{ width: '100%' }}>
                                <Result status="success" subTitle="扫码成功！" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
