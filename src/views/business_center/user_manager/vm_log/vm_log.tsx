import React from 'react'
// import activeStyle from './user_info.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Table, Pagination, message, Select, Checkbox, Input } from 'antd'
import { MachineLog, queryDictList, queryDataCenterList } from '../../../../server/api'
import { PAGE_SIZE, SELL_CHANNEL, VIRTUAL_MACHINE_ID, INPUT_MAXLENGTH } from '../../../../config/config'

const { Option } = Select
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
  mobile: string,
  action: number,
  actionList: any,
  isError: Boolean,
  sellChannelList: any,
  vmTypeList: any,
  userNo: string,
}

class VMLOG extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    startTime: 0,
    endTime: 0,
    placeNo: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    open: false,
    mobile: '',
    action: 0,
    actionList: ['全部', '重启', '重置', '分配', '升级'],
    isError: false,
    sellChannelList: [''],
    vmTypeList: [''],
    userNo: ''
  }

  async componentDidMount() {
    await this.getDicList(VIRTUAL_MACHINE_ID)
    // await this.getDicList(SELL_CHANNEL)
    this.getDataCenterList()
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

  //获取虚机类型数据
  private async getDicList(codeTypeNo: any) {
    return new Promise(async resolve => {
      let params = {
        codeTypeNo,
        pageSize: 99999,
      }
      let res = await queryDictList(params)
      if (res.code !== 200) {
        message.error(res.message)
        return
      }

      switch (codeTypeNo) {
        case SELL_CHANNEL:
          this.setState({
            sellChannelList: res.data.dataList,
          })
          break;
        case VIRTUAL_MACHINE_ID:
          this.setState({
            vmTypeList: res.data.dataList,
          })
          break
        default:
          break;
      }
      resolve(true)
    })
  }

  // 获取数据中心数据
  private async getDataCenterList(){
    let res = await queryDataCenterList()
    if(res.code == 200){
      this.setState({
        sellChannelList: res.data.dataList,
      })
    }else{
      message.error(res.message)
    }
  }

  private async getList() {
    let params: any = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      isError: this.state.isError
    }
    if (!params.isError) {
      params.isError = null // 服务器的奇怪要求
    }

    if (this.state.action !== 0) {
      params.action = this.state.action
    }

    if (this.state.userNo !== '') {
      params.userNo = this.state.userNo
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await MachineLog(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }

    res.data.dataList.forEach((item: any, index: number) => {
      item.index = index
      item.channelName = ''
      item.vmTypeName = ''
      this.state.sellChannelList.forEach((obj: any) => {
        if (item.dataCenterAddressId === obj.id) {
          // 修改数据中心
          item.city = obj.name
        }
      })
      this.state.vmTypeList.forEach((obj: any) => {
        if (item.vmType === obj.serialNo) {
          // 修改虚拟机类型的名称
          item.vmTypeName = obj.name
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

  private onActionChange(action: number) {
    this.setState({
      currentPage: 1,
      action
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

  private onIsErrorChange (e: any) {
    this.setState({
      currentPage: 1,
      isError: e.target.checked
    }, () => {
      this.getList()
    })
  }

  private search(userNo: any) {
    this.setState({
      userNo,
      currentPage: 1
    }, () => {
      this.getList()
    })
  }

  render() {
    const { list, currentPage, total, pageSize, action, actionList, isError } = this.state
    // const columns: any = [
    const columns = [
      {
        title: '用户号',
        dataIndex: 'userNo',
        key: 'userNo',
        width: 200,
      },
      {
        title: '操作类型',
        dataIndex: 'action',
        key: 'action',
        width: 100,
        render: (text: any, item: any) => <span>{actionList[item.action]}</span>
      },
      {
        title: '虚拟机类型',
        dataIndex: 'vmTypeName',
        key: 'vmTypeName',
        width: 200,
      },
      {
        title: '设备号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
        width: 300,
      },
      {
        title: '数据中心',
        dataIndex: 'city',
        key: 'city',
        width: 100,
      },
      {
        title: '商品编号',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 200,
      },
      {
        title: '时长订单编号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 200,
      },
      {
        title: 'machineKey',
        dataIndex: 'machineKey',
        key: 'machineKey',
        width: 200,
      },
      // {
      //   title: 'machineToken',
      //   dataIndex: 'machineToken',
      //   key: 'machineToken',
      //   width: 200,
      // },
      {
        title: '管理员编号',
        dataIndex: 'systemUserNo',
        key: 'systemUserNo',
        width: 200,
      },
      {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
        width: 200,
      },
      {
        title: 'machineId',
        dataIndex: 'machineId',
        key: 'machineId',
        width: 400,
      },
      {
        title: 'machineName',
        dataIndex: 'machineName',
        key: 'machineName',
        width: 200,
      },
      {
        title: '重置后MachineId',
        dataIndex: 'resetMachineId',
        key: 'resetMachineId',
        width: 400,
      },
      {
        title: '重置后MachineName',
        dataIndex: 'resetMachineName',
        key: 'resetMachineName',
        width: 200,
      },
      {
        title: '基础API返回的信息',
        dataIndex: 'apiResultBody',
        key: 'apiResultBody',
        width: 200,
      },
      {
        title: '基础API返回的code',
        dataIndex: 'apiResultCode',
        key: 'apiResultCode',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        width: 200,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 200,
      },
    ];
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className="text-left">
            <Form.Item label='操作类型'>
              <Select onChange={this.onActionChange.bind(this)} value={action}>
                {
                  actionList.map((item: any, index: number) => {
                    return <Option key={index} value={index}>{item}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item style={{marginLeft: '24px'}}>
              <Checkbox checked={isError} onChange={this.onIsErrorChange.bind(this)}>仅查询操作失败日志</Checkbox>
            </Form.Item>
            <Form.Item label='用户号'>
              <Search
                placeholder=""
                maxLength={INPUT_MAXLENGTH}
                onSearch={this.search.bind(this)}
              />
            </Form.Item>
          </div>
        </Form>
        <Table scroll={{ x: 1200 }} rowKey="index" className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_vm_log' })(VMLOG)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)