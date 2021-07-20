import React from 'react';
import './App.scss';
import { RouteComponentProps, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import zhCN from 'antd/es/locale/zh_CN';
import stores from './store';
import moment from 'moment';
import { userProps } from './interface/user';
import { logoutSystem, getInfo } from './server/api';
import { logout, switch_loading, authority } from './actions/index';
import { Layout, Menu, Icon, ConfigProvider, message, Modal } from 'antd';
import NotFoundPage from './views/NotFoundPage/NotFoundPage';
import 'moment/locale/zh-cn';
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

interface Props {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    menuAuthority: any;
}

moment.locale('zh-cn');

interface IState {
    selectedKeys: any;
    collapsed: Boolean;
    defaultOpenKeys: any;
    menus: any;
    pageList: any;
    openKeys: any;
}

class App extends React.PureComponent<RouteComponentProps & Props, IState> {
    state = {
        selectedKeys: [],
        collapsed: false,
        defaultOpenKeys: [],
        menus: [],
        pageList: [],
        openKeys: [],
    };

    private menuClick = (param: any) => {
        this.setState({
            selectedKeys: [param.key],
        });
        this.props.history.push(param.key);
    };
    private getUserInfo = async () => {
        let res = await getInfo();
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        // 缓存当前用户和平台信息
        localStorage.setItem('unionId', res.data.unionId);
        localStorage.setItem('platformType', res.data.platformType);

        let resourcePageIdList = res.data.resourceList.map((item: { id: any }) => {
            return item.id + '';
        });
        this.props.dispatch(authority(resourcePageIdList));
        let selectedKey = '',
            defaultOpenKey = '';
        if (this.state.menus.length > 0) {
            let routeName = this.props.history.location.pathname;
            this.state.menus.forEach((item: any) => {
                if (item.subList.length === 0) {
                    if (item.key === routeName) {
                        selectedKey = item.key;
                        defaultOpenKey = item.key;
                    }
                } else {
                    item.subList.forEach((subMenu: any) => {
                        if (subMenu.key === routeName) {
                            selectedKey = subMenu.key;
                            defaultOpenKey = item.key;
                        }
                    });
                }
            });

            // this.props.history.push(selectedKey)
        }
        let mainMenu = stores.getState().menuAuthority;
        // 过滤出有权限的菜单
        let menus = mainMenu.filter((menuItem) => {
            return resourcePageIdList.indexOf(menuItem.key) > -1;
        });
        let pageList = menus.map((item) => {
            return item.subList[0];
        });
        if (this.props.history.location.pathname !== '/') {
            let cpath = this.props.history.location.pathname;
            menus.forEach((obj: any) => {
                obj.subList.forEach((item: any) => {
                    if (item.key.startsWith(cpath)) {
                        selectedKey = item.key;
                    }
                });
            });
        }
        let defaultOpenKeyArr = menus.map((item) => {
            return item.key;
        });
        if (selectedKey === '') {
            if (menus[0].subList.length === 0) {
                selectedKey = menus[0].key;
            } else {
                selectedKey = menus[0].subList[0].key;
            }
        }
        this.setState({
            openKeys: defaultOpenKeyArr,
            selectedKeys: [selectedKey],
            defaultOpenKeys: defaultOpenKeyArr,
            menus,
            pageList,
        });

        if (this.props.history.location.pathname === '/') {
            this.props.history.push(menus[0].subList[0].key);
        }
    };
    private menuOpenChange(openKeys: string[]) {
        this.setState({
            openKeys,
        });
    }
    componentWillMount() {
        this.getUserInfo();
    }

    configmDialog() {
        Modal.confirm({
            title: '温馨提示',
            content: '确认退出？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.loginout();
            },
        });
    }
    // 登出系统

    async loginout() {
        let data = {};
        this.props.dispatch(switch_loading({ show: true }));
        let res = await logoutSystem(data);
        this.props.dispatch(switch_loading({ show: false }));
        if (res.code === 200) {
            this.props.dispatch(logout());
            setTimeout(() => {
                this.props.history.push('/login');
            }, 1000);
        } else {
            message.error(res.msg);
        }
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const { isShowLoading, menuAuthority } = this.props;
        const { selectedKeys, pageList, openKeys } = this.state;
        return (
            <div className="App">
                <ConfigProvider locale={zhCN}>
                    <Layout className="app-container">
                        <Sider collapsed={this.state.collapsed}>
                            <div className="logo"></div>
                            <Menu
                                selectedKeys={selectedKeys}
                                openKeys={openKeys}
                                mode="inline"
                                theme="dark"
                                onClick={this.menuClick.bind(this)}
                                onOpenChange={this.menuOpenChange.bind(this)}
                            >
                                {menuAuthority.map((item: any) => {
                                    return (
                                        <SubMenu
                                            key={item.key}
                                            title={
                                                <span>
                                                    <Icon type={item.icon} />
                                                    <span>{item.title}</span>
                                                </span>
                                            }
                                        >
                                            {item.subList.map((itemMenu: any) => {
                                                return <Menu.Item key={itemMenu.key}>{itemMenu.title}</Menu.Item>;
                                            })}
                                        </SubMenu>
                                    );
                                })}
                            </Menu>
                        </Sider>
                        <Layout>
                            <Header className="app-header">
                                <Icon
                                    className="hidden1"
                                    style={{ fontSize: '20px' }}
                                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this.toggleCollapsed}
                                />
                                <span className="loginout" onClick={this.configmDialog.bind(this)}>
                                    退出
                                </span>
                            </Header>
                            <Content className="app-content">
                                {isShowLoading && (
                                    <div className="global-spin">
                                        <div className="anim">
                                            <div className="double-bounce1 double-bounce"></div>
                                            <div className="double-bounce2 double-bounce"></div>
                                        </div>
                                    </div>
                                )}
                                <Switch>
                                    {pageList.map((item: any) => {
                                        return <Route path={item.key} component={item.component} key={item.key} />;
                                    })}
                                    <Route path="*" component={NotFoundPage} />
                                    {/* <Route path="/box_manager" component={boxManager} />
                                    <Route path="/organization-structure" component={OrganizationStructure} />
                                    <Route path="/role_list" component={roleList} /> */}
                                </Switch>
                            </Content>
                        </Layout>
                    </Layout>
                </ConfigProvider>
            </div>
        );
    }
}

interface stateType {
    user: userProps;
    isShowLoading: Boolean;
    menuAuthority: any;
}

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
    menuAuthority: state.menuAuthority,
}))(App);
