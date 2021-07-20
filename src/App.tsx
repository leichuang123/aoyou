import React from 'react';
import './App.scss';
import { 
  RouteComponentProps,
  Route,
  Switch
 } from 'react-router-dom';
 import { connect } from 'react-redux';
import zhCN from 'antd/es/locale/zh_CN';
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { userProps } from './interface/user'
import { serverLoginout, getUserInfo } from './server/api'
import { logout } from './actions/index';
import { Layout, Menu, Icon, ConfigProvider, message, Modal } from 'antd';
import  dictionary from './views/system_management/aid_data/dictionary/dictionary'
import  roles from './views/system_management/company_management/roles/roles'
import yunnyBoxOrder from './views/business_center/order_management/yunny_box_order/order'
import virtualMachine from './views/product_center/sku_manager/virtual_machine'
import realTime from './views/product_center/sku_manager/charging_method/real_time'
import timeQuantum from './views/product_center/sku_manager/charging_method/time_quantum'
import productList from './views/product_center/product/product_list'
import activityList from './views/business_center/active_manager/activity_list'
import coupon from './views/business_center/active_manager/coupon/coupon'
import userInfo from './views/business_center/user_manager/user_info/user_info'
import userMachine from './views/business_center/user_manager/user_machine/user_machine'
import stationNotice from './views/system_management/notice_management/station_notice/station_notice'
import ProductType from './views/system_management/aid_data/product_type/product_type'
import CreateUser from './views/system_management/create_user/create_user'
import timeQuantumOrder from './views/business_center/order_management/time_quantum_order/time_quantum_order'
import preInstall from "./views/system_management/aid_data/pre_install/pre_install";
import Resources from './views/system_management/company_management/resources/resources'
import Employee from './views/system_management/company_management/employee/employee'
import Empty from './views/empty'
import VmLog from './views/business_center/user_manager/vm_log/vm_log'
import ArticleList from './views/system_management/article_management/article/list/list'
import userOrder from './views/business_center/order_management/time_quantum_order/user_order'
import telecomOrderNumber from './views/business_center/order_management/telecom_order_number/telecom_order_number'
import queryUserByCode from './views/business_center/user_manager/query_user_by_code/query_user_by_code'
import productPackage from './views/product_center/product_package/product_package'
import softwareList from './views/system_management/software_manager/software_list'
import deviceManager from './views/business_center/device_manager/device_list'
import hardWareBind from './views/business_center/hardWare_bind/hardWare_bind'
import CreateDataCenter from './views/system_management/aid_data/create_dataCenter/create_dataCenter'

import 'moment/locale/zh-cn';
import { ACCOUNT_NAME, MENUS } from './constants/storage_key'
import { formatMenu } from './tools/tools'
import { userPermission } from './server/api'
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
    openKeys: [],
    menus: [
      // {
      //   title: '业务中心',
      //   key: 'business_center',
      //   icon: 'heat-map',
      //   subList: [
      //     {
      //       title: '订单管理',
      //       key: 'order_management',
      //       subList: [
      //         // {
      //         //   title: '云服务订单',
      //         //   key: 'yunny_server_order',
      //         // },
      //         {
      //           title: '云之盒订单',
      //           key: 'yunny_box_order',
      //         },
      //         {
      //           title: '时长订单',
      //           key: 'time_quantum_order',
      //         },
      //       ]
      //     },
      //     {
      //       title: '活动管理',
      //       key: 'activeity_manager',
      //       subList: [
      //         {
      //           title: '活动',
      //           key: 'activity_list',
      //         },
      //         {
      //           title: '优惠券',
      //           key: 'coupon',
      //         }
      //       ]
      //     },
      //     {
      //       title: '用户管理',
      //       key: 'user_manager',
      //       subList: [
      //         {
      //           title: '用户信息',
      //           key: 'user_info',
      //         },
      //         {
      //           title: '用户虚拟机',
      //           key: 'user_machine',
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   title: '商品中心',
      //   key: 'product_center',
      //   icon: 'fund',
      //   subList: [{
      //     title: '商品',
      //     key: 'product',
      //     subList: [{
      //       title: '商品列表',
      //       key: 'product_list'
      //     }, {
      //       title: 'SKU管理',
      //       key: 'sku_manager',
      //       subList: [
      //         {
      //           title: '虚拟机',
      //           key: 'virtual_machine'
      //         },
      //         // {
      //         //   title: '实时计费',
      //         //   key: 'real_time'
      //         // },
      //         {
      //           title: '时长计费',
      //           key: 'time_quantum'
      //         }
      //       ]
      //     }]
      //   }]
      // },
      // {
      //   title: '系统管理',
      //   key: 'system_management',
      //   icon: 'cluster',
      //   subList: [
      //     {
      //       title: '辅助资料',
      //       key: 'aid_data',
      //       subList: [
      //         {
      //           title: '字典',
      //           key: 'dictionary',
      //         },
      //         {
      //           title: '商品类型',
      //           key: 'product_type',
      //         },
      //         {
      //           title: '预装软件',
      //           key: 'pre_install',
      //         }
      //       ]
      //     },
      //     {
      //       title: '公司管理',
      //       key: 'company_management',
      //       subList: [
      //         {
      //           title: '员工',
      //           key: 'employee',
      //         },
      //         {
      //           title: '角色',
      //           key: 'roles',
      //         },
      //         {
      //           title: '资源',
      //           key: 'resources',
      //         }
      //       ]
      //     },
      //     {
      //       title: '通知管理',
      //       key: 'notice_management',
      //       subList: [
      //         {
      //           title: '站内通知',
      //           key: 'station_notice',
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //  title: '后台用户管理',
      //  key: 'user_management',
      //  icon: 'cluster',
      //  subList: [
      //    {
      //      title: '创建用户',
      //      key: 'create_user',
      //    }
      //  ]
      // },
    ]
  }

  private menuClick = (param: any) => {
    this.setState({
      selectedKeys: [param.key],
    })
    this.props.history.push(param.key)
  }

  async componentWillMount () {
    let res = await userPermission()
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    store.set(MENUS, res.data)

    let originMenus = store.get(MENUS) || []
    let menus = store.get(MENUS) ? formatMenu(store.get(MENUS)) : []
    console.log('menus', menus)
    // if (menus.length === 0) {
    //   this.props.history.push('/login')
    //   return
    // }
    let current = this.props.history.location.pathname
    const openKeys: any = []
    const selectedKeys: any = []
    if (current === '/') {
      const getChild = (info: any) => {
        openKeys.push(info.key)
        
        if (info.subList && info.subList.length > 0) {
          getChild(info.subList[0])
        } else {
          selectedKeys.push(info.key)
        }
      }
      if (menus.length > 0) {
        getChild(menus[0])
        this.props.history.push(selectedKeys[0])
      }
    } else {
      current = current.substring(1)
      selectedKeys.push(current)
      let currentItem: any = null
      originMenus.forEach((item: any) => {
        if (item.url === current) {
          currentItem = item
        }
      })
      const getParent = (info: any) => {
        openKeys.push(info.url)
        if (info.parentId !== 0) {
          let newItem: any = null
          originMenus.forEach((item: any) => {
            if (item.id === info.parentId) {
              newItem = item
            }
          })
          if (newItem !== null) {
            getParent(newItem)
          }
          
        }
      }
      if (currentItem !== null) {
        getParent(currentItem)
      }
    }
    this.setState({
      openKeys,
      selectedKeys,
      menus
    })
    
    if (this.props.user !== null) {
      this.refreshUser()
      return
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

  async refreshUser () {
    await getUserInfo()
  }

  async loginout () {
    let data = {
      loginName: this.props.user.loginName,
    }
    let res = await serverLoginout(data)
    if (res.code === 200) {
      this.props.dispatch(logout())
      setTimeout(() => {
        this.props.history.push('/login')
      }, 1000)
    } else {
      message.error(res.message)
    }
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  renderIcon = (item:any) => {
    return (
      <span>
        {
          item.icon && <Icon type={item.icon} />
        }
        <span>{item.title}</span>
      </span>
    )
  }
  renderMenu = (odata:any) => {
    let data = JSON.parse(JSON.stringify(odata))
    if (localStorage.getItem(ACCOUNT_NAME) !== 'admin') {
      data = data.filter((item: any) => {
        return item.title !== '后台用户管理'
      })
    }
    return data.map((item:any)=>{
      if(item.subList){
        return(
          <SubMenu key={item.key} title={this.renderIcon(item)}>
            { this.renderMenu(item.subList) }
          </SubMenu>
        ) 
      }
      return (
        <Menu.Item key={item.key} title={item.title}>
          {item.title}
        </Menu.Item>
      ) 
    })
  }

  private menuOpenChange (openKeys: string[]) {
    this.setState({
      openKeys
    })
  }

  render () {
    const { isShowLoading } = this.props
    const { selectedKeys, menus, openKeys } = this.state
    return (
      <div className="App">
        <ConfigProvider locale={zhCN}>
        <Layout className='app-container'>
          <Sider collapsed={this.state.collapsed}>
            <div className='logo'></div>
            <Menu
              selectedKeys={selectedKeys}
              // defaultOpenKeys={defaultOpenKeys}
              // defaultSelectedKeys={defaultOpenKeys}
              openKeys={openKeys}
              mode="inline"
              theme="dark"
              onClick={this.menuClick.bind(this)}
              onOpenChange={this.menuOpenChange.bind(this)}
            >
            {
              this.renderMenu(menus)
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
                <Route path='/dictionary' component={dictionary} />
                <Route path='/roles' component={roles} />
                <Route path="/yunny_box_order" component={yunnyBoxOrder} />
                <Route path='/virtual_machine' component={virtualMachine} />
                <Route path='/real_time' component={realTime} />
                <Route path='/time_quantum' component={timeQuantum} />
                <Route path='/product_list' component={productList} />
                <Route path='/activity_list' component={activityList} />
                <Route path='/coupon' component={coupon}></Route>
                <Route path='/user_info' component={userInfo}></Route>
                <Route path='/user_machine' component={userMachine}></Route>
                <Route path='/station_notice' component={stationNotice}></Route>
                <Route path='/product_type' component={ProductType}></Route>
                <Route path='/time_quantum_order' component={timeQuantumOrder}></Route>
                <Route path='/create_user' component={CreateUser}></Route>
                <Route path='/pre_install' component={preInstall} ></Route>
                <Route path='/resources' component={Resources} ></Route>
                <Route path='/employee' component={Employee} ></Route>
                <Route path='/vm_log' component={VmLog} ></Route>
                <Route path='/article_list' component={ArticleList} ></Route>
                <Route path='/user_order' component={userOrder} ></Route>
                <Route path='/telecom_order_number' component={telecomOrderNumber} ></Route>
                <Route path='/empty' component={Empty} ></Route>
                <Route path="/query_user_by_code" component={queryUserByCode}></Route>吧
                <Route path="/product_package" component={productPackage}></Route>
                <Route path="/software_list" component={softwareList}></Route>
                <Route path="/device_manager" component={deviceManager}></Route>
                <Route path="/hardWare_bind" component={hardWareBind}></Route>
                <Route path='/create_dataCenter' component={CreateDataCenter}></Route>
                
                
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

export default withRouter(connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(App))
