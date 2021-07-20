import React from 'react'
// import userStyle from './active_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Button, Table, Pagination, message, Input, Select, Modal } from 'antd'
import { userList, operateUserState } from '../../../../server/api'
import { PAGE_SIZE } from '../../../../config/config'
import EditUser from './edit_employee/edit_employee'
import ConfigRole from './config_role/config_role'

const { Search } = Input
const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  currentPage: number,
  pageSize: number,
  title: string,
  total: number,
  list: any,
  exportParam: any,
  visible: Boolean,
  editInfo: any,
  state: number,
  isShowConfigRole: boolean,
  configRoleId: number,
}

class Employee extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    title: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    editInfo: null,
    state: -1,
    isShowConfigRole: false,
    configRoleId: -1,
  }

  componentDidMount() {
    this.getList()
  }

  private handleSubmit() {
    // this.setState({
    //   currentPage: 1,
    //   list: []
    // }, () => {
    //   this.getList()
    // })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      loginName: this.state.title,
    }

    if (this.state.state !== -1) {
      Object.assign(params, { state: this.state.state })
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await userList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      total: res.data.page.totalCount,
      list: res.data.dataList
    })
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

  private search(title = '') {
    this.setState({
      title,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  private addSoftware() {
    this.setState({
      visible: true,
      editInfo: null,
    })
  }

  private async editUser(info: any) {
    // editUser
    let sure = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: `确认${info.state === 1 ? '禁用' : '启用'}？`,
        onOk: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
    if (!sure) {
      return
    }
    let res = await operateUserState({
      id: info.id,
      state: info.state
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success(`${info.state === 1 ? '禁用' : '启用'}成功`)
    this.getList()
  }

  private closeEditDialog(b = false) {
    if (b) {
      this.getList()
    }
    this.setState({
      visible: false
    })
  }

  private addEmployee() {
    this.setState({
      visible: true,
      editInfo: null
    })
  }

  private onStateChange (state: number) {
    this.setState({
      currentPage: 1,
      state,
    }, () => {
      this.getList()
    })
  }

  private closeConfigRole () {
    this.setState({
      isShowConfigRole: false,
    })
  }

  private showConfigRole (info: any) {
    this.setState({
      configRoleId: info.id,
      isShowConfigRole: true
    })
  }

  render() {
    const { list, currentPage, total, pageSize, visible, editInfo, configRoleId,
      state, isShowConfigRole } = this.state
    // const columns: any = [
    const columns: any = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '用户卡号',
        dataIndex: 'userNo',
        key: 'userNo',
        width: 200
      },
      {
        title: '用户名',
        dataIndex: 'loginName',
        key: 'loginName',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text: any, item: any) => <span>{['已禁用', '已启用'][item.state]}</span>,
      },
      {
        title: '操作',
        key: 'action',
        // width: 200,
        // fixed: 'right',
        render: (text: any, item: any) => <div className='flex-enter'>
          {/* <Button type='link' onClick={this.editUser.bind(this, item)}>编辑</Button> */}
          <Button type='link' onClick={this.editUser.bind(this, item)}>{ item.state === 1 ? '禁用' : '启用' }</Button>
          <Button type='link' onClick={this.showConfigRole.bind(this, item)}>角色配置</Button>
        </div>,
      }
    ];
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='flex-between'>
            <div>
              <Form.Item label='名称'>
                <Search
                  placeholder=""
                  onSearch={this.search.bind(this)}
                />
              </Form.Item>
              <Form.Item label='状态' >
                <Select style={{width: '150px'}} onChange={this.onStateChange.bind(this)} value={state}>
                  <Option value={-1}>
                    全部
                  </Option>
                  <Option value={1}>
                    已启用
                  </Option>
                  <Option value={0}>
                    已禁用
                  </Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button type="primary" onClick={this.addEmployee.bind(this)}>
                  新建员工
                </Button>
              </Form.Item>
            </div>
            
            
          </div>


        </Form>
        <Table scroll={{ x: true }} rowKey='id' className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination
          className='pagination'
          current={currentPage}
          total={total}
          onChange={this.pageinChange.bind(this)}
          onShowSizeChange={this.showSizeChange.bind(this)}
          pageSize={pageSize}
          showSizeChanger
          showQuickJumper
          showTotal={() => { return `共${total}条数据` }}
        />
        {
          visible && <EditUser isViewOnly={false} editInfo={editInfo} onClose={this.closeEditDialog.bind(this)} />
        }
        {
          isShowConfigRole && <ConfigRole id={configRoleId} onClose={this.closeConfigRole.bind(this)} />
        }
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_activity_edit' })(Employee)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)