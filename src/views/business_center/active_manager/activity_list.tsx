import React from 'react'
// import activeStyle from './active_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { Form, Button, Table, Pagination, message, Input, Modal, Select, Cascader } from 'antd'
import { ActivityList, stopActivity, queryDictList, publishActive, activePrize, getActivityById, getAreaList, queryDataCenterList} from '../../../server/api'
import { PAGE_SIZE, ACTIVITY_TYPE_ID, SELL_CHANNEL, INPUT_MAXLENGTH } from '../../../config/config'
import EditActive from './edit_activity/edit_activity'
import ChinaPrize from './china_prize/china_prize'
import CouponConnectPrize from './coupon_prize/connect/connect'
import CouponDetailPrize from './coupon_prize/detail/detail'

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
  exportParam: any,
  visible: Boolean,
  open: Boolean,
  chinaPrizeType: string, // 取值 add 、detail
  operateType: string,
  isShowChinaDialog: Boolean,
  isShowConnectCouponDialog: Boolean,
  isShowDetailCouponDialog: Boolean,
  editActivityInfo: any,
  activityTypeList: any,
  isViewOnly: Boolean,
  chinaPrizeInfo: any,
  activityId: string,
  activityNo: string,
  sellChannelList: any,
  sellChannel: number,
  chinaChannel: number,
  couponChannnel: number,
  areaList: any,
  dataCenterAddressId: number,
  dataCenter: number,  //激活卡活动的商品点击奖品时要传给子组件的数据中心id值
}

class Activity extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    title: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    open: false,
    isShowCategory: false, // 控制创建的第一个弹窗
    isShowEditDialog: false,
    chinaPrizeType: 'add',
    isShowConnectCouponDialog: false,
    operateType: 'add',
    isShowChinaDialog: false,
    editActivityInfo: null,
    activityTypeList: [],
    isViewOnly: false,
    chinaPrizeInfo: null,
    activityId: '',
    activityNo: '',
    sellChannelList: [],
    sellChannel: -1,
    couponChannnel: -1,
    chinaChannel: -1,
    isShowDetailCouponDialog: false,
    areaList: [],
    dataCenterAddressId: -1,
    dataCenter: null,
  }

  componentDidMount() {
    this.getActivityList(ACTIVITY_TYPE_ID)
    this.getDataCenterList()
    // this.dataCenterList()
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
      editActivityInfo: null,
      isViewOnly: false,
      visible: true,
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      title: this.state.title,
    }
    // if (this.state.sellChannel !== -1) {
    //   Object.assign(params, { channelNo: this.state.sellChannel })
    // }

    if (this.state.dataCenterAddressId !== -1) {
      Object.assign(params, { dataCenterAddressId: this.state.dataCenterAddressId })
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await ActivityList(params)
    if (res.code === 200) {
      res.data.dataList.forEach((item: any) => {
        item.activeTypeName = ''
        this.state.activityTypeList.forEach((active: any) => {
          if (+active.serialNo === +item.type) {
            item.activeTypeName = active.name
          }
        })
        // this.state.sellChannelList.forEach((channel: any) => {
        //   if (item.channelNo === channel.serialNo) {
        //     item.channelName = channel.name
        //   }
        // })
        // 数据中心
        this.state.sellChannelList.forEach((obj: any) => {
          if (item.dataCenterAddressId === obj.id) {
            item.city = obj.name
          }
        })
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

  private closeEditDialog(isRefresh = false) {
    if (isRefresh) {
      this.getList()
    }
    this.setState({
      visible: false,
      editActivityInfo: null
    })
  }

  private closeChinaDialog () {
    this.setState({
      activityId: '',
      activityNo: '',
      chinaPrizeInfo: null,
      isShowChinaDialog: false
    })
  }

  private saveChinaDialog () {
    this.setState({
      isShowChinaDialog: false
    })
  }

  private async showPrize(item: any) {
    console.log('item',item)
    if (item.type === 2) {
      if (item.state === 1) {
        this.setState({
          isShowDetailCouponDialog: true,
          activityNo: item.activityNo,
          couponChannnel: item.channelNo,
        })
      } else {
        this.setState({
          isShowConnectCouponDialog: true,
          activityNo: item.activityNo,
          couponChannnel: item.channelNo,
          activityId: item.id,
        })
      }
      return
    }
    let res = await activePrize({ channelNo: item.channelNo, awardType: 1, activityNo: item.activityNo })
    if (res.code !== 200) {
      message.error(res.message || '服务器异常')
      return
    }
    this.setState({
      activityId: item.id,
      activityNo: item.activityNo,
      chinaPrizeType: item.state !== 2 ? 'query' : 'add',
      isShowChinaDialog: true,
      chinaChannel: item.channelNo,
      dataCenter: item.dataCenterAddressId,
      chinaPrizeInfo: res.data.dataList.length > 0 ? res.data.dataList[0] : null,
    })
  }

  private search (title = '') {
    this.setState({
      title,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  private async getActivityList(codeTypeNo: string) {
    let params = {
      pageSize: 99999,
      codeTypeNo
    }
    let res = await queryDictList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      activityTypeList: res.data.dataList,
    }, () => {
      this.getSellChanelList()
    })
  }

  private async getSellChanelList() {
    let res = await queryDataCenterList()
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

  private async editActivity (info: any) {
    let res = await getActivityById({id: info.id})
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      isViewOnly: false,
      editActivityInfo: res.data,
      visible: true
    })
  }

  private async viewActivity (info: any) {
    let res = await getActivityById({ id: info.id })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      isViewOnly: true,
      editActivityInfo: res.data,
      visible: true
    })
  }

  private async stopActive (info: any) {
    let sure = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: '确认终止活动？',
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
      id: info.id
    }
    let res = await stopActivity(params)
    if (res.code === 200) {
      message.success('操作成功')
      this.getList()
    } else {
      message.error(res.message)
    }
  }

  private async publish (info: any) {
    Modal.confirm({
      title: '温馨提示',
      content: '确认发布？',
      onOk: async () => {
        let res = await publishActive({ id: info.id })
        if (res.code !== 200) {
          message.error(res.message)
          return
        }
        message.success('发布成功！')
        this.getList()
      }
    })
  }

  private onSellChange(sellChannel: number) {
    this.setState({
      sellChannel
    }, () => {
      this.getList()
    })
  }

  private closeCouponDialog () {
    this.setState({
      isShowConnectCouponDialog: false
    })
  }

  private closeCouponDetailDialog () {
    this.setState({
      isShowDetailCouponDialog: false
    })
  }

  //获取二级树形区域
  private async getDataCenterList() {
    let res = await getAreaList()
    if (res.code !== 200) {
      message.error(res.message)
      return
    }else{
      this.setState({
        areaList: res.data
      })
    }
  }

  // 获取数据中心数据
  private async dataCenterList(){
    let res = await queryDataCenterList()
    if(res.code == 200){
      this.setState({
        sellChannelList: res.data.dataList,
      })
    }else{
      message.error(res.message)
    }
  }

  private onAreaCascaderChange(list: any) {
    if (list.length > 0) {
      this.setState({
        dataCenterAddressId: +list[list.length - 1],
        currentPage: 1,
      }, () => {
        this.getList()
      })
      // console.log('dataCenterAddressId', this.state.dataCenterAddressId)
    } else {
      this.setState({
        dataCenterAddressId: -1,
      }, () => {
        this.getList()
      })
    }
  }

  render() {
    const { list, currentPage, activityId, chinaPrizeInfo, total, pageSize, visible, activityNo, 
      isShowConnectCouponDialog, operateType, couponChannnel, chinaChannel, isShowDetailCouponDialog,
      chinaPrizeType, isShowChinaDialog, editActivityInfo, isViewOnly, sellChannelList, sellChannel, areaList, dataCenter} = this.state
    // const columns: any = [
    const columns: any = [
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
        width: 180,
      },
      {
        title: '活动类型',
        dataIndex: 'activeTypeName',
        key: 'activeTypeName',
        width: 150,
      },
      {
        title: '数据中心',
        dataIndex: 'city',
        key: 'city',
        width: 100,
      },
      {
        title: '活动标题',
        dataIndex: 'title',
        key: 'title',
        width: 150,
      },
      {
        title: '活动内容',
        dataIndex: 'content',
        key: 'content',
        width: 200,
        render: (text: any) => <span>{text.length > 10 ? text.substring(0, 10) + '...': text}</span>,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 200,
        render: (text: any) => <span>{text.split('T')[0]}</span>,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 200,
        render: (text: any) => <span>{text.split('T')[0]}</span>,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        // width: 100,
        render: (text: any, item: any) => <span>{['已失效', '生效中', '待发布'][item.state]}</span>,
      },
      {
        title: '操作',
        key: 'action',
        width: 260,
        fixed: 'right',
        render: (text: any, item: any) => <div className='flex-enter'>
          <Button type='link' onClick={this.showPrize.bind(this, item, text)}>奖品</Button>
          {
            item.state === 2 && (<div className='inline-block'>
              <Button type='link' onClick={this.editActivity.bind(this, item)}>编辑</Button>
              <Button type='link' onClick={this.publish.bind(this, item)}>发布</Button>
            </div>)
          }
          {
            item.state === 1 && (<div className='inline-block'><Button type='link' onClick={this.stopActive.bind(this, item)}>终止</Button></div>)
          }
          {
            item.state === 0 && (<div className='inline-block'><Button type='link' onClick={this.viewActivity.bind(this, item)}>详情</Button></div>)
          }
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
                  maxLength={INPUT_MAXLENGTH}
                  onSearch={this.search.bind(this)}
                />
              </Form.Item>
              <Form.Item label='数据中心'>
                <Cascader
                  options={areaList}
                  onChange={this.onAreaCascaderChange.bind(this)}
                  placeholder="请选择"
                />
                {/* <Select onChange={this.onSellChange.bind(this)} value={sellChannel}>
                  <Option key='' value={-1}>全部</Option>
                  {
                    sellChannelList.filter((item: any) => { return item.state === 1 }).map((item: any, index: number) => {
                      return <Option key={item.id} value={item.serialNo}>{item.name}</Option>
                    })
                  }
                </Select> */}
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button type="primary" onClick={this.addActive.bind(this)}>
                  新建活动
            </Button>
              </Form.Item>
            </div>
          </div>
          
          
        </Form>
        <Table scroll={{x: 1200}} rowKey='id' className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        {
          visible && <EditActive editActivityInfo={editActivityInfo} isViewOnly={isViewOnly} onClose={this.closeEditDialog.bind(this)} />
        }
        {
          isShowChinaDialog && <ChinaPrize channelNo={ chinaChannel } dataCenterAddressId={dataCenter} activityNo={activityNo} activityId={activityId} editInfo={chinaPrizeInfo} onClose={this.closeChinaDialog.bind(this)} onSave={this.saveChinaDialog.bind(this)} chinaPrizeType={chinaPrizeType} />
        }
        {
          isShowConnectCouponDialog && <CouponConnectPrize channelNo={couponChannnel} activityNo={activityNo} activityId={activityId} onClose={this.closeCouponDialog.bind(this)} operateType={operateType} />
        }
        {
          isShowDetailCouponDialog && <CouponDetailPrize channelNo={couponChannnel} activityNo={activityNo} onClose={this.closeCouponDetailDialog.bind(this)} />
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