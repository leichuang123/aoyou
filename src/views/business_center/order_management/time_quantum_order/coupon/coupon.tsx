import React from 'react'
// import cStyle from './coupon.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, message, Modal, Table, } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { getOrderCoupon, } from '../../../../../server/api'
import { PAGE_SIZE, DIALOG_MASK_CLOSABLE } from '../../../../../config/config'


interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  durationSubOrderId: number,
  onClose: () => void,
}

interface IState {
  currentPage: number,
  pageSize: number,
  name: string,
  total: number,
  info: any,
}

class RealTimeOrderDetail extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    info: null,
  }

  componentDidMount() {
    this.getList()
  }

  private handleCancel() {
    this.props.onClose()
  }

  private async getList() {
    let res = await getOrderCoupon({
      durationSubOrderId: this.props.durationSubOrderId,
    })
    // res = { "code": 200, "message": "success", "data": { "activationList": [{ "durationSubOrderId": 387, "code": "4A65HLRk2q53", "awardType": 1, "awardId": 42, "activityNo": "AYHD2020040023", "id": 42, "name": "激活卡-H-042205", "cardNo": "AYJH2020040006" }], "crystalVoucherList": [], "cashVoucherList": [], "experienceVoucherList": [] } }
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    res.data.activationList.forEach((item: any, index: number) => {
      item.index = index + 1
    })
    res.data.crystalVoucherList.forEach((item: any, index: number) => {
      item.index = index + 1
    })
    res.data.cashVoucherList.forEach((item: any, index: number) => {
      item.index = index + 1
    })
    res.data.experienceVoucherList.forEach((item: any, index: number) => {
      item.index = index + 1
    })
    this.setState({
      info: res.data
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

  private couponDetail(info: any) {

  }

  render() {
    const {  info } = this.state
    const ctivationColumns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '活动编号',
        dataIndex: 'activityNo',
        key: 'activityNo',
      },
      {
        title: '激活卡名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '激活卡编号',
        dataIndex: 'cardNo',
        key: 'cardNo',
      },
      {
        title: '激活码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '激活时间',
        dataIndex: 'activationTime',
        key: 'activationTime',
        render: (text: any) => {
        return <span>{(text + '').replace('T', ' ')}</span>
        }
      }
    ]

    const cashVoucherColumns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '活动编号',
        dataIndex: 'activityNo',
        key: 'activityNo',
      },
      {
        title: '卡券名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '有效期',
        dataIndex: 'validityEndStr',
        key: 'validityEndStr',
      },
      {
        title: '卡券编号',
        dataIndex: 'cardNo',
        key: 'cardNo',
      }]


    return (
      <Modal
        title="优惠券信息"
        visible={true}
        width={888}
        maskClosable={DIALOG_MASK_CLOSABLE}
        onCancel={this.handleCancel.bind(this)}
        footer={null}
      >
        {
          info !== null && <div>
            {
              info.activationList.length > 0 && <Table scroll={{x: true}} rowKey='index' className='table' columns={ctivationColumns} dataSource={info.activationList} pagination={false} />
            }
            {
              info.cashVoucherList.length > 0 && <Table scroll={{ x: true }} rowKey='index' className='table vendor-diver' columns={cashVoucherColumns} dataSource={info.activationList} pagination={false} />
            }
            {
              info.experienceVoucherList.length > 0 && <Table scroll={{ x: true }} rowKey='index' className='table vendor-diver' columns={cashVoucherColumns} dataSource={info.activationList} pagination={false} />
            }
            {
              info.crystalVoucherList.length > 0 && <Table scroll={{ x: true }} rowKey='index' className='table vendor-diver' columns={cashVoucherColumns} dataSource={info.activationList} pagination={false} />
            }
          </div>
        }
      </Modal>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: () => void,
  durationSubOrderId: -1,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(RealTimeOrderDetail)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)