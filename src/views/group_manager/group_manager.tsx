import React from 'react'
// import glStyle from './group_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../interface/user'
import { Form } from 'antd'
// import { addDeviceGroup, groupList, updateGroup, notJoinBoxList, quitGroup } from '../../server/api'
// import { PAGE_SIZE } from '../../config/config'
import { RouteComponentProps  } from 'react-router-dom'
import { getUrlParam } from '../../tools/tools'
interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  
}

class GroupManager extends React.PureComponent<RouteComponentProps & IProps, IState> {

  state: any = {
    
  }

  componentDidMount() {
    console.log(' group this.props.history.location.pathname: ', this.props.history.location.pathname)
    if (this.props.history.location.pathname === '/group_manager') {
      const param = getUrlParam(this.props.location.search || '')
      let groupId = param.groupId || -1
      // console.log('/group_user_list?groupId=' + groupId + '&config_group=true')
      this.props.history.push('/group_user_list?groupId=' + groupId + '&config_group=true')
    }
  }


  render() {
    

    return (
      <div className='new-user page'>
        
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_group_list' })(GroupManager)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)