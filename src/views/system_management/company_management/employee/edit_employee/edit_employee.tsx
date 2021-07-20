import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, message, Input, Modal, Icon, Button, } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { createUser } from '../../../../../server/api'

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

class EditUser extends React.PureComponent<IProps, IState> {

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
        loginName: data.username,
        password: md5(data.password)
      }
      let res = await createUser(params)
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
    const title = editInfo === null ? '新建员工' : '编辑员工'
    return (
      <Modal
        title={isViewOnly ? '员工详情' : title}
        visible={true}
        maskClosable={false}
        footer={isViewOnly ? null : Footer}
        width='500px'
        onCancel={this.handleCancel.bind(this)}
      >
        <Form {...formItemLayout}  className="edit-form" onSubmit={this.handleOk.bind(this)}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码"
                />,
              )}
            </Form.Item>
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

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(EditUser)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)