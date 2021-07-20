import React from 'react'
// import cStyle from './coupon.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, Radio, Modal, message, } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { queryVmDetilByProductNo, renewalByManage } from '../../../../../server/api'
import { PAGE_SIZE, DIALOG_MASK_CLOSABLE } from '../../../../../config/config'


interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  productNo: string,
  orderNo: string,
  onClose: () => void,
}

interface IState {
  currentPage: number,
  pageSize: number,
  name: string,
  total: number,
  list: any,
  shortcutDurationId: number,
  timeChargeId: number,
}

class ReNew extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    list: [],
    timeChargeId: -1,
    shortcutDurationId: -1,
  }

  componentDidMount() {
    this.getList()
  }

  private handleCancel() {
    this.props.onClose()
  }

  private async getList() {
    let res = await queryVmDetilByProductNo({
      productNo: this.props.productNo,
      isFormData: true,
    })
    let shortcutDurationId = -1
    res.data.shortcutDurationVOList.forEach((item: any, index: number) => {
      if (index === 0) {
        shortcutDurationId = item.id
      }
      switch (item.durationUnit) {
        case 1:
          item.durationUnitName = item.duration + '天'
          break;
        case 2:
          item.durationUnitName = item.duration + '月'
          break;
        case 3:
          item.durationUnitName = item.duration + '年'
          break;
        default:
          item.durationUnitName = '未知计费单位！！！'
          break;
      }
    })
    this.setState({
      timeChargeId: res.data.timeChargeId,
      shortcutDurationId,
      list: res.data.shortcutDurationVOList.map((item: any) => {
        return {
          label: item.durationUnitName,
          value: item.id
        }
      })
    })
  }

  private radioChange (e: any) {
    this.setState({
      shortcutDurationId: e.target.value
    })
  }

  private async handleOk () {
    if (this.state.shortcutDurationId === -1) {
      message.error('请选择快捷时长')
      return
    }
    let res = await renewalByManage({
      orderNo: this.props.orderNo,
      timeChargeId: this.state.timeChargeId,
      shortcutDurationId: this.state.shortcutDurationId
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('续费成功')
    this.props.onClose()
  }

  render() {
    const { list, shortcutDurationId } = this.state
  
    return (
      <Modal
        title="续费"
        visible={true}
        width={500}
        maskClosable={DIALOG_MASK_CLOSABLE}
        onCancel={this.handleCancel.bind(this)}
        onOk={this.handleOk.bind(this)}
      >
        <Radio.Group options={list} value={shortcutDurationId} onChange={this.radioChange.bind(this)} />
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
  productNo: any,
  orderNo: any,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(ReNew)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)