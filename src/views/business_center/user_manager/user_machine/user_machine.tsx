import React from 'react'
// import activeStyle from './user_info.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Table, Pagination, message, Input, Button, Modal, Radio, } from 'antd'
import { 
  userMachine, 
  RebootVm, 
  upgradePackageList, 
  queryDictList,
  UpgradeByManage,
 } from '../../../../server/api'
import {
  PAGE_SIZE, DURATION_UNIT,
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
} from '../../../../config/config'


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
  isShowReboot: boolean,
  isShowUpgrade: boolean,
  rebootMode: string,
  rebootInfo: any,
  deviceNo: string,
  upgradeList: any,
  durationUnitList: any,
  systemDiskList: any,
  hardDiskList: any,
  graphicsMemoryList: any,
  operateSystemList: any,
  upgradeInfo: any,
  upgradeId: number,
}

class UserInfo extends React.PureComponent<IProps, IState> {

  state: any = {
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
    isShowReboot: false,
    rebootMode: 'soft', // hard
    rebootInfo: null,
    deviceNo: '',
    isShowUpgrade: false,
    upgradeList: [],
    systemDiskList: [],
    hardDiskList: [],
    graphicsMemoryList: [],
    operateSystemList: [],
    upgradeInfo: {},
    upgradeId: -1,
  }

  componentDidMount() {
    // this.getDicList(DURATION_UNIT)
    // this.getDicList(SYSEM_DISK_ID)
    // this.getDicList(HARD_DISK_ID)
    // this.getDicList(GRAPHIC_MEMORY_ID)
    // this.getDicList(OPERATE_SYSTEM_ID)
    this.getList()
  }

  private async getDicList(codeTypeNo: string) {
    let res = await queryDictList({
      codeTypeNo,
      state: 1,
      pageSize: 99999,
      isDisableLoading: true,
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    
    if (codeTypeNo === DURATION_UNIT) {
      this.setState({
        durationUnitList: res.data.dataList
      })
    }else if (codeTypeNo === SYSEM_DISK_ID) {
      this.setState({
        systemDiskList: res.data.dataList
      })
    } else if (codeTypeNo === HARD_DISK_ID) {
      this.setState({
        hardDiskList: res.data.dataList
      })
    } else if (codeTypeNo === GRAPHIC_MEMORY_ID) {
      this.setState({
        graphicsMemoryList: res.data.dataList
      })
    } else if (codeTypeNo === OPERATE_SYSTEM_ID) {
      this.setState({
        operateSystemList: res.data.dataList
      })
    }

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
      pageSize: this.state.pageSize
    }
    if (this.state.deviceNo !== '') {
      Object.assign(params, { deviceNo: this.state.deviceNo})
    }

    if (this.state.mobile !== '') {
      Object.assign(params, { mobile: this.state.mobile })
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await userMachine(params)
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

  private search () {
    this.setState({
      currentPage: 1,
      list: []
    }, () => {
      this.getList()
    })
  }

  private reboot(rebootInfo: any) {
    this.setState({
      rebootInfo,
      isShowReboot: true
    })
  }

  private async handleOkReboot () {
    let res = await RebootVm({
      machineKey: this.state.rebootInfo.machineKey,
      oprMode: this.state.rebootMode
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('操作成功')
    this.handleCancelReboot()
  }

  private handleCancelReboot () {
    this.setState({
      rebootInfo: null,
      rebootMode: 'soft',
      isShowReboot: false
    })
  }

  private onRebootModeChange (e: any) {
    this.setState({
      rebootMode: e.target.value
    })
  }

  private onUpgradeModeChange (e: any) {
    this.setState({
      upgradeId: e.target.value
    })
  }

  private mobileChange (e: any) {
    this.setState({
      mobile: e.target.value
    })
  }

  private deviceChange (e: any) {
    this.setState({
      deviceNo: e.target.value
    })
  }

  private async upgradeVm (info: any) {
    let res = await upgradePackageList({
      productNo: info.productNo,
      machineKey: info.machineKey
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    if (!res.data) {
      message.error('暂无该商品升级包')
      return
    }
    res.data.forEach((item: any) => {
      this.state.operateSystemList.forEach((obj: any) => {
        if (+item.vmInfo.operateSystem === +obj.serialNo) {
          item.vmInfo.operateSystemName = obj.name
        }
      })
      this.state.systemDiskList.forEach((obj: any) => {
        if (+item.vmInfo.systemDisk === +obj.serialNo) {
          item.vmInfo.systemDiskName = obj.name
        }
      })
      this.state.graphicsMemoryList.forEach((obj: any) => {
        if (+item.vmInfo.graphicsMemory === +obj.serialNo) {
          item.vmInfo.graphicsMemoryName = obj.name
        }
      })
      this.state.hardDiskList.forEach((obj: any) => {
        if (+item.vmInfo.hardDisk === +obj.serialNo) {
          item.vmInfo.hardDiskName = obj.name
        }
      })
    })
    this.setState({
      isShowUpgrade: true,
      upgradeInfo: info,
      upgradeList: res.data
    })
  }

  private async handleOkUpgrade () {
    if (this.state.upgradeId === -1) {
      message.error('请选择升级包')
      return
    }
    let chooseInfo: any = null
    this.state.upgradeList.forEach((item: any) => {
      if (item.upgradeId === this.state.upgradeId) {
        chooseInfo = JSON.parse(JSON.stringify(item))
      }
    })
    let res = await UpgradeByManage({
      orderNo: this.state.upgradeInfo.orderNo,//订单号
      upgradeNo: chooseInfo.upgradeNo, //升级包ID
      upgradeChargeId: chooseInfo.timeCharge.id,
      upgradeVmId: chooseInfo.vmInfo.id,
    })
    
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('操作成功')
    this.setState({
      isShowUpgrade: false,
      upgradeId: -1,
    })
  }

  handleCancelUpgrade () {
    this.setState({
      isShowUpgrade: false,
      upgradeId: -1,
    })  
  }

  render() {
    const { list, currentPage, total, pageSize, isShowReboot, rebootMode, upgradeId, upgradeList,
      isShowUpgrade,
    } = this.state
    // const columns: any = [
    const columns = [
      {
        title: '昵称',
        dataIndex: 'userNickName',
        key: 'userNickName',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '设备号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
      },
      {
        title: '虚拟机备注',
        dataIndex: 'remarks',
        key: 'remarks',
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: '虚拟机id',
        dataIndex: 'vmId',
        key: 'vmId',
      },
      {
        title: '所在数据中心',
        dataIndex: 'city',
        key: 'city',
        width: 120,
      },
      {
        title: '机器用户名',
        dataIndex: 'machineKey',
        key: 'machineKey',
      },
      {
        title: '机器名',
        dataIndex: 'machineName',
        key: 'machineName',
      },
      // {
      //   title: '域名',
      //   dataIndex: 'domain',
      //   key: 'domain',
      // },
      {
        title: '开通时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '到期时间',
        dataIndex: 'dueTime',
        key: 'dueTime',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text: any, item: any) => <span>{['已结束', '使用中', '已停用', '分配中', '待支付'][item.state]}</span>
      },
      {
        title: '操作',
        key: 'action',
        width: 160,
        render: (text: any, item: any) => <div className='flex-enter'>
          {
            item.state === 1 && <Button type='link' onClick={this.reboot.bind(this, item)} >重启</Button>
          }
          {
            item.state === 1 && <Button type='link' onClick={this.upgradeVm.bind(this, item)} >升级</Button>
          }
          
          {/* <Button type='link' >重置</Button>
          <Button type='link' >删除</Button> */}
        </div>,
      }
    ];
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='text-left'>
            <Form.Item label='手机号'>
              <Input
                placeholder=""
                maxLength={11}
                onChange={this.mobileChange.bind(this)}
                onPressEnter={this.search.bind(this)}
              />
            </Form.Item>
            <Form.Item label='串号'>
              <Input
                placeholder=""
                maxLength={25}
                onChange={this.deviceChange.bind(this)}
                onPressEnter={this.search.bind(this)}
              />
            </Form.Item>
            <Form.Item >
              <Button type="primary" onClick={this.search.bind(this)}>查询</Button>
            </Form.Item>
          </div>
        </Form>
        <Table scroll={{ x: 1200, y: 780 }} rowKey="orderNo" className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        <Modal
          title="选择重启模式"
          visible={isShowReboot}
          onOk={this.handleOkReboot.bind(this)}
          onCancel={this.handleCancelReboot.bind(this)}
        >
          <Radio.Group onChange={this.onRebootModeChange.bind(this)} value={rebootMode}>
            <Radio value='soft'>软重启</Radio>
            <Radio value='hard'>硬重启</Radio>
          </Radio.Group>
        </Modal>
        <Modal
          title="虚拟机升级"
          visible={isShowUpgrade}
          onOk={this.handleOkUpgrade.bind(this)}
          onCancel={this.handleCancelUpgrade.bind(this)}
        >
          <Radio.Group onChange={this.onUpgradeModeChange.bind(this)} value={upgradeId}>
            {
              upgradeList.map((item: any) => {
                return <div key={item.upgradeId} style={{marginTop: '12px'}}><Radio value={item.upgradeId} >{item.vmInfo.memory}G内存，{item.vmInfo.cpu}核cpu</Radio></div>
              })
            }
          </Radio.Group>
        </Modal>
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_user_info' })(UserInfo)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)