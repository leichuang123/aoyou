import React from 'react'
// import cdStyle from './change_device.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, Select, Modal, message, Input, Row, Col, Button } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { changDevice } from '../../../../../server/api'
import { PAGE_SIZE, DIALOG_MASK_CLOSABLE } from '../../../../../config/config'

const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  orderNo: string,
  mobile: string,
  onClose: (isRefresh: boolean) => void,
}

interface IState {
  currentPage: number,
  pageSize: number,
  name: string,
  total: number,
  list: any,
  shortcutDurationId: number,
  timeChargeId: number,
  operationTypeList: any,
  operationType: number,
  newDeviceNo: string,
}

class ChangeDevice extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    list: [],
    timeChargeId: -1,
    shortcutDurationId: -1,
    operationTypeList: [{
      label: '绑定',
      value: 1
    }, {
      label: '置换',
      value: 2
    }],
    operationType: 0, // 操作类型
    newDeviceNo: '',
  }

  componentDidMount() {
  }

  private handleCancel() {
    this.props.onClose(false)
  }

  operationTypeChange(operationType: number) {
    this.setState({
      operationType
    })
  }

  private async handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      if (data.newDeviceNo.endsWith('xxxx')) {
        message.error('请检查设备号')
        return
      }

      if (data.operationType === 0) {
        message.error('请选择操作类型')
        return
      }

      let res = await changDevice({
        orderNo: this.props.orderNo,
        mobile: this.props.mobile,
        operationType: data.operationType,
        newDeviceNo: data.newDeviceNo,
      })
      if (res.code !== 200) {
        message.error(res.message)
        return
      }
      message.success('操作成功')
      this.props.onClose(true)
    })
  }

  render() {
    const { operationTypeList, operationType, newDeviceNo } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = this.props.form

    const Footer = (<div className='flex-end'>
      <Button type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
      <Button onClick={this.handleCancel.bind(this)}>取消</Button>
    </div>)
    return (
      <Modal
        title="绑定/更换设备"
        visible={true}
        width={500}
        maskClosable={DIALOG_MASK_CLOSABLE}
        onCancel={this.handleCancel.bind(this)}
        footer={Footer}
      >
        <Form {...formItemLayout} onSubmit={this.handleOk.bind(this)}>
          <Row>
            <Col span={24}>
              <Form.Item label='操作类型'>
                {getFieldDecorator('operationType', {
                  initialValue: operationType,
                  rules: [{ required: true, message: '请选择操作类型' }],
                })(
                  <Select onChange={this.operationTypeChange.bind(this)}>
                    <Option key='' value={0}>请选择</Option>
                    {
                      operationTypeList.map((item: any, index: number) => {
                        return <Option key={item.value} value={item.value}>{item.label}</Option>
                      })
                    }
                  </Select>
                )}
              </Form.Item>

            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label='设备号'>
                {getFieldDecorator('newDeviceNo', {
                  initialValue: newDeviceNo,
                  rules: [{ required: true, message: '请输入设备号' }],
                })(
                  <Input type="text" placeholder="请输入设备号" maxLength={25}></Input>
                )}
              </Form.Item>

            </Col>
          </Row>
          {/* <p className={cdStyle.tip}>例如：001001A01000100E04C49xxxx</p> */}
        </Form>        
      </Modal>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: (isRefresh: boolean ) => void,
  mobile: any,
  orderNo: any,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(ChangeDevice)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)