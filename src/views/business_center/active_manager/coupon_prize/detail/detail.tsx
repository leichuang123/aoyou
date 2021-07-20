import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, message, Modal, Table, Pagination, Input, Row, Select, } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import {
  activePrize,
  couponGrandDetail
} from '../../../../../server/api'

import {
  PAGE_SIZE
} from '../../../../../config/config'

const { Search } = Input
const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  activityNo: string,
  channelNo: Number,
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
  awardType: any,
  awardTypeList: any,
  detailTable: any,
  awardId: number,
}

class Detail extends React.PureComponent<IProps, IState> {

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
    awardType: 2, // 2.水晶券 3.代金券  4.体验券
    awardTypeList: [
      {
        label: '水晶券',
        value: 2,
      },
      {
        label: '代金券',
        value: 3,
      },
      {
        label: '体验券',
        value: 4,
      }
    ],
    detailTable: {
      pageSize: PAGE_SIZE,
      currentPage: 1,
      total: 0,
      list: []
    },
    awardId: -1,
  }

  componentDidMount() {
    this.getList()
  }

  private searchCard(name: string) {
    const detailTable = JSON.parse(JSON.stringify(this.state.detailTable))
    detailTable.currentPage = 1
    this.setState({
      name,
      detailTable,
    }, () => {
      this.getDetailList()
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

  private detailPageinChange(currentPage: number) {
    const detailTable = JSON.parse(JSON.stringify(this.state.detailTable))
    detailTable.currentPage = currentPage
    this.setState({
      detailTable
    }, () => {
      this.getDetailList()
    })
  }

  private detailShowSizeChange(current: number, pageSize: number) {
    const detailTable = JSON.parse(JSON.stringify(this.state.detailTable))
    detailTable.pageSize = pageSize
    detailTable.currentPage = 1
    this.setState({
      detailTable
    }, () => {
      this.getDetailList()
    })
  }

  // 获取优惠券列表
  private async getList() {
    let params = {
      channelNo: this.props.channelNo, 
      awardType: this.state.awardType, 
      activityNo: this.props.activityNo, 
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize
    }
    let response = await activePrize(params)
    if (response.code !== 200) {
      message.error(response.message)
      return
    }
    if (!response.data) return
    this.setState({
      total: response.data.page.totalCount,
      list: response.data.dataList,
      awardId: response.data.dataList.length > 0 ? response.data.dataList[0].id : -1,
      detailTable: {
        list: [],
        pageSize: PAGE_SIZE,
        currentPage: 1,
        total: 0,
      }
    }, () => {
      if (response.data.dataList.length === 0) {
        return
      }
      this.getDetailList()
    })
  }

  private async getDetailList () {
    if (this.state.awardId === -1) {
      return
    }
    let params = {
      name: this.state.name,
      type: this.state.awardType,
      id: this.state.awardId,
      pageSize: this.state.detailTable.pageSize,
      currentPage: this.state.detailTable.currentPage,
    }
    let response = await couponGrandDetail(params);
    if (response.code !== 200) {
      message.error(response.message)
      return
    }
    if (!response.data) return
    const detailTable = JSON.parse(JSON.stringify(this.state.detailTable))
    detailTable.total = response.data.page.totalCount
    detailTable.list = response.data.dataList
    this.setState({
      detailTable
    })
  }



  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose(false)
  }

  private onawardTypeChange(awardType: number) {
    this.setState({
      awardType
    }, () => {
      this.getList()
    })
  }

  render() {
    const { currentPage, total, pageSize, list, awardType, awardTypeList, detailTable } = this.state
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
      },
      {
        title: ['减免水晶', '减免金额', '使用时长'][awardType - 2],
        dataIndex: 'waiverAmount',
        key: 'waiverAmount',
      },
      {
        title: '有效期',
        dataIndex: '',
        key: '',
        width: 220,
        render: (text: string, record: any, index: number) => <span>{
          record.type === 0 ? `领取后${record.validityReceive}天生效，有效天数${record.validityRange}天` : `${record.validityBegin} 至 ${record.validityEnd}`
        }</span>
      },
      {
        title: '应发放数量',
        dataIndex: 'stock',
        key: 'stock',
      },
      {
        title: '已领取数量',
        dataIndex: 'num',
        key: 'num',
      }
    ]
    const detailColumns = [
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
      // {
      //   title: '水晶券编号',
      //   dataIndex: 'userNo',
      //   key: 'userNo',
      // },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text: string, record: any, index: number) => {
          return ['未使用', '已使用', '未领用', '已过期'][record.state]
        }
      },
      // {
      //   title: '用户昵称',
      //   dataIndex: 'validityRange',
      //   key: 'validityRange',
      // },
      // {
      //   title: '用户手机号',
      //   dataIndex: 'validityRange',
      //   key: 'validityRange',
      // },
      {
        title: '用户编号',
        dataIndex: 'userNo',
        key: 'userNo',
      },
      // {
      //   title: '使用日期',
      //   dataIndex: 'validityRange',
      //   key: 'validityRange',
      // }
    ]
    return (
      <Modal
        title="奖品"
        visible={true}
        maskClosable={false}
        width='800px'
        footer={null}
        onCancel={this.handleCancel.bind(this)}
      >
        <Row>
          <Select onChange={this.onawardTypeChange.bind(this)} value={awardType}>
            {
              awardTypeList.map((item: any, index: number) => {
                return <Option key={item.value} value={item.value}>{item.label}</Option>
              })
            }
          </Select>
        </Row>
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
        <h2 className='vendor-diver'>发放明细</h2>
        <Form layout="inline" className='search'>
          <Form.Item label='卡券编号'>
            <Search
              placeholder=""
              onSearch={this.searchCard.bind(this)}
            />
          </Form.Item>
        </Form>
        <Table scroll={{ x: true }} rowKey='id' className='table vendor-diver' columns={detailColumns} dataSource={detailTable.list} pagination={false} />
        <Pagination
          className='pagination vendor-diver'
          current={detailTable.currentPage}
          total={detailTable.total}
          onChange={this.detailPageinChange.bind(this)}
          onShowSizeChange={this.detailShowSizeChange.bind(this)}
          pageSize={detailTable.pageSize}
          showSizeChanger
          showQuickJumper
          showTotal={() => { return `共${detailTable.total}条数据` }}
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
  activityNo: string,
  channelNo: number,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_discount_active_detail' })(Detail)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)