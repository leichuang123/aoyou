import React from 'react'
import './roles.module.scss'
import { connect } from 'react-redux';
import { Input, Button, Pagination, Table, Form, Select, message, Tooltip } from 'antd';
// import locale from 'antd/es/date-picker/locale/zh_CN'
import { getRolesList } from '../../../../server/api'
import { PAGE_SIZE, INPUT_MAXLENGTH } from '../../../../config/config'
import RolePermission from './role_permission/role_permission'

import EditRoles from './edit_roles'

const { Option } = Select;
const { Search } = Input;
interface IProps {
  dispatch: Function
}

interface IState {
  rolesList: any,
  rolesType: number,
  rolesState: number,
  rolesName: string,
  currentPage: number,
  totalCount: number,
  pageSize: number,
  showEditRoleModal: boolean,
  rolesInfo: any,
  editRoleId: number,
  isShowEditPermission: boolean,
}
let typeList = [
  {key: -1, name: '全部'},
  {key: 0, name: '管理员'},
  {key: 1, name: '普通'},
];
let stateList = [
  {key: -1, name: '全部'},
  {key: 0, name: '无效'},
  {key: 1, name: '有效'},
];

class Roles extends React.PureComponent<IProps, IState> {
  constructor(props:any) {
    super(props)
    this.getRoleList = this.getRoleList.bind(this);
    this.rolesModalClose = this.rolesModalClose.bind(this);
    this.initList = this.initList.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.typeChange = this.typeChange.bind(this);
    this.stateChange = this.stateChange.bind(this);
  }
  state:any = {

    rolesList: [], // 角色列表
    rolesType: -1,//0:管理员 1:普通
    rolesState: -1,//0:无效 1:有效
    rolesName: "",
    currentPage: 1,
    totalCount: 0,
    pageSize: PAGE_SIZE,
    showEditRoleModal: false,
    rolesInfo: null,
    editRoleId: -1,
    isShowEditPermission: false,
  }

  componentDidMount () {
    this.initList()
  }
  // 获取角色列表
  private async getRoleList(params:any) {
    let newParams:any = {
      name: params.name,
      currentPage: params.currentPage,
      pageSize: params.pageSize,
    }
    if(params.type !== -1) {
      newParams.type = params.type
    }
    if(params.state !== -1) {
      newParams.state = params.state
    }
    let response = await getRolesList(newParams);
    if(response.code !== 200) {
      message.error(response.message);
      return false;
    }
    this.setState({
      rolesList: response.data.dataList,
      totalCount: response.data.page.totalCount
    })
  }
 
  private initList () {
    this.getRoleList({
      type: typeList[0].key,
      state: stateList[0].key,
      name: "",
      currentPage: 1,
      pageSize: PAGE_SIZE,
    })
  }
  
  private refreshList() {
    this.getRoleList({
      type: this.state.rolesType,
      state: this.state.rolesState,
      name: this.state.rolesName,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    })
  }
 
  private onSearch(name:any) {
    this.setState({
      rolesName: name
    },() => {
      this.refreshList()
    })
  }

  private handleSubmit() {

  }
  private stateChange(val:any) {
    this.setState({
      rolesState: val
    }, () => {
      this.refreshList()
    })
  }

  private typeChange(val:any) {
    this.setState({
      rolesType: val
    }, () => {
      this.refreshList()
    })
  }

  private editRoles(info:any) {
    this.setState({
      showEditRoleModal: true,
    })

    this.setState({
      rolesInfo: info.id ? info : null,
    })
  }

  private rolesModalClose(val: any) {
    this.setState({
      showEditRoleModal: false,
    })
    if(val) {
      this.initList();
    }
  }

  private pageSizeChange(current:number, size:number) {
    this.setState({
      pageSize: size
    }, () => {
      this.initList();
    })
  }

  private currentPageChange(page:any, pageSize:any) {
    this.setState({
      currentPage: page
    }, () => {
      this.refreshList();
    })
  }

  private authModalAbout (info: any) {
    this.setState({
      isShowEditPermission: true,
      editRoleId: info.id
    })
  }

  private closeRolePermission () {
    this.setState({
      isShowEditPermission: false,
      editRoleId: -1
    })
  }

  render () {
    const columns:any = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text: string, record: any, index: number) => <span>{(this.state.currentPage - 1) * this.state.pageSize + index + 1}</span>,
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '角色',
        dataIndex: 'type',
        key: 'type',
        width: 120,
        render: (text: any) => (
          <div>
            {
              typeList[text + 1].name || '未知'
            }
          </div>
        )
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 120,
        render: (text: any) => (
          <div>
            {
              stateList[text + 1].name || '未知状态'
            }
          </div>
        )
      },
      {
        title: '角色说明',
        dataIndex: 'content',
        key: 'content',
        render: (text: any) => (
          <Tooltip title={text}>
            {
              text.substr(0, 10)
            }
          </Tooltip>
        )
      },
      {
        title: '操作',
        key: 'option',
        width: 200,
        fixed: "right",
        render: (text:any, record:any) => (
          <div>
            <Button type="link" onClick={this.editRoles.bind(this,text)}>编辑</Button>
            <Button type="link" disabled={record.type === 0} onClick={this.authModalAbout.bind(this, text)}>分配权限</Button>
          </div>
        )
      },
    ];
    return (
      <div className='page'>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='flex-between'>
            <div>
              <Form.Item label='角色名称'>
                <Search
                  placeholder=""
                  maxLength={INPUT_MAXLENGTH}
                  onSearch={this.onSearch.bind(this)}
                />
              </Form.Item>
              <Form.Item label='类型'>
                <Select defaultValue={typeList[0].key} style={{ width: 120 }} onChange={this.typeChange}>
                  {
                    typeList.map((item: any) => {
                      return (
                        <Option value={item.key} key={item.key}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
              <Form.Item label='是否可用'>
                <Select defaultValue={stateList[0].key} style={{ width: 120 }} onChange={this.stateChange}>
                  {
                    stateList.map((item: any) => {
                      return (
                        <Option value={item.key} key={item.key}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button type="primary" onClick={this.editRoles.bind(this, {})}>
                  新建角色
                </Button>
              </Form.Item>
            </div>
          </div>
          
          
        </Form>
       
        <div>
        
          <Table
            rowKey="id"
            scroll={{ x: 1000 }}
            columns={columns}
            size="small"
            dataSource={this.state.rolesList}
            bordered
            pagination={false}
          />
          <Pagination showQuickJumper showSizeChanger defaultCurrent={this.state.currentPage} pageSize={this.state.pageSize} onChange={this.currentPageChange.bind(this)} onShowSizeChange={this.pageSizeChange.bind(this)} total={this.state.totalCount} />
        </div>
        {
          this.state.showEditRoleModal && <EditRoles info={this.state.rolesInfo} handleClose={this.rolesModalClose} />
        }
        {
          this.state.isShowEditPermission && <RolePermission id={this.state.editRoleId} onClose={this.closeRolePermission.bind(this)} />
        }
      </div>
    )
  }
}

interface stateType {
  // user: userProps,
  isShowLoading: Boolean
}

export default connect(
  (state: stateType) => ({
    // user: state.user,
    isShowLoading: state.isShowLoading
  })
)(Roles)