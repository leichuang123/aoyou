import React from 'react'
// import activeStyle from './active_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Button, Table, Pagination, message, Input } from 'antd'
import { preinstallSoftwareList  } from '../../../../server/api'
import { PAGE_SIZE } from '../../../../config/config'
import EditPreInstall from './edit_install/edit_install'

const { Search } = Input

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
}

class PreInstall extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    title: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    editInfo: null,
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

  private addActive() {
    this.setState({
      editInfo: null,
      visible: true,
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      name: this.state.title,
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await preinstallSoftwareList(params)
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

  private addSoftware () {
    this.setState({
      visible: true,
      editInfo: null,
    })
  }

  private editPreInstall (info: any) {

  }

  private closeEditDialog (b = false) {
    if (b) {
      this.getList()
    }
    this.setState({
      visible: false
    })
  }

  render() {
    const { list, currentPage, total, pageSize, visible, editInfo } = this.state
    // const columns: any = [
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
      },
      {
        title: '启动项',
        dataIndex: 'startup',
        key: 'activeTypeName',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text: any, item: any) => <span>{['已失效', '生效中', '待发布'][item.state]}</span>,
      },
      // {
      //   title: '操作',
      //   key: 'action',
      //   width: 150,
      //   render: (text: any, item: any) => <div className='flex-enter'>
      //     <Button type='link' onClick={this.editPreInstall.bind(this, item)}>编辑</Button>
      //   </div>,
      // }
    ];
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='flex-between'>
            <Form.Item label='名称'>
              <Search
                placeholder=""
                onSearch={this.search.bind(this)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.addSoftware.bind(this)}>
                新建软件
            </Button>
            </Form.Item>
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
          visible && <EditPreInstall isViewOnly={false} editInfo={editInfo} onClose={this.closeEditDialog.bind(this)}  />
        }
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_activity_edit' })(PreInstall)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)