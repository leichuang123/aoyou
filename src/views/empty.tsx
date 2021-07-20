import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../interface/user'
import { RouteComponentProps } from 'react-router-dom'
import { Form } from 'antd'

interface Props {
  user: userProps,
  dispatch: Function,
  form: {
    validateFields: Function,
    getFieldDecorator: Function
    resetFields: Function
  }
}

class Empty extends React.Component<RouteComponentProps & Props> {
  handleSubmit = (e: any) => {
    e.preventDefault();
    
  }

  componentDidMount() {
  }

  render() {
    return (
      <div style={{padding: '20px'}}>
        页面不存在
      </div>
    )
  }
}

interface stateType {
  user: userProps
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Empty)

export default connect(
  (state: stateType) => ({
    user: state.user
  })
)(WrappedNormalLoginForm)