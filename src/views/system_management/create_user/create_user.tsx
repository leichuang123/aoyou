import React from 'react'
import './create_user.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { RouteComponentProps  } from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd'
import { createUser } from '../../../server/api'

interface Props {
  user: userProps,
  dispatch: Function,
  form: {
    validateFields: Function,
    getFieldDecorator: Function
    resetFields: Function
  }
}

class CreateUser extends React.Component<RouteComponentProps & Props> {
  handleSubmit = (e:any) => {
    e.preventDefault();
    this.props.form.validateFields(async (err: any, data: any) => {
      if (!err) {
        let res = await createUser({
          loginName: data.username,
          password: md5(data.password)
        })
        if (res.code !== 200) {
          message.error(res.message)
          return
        }
        message.success('创建成功')
        this.props.form.resetFields()
      }
    })
  }

  componentDidMount () {
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className='create-user'>
        <Form onSubmit={this.handleSubmit} className='create_user_form'>
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
          <Form.Item>
      <div className='flex-center'>
        <Button type="primary" htmlType="submit" className="login-form-button">
          创建
        </Button>
      </div>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

interface stateType {
  user: userProps
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(CreateUser)

export default connect(
  (state: stateType) => ({
    user: state.user
  })
)(WrappedNormalLoginForm)