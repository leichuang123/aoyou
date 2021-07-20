import React from 'react'
import bind from './hardWare_bind.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { Form, Table, Pagination, message, Input, Button, Modal, Drawer, Row, Cascader} from 'antd'
import { deviceList, restoryDevice, queryDictList, hardWareAreaList, getAreaList, hardWareAreaSubmit } from '../../../server/api'
import { PAGE_SIZE, SELL_CHANNEL } from '../../../config/config'


const { Search } = Input
interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: () => void,
  visible: boolean,
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
  areaList: any,
  dataCenterAddressId: number,
  areaTable: any,
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
    sellChannelList: [],
    areaList:[],
    loading: false,
    dataCenterAddressId: 0,
    areaTable: {
      ids: []
    },
  }

  componentDidMount() {
    this.getSellChanelList(SELL_CHANNEL)
    this.getOrderAreaList()
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

  //绑定事件
  private async reset (info: any) {
    if(this.state.areaTable.ids.length == 0){
      message.error('请先勾选要绑定的硬件串号')
      return
    }else{
      this.getOrderAreaList()
      this.setState({
        visible: true,
      })
    }
    // this.getOrderAreaList()
    // let areaTable = JSON.parse(JSON.stringify(this.state.areaTable))
    // if (areaTable.ids.indexOf(info.id) === -1) {
    //   areaTable.ids.push(info.id)
    // } else {
    //   areaTable.ids.splice(areaTable.ids.indexOf(info.id), 1)
    // }
    // this.setState({
    //   visible: true,
    // })
  }
  //批量绑定按钮
  private async handleClick (info: any) {
    if(this.state.areaTable.ids.length == 0){
      message.error('请先勾选要绑定的硬件串号')
      return
    }else{
      this.getOrderAreaList()
      this.setState({
        visible: true,
      })
    }
    // this.setState({
    //   visible: true
    // })
    // this.getOrderAreaList()
  }

  private async getList() {
    let params: any = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      // deviceNo: this.state.deviceNo,
    }
    //deviceNo如果是空，不用传，如果不是空，传参
    if (this.state.deviceNo !== '') {
      params.deviceNo = this.state.deviceNo
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await hardWareAreaList(params)
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
      list: res.data.dataList,
      areaList: []
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

  


  private search(deviceNo: any) {
    this.setState({
      deviceNo,
      currentPage: 1
    }, () => {
      this.getList()
    })
  }
  
  private handleCancel() {
    this.setState({
      visible: false
    })
  }

  private onAreaBind(value) {
    this.setState({
      dataCenterAddressId: value[value.length - 1]
    })
  }
  //获取数据中心数据
  private async getOrderAreaList() {
    let res = await getAreaList()
    if (res.code !== 200) {
      message.error(res.message)
      return
    }else{
      this.setState({
        areaList: res.data,
      })
    }
    
  }

  private async handleOk() {
    let params = {
      dataCenterAddressId: this.state.dataCenterAddressId,
      ids: this.state.areaTable.ids,
    }
    let res = await hardWareAreaSubmit(params)
    if(res.code == 200){
      // 清空选中数据
      let areaTable = JSON.parse(JSON.stringify(this.state.areaTable))
      areaTable.ids = []
      this.setState({
        visible: false,
        areaTable,
        areaList: [],  //清空数据中心列表   
      })
      message.info('已成功绑定')
      this.getList()
    }
    
  }

  private onCrystalRowSelection (info: any) {
    let areaTable = JSON.parse(JSON.stringify(this.state.areaTable))
    if (areaTable.ids.indexOf(info.id) === -1) {
      areaTable.ids.push(info.id)
    } else {
      areaTable.ids.splice(areaTable.ids.indexOf(info.id), 1)
    }
    this.setState({
      areaTable
    })
    console.log('areaTable',this.state.areaTable)
  }

  private onCashRowSelection(info: any) {
    // let areaTable = JSON.parse(JSON.stringify(this.state.areaTable))
    // if (areaTable.ids.indexOf(info.id) === -1) {
    //   areaTable.ids.push(info.id)
    // } else {
    //   areaTable.ids.splice(areaTable.ids.indexOf(info.id), 1)
    // }
    // this.setState({
    //   areaTable
    // })
  }

  render() {
    const { list, currentPage, total, pageSize,  } = this.state
    // const columns: any = [
    const columns: any = [
      {
        title: '硬件串号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
        width: 550,
      },
      {
        title: '区域',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 200,
        render: (text: any, item: any) => <div className='flex-enter'>
          <Button type='link' onClick={this.reset.bind(this, item)}>绑定</Button>
        </div>,
      }
    ];
    return (
      <div className='new-user page'>
        <div className={bind.nav}>
            <div>
              <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
                <div className='text-left'>
                  <Form.Item label='硬件串号'>
                    <Search
                      placeholder="请输入硬件串号"
                      style={{width: 300}}
                      onSearch={this.search.bind(this)}
                    />
                  </Form.Item>
                </div>
              </Form>
            </div>
            
            <div className={bind.btnWrapper}>
              <Button type="primary" onClick={this.handleClick.bind(this)}>批量绑定</Button>
            </div>
        </div>
        <Table
          scroll={{ x: 1200 }}
          className='table'
          columns={columns}
          dataSource={list}
          pagination={false}
          rowKey="id"
          rowSelection={{ type: 'checkbox', selectedRowKeys: this.state.areaTable.ids,
          columnTitle: '',
          onSelect: (item: any) => this.onCrystalRowSelection(item)}}
          // onRow={(record: any) => {
          //   return {
          //     onClick: () => {
          //       this.onCashRowSelection(record)
          //     }
          //   }
          // }}
        />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        <Drawer
          title = "绑定区域"
          visible={this.state.visible}
          width={800}
          onClose={this.handleCancel.bind(this)}
        >
          <Cascader
            onChange={this.onAreaBind.bind(this)}
            placeholder="请选择绑定地区"
            style={{ width: "320px" }}
            options={this.state.areaList}
          />
          <div
            style={{
              position: 'fixed',
              right: 0,
              bottom: 0,
              zIndex: 100,
              width: 720,
              height: 55,
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button key="back" style={{marginRight: '16px'}} onClick={this.handleCancel.bind(this)}>
              取消
            </Button>
            <Button key="save" type="primary" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
              确认
            </Button>
          </div> 
        </Drawer>
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean,
  onClose: () => {},
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_device_list' })(DeviceList)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)