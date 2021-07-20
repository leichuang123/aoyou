import React from 'react'
// import activeStyle from './user_info.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Table, Pagination, message, Input, Button, Modal, Cascader } from 'antd'
import { userInfoList, getAreaList, editUserInfo, queryDataCenterList } from '../../../../server/api'
import { PAGE_SIZE, MOBILE_MAX_LENGTH } from '../../../../config/config'
import UserCrystal from './user_crystal/user_crystal'
import UserCoupon from './user_coupon/user_coupon'


const { Search } = Input

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  currentPage: number,
  pageSize: number,
  startTime: number,
  endTime: number,
  placeNo: string,
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  open: boolean,
  isShowUserCoupon: boolean,
  isShowModel: boolean,
  mobile: string,
  userNo: string,
  areaList: any,
  dataCenterAddressId: number,
  dataCenterList: any,
}

class UserInfo extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    startTime: 0,
    endTime: 0,
    placeNo: '',
    total: 0,
    list: [],
    mobile: '',
    exportParam: {},
    visible: false,
    open: false,
    timeList: [{
      startTime: '00:00',
      endTime: '23:59',
    }],
    isShowCategory: false, // 控制创建的第一个弹窗
    isShowEditDialog: false,
    isShowUserCoupon: false,
    isShowModel: false, //控制编辑弹窗
    userNo: '',
    areaList: [],
    dataCenterAddressId: 0,
    dataCenterList: [],
  }

  componentDidMount() {
    this.getList()
    this.getDataCenterList()
  }

  private handleSubmit() {
    this.setState({
      currentPage: 1,
      list: []
    }, () => {
      this.getList()
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      mobile: this.state.mobile,
    }
    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await userInfoList(params)
    if (res.code === 200) {
      res.data.dataList.forEach((item: any, index: number) => {
        this.state.dataCenterList.forEach((obj: any) => {
          if (item.dataCenterAddressId === obj.id) {
            // 修改数据中心
            item.city = obj.name
          }
        })
      })
      this.setState({
        total: res.data.page.totalCount,
        list: res.data.dataList
      })
    } else {
      message.error(res.message)
    }
  }

  private pageinChange(currentPage: number) {
    this.setState({
      currentPage
    }, () => {
      this.getList()
    })
  }

  private showSizeChange(current: number, pageSize: number) {
    this.setState({
      currentPage: 1,
      pageSize
    }, () => {
      this.getList()
    })
  }

  private showUserCrystal(item: any) {
    this.setState({
      userNo: item.userNo,
      visible: true
    })
  }

  private hideUserCrystal() {
    this.setState({
      visible: false
    })
  }

  private showUserCoupon (info: any){
    this.setState({
      userNo: info.userNo,
      isShowUserCoupon: true
    })
  }

  private hideUserCoupon() {
    this.setState({
      isShowUserCoupon: false
    })
  }

  private showUserArea(this, item: any) {
    this.getOrderAreaList()
    this.setState({
      userNo: item.userNo,
      isShowModel: true
    })
  }

  private search (mobile: any) {
    this.setState({
      mobile,
      currentPage: 1
    }, () => {
      this.getList()
    })
  }

  private async handleOk () {
    this.setState({
      isShowModel: false
    })
    let params = {
      userNo: this.state.userNo,
      dataCenterAddressId: this.state.dataCenterAddressId
    }
    // Object.assign({},params)
    let res = await editUserInfo(params)
    if (res.code === 200) {
      message.info('修改成功')
      this.getList()
    } else {
      message.error(res.message)
    }
  }

  private handleCancel () {
    this.setState({
      isShowModel: false
    })
  }

  private onAreaBind(item) {
    this.setState({
      dataCenterAddressId: item[item.length - 1]
    })
  }

  private async getOrderAreaList() {
    let res = await getAreaList()
    if (res.code !== 200) {
      message.error(res.message)
      return
    }else{
      this.setState({
        areaList: res.data
      })
    }
    
  }

  // 获取数据中心数据
  private async getDataCenterList(){
    let res = await queryDataCenterList()
    if(res.code == 200){
      this.setState({
        dataCenterList: res.data.dataList,
      })
    }else{
      message.error(res.message)
    }
  }

  render() {
    const { list, currentPage, total, pageSize, visible, isShowUserCoupon, isShowModel, userNo } = this.state
    // const columns: any = [
    const columns:any = [
      {
        title: '昵称',
        dataIndex: 'userNickName',
        key: 'userNickName',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 150,
      },
      {
        title: '用户编号',
        dataIndex: 'userNo',
        key: 'userNo',
        width: 200,
      },
      {
        title: '用户地址',
        dataIndex: 'city',
        key: 'city',
        width: 130,
      },
      {
        title: '总充值（水晶）',
        dataIndex: 'crystalRecharge',
        key: 'crystalRecharge',
        width: 130,
      },
      {
        title: '总消费（水晶）',
        dataIndex: 'crystalConsume',
        key: 'crystalConsume',
        width: 130,
      },
      {
        title: '会员虚拟机数（含销毁）',
        dataIndex: 'vmCountInDestroy',
        key: 'vmCountInDestroy',
        width: 200,
      },
      {
        title: '会员虚拟机数（不含销毁）',
        dataIndex: 'vmCountNotInDestroy',
        key: 'vmCountNotInDestroy',
        width: 240,
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
      },
      {
        title: '水晶余额',
        dataIndex: 'crystalBalance',
        key: 'crystalBalance',
        width: 200,
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 250,
        render: (text: any, item: any) => <div className='flex-enter'>
          <Button type='link' onClick={this.showUserArea.bind(this, item)}>编辑</Button>
          <Button type='link' onClick={this.showUserCrystal.bind(this, item)}>水晶明细</Button>
          <Button type='link' onClick={this.showUserCoupon.bind(this, item)}>卡券</Button>
        </div>,
      }
    ];
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='text-left'>
            <Form.Item label='手机号'>
              <Search
                placeholder=""
                maxLength={MOBILE_MAX_LENGTH}
                onSearch={this.search.bind(this)}
              />
            </Form.Item>
          </div>
          
        </Form>
        <Table
          scroll={{ x: 1600 }}
          className='table' 
          columns={columns} 
          dataSource={list} 
          pagination={false}
          rowKey="userNo"
        />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        {
          visible && <UserCrystal userNo={userNo} onClose={this.hideUserCrystal.bind(this)} />
        }
        {
          isShowUserCoupon && <UserCoupon userNo={userNo} onClose={this.hideUserCoupon.bind(this)} />
        }
        <Modal
          maskClosable={false}
          title="用户地址"
          visible={this.state.isShowModel}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width='400px'
        >
          <Cascader
              onChange={this.onAreaBind.bind(this)}
              placeholder="请选择绑定地区"
              style={{ width: "320px" }}
              options={this.state.areaList}
          />
          
        </Modal>
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_user_info' })(UserInfo)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)