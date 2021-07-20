import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, message, Modal, Table, Pagination, Input } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { couponGrandDetail } from '../../../../server/api'

import {
  PAGE_SIZE
} from '../../../../config/config'

const { Search } = Input

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  id: Number,
  type: any,
  onClose: (isRefresh: boolean) => void,
}

interface IState {
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  startTime: string,
  endTime: string,
  channelList: any,
  activityTypeList: any
  currentPage: number,
  pageSize: number,
  name: string,
}

class EditActive extends React.PureComponent<IProps, IState> {

  state = {
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    startTime: '',
    endTime: '',
    channelList: [],
    activityTypeList: [],
    currentPage: 1,
    pageSize: PAGE_SIZE,
    name: '',
  }

  componentDidMount() {
    this.getList()
  }

  private searchCard(name: string) {
    this.setState({
      name
    }, () => {
      this.getList()
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

  // 获取优惠券列表
  private async getList() {
    let params = {
      // name: this.state.name,
      type: this.props.type,
      id: this.props.id,
      pageSize: this.state.pageSize,
      currentPage: this.state.currentPage,
    }
    let response = await couponGrandDetail(params);
    if (response.code !== 200) {
      message.error(response.message)
      return
    }
    if (!response.data) return
    this.setState({
      total: response.data.page.totalCount,
      list: response.data.dataList
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose(false)
  }

  render() {
    const { currentPage, total, pageSize, list } = this.state
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '活动编号',
        dataIndex: 'activityNo',
        key: 'activityNo',
      },
      {
        title: '卡券编号',
        dataIndex: 'cardNo',
        key: 'cardNo',
      },
      {
        title: '用户编号',
        dataIndex: 'userNo',
        key: 'userNo',
      },
      // {
      //   title: '用户手机号',
      //   dataIndex: 'validityRange',
      //   key: 'validityRange',
      // },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text: string, record: any, index: number) => {
          return ['未使用', '已使用', '未领用', '已过期'][record.state]
        },
      }
    ]
    return (
      <Modal
        title="发放明细"
        visible={true}
        maskClosable={false}
        width='800px'
        footer={null}
        onCancel={this.handleCancel.bind(this)}
      >
        <Form layout="inline" className='search'>
          <Form.Item label='卡券编号'>
            <Search
              placeholder=""
              onSearch={this.searchCard.bind(this)}
            />
          </Form.Item>
        </Form>
        <Table scroll={{ x: true }} rowKey='id' className='table vendor-diver' columns={columns} dataSource={list} pagination={false} />
        <Pagination
          className='pagination vendor-diver'
          current={currentPage}
          total={total}
          onChange={this.pageinChange.bind(this)}
          onShowSizeChange={this.showSizeChange.bind(this)}
          pageSize={pageSize}
          showSizeChanger
          showQuickJumper
          showTotal={() => { return `共${total}条数据` }}
        />
      </Modal>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: (isRefresh: boolean) => void,
  id: number,
  type: number,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(EditActive)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)