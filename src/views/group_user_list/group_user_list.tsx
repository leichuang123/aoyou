import React from 'react'
import gulStyle from './group_user_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../interface/user'
import { Form, Button, Table, Pagination, message, Modal } from 'antd'
import { groupUserList, inviteUser, setSuperMan, changeUserState, editGroupUserRole, checkOperatePermission } from '../../server/api'
import { getUrlParam } from '../../tools/tools'
import { PAGE_SIZE, PERMISSION } from '../../config/config'
import SuperAdmin from './super_admin/super_admin'
import Invite from './invite/invite'
import EditRole from './edit_role/edit_role'

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  location: any,
  form: any,
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
  checkboxList: any,
  inviteForm: any,
  superAdminForm: any,
  editRoleForm: any,
  groupId: number,
  isShowEditRole: boolean,
  editUser: any,
}

class GroupUserList extends React.PureComponent<IProps, IState> {

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
    inviteForm: null,
    superAdminForm: null,
    editRoleForm: null,
    groupId: -1,
    isShowEditRole: false,
    editUser: null,
  }

  componentDidMount() {
    const param = getUrlParam(this.props.location.search)
    this.setState({
      groupId: param.groupId
    }, () => {
      this.getList()
    })
  }

  private handleSubmit() {
    this.setState({
      currentPage: 1,
      list: []
    }, () => {
      this.getList()
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      // name: this.state.name,
      groupId: this.state.groupId
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await groupUserList(params)
    if (res.code === 200) {
      res.data.dataList.forEach((item: any, index: number) => {
        item.index = (index + 1)
      })
      this.setState({
        total: res.data.page.totalCount,
        list: res.data.dataList
      })
    } else {
      message.error(res.message)
    }
  }

  private pageinChange(currentPage: number) {
    this.setState({
      currentPage
    }, () => {
      this.getList()
    })
  }

  private showSizeChange(current: number, pageSize: number) {
    this.setState({
      currentPage: 1,
      pageSize
    }, () => {
      this.getList()
    })
  }

  private joinGroup(item: any) {
    this.setState({
      editInfo: item,
      visible: true
    })
  }

  private searchVm(name = '') {
    if (name.trim() === '') {
      return
    }
    this.setState({
      name,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  private handleOkSuperAdmin() {
    this.state.superAdminForm.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let param = {
        groupId: this.state.groupId,
      }
      Object.assign(param, data)
      let res = await setSuperMan(param)
      if (res.code !== 200) {
        message.error(res.message)
        return
      }
      this.setState({
        isShowSetSuperAdmin: false
      }, () => {
        this.getList()
      })
    })
  }

  private handleCancelSuperAdmin() {
    this.setState({
      isShowSetSuperAdmin: false
    })
  }

  private async showSuperAdmin () {
    let isPermission = await checkOperatePermission({ groupId: this.state.groupId, resourceId: PERMISSION.setting_admin.id })
    if (isPermission.code !== 200) {
      message.error(isPermission.message)
      return
    }
    this.setState({
      isShowSetSuperAdmin: true
    })
  }

  private handleOkInvite () {
    this.state.inviteForm.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let param = {
        invateUserNo: this.props.user.userNo,
        groupId: this.state.groupId
      }
      Object.assign(param, data)
      let res = await inviteUser(param)
      if (res.code !== 200) {
        message.error(res.message)
        return
      }
      message.success('邀请消息已发送')
      this.setState({
        isShowInvite: false
      }, () => {
        this.getList()
      })
    })
  }

  private handleCancelInvite () {
    this.setState({
      isShowInvite: false
    })
  }

  private handleCancelEditRole () {
    this.setState({
      isShowEditRole: false
    })
  }

  private handleOkEditRole () {
    this.state.editRoleForm.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let param = {
        userNo: this.state.editUser.userNo,
        roleIdList: data.roleIdList,
        groupId: this.state.groupId
      }
      Object.assign(param, data)
      let res = await editGroupUserRole(param)
      if (res.code !== 200) {
        message.error(res.message)
        return
      }
      message.success('角色编辑成功')
      this.setState({
        isShowEditRole: false,
        editUser: null,
      }, () => {
        this.getList()
      })
    })
  }

  private async showInviate () {
    let isPermission = await checkOperatePermission({ groupId: this.state.groupId, resourceId: PERMISSION.invate_user.id })
    if (isPermission.code !== 200) {
      message.error(isPermission.message)
      return
    }
    this.setState({
      isShowInvite: true
    })
  }

  private async operateState (info: any) {
    let isPermission = await checkOperatePermission({ groupId: this.state.groupId, resourceId: PERMISSION.eidt_user_status.id })
    if (isPermission.code !== 200) {
      message.error(isPermission.message)
      return
    }
    const modal = Modal.confirm({
      title: '温馨提示',
      content: '确认' + (info.state === 1 ? '禁用' : '启用') + '?',
      onOk: async () => {
        let param = {
          state: info.state === 1 ? 0 : 1,
          groupId: this.state.groupId,
          userNo: info.userNo,
        }
        let res = await changeUserState(param)
        if (res.code !== 200) {
          message.error(res.msg)
          return
        }
        message.success('操作成功')
        this.getList()
        modal.destroy()
      },
      onCancel: () => {
        modal.destroy()
      }
    })
    
  }

  private async editUserRole (item: any) {
    let isPermission = await checkOperatePermission({ groupId: this.state.groupId, resourceId: PERMISSION.edit_role.id })
    if (isPermission.code !== 200) {
      message.error(isPermission.message)
      return
    }
    this.setState({
      isShowEditRole: true,
      editUser: item
    })
  }

  render() {
    const { list, currentPage, total, pageSize, isShowSetSuperAdmin, isShowInvite, groupId, isShowEditRole, editUser } = this.state
    // const columns: any = [
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '昵称',
        dataIndex: 'userNickName',
        key: 'userNickName',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '加入时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text: any, item: any) =><span>{['不可用', '可用', '待确认'][item.state]}</span>
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, item: any) => <div>
          {
            ((item.state === 0 || item.state === 1) && item.type !== 0) && <div>
              <Button type='link' onClick={this.operateState.bind(this, item)}>{['启用', '禁用'][item.state]}</Button>
              <Button type='link' onClick={this.editUserRole.bind(this, item)} >编辑</Button>
          </div>
          }
          
          
        </div>,
      }
    ]
    
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          {/* <Form.Item label='虚拟机名称'>
            <Search
              placeholder=""
              onSearch={this.searchBox.bind(this)}
            />
          </Form.Item> */}
          <div className={`flex-center ${gulStyle.btns}`}>
            <Button type="primary" onClick={this.showSuperAdmin.bind(this)}>指定超级管理员</Button>
            <Button type="primary" className={gulStyle.join} onClick={this.showInviate.bind(this)}>邀请</Button>
          </div>
          
        </Form>
        <Table rowKey="index" className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        
        {
          isShowSetSuperAdmin && <SuperAdmin groupId={groupId} onClose={this.handleCancelSuperAdmin.bind(this)} onSave={this.handleOkSuperAdmin.bind(this)} wrappedComponentRef={(form: any) => this.setState({ superAdminForm: form })} />
        }

        {
          isShowInvite && <Invite groupId={groupId} onClose={this.handleCancelInvite.bind(this)} onSave={this.handleOkInvite.bind(this)} wrappedComponentRef={(form: any) => this.setState({inviteForm: form})} />
        }

        {
          isShowEditRole && <EditRole editInfo={editUser} groupId={groupId} onClose={this.handleCancelEditRole.bind(this)} onSave={this.handleOkEditRole.bind(this)} wrappedComponentRef={(form: any) => this.setState({ editRoleForm: form })} ></EditRole>
        }
        
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_group_user_list' })(GroupUserList)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)