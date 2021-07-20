import React from 'react'
import inviteStyle from './invite.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { Form, Checkbox, Modal, Row, Input, message } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { roleListData } from '../../../server/api'
import { PAGE_SIZE, MIN_PAGE, MAX_PAGE_SIZE } from '../../../config/config'

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
  checkboxList: any
}

class Invite extends React.PureComponent<IProps, IState> {

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
    checkboxList: []
  }

  componentDidMount() {
    this.getRoleList()
  }

  private async getRoleList () {
    let res = await roleListData({
      currentPage: MIN_PAGE,
      pageSize: MAX_PAGE_SIZE,
      groupId: this.props.groupId
    })
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    this.setState({
      checkboxList: res.data.dataList.filter((item: any) => {
        return item.type !== 0
      }).map((item: any) => {
        return {
          label: item.name,
          value: item.id,
          checked: false
        }
      })
    })
  }

  private handleOkInvite() {
    this.props.onSave()
  }

  private handleCancelInvite() {
    this.props.onClose()
  }

  private checkboxChange(index: number) {
    
  }

  render() {
    const { checkboxList } = this.state
    const { getFieldDecorator } = this.props.form
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
        title="邀请"
        visible={true}
        onOk={this.handleOkInvite.bind(this)}
        onCancel={this.handleCancelInvite.bind(this)}
        width='600px'
      >
        <Form {...formItemLayout} onSubmit={this.handleOkInvite.bind(this)}>
          <Row>
            <Form.Item label='邀请人手机号' >
              {getFieldDecorator('mobile', {
                initialValue: '',
                rules: [{ required: true, message: '请输入邀请人手机号' }],
              })(
                <Input
                  className={inviteStyle.codeInput}
                  placeholder=""
                  maxLength={11}
                />,
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label='角色' >
              {getFieldDecorator('roleIdList', {
                initialValue: [],
                rules: [{ required: true, message: '请选择角色' }],
              })(
                <Checkbox.Group>
                  {
                    checkboxList.map((item: any, index: number) => {
                      return <Checkbox value={item.value} key={index} >{item.label}</Checkbox>
                    })
                  }
                </Checkbox.Group>
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
  isShowLoading: Boolean,
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: () => void,
  onSave: () => void,
  groupId: -1,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_super_admin' })(Invite)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)