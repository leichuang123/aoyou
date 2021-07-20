import React from 'react'
import { connect } from 'react-redux';
import { Input, message,Table, Button, Pagination, Select, Row, Col, Divider, Popconfirm, Drawer } from 'antd';

import { 
  getManOrderList,
  submitPmanualOrder,
  cancelManualOrder,
  getManualOrderByNo,
  getManualOrderDeviceInfo,
  queryDictList,
  queryVMDetails,
} from '../../../../../server/api'
import { 
  SELL_CHANNEL, 
  TIME_UNIT_LIST,
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
} from '../../../../../config/config'
import order from './manual_order.module.scss'
// import OrderModal from './orderModal'
import OrderDrawer from './orderDrawer'
// import { codeInfoListFilter } from '../../../../../tools/tools'
const { Option } = Select;
const { Search } = Input;
interface IProps {
  dispatch: Function,
}

interface IState {
}

class ManualOrder extends React.PureComponent<IProps, IState> {
  state:any = {
    searchPhoneNumber: "",
    state: "",
    currentPage: 1,
    pageSize: 10,
    totalCount:0,
    orderList: [],
    orderModalVisible: false,
    chosedOrder: null,
    detailModalVisible: false,
    manualOrderDetail: null,
    deviceCurrentPage: 1,
    devicePageSize: 5,
    deviceTotalCount: 0,
    deviceChoosedList: [],
    deviceDetailModalVisible: false,
    deviceDetail: null,
    choosedManualOrderNo: null,
    editOrderInfo: null,
    dcCurrentPage: 1,
    dcTotalCount: 0,
    sellChannelList: [],
    systemDiskList: [],
    hardList: [],
    graphicList: [],
    operateSystemList: []
  }
  componentDidMount() {
    this.getSellChanelList()
  }
  // 表单相关
  // 搜索
  private onSearch(val:any) {
    this.setState({
      searchPhoneNumber: val
    },() => {
      this.getManOrderList()
    })
  }
  private formatNumber(e:any) {
    const { value } = e.target;
    this.setState({
      searchPhoneNumber: value.replace(/[^0-9]+/g,'')
    });
  }
  // 获取列表
  private async getManOrderList() {
    let params:any = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    }
    if(this.state.searchPhoneNumber !== "") {
      params.mobile = this.state.searchPhoneNumber;
    }
    if(this.state.state !== "") {
      params.state = this.state.state;
    }
      
    let res = await getManOrderList(params);
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    res.data.dataList.forEach((item: any) => {
      this.state.sellChannelList.forEach((obj: any) => {
        if (item.channelNo === obj.serialNo) {
          item.channelName = obj.name
        }
      })
    })
    this.setState({
      totalCount: res.data.page.totalCount,
      orderList: res.data.dataList,
    })
    this.getDicList(SYSEM_DISK_ID)
    this.getDicList(HARD_DISK_ID)
    this.getDicList(GRAPHIC_MEMORY_ID)
    this.getDicList(OPERATE_SYSTEM_ID)
  }
  async getDicList (codeTypeNo: string) {
    let res = await queryDictList({
      codeTypeNo,
      pageSize: 99999,
    })
    // res.data.dataList = codeInfoListFilter(res.data.dataList)
    switch (codeTypeNo) {
      case SYSEM_DISK_ID:
        this.setState({
          systemDiskList: res.data.dataList
        })
        break;
      case HARD_DISK_ID:
        this.setState({
          hardList: res.data.dataList
        })
        break;
      case GRAPHIC_MEMORY_ID:
        this.setState({
          graphicList: res.data.dataList
        })
        break;
      case OPERATE_SYSTEM_ID:
        this.setState({
          operateSystemList: res.data.dataList
        })
        break;
      default:
        break;
    }
  }
  private async getSellChanelList() {
    let params = {
      codeTypeNo: SELL_CHANNEL,
      pageSize: 9999,
    }
    let res = await queryDictList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    // res.data.dataList = codeInfoListFilter(res.data.dataList);
    this.setState({
      sellChannelList: res.data.dataList,
    }, () => {
        this.getManOrderList()
    })
  }


  // 分页器
  private onShowSizeChange(current:number, size: number) {
    this.setState({
      pageSize: size,
      currentPage: 1,
    },() => {
      this.getManOrderList();
    })
  }
  private paginationChange(val:number) {
    this.setState({
      currentPage: val,
    },() => {
      this.getManOrderList();
    })
  }
  // 订单弹窗
  private toCreateOrder(val:any = null) {
    this.setState({
      orderModalVisible: true,
      editOrderInfo:val
    })
    
  }
  private closeOrderModal() {
    this.setState({
      orderModalVisible: false
    })
  }
  private handleChange(val: any) {
    this.setState({
      state: val,
    },() => {
      this.getManOrderList();
    })
  }
  private async submitPmanualOrder(val:any) {
    let params = {
      manualOrderNo: val.manualOrderNo
    }
    let res = await submitPmanualOrder(params);
    if(res.code === 200) {
      this.getManOrderList();
    } else {
      message.error(res.message);
    }
  }
  private async cancelManualOrder(val:any) {
    let params = {
      manualOrderNo: val.manualOrderNo
    }
    let res = await cancelManualOrder(params);
    if(res.code === 200) {
      this.getManOrderList();
    } else {
      message.error(res.message);
    }
  }
  private handleCancel() {
    this.setState({
      detailModalVisible: false,
    })
  }
  
  private showOederDetail(val:any) {
    this.setState({
      choosedManualOrderNo:val.manualOrderNo
    },() => {
      this.getManualOrderByNo(val.manualOrderNo);
      this.getManualOrderDeviceInfo(val.manualOrderNo);
    })
    
  }
  private async getManualOrderDeviceInfo(manualOrderNo:any) {
    let params = {
      manualOrderNo: manualOrderNo,
      currentPage: this.state.deviceCurrentPage,
      pageSize: this.state.devicePageSize,
    }
    // getManualOrderDeviceInfo
    let res = await getManualOrderDeviceInfo(params);
    if (res.code === 200) {
      this.setState({
        deviceTotalCount: res.data.page.totalCount,
        deviceChoosedList: res.data.dataList,
      })
    } else {
      message.error(res.message);
    }
  }
  private async getManualOrderByNo(manualOrderNo: string){
    let params = {
      manualOrderNo: manualOrderNo
    }
    let res = await getManualOrderByNo(params);
    if(res.code === 200) {
      this.setState({
        manualOrderDetail: res.data,
      }, () => {
        this.setState({
          detailModalVisible: true,
        })
      })
    } else {
      message.error(res.message);
    }
  }
  private async showDeviceDetail(val:any) {
    let params = {
      productNo: val.productNo,
      // manualOrderNo: this.state.choosedManualOrderNo
    }
    // let deviceParams = {
    //   manualOrderNo: this.state.choosedManualOrderNo,
    //   deviceNo: val.deviceNo
    // }
    let res =  await queryVMDetails(params);
    // let devres = await getManualDeviceInfo(deviceParams)
    
    ///
    this.state.systemDiskList.forEach((obj:any) => {
      if (obj.serialNo === +res.data.systemDisk) {
        res.data.systemDiskName = obj.name
      }
    })
    this.state.hardList.forEach((obj:any) => {
      if (obj.serialNo === +res.data.hardDisk) {
        res.data.hardDiskName = obj.name
      }
    })
    this.state.graphicList.forEach((obj:any) => {
      if (obj.serialNo === +res.data.graphicsMemory) {
        res.data.graphicsMemoryName = obj.name
      }
    })
    this.state.operateSystemList.forEach((obj:any) => {
      if (obj.serialNo === +res.data.operateSystem) {
        res.data.operateSystemName = obj.name
      }
    })
    this.setState({
      deviceDetail: {...res.data, ...val}
    }, () => {
      this.setState({
        deviceDetailModalVisible: true
      })
    })
  }
  private serviceDetailHandleCancel() {
    this.setState({
      deviceDetail: null,
      deviceDetailModalVisible: false
    })
  }
  private serviceDetailHandleOk() {

  }
  private dcPaginationChange(val:any) {
    this.setState({
      dcCurrentPage: val,
    },() => {
      this.getManualOrderDeviceInfo(this.state.manualOrderNo);
    })
  }
  private renderButton(record: any) {
    let buttons = null;
    switch (record.state) {
      case 0:
        buttons = (
          <div>
            <Popconfirm onConfirm={this.submitPmanualOrder.bind(this,record)} title="确认下单？" okText="确定" cancelText="再想想">
              <Button type="link">下单</Button>
            </Popconfirm>
            <Popconfirm onConfirm={this.cancelManualOrder.bind(this,record)} title="确认撤销？" okText="确定" cancelText="再想想">
              <Button type="link">驳回</Button>
            </Popconfirm>
            <Button type="link" onClick={this.toCreateOrder.bind(this,record)}>编辑</Button>
          </div>
        )
        break;
      case 1:
      case 3:
          buttons = (
            <div>
              <Button type="link" onClick={this.showOederDetail.bind(this, record)}>详情</Button>
            </div>
          )
        break;
      case 2:
          buttons = (
            <div>
              <Button type="link" onClick={this.showOederDetail.bind(this, record)}>详情</Button>
            </div>
          )
        break;
      default:
        break;
    }
    // return (<div>
    //   {
    //     record.state === 0 && <Button type="link" onClick={this.submitPmanualOrder.bind(this,record)}>立即下单</Button>
    //   }
    //   {
    //     record.state === 0 && <Button type="link" onClick={this.toCreateOrder.bind(this,record)}>编辑</Button>
    //   }
    //   {
    //     record.state === 0 && <Button type="link" onClick={this.cancelManualOrder.bind(this,record)}>作废</Button>
    //   }
    //   {
    //     record.state === 1 && <Button type="link" onClick={this.showOederDetail.bind(this, record)}>详情</Button>
    //   }
    //   {
    //     record.state === 2 && <Button type="link" onClick={this.showOederDetail.bind(this, record)}>详情</Button>
    //   }
      
    // </div>)
    return buttons;
  }
  render () {    
    const columns:any = [
      {
        width: 100,
        title: '序号',
        dataIndex: 'index',
        render: (text: any, record: any, index: number) => (
          <span>
            {(this.state.currentPage - 1) * this.state.pageSize + index + 1}
          </span>
        )
      },
      {
        title: '订单号',
        dataIndex: 'manualOrderNo',
        width: 200,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '订单类型',
        dataIndex: 'type',
        width: 150,
        render:(text: number) => {
          if(text === 0) {
            return (<div>代销订单</div>)
          } else {
            return (<div>集采订单</div>)
          }
        }
      },
      // {
      //   title: '数据中心',
      //   dataIndex: 'city',
      //   width: 200,
      // },
      {
        title: '预下单号',
        dataIndex: 'preOrderNo',
        width: 200,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200,
      },
      {
        title: '订单状态',
        dataIndex: 'state',
        // width: 100,
        render: (text: any) => {
          let content = "";
            switch (text) {
              case 0:
                content = "新订单"
                break;
              case 1:
                content = "已下单"
                break;
              case 2:
                content = "已作废"
                break;
              case 3:
                content = "已结束"
                break;
              default:
                content = "未知状态"
                break;
            }
          return (
            <div>{content}</div>
          )
        }
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: (record: any) => {
          return (
            <div>
              {
                this.renderButton(record)
              }
            </div>
          )
        }
      }
    ];
    const deviceColumns:any = [
      {
        width: 100,
        title: '序号',
        dataIndex: 'index',
        render: (text: any, record: any, index: number) => (
          <span>
            {(this.state.deviceCurrentPage - 1) * this.state.devicePageSize + index + 1}
          </span>
        )
      },
      {
        title: '盒子串号',
        dataIndex: 'deviceNo',
        width: 200,
      },
      {
        title: '云服务',
        dataIndex: 'cloudService'
      },
      {
        title: '产品编号',
        dataIndex: 'productNo'
      },
      {
        title: '激活时间',
        dataIndex: 'activateTime'
      },
      {
        title: '时长订单编号',
        dataIndex: 'durationOrderNo'
      },
      {
        title: '状态',
        dataIndex: 'state',
        width: 100,
        render: (text: any) => {
          let content = "";
            switch (text) {
              case 0:
                content = "未激活"
                break;
              case 1:
                content = "已激活"
                break;
              default:
                content = "未知状态"
                break;
            }
          return (
            <div>{content}</div>
          )
        }
      },
      {
        title: '操作',
        fixed: 'right',
        render: (record: any) => {
          return (
            <div>
              <Button type="link" onClick={this.showDeviceDetail.bind(this, record)}>详情</Button>
            </div>
          )
        }
      }
    ];
    return (
      <div className={order.body}>
        <div className={order.nav}>
          <div>
            <Search placeholder="客户手机号" onSearch={this.onSearch.bind(this)} style={{ width: 200 }} value={this.state.searchPhoneNumber} onChange={this.formatNumber.bind(this)} maxLength={11} allowClear />
            <Select defaultValue="" style={{ width: 120, marginLeft: '12px' }} onChange={this.handleChange.bind(this)}>
              <Option value="">全部</Option>
              <Option value={0}>新订单</Option>
              <Option value={1}>已下单</Option>
              <Option value={2}>已作废</Option>
            </Select>
          </div>
          <div className={order.button_area}>
            <Button type="primary" onClick={this.toCreateOrder.bind(this, null)}>新建订单</Button>
          </div>
        </div>
        <div>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={this.state.orderList}
            bordered
            pagination={false}
            rowKey="manualOrderNo"
          />
          <Pagination 
          className='vendor-diver'
          onShowSizeChange={this.onShowSizeChange.bind(this)} 
          showQuickJumper defaultCurrent={1} 
          showSizeChanger
          onChange={this.paginationChange.bind(this)}
          current={this.state.currentPage}
          total={this.state.totalCount}/>
        </div>
        {
          <OrderDrawer
            editOrderInfo={this.state.editOrderInfo}
            refreshList={this.getManOrderList.bind(this)}
            visible={this.state.orderModalVisible} 
            orderInfo={this.state.chosedOrder}
            sellChannelList={this.state.sellChannelList}
            onClose={this.closeOrderModal.bind(this)}/>
        }
        <Drawer
          title="详情"
          visible={this.state.detailModalVisible}
          width={800}
          onClose={this.handleCancel.bind(this)}
        >
          <Divider orientation="left">基础信息</Divider>
          {
            this.state.manualOrderDetail && 
            <div>
              <Row gutter={[8, 16]}>
                <Col span={12}>
                  订单单号: &nbsp;&nbsp;&nbsp;&nbsp;{this.state.manualOrderDetail.manualOrderNo}
                </Col>
                <Col span={12}>
                  预下单号: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ this.state.manualOrderDetail.preOrderNo}
                </Col>
                
              </Row>
              <Row gutter={[8, 16]}>
                <Col span={12}>
                  盒子总数: &nbsp;&nbsp;&nbsp;&nbsp;{this.state.manualOrderDetail.number}
                </Col>
                <Col span={12}>
                  用户手机号: &nbsp;&nbsp;&nbsp;&nbsp;{this.state.manualOrderDetail.mobile}
                </Col>
              </Row>
              <Row gutter={[8, 16]}>
                <Col span={12}>
                  创建时间: &nbsp;&nbsp;&nbsp;&nbsp;{this.state.manualOrderDetail.createTime}
                </Col>
                <Col span={12}>
                  下单时间: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.manualOrderDetail.submitTime}
                </Col>
              </Row>
            </div>
          }
          <Divider orientation="left">盒子信息</Divider>
          <Table
            scroll={{ x: true }}
            columns={deviceColumns}
            dataSource={this.state.deviceChoosedList}
            bordered
            pagination={false}
            rowKey="productNo"
          />
          <Pagination 
            showQuickJumper defaultCurrent={1} 
            onChange={this.dcPaginationChange.bind(this)}
            current={this.state.deviceCurrentPage}
            total={this.state.deviceTotalCount}/>
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
                zIndex: 999,
              }}
            >
              <Button key="back"  type="primary" onClick={this.handleCancel.bind(this)}>
              关闭
            </Button>
            </div>
        </Drawer>
        <Drawer
          title="服务详情"
          visible={this.state.deviceDetailModalVisible}
          width={400}
          onClose={this.serviceDetailHandleCancel.bind(this)}
        >
          {
            this.state.deviceDetail && 
            <div>
              <Row gutter={[8, 16]}>
                <Col span={8}>商品名称</Col>
                <Col span={16}>{this.state.deviceDetail.productName}</Col>
                {/* <Col span={8}>虚机名称</Col>
                <Col span={16}>{this.state.deviceDetail.deviceNo}</Col> */}
                
              </Row>
              <Row gutter={[8, 16]}>
                <Col span={8}>内存</Col>
                <Col span={16}>{this.state.deviceDetail.memory || "---"}</Col>
                <Col span={8}>CPU</Col>
                <Col span={16}>{this.state.deviceDetail.cpu || "---"}</Col>
              </Row>
              <Row gutter={[8, 16]}>
                <Col span={8}>系统盘</Col>
                <Col span={16}>{this.state.deviceDetail.hardDiskName || "---"}</Col>
                <Col span={8}>操作系统</Col>
                <Col span={16}>{this.state.deviceDetail.operateSystemName || "---"}</Col>
              </Row>
              <Row gutter={[8, 16]}>
                <Col span={8}>显存</Col>
                <Col span={16}>{this.state.deviceDetail.graphicsMemoryName || "---"}</Col>
                <Col span={8}>硬盘</Col>
                <Col span={16}>{this.state.deviceDetail.systemDiskName || "---"}</Col>
              </Row>
              <Row gutter={[8, 16]}>
                <Col span={8}>每天(水晶)</Col>
                <Col span={16}>{this.state.deviceDetail.timeCharge.daily || "---"}</Col>
                <Col span={8}>每月(水晶)</Col>
                <Col span={16}>{this.state.deviceDetail.timeCharge.monthly || "---"}</Col>
                <Col span={8}>每年(水晶)</Col>
                <Col span={16}>{this.state.deviceDetail.timeCharge.annually || "---"}</Col>
              </Row>
              <Row gutter={[8, 16]}>
                <Col span={8}>时长</Col>
                <Col span={16}>
                  {this.state.deviceDetail.duration}
                  {TIME_UNIT_LIST[this.state.deviceDetail.durationUnit]}
                </Col>
              </Row>
            </div>
          }
          <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
                zIndex: 999,
              }}
            >
              <Button key="save" type="primary" onClick={this.serviceDetailHandleCancel.bind(this)}>
                关闭
              </Button>
            </div>
        </Drawer>
      </div>
    )
  }
}

interface stateType {
  isShowLoading: Boolean
}



export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(ManualOrder)