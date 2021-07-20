import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, Button, Table, Input, Modal, message, Select, Pagination } from 'antd'
import { PAGE_SIZE, SELL_CHANNEL, INPUT_MAXLENGTH } from '../../../../../config/config'
import { crystalListGet, crystalVoucherOperate, queryDictList } from '../../../../../server/api'
import GrandDetail from '../grand_detail'
import CardEdit from './card_edit/card_edit'


const { Search } = Input
const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  list: any,
  isViewOnly: boolean,
  visible: boolean,
  isShowCardDetail: boolean,
  editInfo: any,
  currentPage: number,
  pageSize: number,
  total: number,
  name: string,
  awardId: number,
  isShowGrandDetail: boolean,
  grandDetailId: number,
  sellChannelList: any,
  sellChannel: number,
}

class CrystalCoupon extends React.PureComponent<IProps, IState> {

  state = {
    list: [],
    isViewOnly: false,
    visible: false,
    isShowCardDetail: false,
    isShowGrandDetail: false,
    editInfo: null,
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    name: '',
    awardId: 0,
    grandDetailId: -1,
    sellChannelList: [],
    sellChannel: -1,
  }

  componentDidMount() {
    this.getSellChanelList();
  }

  private onSellChange(sellChannel: number) {
    this.setState({
      sellChannel
    }, () => {
      this.crystalListGet()
    })
  }

  private async getSellChanelList() {
    let params = {
      pageSize: 99999,
      codeTypeNo: SELL_CHANNEL,
    }
    let res = await queryDictList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    // res.data.dataList = codeInfoListFilter(res.data.dataList)
    this.setState({
      sellChannelList: res.data.dataList,
    }, () => {
      this.crystalListGet()
    })
  }

  // 获取水晶券列表
  private async crystalListGet() {
    let params: any = {
      name: this.state.name,
      pageSize: 10,
      currentPage: 1,
    }
    if (this.state.sellChannel !== -1) {
      params.channelNo = this.state.sellChannel
    }
    let response = await crystalListGet(params);
    if(response.code !== 200) {
      message.error(response.message)
      return
    }
    response.data.dataList.forEach((item: any) => {
      this.state.sellChannelList.forEach((obj: any) => {
        if (+item.channelNo === +obj.serialNo) {
          item.channelName = obj.name
        }
      })
    })
    this.setState({
      list: response.data.dataList,
      total: response.data.page.totalCount,
    })
  }

  private handleSubmit() {

  }
  
  private searchCard(name: string) {
    this.setState({
      name: name,
      currentPage: 1,
    },() => {
      this.crystalListGet();
    })
  }
  
  private submitSuccess() {
    this.closeEditDialog()
    this.crystalListGet();
  }

  private addCard() {
    this.setState({
      isViewOnly: false,
      visible: true,
    })
  }

  private closeEditDialog() {
    this.setState({
      visible: false,
      editInfo: null,
      isViewOnly: false,
    })
  }

  private async operateCard(info: any) {
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
   
    let response =  await crystalVoucherOperate({id: info.id});
    if (response.code !== 200) {
      message.error(response.message)
      return
    }
    message.success(+response.data.state === 1 ? '启用成功' : '终止成功')
    this.crystalListGet()
  }

  private editCard(item:any) {
    this.setState({
      isViewOnly: false,
      editInfo: item,
      visible: true,
    })
  }

  private pageinChange(currentPage: number) {
    this.setState({
      currentPage
    }, () => {
      this.crystalListGet()
    })
  }

  private showSizeChange(current: number, pageSize: number) {
    this.setState({
      currentPage: 1,
      pageSize
    }, () => {
      this.crystalListGet()
    })
  }

  private useDetail (info: any) {
    this.setState({
      awardId: info.id,
      isShowCardDetail: true,
    })
  }

  private closeDetail () {
    this.setState({
      isShowCardDetail: false
    })
  }

  private closeGrandDetail() {
    this.setState({
      isShowGrandDetail: false
    })
  }

  private viewDetail(editInfo: any) {
    this.setState({
      visible: true,
      editInfo,
      isViewOnly: true
    })
  }

  private showGrandDetail(info: any) {
    this.setState({
      isShowGrandDetail: true,
      grandDetailId: info.id,
    })
  }

  render() {
    const { list, isShowGrandDetail, isViewOnly, editInfo, currentPage, sellChannelList,
      pageSize, visible, grandDetailId, sellChannel, total } = this.state
    const columns:any = [
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
        width: 200,
      },
      {
        title: '渠道',
        dataIndex: 'channelName',
        key: 'channelName',
        width: 80,
      },
      {
        title: '减免金额(水晶)',
        dataIndex: 'waiverAmount',
        key: 'waiverAmount',
        width: 200,
      },
      {
        title: '有效期',
        dataIndex: 'expireTime',
        key: 'expireTime',
        width: 220,
        render: (text: string, record: any, index: number) => <span>{
          record.type === 0 ? `领取后${record.validityReceive}天生效，有效天数${record.validityRange}天` : `${record.validityBegin} 至 ${record.validityEnd}`
        }</span>
      },
      {
        title: '总库存',
        dataIndex: 'stock',
        key: 'stock',
        width: 100,
      },
      {
        title: '已发放',
        dataIndex: 'useStock',
        key: 'useStock',
        width: 100,
      },
      // {
      //   title: '已领用',
      //   dataIndex: 'useStock',
      //   key: 'useStock',
      // },
      {
        title: '剩余库存',
        dataIndex: 'remainStock',
        key: 'remainStock',
        width: 100,
      },
      // {
      //   title: '已使用',
      //   dataIndex: 'duration',
      //   key: 'duration',
      // },
      // {
      //   title: '未使用',
      //   dataIndex: 'duration',
      //   key: 'duration',
      // },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text: string, record: any, index: number) => {
          let stateText = "";
          switch (+text) {
            case 0:
              stateText = "未生效"
              break;
            case 1:
              stateText = "生效中"
              break;
            case 2:
              stateText = "发放中"
              break;
            case 3:
              stateText = "发放完毕"
              break;
            default:
              stateText = "未知状态"
              break;
          }
          return stateText
        },
      },
      {
        title: '操作',
        dataIndex: 'duration',
        key: 'duration',
        fixed: 'right',
        width: 200,
        render: (text: any, item: any) => <div className='flex-enter'>
          {
            (item.state === 0 || item.state === 1) && <div className='inline-block'>
              <Button type='link' onClick={this.editCard.bind(this, item)}>编辑</Button>
              <Button type='link' onClick={this.operateCard.bind(this, item)}>{item.state === 0 ? '启用' : '停用'}</Button>
              </div>
          }
          {
            (item.state === 2 || item.state === 3) && <div className='inline-block'>
              <Button type='link' onClick={this.viewDetail.bind(this, item)}>详情</Button>
              <Button type='link' onClick={this.showGrandDetail.bind(this, item)}>发放明细</Button>
            </div>
          }
        </div>,
      },
    ]
    return (
      <div className='page' style={{paddingTop: 0}}>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='flex-between'>
            <div>
              <Form.Item label='水晶券名称'>
                <Search
                  placeholder=""
                  maxLength={INPUT_MAXLENGTH}
                  onSearch={this.searchCard.bind(this)}
                />
              </Form.Item>
              <Form.Item label='渠道'>
                <Select onChange={this.onSellChange.bind(this)} value={sellChannel}>
                  <Option key='' value={-1}>全部</Option>
                  {
                    sellChannelList.filter((item: any) => {
                      return item.state === 1
                    }).map((item: any, index: number) => {
                      return <Option key={item.id} value={item.serialNo}>{item.name}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </div>
          <div>
            <Form.Item>
              <Button type="primary" onClick={this.addCard.bind(this)}>
                新建水晶券
              </Button>
            </Form.Item>
          </div>
          </div>
        </Form>

        <Table scroll={{ x: 1400 }} rowKey='id' className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        { 
          visible && <CardEdit type={2} isViewOnly={isViewOnly} editInfo={editInfo} onClose={this.closeEditDialog.bind(this)} submitSuccess={this.submitSuccess.bind(this)} /> 
        }
        {
          isShowGrandDetail && <GrandDetail type={2} id={grandDetailId} onClose={this.closeGrandDetail.bind(this)} />
        }
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_vm_edit' })(CrystalCoupon)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)