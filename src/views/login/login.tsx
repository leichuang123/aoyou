import React from 'react';
import './login.scss';
import { connect } from 'react-redux';
import { login } from '../../actions/index';
import { userProps } from '../../interface/user';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Icon, Input, Button, message } from 'antd';
import { yunnyLogin, loginWithCompany, createCompany, getInfo, ddLogin } from '../../server/api';
import { switch_loading } from '../../actions/index';
import DingCode from './DingCode/DingCode';
import SelectCompany from './SelectCompany/index';
import CreateCompany from './CreateCompany/index';
import { getUrlParam } from '../../tools/tools';

interface Props {
    user: userProps;
    dispatch: Function;
    form: {
        validateFields: Function;
        getFieldDecorator: Function;
    };
}

class Login extends React.Component<RouteComponentProps & Props> {
    state = {
        // 是否为扫码登录
        codeVisible: false,
        loginLoading: false,
        // 是否显示选择公司界面
        showSelectCompany: false,
        // 公司列表
        companyList: [],
        // 是否多加公司
        multipleCompany: false,
        // 用户标识
        cmUserNo: '',
        // 用户手机号
        accountMoblie: '',
        showCreateCompany: false,
        loading: false,
        hasScanCode: false,
        unionId: '',
    };
    componentDidMount() {
        // 钉钉扫码成功后会重定向到登录界面，并且携带了code
        const param = getUrlParam(this.props.location.search);
        if (param.state === 'dinglogin' && param.code) {
            this.setState({
                codeVisible: true,
                hasScanCode: true,
            });

            this.loginByDDCode(param.code);
        }
    }
    // 根据钉钉重定向地址调用获取用户token的接口
    loginByDDCode = async (code: any) => {
        this.props.dispatch(switch_loading({ show: true }));
        let res = await ddLogin(code);
        this.props.dispatch(switch_loading({ show: false }));
        if (res.code !== 200) {
            message.error(res.message);
            this.props.history.replace('/login');
            this.setState({
                codeVisible: false,
                hasScanCode: false,
            });
            return;
        }
        // 拿到临时token
        let tokenParams = {
            token: res.data.token,
        };
        this.props.dispatch(login(tokenParams));
        this.setState({
            showSelectCompany: true,
            multipleCompany: res.data.multipleCompany,
            companyList: res.data.companyList,
            cmUserNo: res.data.cmUserNo,
            unionId: res.data.unionId,
        });
    };
    // 账号密码登陆
    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields(async (err: any, data: any) => {
            if (!err) {
                this.setState({
                    loginLoading: true,
                });
                this.props.dispatch(switch_loading({ show: true }));
                let res = await yunnyLogin({
                    account: data.username,
                    password: md5(data.password),
                });
                this.props.dispatch(switch_loading({ show: false }));
                if (res.code !== 200) {
                    message.error(res.message);
                    this.setState({
                        loginLoading: false,
                    });
                    return;
                }
                // 拿到临时token
                let tokenParams = {
                    token: res.data.token,
                };
                this.props.dispatch(login(tokenParams));
                this.setState({
                    showSelectCompany: true,
                    accountMoblie: data.username,
                    multipleCompany: res.data.multipleCompany,
                    companyList: res.data.companyList,
                    cmUserNo: res.data.cmUserNo,
                    unionId: res.data.unionId,
                });
            }
        });
    };
    // 钉钉扫码登录
    scanCodeCallBack = (code: any, url: any) => {
        window.open(encodeURI(url), '_parent');
    };
    // 选择当前公司进行登录
    selectThisCompany = async (item: any) => {
        this.props.dispatch(switch_loading({ show: true }));
        const { cmUserNo, unionId } = this.state;
        let res = await loginWithCompany({
            cmUserNo: cmUserNo,
            unionId: unionId,
            companyCode: item.companyCode,
        });
        this.props.dispatch(switch_loading({ show: false }));
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        localStorage.setItem('companyCode', item.companyCode);
        this.props.dispatch(login(res.data));
        let userRes = await getInfo();
        if (userRes.code !== 200) {
            message.error(userRes.message);
            return;
        }
        // 缓存当前用户和平台信息
        localStorage.setItem('unionId', userRes.data.unionId);
        this.jumpPageHasAuth(userRes.data.resourceList);
    };
    // 跳转的界面是否有权限
    jumpPageHasAuth = (resourceList: any) => {
        let resourcePageIdList = resourceList.map((item: { url: any }) => {
            return item.url;
        });
        // 没有角色权限
        if (!resourcePageIdList.length) {
            message.error('该账号暂无权限，请联系管理员处理！');
            return;
        }
        // 跳转到权限第一个界面
        this.props.history.push(resourcePageIdList[0]);
    };
    // 切换账号登录/钉钉扫码登录方式
    changeLoginType = () => {
        const codeVisible = this.state.codeVisible;
        this.setState({
            codeVisible: !codeVisible,
            hasScanCode: false,
        });
    };
    // 已经登录后返回账号密码登录
    backToLoginForm = () => {
        this.setState({
            showSelectCompany: false,
            loginLoading: false,
            hasScanCode: false,
        });
    };
    // 创建公司
    goCreateCompany = () => {
        this.setState({
            showCreateCompany: true,
        });
    };
    // 取消创建公司
    cancelCreateCom = () => {
        this.setState({
            showCreateCompany: false,
            loginLoading: false,
        });
    };
    // 创建公司提交
    sureCreateCompany = async (name: any, companyCode: any) => {
        const { cmUserNo, unionId } = this.state;
        this.setState({ loading: true });
        let res = await createCompany({
            name: name,
            unionId: unionId,
            companyCode: companyCode,
            cmUserNo: cmUserNo,
        });
        this.setState({ loading: false });
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        this.props.dispatch(switch_loading({ show: true }));
        let loginWithCompanyRes = await loginWithCompany({
            cmUserNo: cmUserNo,
            unionId: unionId,
            companyCode: companyCode,
        });
        this.props.dispatch(switch_loading({ show: false }));
        if (loginWithCompanyRes.code !== 200) {
            message.error(loginWithCompanyRes.message);
            return;
        }
        let tokenParams = {
            token: loginWithCompanyRes.data.token,
        };
        this.props.dispatch(login(tokenParams));
        localStorage.setItem('companyCode', companyCode);
        let userRes = await getInfo();
        if (userRes.code !== 200) {
            message.error(userRes.message);
            return;
        }
        // 缓存当前用户和平台信息
        localStorage.setItem('unionId', userRes.data.unionId);
        localStorage.setItem('platformType', userRes.data.platformType);
        this.jumpPageHasAuth(userRes.data.resourceList);
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { codeVisible, showSelectCompany, companyList, showCreateCompany, loading, hasScanCode, loginLoading } =
            this.state;
        return (
            <div className="login">
                {!showSelectCompany ? (
                    <Form
                        onSubmit={this.handleSubmit}
                        className="login-form"
                        style={{ height: codeVisible ? '400px' : '325px' }}
                    >
                        <div className="login_face">
                            <img
                                alt="头像"
                                src={require('../../assets/images/login/face.jpg')}
                                className="userAvatar"
                            />
                        </div>
                        <div>
                            {!codeVisible ? (
                                <div>
                                    <Form.Item>
                                        {getFieldDecorator('username', {
                                            rules: [{ required: true, message: '请输入用户名' }],
                                        })(
                                            <Input
                                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                placeholder="用户名"
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: '请输入密码' }],
                                        })(
                                            <Input
                                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                type="password"
                                                placeholder="密码"
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item>
                                        <div className="flex-center">
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="login-form-button"
                                                loading={loginLoading}
                                            >
                                                登录
                                            </Button>
                                        </div>
                                    </Form.Item>
                                </div>
                            ) : (
                                <DingCode hasScanCode={hasScanCode} scanCodeCallBack={this.scanCodeCallBack}></DingCode>
                            )}
                        </div>
                        <div className="text-center">
                            <Button type="link" onClick={this.changeLoginType.bind(this)}>
                                {codeVisible ? '账号密码登录' : '钉钉扫码登录'}
                            </Button>
                        </div>
                    </Form>
                ) : !showCreateCompany ? (
                    <SelectCompany
                        companyList={companyList}
                        backToLoginForm={this.backToLoginForm}
                        selectThisCompany={this.selectThisCompany}
                        goCreateCompany={this.goCreateCompany}
                    />
                ) : (
                    <CreateCompany
                        loading={loading}
                        cancelCreateCom={this.cancelCreateCom}
                        sureCreateCompany={this.sureCreateCompany}
                    ></CreateCompany>
                )}
            </div>
        );
    }
}

interface stateType {
    user: userProps;
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

export default connect((state: stateType) => ({
    user: state.user,
}))(WrappedNormalLoginForm);
