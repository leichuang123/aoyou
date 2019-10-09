import React from 'react'
import './login.scss'
import { connect } from 'react-redux';
import { login } from '../../actions/index';
import { userProps } from '../../interface/user'
import { RouteComponentProps  } from 'react-router-dom'
interface Props {
  user: userProps,
  dispatch: Function
}

class Login extends React.Component<RouteComponentProps & Props> {
  btnClick = () => {
    this.props.dispatch(login({id: 1}))
  }

  componentDidMount () {
  }

  render () {
    const { user } = this.props
    return (
      <div>
        {
          user.id && <div>{ user && user.id }</div>
        }        
        <button onClick={this.btnClick}>{user.id ? '退出登录' : '登录'}</button>
      </div>
    )
  }
}

interface stateType {
  user: userProps
}

export default connect(
  (state: stateType) => ({
    user: state.user
  })
)(Login)