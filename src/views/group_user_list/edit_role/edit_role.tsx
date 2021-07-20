import React from 'react'
import erStyle from './edit_role.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { Form, Checkbox, Modal, Row, Input, message } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { roleListData, getUserRole } from '../../../server/api'
import { PAGE_SIZE, MIN_PAGE, MAX_PAGE_SIZE } from '../../../config/config'

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: Function,
  onSave: Function,
  groupId: Number,
  editInfo: any,
}

interface IState {
  currentPage: number,
  pageSize: number,
  total: number,
  list: any,
  name: string,
  exportParam: any,
  inputError: boolean,
  checkboxList: any,
  defaultList: any,
}

class EditRole extends React.PureComponent<IProps, IState> {

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
    defaultList: [],
    checkboxList: []
  }

  componentDidMount() {
    this.getUserRoleList()
  }

  private async getUserRoleList() {
    let res = await getUserRole({
      userNo: this.props.editInfo.userNo,
      groupId: this.props.groupId
    })
    if (res.code !== 200) {
      message.error(res.msg)
      return
    }
    this.setState({
      defaultList: res.data.roleList.map((item: any) => {
        return item.id
      })
    }, () => {
      this.getRoleList()
    })
  }

  private async getRoleList() {
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
        let checked = false
        this.state.defaultList.forEach((id: number) => {
          if (id * 1 === item.id * 1) {
            checked = true
          }
        })
        return {
          label: item.name,
          value: item.id,
          checked
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

  render() {
    const { checkboxList, defaultList } = this.state
    const { editInfo } = this.props
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
        title="编辑角色"
        visible={true}
        onOk={this.handleOkInvite.bind(this)}
        onCancel={this.handleCancelInvite.bind(this)}
        width='600px'
      >
        <Form {...formItemLayout} onSubmit={this.handleOkInvite.bind(this)}>
          <Row>
            <Form.Item label='昵称' >
              {getFieldDecorator('userNickName', {
                initialValue: editInfo.userNickName,
                rules: [{ required: true, message: '' }],
              })(
                <Input
                  className={erStyle.codeInput}
                  disabled
                  placeholder=""
                />,
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label='手机号' >
              {getFieldDecorator('mobile', {
                initialValue: editInfo.mobile,
                rules: [{ required: true, message: '' }],
              })(
                <Input
                  className={erStyle.codeInput}
                  disabled
                  placeholder=""
                />,
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label='角色' >
              {getFieldDecorator('roleIdList', {
                initialValue: defaultList,
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
  editInfo: null,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_super_admin' })(EditRole)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)