import React from 'react'
// import activeStyle from './user_info.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { Form, Table, Pagination, message, Input, Button, Modal } from 'antd'
import { deviceList, restoryDevice, queryDictList } from '../../../server/api'
import { PAGE_SIZE, SELL_CHANNEL } from '../../../config/config'


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
  startTime: number,
  endTime: number,
  placeNo: string,
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  open: boolean,
  isShowUserCoupon: boolean,
  deviceNo: string,
  userNo: string,
  sellChannelList: any,
}

class DeviceList extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    startTime: 0,
    endTime: 0,
    placeNo: '',
    total: 0,
    list: [],
    deviceNo: '',
    exportParam: {},
    visible: false,
    open: false,
    timeList: [{
      startTime: '00:00',
      endTime: '23:59',
    }],
    isShowCategory: false, // 控制创建的第一个弹窗
    isShowEditDialog: false,
    isShowUserCoupon: false,
    userNo: '',
    sellChannelList: []
  }

  componentDidMount() {
    this.getSellChanelList(SELL_CHANNEL)
  }

  private async getSellChanelList(codeTypeNo: string) {
    let params = {
      codeTypeNo,
      pageSize: 99999,
    }
    let res = await queryDictList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      sellChannelList: res.data.dataList,
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

  private async reset (info: any) {
    let sure = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: '确认初始化？（设备组、设备会员的关系都清除）',
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
    let params = {
      deviceNo: info.deviceNo
    }
    let res = await restoryDevice(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('操作成功')
    this.getList()
  }

  private async getList() {
    let params: any = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      // deviceNo: this.state.deviceNo,
    }
    if (this.state.deviceNo !== '') {
      params.deviceNo = this.state.deviceNo
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await deviceList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    res.data.dataList.forEach((item: any) => {
      item.channelName = ''
      this.state.sellChannelList.forEach((channel: any) => {
        if (item.channelNo === channel.serialNo) {
          item.channelName = channel.name
        }
      })
    })
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

  private showUserCrystal(item: any) {
    this.setState({
      userNo: item.userNo,
      visible: true
    })
  }


  private search(deviceNo: any) {
    this.setState({
      deviceNo,
      currentPage: 1
    }, () => {
      this.getList()
    })
  }

  render() {
    const { list, currentPage, total, pageSize } = this.state
    // const columns: any = [
    const columns: any = [
      {
        title: '条码',
        dataIndex: 'code',
        key: 'code',
        width: 150,
      },
      {
        title: '前缀',
        dataIndex: 'prefix',
        key: 'prefix',
        width: 150,
      },
      {
        title: 'mac',
        dataIndex: 'mac',
        key: 'mac',
        width: 200,
      },
      {
        title: '设备号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
        width: 200,
      },
      {
        title: '用户编号',
        dataIndex: 'userNo',
        key: 'userNo',
        width: 200,
      },
      {
        title: '绑定区域',
        dataIndex: 'city',
        key: 'city',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text: any, item: any) => <span>{['未激活', '已激活', '分配中（激活中）'][item.state]}</span>
      },
      
      {
        title: '策略',
        dataIndex: 'strategy',
        key: 'strategy',
        width: 100,
        render: (text: any, item: any) => <span>{['双无', '双有', '免密'][item.strategy]}</span>
      },
      // {
      //   title: '销售渠道',
      //   dataIndex: 'channelName',
      //   key: 'channelName',
      //   width: 100,
      // },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 240,
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        render: (text: any, item: any) => <div className='flex-enter'>
          <Button type='link' onClick={this.reset.bind(this, item)}>初始化</Button>
        </div>,
      }
    ];
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='text-left'>
            <Form.Item label='设备号'>
              <Search
                placeholder=""
                style={{width: 300}}
                onSearch={this.search.bind(this)}
              />
            </Form.Item>
          </div>

        </Form>
        <Table
          scroll={{ x: 1200 }}
          className='table'
          columns={columns}
          dataSource={list}
          pagination={false}
          rowKey="userNo"
        />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_device_list' })(DeviceList)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)