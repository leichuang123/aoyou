import React from 'react'
import './login.scss'
import { connect } from 'react-redux';
import { login } from '../../actions/index';
import { userProps } from '../../interface/user'
import { RouteComponentProps  } from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd'
import { serverLogin, userPermission } from '../../server/api'
import { ACCOUNT_NAME, MENUS } from '../../constants/storage_key'

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
        let res = await serverLogin({
          loginName: data.username,
          password: md5(data.password)
        })
        if (res.code === 200) {
          localStorage.setItem(ACCOUNT_NAME, data.username)
          Object.assign(res.data, {
            loginName: data.username,
          })
          this.props.dispatch(login(res.data))
          this.initMenus()
        } else {
          message.error(res.message)
        }
      }
    })
  }

  private async initMenus () {
    let res = await userPermission()
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    store.set(MENUS, res.data)
    this.props.history.push('/')
  }

  componentDidMount () {
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className='login'>
        <Form onSubmit={this.handleSubmit} className="login-form" >
			<div className="login_face">
            <img alt='头像' src={require('../../assets/images/login/face.jpg')} className="userAvatar" />
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