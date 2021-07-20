import React from 'react'
import slStyle from './software_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { Form, Button, Table, 
  Pagination, 
  Input,
  message, Modal, Select } from 'antd'
import { queryLogVisitManager, logVisitEdit, deleteLogVisitById, } from '../../../server/api'
import EditSoftWare from './edit_software/edit_software'
import { PAGE_SIZE, 
  // INPUT_MAXLENGTH
 } from '../../../config/config'


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
  editInfo: any,
  state: number,
  name: string,
  visible: boolean,
}

class Activity extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    title: '',
    total: 0,
    list: [],
    state: -1,
    editInfo: null,
    name: '',
    visible: false,
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

  private addSoftware() {
    this.setState({
      editInfo: null,
      visible: true,
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      name: this.state.name
    }
    if (this.state.state !== -1) {
      Object.assign(params, { state: this.state.state })
    }

    let res = await queryLogVisitManager(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      total: res.data.page.totalCount,
      list: res.data.dataList,
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

  private closeEditDialog(isRefresh = false) {
    if (isRefresh) {
      this.getList()
    }
    this.setState({
      visible: false,
      editInfo: null
    })
  }

  private search(name = '') {
    this.setState({
      name,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  private async operateStatus(info: any) {
    let statusText = info.state * 1 === 0 ? '上架' : '下架'
    Modal.confirm({
      title: '温馨提示',
      content: `确认${statusText}？`,
      onOk: async () => {
        let params = JSON.parse(JSON.stringify(info))
        params.state = info.state * 1 === 0 ? 1 : 0
        let res = await logVisitEdit(params)
        if (res.code !== 200) {
          message.error(res.message)
          return
        }
        message.success(`${statusText}成功！`)
        this.getList()
      }
    })
  }

  private editSoftware(editInfo: any) {
    this.setState({
      visible: true,
      editInfo
    })
  }

  private onStateChange(state: number) {
    this.setState({
      state
    }, () => {
      this.getList()
    })
  }

  private deleteSoftware (info: any) {
    Modal.confirm({
      title: '温馨提示',
      content: `确认删除？`,
      onOk: async () => {
        let res = await deleteLogVisitById({
          id: info.id
        })
        if (res.code !== 200) {
          message.error(res.message)
          return
        }
        message.success(`删除成功！`)
        this.getList()
      }
    })
  }

  render() {
    const { list, currentPage, 
      total, 
      pageSize, state, editInfo, visible } = this.state
    // const columns: any = [
    const columns: any = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 180,
      },
      {
        title: '图标',
        dataIndex: 'logUrl',
        key: 'logUrl',
        width: 150,
        render: (url: any) => <div><img src={url} className={slStyle.cover} alt="图标" /></div>,
      },
      {
        title: '跳转地址',
        dataIndex: 'logLink',
        key: 'logLink',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        // width: 100,
        render: (text: any, item: any) => <span>{['已下架', '已上架'][item.state]}</span>,
      },
      {
        title: '操作',
        key: 'action',
        width: 260,
        fixed: 'right',
        render: (text: any, item: any) => <div className='flex-enter'>
          <Button type='link' onClick={this.editSoftware.bind(this, item)}>编辑</Button>
          <Button type='link' onClick={this.operateStatus.bind(this, item)}>{item.state * 1 === 0 ? '上架' : '下架'}</Button>
          <Button type='link' onClick={this.deleteSoftware.bind(this, item)}>删除</Button>
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
                  // maxLength={INPUT_MAXLENGTH}
                  onSearch={this.search.bind(this)}
                />
              </Form.Item>
              <Form.Item label='状态'>
                <Select onChange={this.onStateChange.bind(this)} value={state} style={{width: '150px'}}>
                  <Option  value={-1}>全部</Option>
                  <Option value={1}>已上架</Option>
                  <Option value={0}>已下架</Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button type="primary" onClick={this.addSoftware.bind(this)}>
                  新建应用
            </Button>
              </Form.Item>
            </div>
          </div>


        </Form>
        <Table scroll={{ x: 1200 }} rowKey='id' className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        {
          visible && <EditSoftWare editInfo={editInfo}  onClose={this.closeEditDialog.bind(this)} />
        }
        
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_activity_edit' })(Activity)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)