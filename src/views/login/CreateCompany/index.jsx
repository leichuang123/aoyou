import React, { Component } from 'react';
import { Icon, Button, Input, message } from 'antd';
import './createCompany.scss';

export default class index extends Component {
    // 点击返回登录界面
    backToLogin = () => {
        this.props.cancelCreateCom();
    };
    // 选择当前公司
    selectThisCompany = (item) => {
        return () => {
            this.props.selectThisCompany(item);
        };
    };
    // 创建公司
    sureCreateCompany = () => {
        const { name, companyCode } = this.state;
        if (name == '') {
            message.error('请输入公司名称');
            return;
        }
        if (companyCode == '') {
            message.error('请输入公司编码');
            return;
        }
        const reg = /^[0-9a-zA-Z]{1,}$/;
        if (!reg.test(companyCode)) {
            message.error('公司编码不合法');
            return;
        }
        this.props.sureCreateCompany(name, companyCode);
    };
    // input值修改
    saveFormData = (formType) => {
        return (event) => {
            this.setState({
                [formType]: event.target.value,
            });
        };
    };
    state = {
        name: '',
        companyCode: '',
    };

    render() {
        return (
            <div className="login-form module-comm-page">
                <div className="module-comm-back" onClick={this.backToLogin}>
                    <Icon type="left" />
                    <span>返回</span>
                </div>
                <h2 className="module-comm-page-title">创建你管理的公司</h2>
                <div className="module-comm-page-desc mart-10" style={{ marginTop: 20 }}>
                    公司名称
                </div>
                <div style={{ marginTop: 8 }}>
                    <Input placeholder="请输入公司名称" onChange={this.saveFormData('name')} />
                </div>
                <div className="module-comm-page-desc mart-10">公司编码</div>
                <div style={{ marginTop: 8 }}>
                    <Input placeholder="请输入公司编码" onChange={this.saveFormData('companyCode')} />
                </div>
                <Button
                    type="primary"
                    block
                    className="mart-30"
                    loading={this.props.loading}
                    onClick={this.sureCreateCompany}
                >
                    确定
                </Button>
            </div>
        );
    }
}
