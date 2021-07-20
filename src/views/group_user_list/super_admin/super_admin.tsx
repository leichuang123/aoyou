import React from 'react'
import saStyle from './super_admin.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { Form, Button, Modal, Row, Col, Input, message, Select } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { PAGE_SIZE, MIN_PAGE, MAX_PAGE_SIZE } from '../../../config/config'
import { getCode, roleListData } from '../../../server/api'

const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: Function,
  onSave: Function,
  groupId: Number,
}

interface IState {
  currentPage: number,
  pageSize: number,
  total: number,
  list: any,
  name: string,
  exportParam: any,
  visible: boolean,
  inputError: boolean,
  editInfo: any,
  isShowSetSuperAdmin: boolean,
  isShowInvite: boolean,
  checkboxList: any,
  count: number,
  roleGroupId: number,
  userRoleList: any,
}

class SuperAdmin extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    inputError: false,
    name: '',
    editInfo: null,
    isShowSetSuperAdmin: false,
    isShowInvite: false,
    checkboxList: [],
    count: 60,
    roleGroupId: -1,
    userRoleList: []
  }

  componentDidMount() {
    this.getUserRoleList()
  }

  private async getUserRoleList () {
    let params = {
      currentPage: MIN_PAGE,
      pageSize: MAX_PAGE_SIZE,
      groupId: this.props.groupId,
    }
    let res = await roleListData(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    let userRoleList: any = []
    res.data.dataList.forEach((item: any, index: number) => {
      if (item.type !== 0) {
        userRoleList.push(item)
      }
    })
    this.setState({
      userRoleList,
    })
  }

  private handleOkSuperAdmin() {
    this.props.onSave()
  }

  private handleCancelSuperAdmin() {
    this.props.onClose()
  }

  async sendCode () {
    if (this.state.count !== 60) {
      return
    }
    let mobile = this.props.form.getFieldValue('mobile')
    if (mobile === '') {
      message.warning('输输入手机号')
      return
    }
    let type = 4
    let res = await getCode({mobile, type})
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('验证码已发送')
    let timer = setInterval(() => {
      if (this.state.count <= 1) {
        clearInterval(timer)
        this.setState({
          count: 60
        })
        return
      }
      this.setState({
        count: this.state.count - 1
      })
    }, 1000)
  }


  render() {
    const { getFieldDecorator } = this.props.form
    const { count, userRoleList } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
        <Modal
          title="指定超级管理员"
          visible={true}
          onOk={this.handleOkSuperAdmin.bind(this)}
          onCancel={this.handleCancelSuperAdmin.bind(this)}
          width='600px'
        >
          <Form {...formItemLayout} onSubmit={this.handleOkSuperAdmin.bind(this)}>
            <Row>
              <Form.Item label='指定人手机号' >
                <Row gutter={8}>
                  <Col span={12}>
                    {getFieldDecorator('mobile', {
                      rules: [{ required: true, message: '请输入手机号' }],
                    })(<Input />)}
                  </Col>
                  <Col span={12}>
                    {
                      count === 60 && <Button onClick={this.sendCode.bind(this)}>发送验证码</Button>
                    }
                    
                    {
                      count !== 60 && <Button disabled>{count}s</Button>
                    }
                  </Col>
                </Row>
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label='输入验证码' >
                {getFieldDecorator('code', {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入验证码' }],
                })(
                  <Input
                    className={saStyle.codeInput}
                    placeholder=""
                  />,
                )}
              </Form.Item>
            </Row>
          <Row>
            <Form.Item label='选择自己角色' >
              {getFieldDecorator('roleGroupId', {
                initialValue: '',
                rules: [{ required: true, message: '请选择自己的角色' }],
              })(
                <Select>
                  <Option value=''>请选择</Option>
                  {
                    userRoleList.map((item: any, index: number) => {
                    return <Option value={item.id}>{item.name}</Option>
                    })
                  }
                </Select>,
              )}
            </Form.Item>
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
  onClose: () => void,
  onSave: () => void,
  groupId: -1,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_super_admin' })(SuperAdmin)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)