import React from 'react';
import './App.scss';
import { 
  RouteComponentProps,
  Route,
  Switch
 } from 'react-router-dom';
 import { connect } from 'react-redux';
import zhCN from 'antd/es/locale/zh_CN';
import newUser from './views/new_user/new_user'

import moment from 'moment'
import { userProps } from './interface/user'
import { serverLoginout } from './server/api'
import { logout, switch_loading } from './actions/index';
import { Layout, Menu, Icon, ConfigProvider, message, Modal } from 'antd';
import 'moment/locale/zh-cn';
const { Header, Sider, Content } = Layout
const { SubMenu } = Menu


interface Props {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function
}

moment.locale('zh-cn')

class App extends React.Component<RouteComponentProps & Props> {

  state = {
    selectedKeys: [],
    collapsed: false,
    defaultOpenKeys: [],
    menus: [
      {
        title: '用户信息统计',
        key: '1',
        icon: 'user',
        subList: [
          {
            key: '/new_user',
            title: '新用户注册量'
          }
        ]
      }
    ]
  }

  private menuClick = (param: any) => {
    this.setState({
      selectedKeys: [param.key],
    })
    this.props.history.push(param.key) 
  }

  componentWillMount () {
    if (this.state.menus.length > 0) {
      let selectedKey = '', defaultOpenKey = ''
      let routeName = this.props.history.location.pathname
      this.state.menus.forEach(item => {
        if (item.subList.length === 0) {
          if (item.key === routeName) {
            selectedKey = item.key
            defaultOpenKey = item.key
          }
        } else {
          item.subList.forEach(subMenu => {
            if (subMenu.key === routeName) {
              selectedKey = subMenu.key
              defaultOpenKey = item.key
            }
          })
        }
      })
      if (selectedKey === '') {
        if (this.state.menus[0].subList.length === 0) {
          selectedKey = this.state.menus[0].key
        } else {
          selectedKey = this.state.menus[0].subList[0].key
        }
        defaultOpenKey = this.state.menus[0].key
      }
      this.props.history.push(selectedKey)
      this.setState({
        selectedKeys: [selectedKey],
        defaultOpenKeys: [defaultOpenKey]
      })
    }
  }

  configmDialog () {
    Modal.confirm({
      title: '温馨提示',
      content: '确认退出？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.loginout()
      }
    })
  }

  async loginout () {
    let data = {
      memberKey: this.props.user.memberKey,
      typeid: 9
    }
    this.props.dispatch(switch_loading({show: true}))
    let res = await serverLoginout(data)
    this.props.dispatch(switch_loading({show: false}))
    if (res.success === 'true') {
      this.props.dispatch(logout())
      setTimeout(() => {
        this.props.history.push('/login')
      }, 1000)
    } else {
      message.error(res.msg)
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  
  render () {
    const { isShowLoading } = this.props
    const { selectedKeys, menus, defaultOpenKeys } = this.state
    return (
      <div className="App">
        <ConfigProvider locale={zhCN}>
        <Layout className='app-container'>
          <Sider collapsed={this.state.collapsed}>
            <div className='logo'></div>
            <Menu
              selectedKeys={selectedKeys}
              defaultOpenKeys={defaultOpenKeys}
              defaultSelectedKeys={defaultOpenKeys}
              mode="inline"
              theme="dark"
              onClick={this.menuClick.bind(this)}
            >
            {
              menus.map(item => {
                return <SubMenu 
                    key={item.key}
                    title={
                      <span>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                      </span>
                    }
                  >
                  {
                    item.subList.map(itemMenu => {
                      return <Menu.Item key={itemMenu.key}>{itemMenu.title}</Menu.Item>
                    })
                  }
                </SubMenu>
              })
            }
            </Menu>
          </Sider>
          <Layout>
            <Header className='app-header'>
              <Icon className='hidden1' style={{ fontSize: '20px'}}  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}  onClick={this.toggleCollapsed} />
              <span className='loginout' onClick={this.configmDialog.bind(this)}>退出</span>
            </Header>
            <Content className='app-content'>
            {
              isShowLoading && <div className='global-spin'>
                
				<div className="anim">
				  <div className="double-bounce1 double-bounce"></div>
				  <div className="double-bounce2 double-bounce"></div>
				</div>
              </div>
            }
              <Switch>
                <Route path='/new_user' component={newUser} />
              </Switch>
            </Content>
          </Layout>
        </Layout>
        </ConfigProvider>
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(App)

