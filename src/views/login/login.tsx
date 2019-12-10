import React from 'react'
import './login.scss'
import { connect } from 'react-redux';
import { login } from '../../actions/index';
import { userProps } from '../../interface/user'
import { RouteComponentProps  } from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd'
import { serverLogin } from '../../server/api'
import { switch_loading } from '../../actions/index';

interface Props {
  user: userProps,
  dispatch: Function,
  form: {
    validateFields: Function,
    getFieldDecorator: Function
  }
}

class Login extends React.Component<RouteComponentProps & Props> {


  handleSubmit = (e:any) => {
    e.preventDefault();
    this.props.form.validateFields(async (err: any, data: any) => {
      if (!err) {
        this.props.dispatch(switch_loading({show: true}))
        let res = await serverLogin({
          userName: data.username,
          password: data.password
        })
        this.props.dispatch(switch_loading({show: false}))
        if (res.success === 'true') {
          this.props.dispatch(login(res.info))
          this.props.history.push('/')
        } else {
          message.error(res.msg)
        }
      }
    })
  }

  componentDidMount () {
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login'>
        <Form onSubmit={this.handleSubmit} className="login-form" >
			<div className="login_face">
				<img alt='头像' src="http://layuicms.com/v2/images/face.jpg" className="userAvatar" />
			</div>
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
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
			<div className='flex-center'>
				<Button type="primary" htmlType="submit" className="login-form-button">
				  登录
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

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login)

export default connect(
  (state: stateType) => ({
    user: state.user
  })
)(WrappedNormalLoginForm)