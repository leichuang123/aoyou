import React from 'react'
// import dStyle from './detail.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, message, Drawer, Card, Button, Row, Col, Table, Pagination, } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { getVmInfoByProductNo, getTimeCharge, getBuyList, queryDictList, } from '../../../../../server/api'
import { 
  PAGE_SIZE, 
  DIALOG_MASK_CLOSABLE,
  PREPARE_SOFTWARE_ID,
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
} from '../../../../../config/config'
import Coupon from '../coupon/coupon'
// import { codeInfoListFilter } from '../../../../../tools/tools'
interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  editInfo: any,
  onClose: () => void,
}

interface IState {
  currentPage: number,
  pageSize: number,
  name: string,
  total: number,
  list: any,
  vmInfo: any,
  costInfo: any,
  isShowCoupon: boolean,
  durationSubOrderId: number,
  presoftWareList: any,
  systemDiskList: any,
  hardDiskList: any,
  graphicList: any,
  operateList: any,
}

class RealTimeOrderDetail extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    list: [],
    vmInfo: {},
    costInfo: {},
    isShowCoupon: false,
    durationSubOrderId: -1,
    presoftWareList: [],
    systemDiskList: [],
    hardDiskList: [],
    graphicList: [],
    operateList: [],
  }

  async componentDidMount() {
    this.getDicList(PREPARE_SOFTWARE_ID)
    this.getDicList(SYSEM_DISK_ID)
    this.getDicList(HARD_DISK_ID)
    this.getDicList(GRAPHIC_MEMORY_ID)
    this.getDicList(OPERATE_SYSTEM_ID)
    this.getVmInfo()
    this.getCostInfo()
    this.getList()
  }

  private async getDicList (codeTypeNo: string) {
    let res = await queryDictList({ 
      codeTypeNo, 
      isDisableLoading: false,
      pageSize: 9999,
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    // res.data.dataList = codeInfoListFilter(res.data.dataList)
    switch (codeTypeNo) {
      case PREPARE_SOFTWARE_ID:
        this.setState({
          presoftWareList: res.data.dataList
        })
        break;
      case SYSEM_DISK_ID:
        this.setState({
          systemDiskList: res.data.dataList
        })
        break
      case HARD_DISK_ID:
        this.setState({
          hardDiskList: res.data.dataList
        })
        break
      case GRAPHIC_MEMORY_ID:
        this.setState({
          graphicList: res.data.dataList
        })
        break
      case OPERATE_SYSTEM_ID:
        this.setState({
          operateList: res.data.dataList
        })
        break
      default:
        break;
    }
  }

  private handleCancel () {
    this.props.onClose()
  }

  private closeCoupon() {
    this.setState({
      isShowCoupon: false,
    })
  }

  private async getVmInfo () {
    let res = await getVmInfoByProductNo({ productNo: this.props.editInfo.productNo })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.state.systemDiskList.forEach((item: any) => {
      if (item.serialNo === +res.data.systemDisk) {
        res.data.systemDiskName = item.name
      }
    })
    this.state.hardDiskList.forEach((item: any) => {
      if (item.serialNo === +res.data.hardDisk) {
        res.data.hardDiskName = item.name
      }
    })
    this.state.graphicList.forEach((item: any) => {
      if (item.serialNo === +res.data.graphicsMemory) {
        res.data.graphicsMemoryName = item.name
      }
    })
    this.state.operateList.forEach((item: any) => {
      if (item.serialNo === +res.data.operateSystem) {
        res.data.operateSystemName = item.name
      }
    })
    this.setState({
      vmInfo: res.data
    })
  }

  private async getCostInfo () {
    let res = await getTimeCharge({ productNo: this.props.editInfo.productNo })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      costInfo: res.data
    })
  }
  private async getList () {
    let res = await getBuyList({ 
      productNo: this.props.editInfo.productNo, 
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      orderNo: this.props.editInfo.orderNo,
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    res.data.dataList.forEach((item: any, index: number) => {
      item.index = (this.state.currentPage - 1) * this.state.pageSize + index + 1
      item.buyTime = item.buyTime.replace('T', ' ')
      item.renewDueTime = item.renewDueTime.replace('T', ' ')
    })
    this.setState({
      list: res.data.dataList
    })
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

  private async couponDetail (info: any) {
    this.setState({
      isShowCoupon: true,
      durationSubOrderId: info.id
    })
  }

  render() {
    const { editInfo } = this.props
    const { vmInfo, costInfo, currentPage, total, pageSize, list, isShowCoupon, durationSubOrderId  } = this.state
    const columns: any = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '订单号',
        dataIndex: 'subOrderNo',
        key: 'subOrderNo',
      },
      {
        title: '购买时间',
        dataIndex: 'buyTime',
        key: 'buyTime',
      },
      {
        title: '结束时间',
        dataIndex: 'renewDueTime',
        key: 'renewDueTime',
      },
      {
        title: '时长',
        dataIndex: 'totalDurationStr',
        key: 'totalDurationStr',
        render: (text: any, item: any) => <span>
          {
            item.duration + ['天', '月', '年'][item.durationUnit - 1]
          }
        </span>
      },
      {
        title: '应付水晶',
        dataIndex: 'handle',
        key: 'handle',
      },
      {
        title: '消耗水晶',
        dataIndex: 'actuallyPay',
        key: 'actuallyPay',
      },
      {
        title: '是否使用优惠券',
        dataIndex: 'isCoupon',
        key: 'isCoupon',
        render: (text: any, item: any) => <div className='flex-enter'>
          {item.isCoupon ? '是' : '否'}
        </div>
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        render: (text: any, item: any) => <div className='flex-enter'>
          {
            item.isCoupon && <Button type='link' onClick={this.couponDetail.bind(this, item)}>优惠券详情</Button>
          }
        </div>,
      },
    ]
    return (
      <Drawer
        title="订单详情"
        visible={true}
        width={900}
        maskClosable={DIALOG_MASK_CLOSABLE}
        // onCancel={this.handleCancel.bind(this)}
        onClose={this.handleCancel.bind(this)}
      >
        <Card title="基础信息">
          <Row gutter={[16, 16]}>
            <Col span={24} >
              商品类型：{ editInfo.productName }
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              订单编号：{ editInfo.orderNo }
            </Col>
            <Col span={12}>
              商品名称：{ editInfo.productName }
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              用户昵称：{ editInfo.userNickName }
            </Col>
            <Col span={12}>
              用户手机号：{ editInfo.mobile }
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              购买时间：{ (editInfo.buyTime + '').replace('T', ' ') }
            </Col>
            <Col span={12}>
              结束时间：{(editInfo.dueTime + '').replace('T', ' ')}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              消耗水晶：{ editInfo.actuallyPay }
            </Col>
            <Col span={12}>
              状态：{['已结束', '使用中', '已停用', '分配中', '待支付'][editInfo.durationOrderState] }
            </Col>
          </Row>
        </Card>
        <Card title="虚拟机信息" className="vendor-diver">
          <Row gutter={[16, 16]}>
            <Col span={12} >
              虚拟机名称：{ vmInfo.vmName }
            </Col>
            <Col span={12}>
              内存：{vmInfo.memory}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              cpu：{ vmInfo.cpu }
            </Col>
            <Col span={12}>
              系统盘：{vmInfo.systemDiskName}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            
            <Col span={12}>
              操作系统：{ vmInfo.operateSystemName }
            </Col>
            <Col span={12}>
              显存：{vmInfo.graphicsMemoryName}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              硬盘：{ vmInfo.hardDiskName }
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              预装软件：{vmInfo.preinstallSoftwareList ? vmInfo.preinstallSoftwareList.map((item: any) => {
                return item.name
              }).join(',') : '' }
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              使用说明：{vmInfo.instructions}
            </Col>
          </Row>
        </Card>
        <Card title="时长计费信息" className="vendor-diver">
          <Row gutter={[16, 16]}>
            <Col span={12} >
              名称：{ costInfo.name }水晶
            </Col>
            <Col span={12} >
              每天：{costInfo.daily}水晶
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12} >
              每月：{costInfo.monthly}水晶
            </Col>
            <Col span={12} >
              每年：{costInfo.annually}水晶
            </Col>
          </Row>
        </Card>
        <Card title="购买记录" className="vendor-diver">
          <Table scroll={{ x: true }} rowKey='index' className='table' columns={columns} dataSource={list} pagination={false} />
          <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        </Card>
        {
          isShowCoupon && <Coupon durationSubOrderId={durationSubOrderId} onClose={this.closeCoupon.bind(this)} />
        }
      </Drawer>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: () => void,
  editInfo: null,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(RealTimeOrderDetail)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)