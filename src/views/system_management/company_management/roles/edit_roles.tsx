import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { RouteComponentProps  } from 'react-router-dom'
import { FormComponentProps } from 'antd/es/form';
import { Form, Input, Button, Modal, Row, Col, Select, message } from 'antd'
// import { createUser } from '../../../../server/api'
import { INPUT_MAXLENGTH } from '../../../../config/config'
import { createRoles, updateRoles } from '../../../../server/api'

const { Option } = Select
const { TextArea } = Input;
interface Props {
  user: userProps,
  dispatch: Function,
  form:any,
  handleClose: Function,
  info: any,
  // form: {
  //   validateFields: Function,
  //   getFieldDecorator: Function
  //   resetFields: Function
  // }
}

class EditRoles extends React.Component<RouteComponentProps & Props> {
  state = {
    name:  "",
    type: 0,
    state: 1,
    content: "",
  }
  constructor(props:any) {
    super(props);
    this.editRolesModalOk = this.editRolesModalOk.bind(this)
    this.rolesTypeChange = this.rolesTypeChange.bind(this);
    this.rolesStateChange = this.rolesStateChange.bind(this);
    this.editRolesModalCancel = this.editRolesModalCancel.bind(this);
    if(this.props.info) {
      this.state = {
        name: this.props.info.name,
        type: this.props.info.type,
        state: this.props.info.state,
        content: this.props.info.content,
      }
    }
  }
  // componentDidMount() {
  //   console.log()
  //   if(this.props.info) {
  //     this.setState({

  //     })
  //   }
  // }
  private editRolesModalOk() {
    this.handleOk()
  }
  private editRolesModalCancel() {
    this.props.handleClose();
  }
  private handleOk(){
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      const { type, name, content, state } =  data;
      let params:any = {
        type,
        name,
        content,
        state,
      }
      if(this.props.info) {
        params.id = this.props.info.id
        this.updateRoles(params);
      } else {
        this.createRoles(params);
      }
    });
  }
  private async createRoles(params: any){
    let response = await createRoles(params);
    if(response.code !== 200) {
      message.error(response.message);
      return false;
    }
    this.props.handleClose(true);
  }
  private async updateRoles(params: any) {
    let response = await updateRoles(params);
    if(response.code !== 200) {
      message.error(response.message);
      return false;
    }
    this.props.handleClose(true);
  }
  private rolesTypeChange(val: any) {
    this.setState({
      type: val
    })
  }
  private rolesStateChange(val: any) {
    this.setState({
      state: val
    })
  }
  render () {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = this.props.form;
    let typeList = [
      {key: 0, name: '管理员'},
      {key: 1, name: '普通'},
    ];
    let stateList = [
      {key: 0, name: '无效'},
      {key: 1, name: '有效'},
    ];
    return (
      <Modal
        visible={true}
        title={(this.props.info === null ? '新建' : '编辑' ) + "角色"}
        maskClosable={false}
        onOk={this.editRolesModalOk}
        onCancel={this.editRolesModalCancel}
        footer={[
          <Button key="back" onClick={this.editRolesModalCancel}>取消</Button>,
          <Button key="submit" type="primary" onClick={this.editRolesModalOk}>保存</Button>
        ]}
      >
        <Form {...formItemLayout} onSubmit={this.handleOk.bind(this)}>
          <Row>
            <Col span={24}>
              <Form.Item label='角色名称：' >
                {
                  getFieldDecorator("name", {
                    rules: [
                      {required: true, message: '请输入角色名称'},
                      {max: INPUT_MAXLENGTH, message: `长度最大为${INPUT_MAXLENGTH}位`},
                    ],
                    initialValue: this.state.name
                  })(
                    <Input allowClear placeholder="请输入角色名称" />
                  )
                }
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='角色类型：' >
                {
                  getFieldDecorator("type", {
                    rules: [{required: true, message: '请输选择角色类型'}],
                    initialValue: this.state.type
                  })(
                    <Select style={{ width: 120 }} onChange={this.rolesTypeChange}>
                      {
                        typeList.map((item:any) => {
                        return <Option value={item.key} key={item.key}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='是否可用：' >
                {
                  getFieldDecorator("state", {
                    rules: [{required: true, message: '请输选择状态'}],
                    initialValue: this.state.state
                  })(
                    <Select style={{ width: 120 }}>
                      {
                        stateList.map((item:any) => {
                        return <Option value={item.key} key={item.key}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )
                }
              </Form.Item>
              <Form.Item label='内容：' >
                {
                  getFieldDecorator("content", {
                    rules: [
                      {required: true, message: '请输入内容'},
                      {max: INPUT_MAXLENGTH*10, message: `长度最大为${INPUT_MAXLENGTH*10}位`},
                    ],
                    initialValue: this.state.content
                  })(
                    <TextArea
                      placeholder="请输入内容"
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                  )
                }
              </Form.Item>
            </Col>
          </Row>
            
         
          {/* <div>
            <span>角色状态：</span>
            <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
          </div>
          <div>
            <span>角色说明</span>
            <TextArea
              value={this.state.addRolesModal.info}
              placeholder="请输入角色说明"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </div> */}
        </Form>
      </Modal>
    )
  }
}

interface stateType {
  user: userProps
}

interface ComponentPropsInterface extends FormComponentProps {
  handleClose: (isRefresh: boolean) => void,
  info: null,
}

const WrappedNormalLoginForm = Form.create<ComponentPropsInterface>({ name: 'edit_roles' })(EditRoles)

export default connect(
  (state: stateType) => ({
    user: state.user
  })
)(WrappedNormalLoginForm)