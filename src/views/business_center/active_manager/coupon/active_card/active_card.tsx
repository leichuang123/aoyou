import React from 'react'
// import activeStyle from './active_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, Button, Table, Pagination, message, Input, Modal, Select, Cascader } from 'antd'
import { activeCardList, operateActiveCard, queryDictList, getAreaList, queryDataCenterList} from '../../../../../server/api'
import { PAGE_SIZE, SELL_CHANNEL } from '../../../../../config/config'
import EditActiveCard from './edit_active_card/edit_active_card'
import CardDetail from './card_detail/card_detail'
// import { codeInfoListFilter } from '../../../../../tools/tools'

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
  name: string,
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  isShowCardDetail: boolean,
  editInfo: any,
  isViewOnly: boolean,
  cardNo: number,
  awardId: number,
  sellChannelList: any,
  sellChannel: number,
  areaList: any,
  dataCenterAddressId: number,
}

class ActiveCard extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    name: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    isShowCardDetail: false,
    editInfo: null,
    isViewOnly: false,
    cardNo: 0,
    awardId: 0,
    sellChannelList: [],
    sellChannel: -1,
    areaList: [],
    dataCenterAddressId: -1,
  }

  componentDidMount() {
    this.getSellChanelList()
    this.getDataCenterList()
    this.dataCenterList()
  }

  private async getSellChanelList() {
    let params = {
      codeTypeNo: SELL_CHANNEL,
      pageSize: 99999,
    }
    let res = await queryDictList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    // res.data.dataList = codeInfoListFilter(res.data.dataList);

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

  private addActiveCard() {
    this.setState({
      isViewOnly: false,
      visible: true,
    })
  }

  // 获取二级地域
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

  private async getList() {
    let params: any = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      name: this.state.name
    }
    // if (this.state.sellChannel !== -1) {
    //   params.channelNo = this.state.sellChannel
    // }
    if (this.state.dataCenterAddressId !== -1) {
      Object.assign(params, {dataCenterAddressId: this.state.dataCenterAddressId})
    }
    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await activeCardList(params)
    res.data.dataList.forEach((item: any) => {
      // this.state.sellChannelList.forEach((channel: any) => {
      //   if (item.channelNo === channel.serialNo) {
      //     item.channelName = channel.name
      //   }
      // })
      this.state.sellChannelList.forEach((obj: any) => {
        if (item.dataCenterAddressId === obj.id) {
          item.city = obj.name
        }
      })
      item.duration_ = item.duration + ['天', '月', '年'][item.durationUnit - 1]
    })
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

  private closeEditDialog(isRefresh = false) {
    if (isRefresh) {
      this.getList()
    }
    this.setState({
      visible: false,
      editInfo: null,
    })
  }

  private closeDetail () {
    this.setState({
      isShowCardDetail: false
    })
  }

  private showCardDetail (info: any) {
    this.setState({
      editInfo: info,
      visible: true,
      isViewOnly: true,
    })
  }

  private editActivityCard (item: any) {
    this.setState({
      isViewOnly: false,
      editInfo: item,
      visible: true,
    })
  }

  private onSellChange(sellChannel: number) {
    this.setState({
      sellChannel
    }, () => {
      this.getList()
    })
  }

  private async operateActiveCard (info: any) {
    let sure = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: `确认${+info.state === 0 ? '启用' : '终止'}？`,
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
    let res = await operateActiveCard({ id: info.id})
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success(+res.data.result === 1 ? '启用成功' : '终止成功')
    this.getList()
  }

  private useDetail (info: any) {
    this.setState({
      cardNo: info.cardNo,
      awardId: info.id,
      isShowCardDetail: true,
    })
  }

  private searchCard (name: string) {
    this.setState({
      name,
    }, () => {
      this.getList()
    })
  }

  private onAreaCascaderChange(list: any) {
    if (list.length > 0) {
      this.setState({
        dataCenterAddressId: +list[list.length - 1],
        currentPage: 1,
      }, () => {
        this.getList()
      })
    } else {
      this.setState({
        dataCenterAddressId: -1,
      }, () => {
        this.getList()
      })
    }
  }
  render() {
    const { list, cardNo, isViewOnly, currentPage, total, pageSize, areaList,
      visible, isShowCardDetail, editInfo, awardId, sellChannel, sellChannelList, } = this.state
    // const columns: any = [
    const columns:any = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '激活卡名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      // {
      //   title: '商品名称',
      //   dataIndex: 'goodsName',
      //   key: 'goodsName',
      // },
      {
        title: '数据中心',
        dataIndex: 'city',
        key: 'city',
        width: 120,
      },
      {
        title: '时长',
        dataIndex: 'duration_',
        key: 'duration_',
        width: 120,
      },
      {
        title: '价值（水晶）',
        dataIndex: 'price',
        key: 'price',
        width: 120,
      },
      {
        title: '总库存',
        dataIndex: 'stock',
        key: 'stock',
        width: 120,
      },
      {
        title: '已发放',
        dataIndex: 'usedStock',
        key: 'usedStock',
        width: 120,
      },
      {
        title: '剩余库存',
        dataIndex: 'remainStock',
        key: 'remainStock',
        width: 120,
      },
      // {
      //   title: '已激活',
      //   dataIndex: 'activated',
      //   key: 'activated',
      // },
      // {
      //   title: '未激活',
      //   dataIndex: 'inactivated',
      //   key: 'inactivated',
      // },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        // width: 150,
        render: (text: any, item: any) => <span>{['未生效', '已生效', '发放中', '发放完毕'][item.state]}</span>,
      },
      {
        title: '操作',
        key: 'action',
        fixed:'right',
        width: 220,
        render: (text: any, item: any) => <div className='flex-enter'>
          {
            item.state === 0 && (<div className='inline-block'><Button type='link' onClick={this.editActivityCard.bind(this, item)}>编辑</Button><Button type='link' onClick={this.operateActiveCard.bind(this, item)}>启用</Button></div>)
          }
          {
            item.state === 1 && (<div className='inline-block'><Button type='link' onClick={this.editActivityCard.bind(this, item)} >编辑</Button><Button type='link' onClick={this.operateActiveCard.bind(this, item)}>终止</Button></div>)
          }
          {
            item.state === 2 && (<div className='inline-block'><Button type='link' onClick={this.showCardDetail.bind(this, item)}>详情</Button><Button type='link' onClick={this.useDetail.bind(this, item)}>发放明细</Button></div>)
          }
          {
            item.state === 3 && (<div className='inline-block'><Button type='link' onClick={this.showCardDetail.bind(this, item)}>详情</Button><Button type='link' onClick={this.useDetail.bind(this, item)}>发放明细</Button></div>)
          }
          {/* <Button type='link' onClick={this.queryVm.bind(this, item)}>虚拟机</Button> */}
        </div>,
      }
    ];
    return (
      <div className='new-user page' style={{ paddingTop: 0 }}>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='flex-between'>
            <div>
              <Form.Item label='激活卡名称'>
                <Search
                  placeholder=""
                  onSearch={this.searchCard.bind(this)}
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
                    sellChannelList.filter((item: any) => {
                      return item.state === 1
                    }).map((item: any, index: number) => {
                      return <Option key={item.id} value={item.serialNo}>{item.name}</Option>
                    })
                  }
                </Select> */}
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button type="primary" onClick={this.addActiveCard.bind(this)}>
                  新建激活卡
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
        <Table scroll={{ x: 1400 }} rowKey='id' className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        {
          visible && <EditActiveCard isViewOnly={isViewOnly} onClose={this.closeEditDialog.bind(this)} editInfo={editInfo} />
        }
        {
          isShowCardDetail && <CardDetail awardId={awardId} onClose={this.closeDetail.bind(this)} cardNo={cardNo}></CardDetail>
        }
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_vm_edit' })(ActiveCard)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)