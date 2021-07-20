import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, message, Input, Modal, Row, Col, Button, } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { createpreSoftWare } from '../../../../../server/api'

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: (isRefresh: boolean) => void,
  editInfo: any,
  isViewOnly: boolean,
}

interface IState {
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  startTime: string,
  endTime: string,
  channelList: any,
  activityTypeList: any,
  sellChannel: number,
}

class EditSoftware extends React.PureComponent<IProps, IState> {

  state: any = {
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    startTime: '',
    endTime: '',
    channelList: [],
    activityTypeList: [],
    sellChannel: '',
  }

  componentDidMount() {
    
  }


  private handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let params = {
        state: 1
      }
      Object.assign(params, data)
      // Object.assign(params, {channelNo: params.channel[0]})
      let res = await createpreSoftWare(params)
      if (res.code === 200) {
        this.props.form.resetFields()
        message.success('保存成功！')
        this.props.onClose(true)
      } else {
        message.error(res.message)
      }
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose(false)
  }

  render() {
    const { editInfo, isViewOnly } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const Footer = (<div className='flex-end'>
      <Button type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
      <Button onClick={this.handleCancel.bind(this)}>取消</Button>
    </div>)
    const title = editInfo === null ? '新建预装软件' : '编辑预装软件'
    return (
      <Modal
        title={isViewOnly ? '软件详情' : title}
        visible={true}
        maskClosable={false}
        footer={isViewOnly ? null : Footer}
        width='800px'
        onCancel={this.handleCancel.bind(this)}
      >
        <Form {...formItemLayout} className="edit-form" onSubmit={this.handleOk.bind(this)}>
          <Row>
            <Col span={12}>
              <Form.Item label='软件名称'>
                {getFieldDecorator('name', {
                  initialValue: editInfo !== null ? editInfo.name : '',
                  rules: [{ required: true, message: '请输入名称' }],
                })(
                  <Input
                    disabled={isViewOnly}
                    placeholder="最多64个字"
                    maxLength={64}
                  />,
                )}
              </Form.Item>

            </Col>
            <Col span={12}>
              <Form.Item label='启动项'>
                {getFieldDecorator('startup', {
                  initialValue: editInfo !== null ? editInfo.startup : '',
                  rules: [{ required: true, message: '请输入启动项' }],
                })(
                  <Input
                    disabled={isViewOnly}
                    placeholder="最多10个字"
                    maxLength={10}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          
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
  onClose: (isRefresh: boolean) => void,
  editInfo: null,
  isViewOnly: boolean,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(EditSoftware)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)