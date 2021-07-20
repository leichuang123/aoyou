import React, { Component } from 'react';
import { Icon, Empty, Button } from 'antd';
import './selectCompany.scss';

export default class index extends Component {
    // 点击返回登录界面
    backToLogin = () => {
        this.props.backToLoginForm();
    };
    // 选择当前公司
    selectThisCompany = (item) => {
        return () => {
            this.props.selectThisCompany(item);
        };
    };
    // 创建公司
    goCreateCompany = () => {
        this.props.goCreateCompany();
    };

    render() {
        const { companyList } = this.props;

        return (
            <div className="login-form module-comm-page">
                <div className="module-comm-back" onClick={this.backToLogin}>
                    <Icon type="left" />
                    <span>返回</span>
                </div>
                <h2 className="module-comm-page-title">选择你管理的公司</h2>
                <div className="module-comm-page-desc">你在以下公司中担任管理员</div>
                <div className="module-corp-sel-list">
                    {companyList.length ? (
                        companyList.map((item) => {
                            return (
                                <div
                                    className="module-corp-sel-listitem"
                                    onClick={this.selectThisCompany(item)}
                                    key={item.id}
                                >
                                    <div className="module-corp-sel-listitem-avatar">
                                        <img
                                            src="https://gw.alicdn.com/tfs/TB14o5MmcVl614jSZKPXXaGjpXa-120-120.png"
                                            width="24"
                                            height="24"
                                        />
                                    </div>
                                    <span className="module-corp-sel-listitem-name">{item.name}</span>
                                    <Icon type="arrow-right" className="module-corp-sel-listitem-go" />
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-company">
                            <Empty description={<span>暂无公司</span>}></Empty>
                        </div>
                    )}
                </div>
                <div className="createNewCom">
                    <Button type="link" onClick={this.goCreateCompany}>
                        创建新公司
                    </Button>
                </div>
            </div>
        );
    }
}
