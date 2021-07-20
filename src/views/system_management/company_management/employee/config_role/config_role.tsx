import React from 'react'
// import etStyle from './edit_role.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, Checkbox, Modal, Row, message } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { userRoleList, updateUserRole } from '../../../../../server/api'

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: Function,
  id: any,
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
    let res = await userRoleList({
      userId: this.props.id
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    let defaultList = res.data.filter((item: any) => {
      return item.ifHave
    }).map((item: any) => {
      return item.id
    })
    this.setState({
      checkboxList: res.data.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
          checked: item.ifHave
        }
      }),
      defaultList,
    })
  }

  private async handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let res = await updateUserRole({
        userId: this.props.id,
        roleIdList: data.roleIdList
      })
      if (res.code !== 200) {
        message.error(res.message)
        return
      }
      message.success('角色保存成功')
      this.props.onClose()
    })
  }


  private handleCancel() {
    this.props.onClose()
  }

  render() {
    const { checkboxList, defaultList } = this.state
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
        title="用户角色"
        visible={true}
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        width='600px'
      >
        <Form {...formItemLayout} onSubmit={this.handleOk.bind(this)}>
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
  id: any,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_super_admin' })(EditRole)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)