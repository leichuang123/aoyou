import React from 'react'
// import activeStyle from './active_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Button, Table, Pagination, message, Input, Modal, Row } from 'antd'
import { getTimeQuantumOrder, operateOrderState, getProductTypeList, queryDictList, resetOrderOldDevice, queryDataCenterList,} from '../../../../server/api'
import { PAGE_SIZE, SELL_CHANNEL, INPUT_MAXLENGTH } from '../../../../config/config'
import Detail from './detail/detail'
import { codeInfoListFilter } from '../../../../tools/tools'
import ReNew from './renew/renew'
import ChangeDevice from './change_device/change_device'
const { Search } = Input
// const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  currentPage: number,
  pageSize: number,
  mobile: string,
  total: number,
  list: any,
  exportParam: any,
  visible: Boolean,
  productTypeList: any,
  editInfo: any,
  orderChannel: number,
  sellChannelList: any,
  isShowRenewDialog: boolean,
  reNewProductNo: string,
  reNewOrderNo: string,
  isShowChangeDevice: boolean,
  changeDeviceInfo: any,
}

class RealTimeOrder extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    mobile: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    productTypeList: [],
    editInfo: null,
    isShowCoupon: false,
    durationSubOrderId: -1,
    orderChannel: -1,
    sellChannelList: [],
    isShowRenewDialog: false,
    reNewProductNo: '',
    reNewOrderNo: '',
    isShowChangeDevice: false,
    changeDeviceInfo: null,
  }

  private async getProductType() {
    let params = {
      pageSize: 9999,
    }
    let res = await getProductTypeList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      productTypeList: res.data.dataList,
    }, () => {
      // this.getSellChanelList()
      this.getDataCenterList()
    })
  }

  componentDidMount() {
    this.getProductType()
  }

  private handleSubmit() {
    // this.setState({
    //   currentPage: 1,
    //   list: []
    // }, () => {
    //   this.getList()
    // })
  }

  private async getList() {
    let params: any = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      mobile: this.state.mobile,
    }

    if (this.state.orderChannel !== -1) {
      params.orderChannel = this.state.orderChannel
    }

    // if (this.state.title.trim() === '') {
    //   delete params.title
    // }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await getTimeQuantumOrder(params)
    if (res.code === 200) {
      res.data.dataList.forEach((item: any) => {
        this.state.productTypeList.forEach((obj: any) => {
          if (item.productType === obj.id) {
            item.productTypeName = obj.name
          }
        })
        // item.orderChannelName = ''
        // this.state.sellChannelList.forEach((channel: any) => {
        //   if (channel.serialNo === item.orderChannel) {
        //     item.orderChannelName = channel.name
        //   }
        // })
        this.state.sellChannelList.forEach((obj: any) => {
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

  private async getSellChanelList() {
    let params = {
      codeTypeNo: SELL_CHANNEL,
      pageSize: 99999,
    }
    let res = await queryDictList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    res.data.dataList = codeInfoListFilter(res.data.dataList);
    this.setState({
      sellChannelList: res.data.dataList,
    }, () => {
      this.getList()
    })
  }

  private onSellChange(orderChannel: number) {
    this.setState({
      orderChannel
    }, () => {
      this.getList()
    })
  }

  private search(mobile = '') {
    // if (title.trim() === '') {
    //   return
    // }
    this.setState({
      mobile,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  private async orderDetail(info: any) {
    this.setState({
      editInfo: info,
      visible: true
    })
  }

  private async operState(info: any) {
    let sure = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: `确认${info.durationOrderState === 1 ? '停用' : '启用'}？`,
        onOk: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
    if (!sure) {
      return
    }
    let params = {
      orderNo: info.orderNo,
      state: info.durationOrderState === 1 ? 2 : 1,
    }
    let res = await operateOrderState(params)
    if (res.code !== 200) {
      message.error(res.message)
    }
    message.success(`${info.durationOrderState === 1 ? '停用' : '启用'}成功`)
    this.getList()
  }

  private closeDeail() {
    this.setState({
      visible: false
    })
  }

  private closeRenew() {
    this.setState({
      isShowRenewDialog: false,
    }, () => {
      this.getList()
    })
  }

  closeChangeDevice(isRefresh: boolean) {
    this.setState({
      isShowChangeDevice: false,
    })
    if (isRefresh) {
      this.getList()
    }
  }

  private showRenewDialog(info: any) {
    this.setState({
      reNewProductNo: info.productNo,
      reNewOrderNo: info.orderNo,
      isShowRenewDialog: true,
    })
  }

  private changeDevice(info: any) {
    this.setState({
      changeDeviceInfo: info,
      isShowChangeDevice: true
    })
  }

  private async resetDevice(info: any) {
    let sure = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: `确认初始化订单旧设备？`,
        onOk: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
    if (!sure) {
      return
    }

    let res = await resetOrderOldDevice({
      orderNo: info.orderNo
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('操作成功')
  }
  // 获取数据中心数据
  private async getDataCenterList(){
    let res = await queryDataCenterList()
    if(res.code == 200){
      this.setState({
        sellChannelList: res.data.dataList,
      }, () => {
        this.getList()
      })
    }else{
      message.error(res.message)
    }
  }
  render() {
    const { list, currentPage, total, pageSize, visible, editInfo, isShowRenewDialog, reNewProductNo, reNewOrderNo,
      isShowChangeDevice, changeDeviceInfo,
      //  orderChannel, sellChannelList 
    } = this.state
    // const columns: any = [
    const columns: any = [
      {
        title: '序号',
        width: 80,
        key: 'index',
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '数据中心',
        dataIndex: 'city',
        key: 'city',
        width: 150,
      },
      {
        title: '商品类型',
        dataIndex: 'productTypeName',
        key: 'productTypeName',
        width: 150,
      },
      {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 200,
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 200,
      },
      {
        title: '虚拟机名称',
        dataIndex: 'vmName',
        key: 'vmName',
        width: 150,
      },
      // { // 小黑去掉了这个
      //   title: '用户昵称',
      //   dataIndex: 'userNickName',
      //   key: 'userNickName',
      //   width: 150,
      // },
      {
        title: '用户手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 200,
      },
      {
        title: '设备号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
        width: 260,
      },
      {
        title: '计费时间',
        dataIndex: 'buyTime',
        key: 'buyTime',
        width: 200,
        render: (text: any, item: any) => <span>{(item.buyTime + '').replace('T', ' ')}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'dueTime',
        key: 'dueTime',
        width: 200,
        render: (text: any, item: any) => <span>{((item.dueTime || '') + '').replace('T', ' ')}</span>,
      },
      {
        title: '消耗水晶',
        dataIndex: 'actuallyPay',
        key: 'actuallyPay',
        width: 150,
      },
      {
        title: '状态', // 状态待定
        dataIndex: 'durationOrderState',
        key: 'durationOrderState',
        width: 100,
        render: (text: any, item: any) => <span>{['已结束', '使用中', '已停用', '分配中', '待支付'][item.durationOrderState]}</span>,
      },
      {
        title: '操作',
        width: 300,
        dataIndex: 'operate',
        fixed: 'right',
        render: (text: any, item: any) => <div className='flex-enter'>
          <Button type='link' onClick={this.orderDetail.bind(this, item)}>详情</Button>
          <Button type='link' onClick={this.changeDevice.bind(this, item)}>更换设备</Button>
          <Button type='link' onClick={this.resetDevice.bind(this, item)}>初始化旧设备</Button>
        </div>,
      }
    ];
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <Row className='text-left'>
            <Form.Item label='手机号'>
              <Search
                placeholder=""
                maxLength={INPUT_MAXLENGTH}
                onSearch={this.search.bind(this)}
              />
            </Form.Item>
          </Row>

          {
            // 接口不支持过滤
          }
          {/* <Form.Item label='渠道'>
            <Select onChange={this.onSellChange.bind(this)} value={orderChannel}>
              <Option key='' value={-1}>全部</Option>
              {
                sellChannelList.map((item: any, index: number) => {
                  return <Option key={item.id} value={item.serialNo}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item> */}
        </Form>
        <Table scroll={{ x: 1200, y: 780 }} rowKey='orderNo' className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        {
          visible && <Detail editInfo={editInfo} onClose={this.closeDeail.bind(this)} />
        }

        {
          isShowRenewDialog && <ReNew orderNo={reNewOrderNo} productNo={reNewProductNo} onClose={this.closeRenew.bind(this)} />
        }

        {
          isShowChangeDevice && <ChangeDevice orderNo={changeDeviceInfo.orderNo} mobile={changeDeviceInfo.mobile} onClose={this.closeChangeDevice.bind(this)} ></ChangeDevice>
        }

      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_activity_edit' })(RealTimeOrder)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)