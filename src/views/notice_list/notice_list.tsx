import React from 'react'
// import tqStyle from './time_quantum.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../interface/user'
import { Form, Button, Table, Pagination, message, Modal } from 'antd'
import { NoticeListData, acceptOrNotInviate, delNotice, setNoticeRead } from '../../server/api'
import { PAGE_SIZE } from '../../config/config'

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  currentPage: number,
  pageSize: number,
  total: number,
  name: string,
  list: any,
  exportParam: any,
  visible: boolean,
  editInfo: any,
  isShowPermission: boolean,
  editRoleInfo: any,
}

class NoticeList extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    name: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    editInfo: null,
  }

  componentDidMount() {
    this.getList()
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      name: this.state.name,
      deviceNo: '',
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await NoticeListData(params)
    if (res.code === 200) {
      res.data.dataList.forEach((item: any) => {
        item.createTime = item.createTime !== null ? item.createTime.replace('T', ' ') : ''
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

  private async operateInvite(flag: number, noticeSign: string) {
    let confirm = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: `确认${flag === 1 ? '加入' : '拒绝'}？`,
        onOk: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
    if (!confirm) {
      return
    }
    let res = await acceptOrNotInviate({ flag, noticeSign })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('操作成功')
    this.getList()
  }

  private async setRead (info: any) {
    let res = await setNoticeRead({ flag: false, noticeList: [{
      noticeNo: info.noticeNo,
      noticeSign: info.noticeSign,
    }]})
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('操作成功')
    this.getList()
  }

  private async deleteNotice(info: any) {
    let confirm = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: `确认删除？`,
        onOk: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
    if (!confirm) {
      return
    }
    let res = await delNotice({
      flag: false, noticeList: [{
        noticeNo: info.noticeNo,
        noticeSign: info.noticeSign,
      }] })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('已删除')
    this.getList()
  }

  render() {
    const { list, currentPage, total, pageSize, } = this.state
    // const columns: any = [
    const columns = [
      {
        width: 200,
        title: '消息标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        width: 500,
        title: '消息内容',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150,
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 150,
      render: (text: any, item: any) => <span>{['站内通知', '邀请消息'][item.type - 1]}</span>,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 150,
        render: (text: any, item: any) => <span>{['未读', '已读', '已删除', '已同意', '已拒绝'][item.state]}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, item: any) => <div>
          {
            (item.state === 0 || item.state === 1) && item.type === 2 && <Button type='link' onClick={this.operateInvite.bind(this, 1, item.noticeSign)}>同意</Button>
          }
          {
            (item.state === 0 || item.state === 1) && item.type === 2 && <Button type='link' onClick={this.operateInvite.bind(this, 2, item.noticeSign)}>拒绝</Button>
          }
          
          {
            item.state === 0 && <Button type='link' onClick={this.setRead.bind(this, item)}>标记为已读</Button>
          }
          <Button type='link' onClick={this.deleteNotice.bind(this, item)}>删除</Button>
        </div>,
      }
    ]
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        {/* <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <Form.Item label='名称'>
            <Search
              placeholder=""
              onSearch={this.search.bind(this)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.addRole.bind(this)}>
              新建角色
            </Button>
          </Form.Item>
        </Form> */}
        <Table rowKey="noticeNo" className='table' columns={columns} dataSource={list} pagination={false} />
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
      </div>

    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_role_list' })(NoticeList)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)