import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, Button, Table, Input, message, Pagination, Modal, Select } from 'antd'
import { PAGE_SIZE, SELL_CHANNEL } from '../../../../../config/config'
import { cashVoucherGet, queryDictList, cashVoucherOperate } from '../../../../../server/api'
import GrandDetail from '../grand_detail'
import CardEdit from '../crystal_voucher/card_edit/card_edit'

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
  sellChannelList: any,
  sellChannel: number,
  name: string,
  isShowGrandDetail: boolean,
  grandDetailId: number,
}

class CrystalCoupon extends React.PureComponent<IProps, IState> {

  state = {
    list: [],
    isViewOnly: false,
    visible: false,
    isShowCardDetail: false,
    editInfo: null,
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    sellChannelList: [],
    sellChannel: -1,
    name: '',
    isShowGrandDetail: false,
    grandDetailId: -1,
  }

  componentDidMount() {
    this.getSellChanelList()
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
    this.setState({
      sellChannelList: res.data.dataList,
    }, () => {
      this.getList()
    })
  }

  // 获取代金券列表
  private async getList() {
    let params: any = {
      name: this.state.name,
      pageSize: this.state.pageSize,
      currentPage: this.state.currentPage,
    }
    if (this.state.sellChannel !== -1) {
      params.channelNo = this.state.sellChannel
    }
    let response = await cashVoucherGet(params);
    if (response.code !== 200) {
      message.error(response.message)
      return
    }
    response.data.dataList.forEach((item: any) => {
      item.channelName = '未知'
      this.state.sellChannelList.forEach((obj: any) => {
        if (item.channelNo === obj.serialNo) {
          item.channelName = obj.name
        }
      })
    })
    this.setState({
      total: response.data.page.totalCount,
      list: response.data.dataList
    })
  }

  private viewDetail(editInfo: any) {
    this.setState({
      visible: true,
      editInfo,
      isViewOnly: true
    })
  }

  private submitSuccess() {
    this.closeEditDialog()
    this.getList();
  }

  private closeEditDialog () {
    this.setState({
      visible: false
    })
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

  private addCard() {
    this.setState({
      isViewOnly: false,
      visible: true,
      editInfo: null,
    })
  }
  private editCard(editInfo: any) {
    this.setState({
      isViewOnly: false,
      visible: true,
      editInfo
    })
  }

  private async operateCard (info: any) {
    let sure = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: `确认${info.state === 0 ? '启用' : '停用'}？`,
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
    let res = await cashVoucherOperate({id: info.id})
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('操作成功')
    this.getList()
  }

  private closeGrandDetail () {
    this.setState({
      isShowGrandDetail: false
    })
  }

  private showGrandDetail (info: any ) {
    this.setState({
      isShowGrandDetail: true,
      grandDetailId: info.id,
    })
  }

  private onSellChange(sellChannel: number) {
    this.setState({
      sellChannel
    }, () => {
      this.getList()
    })
  }

  render() {
    const { list, isViewOnly, editInfo, total, sellChannel, sellChannelList,
      currentPage, pageSize, visible, isShowGrandDetail, grandDetailId } = this.state
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
        width: 200,
        key: 'name',
      },
      {
        title: '渠道',
        dataIndex: 'channelName',
        key: 'channelName',
        width: 80,
      },
      {
        title: '减免金额(RMB)',
        dataIndex: 'waiverAmount',
        key: 'waiverAmount',
        width: 160,
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
        width: 120,
      },
      {
        title: '已发放',
        dataIndex: 'useNum',
        key: 'useNum',
        width: 120,
      },
      {
        title: '已领用',
        dataIndex: 'getNum',
        key: 'getNum',
        width: 120,
      },
      {
        title: '剩余库存',
        dataIndex: 'remainStock',
        key: 'remainStock',
        width: 120,
      },
      {
        title: '已使用',
        dataIndex: 'useStock',
        key: 'useStock',
        width: 120,
      },
      {
        title: '未使用',
        dataIndex: 'unUseNum',
        key: 'unUseNum',
        width: 120,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 200,
        render: (text: string, record: any, index: number) => {
          return ['未生效', '生效中', '发放中', '未知状态'][record.state]
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        render: (text: string, item: any, index: number) => {
          return (
            <div className='flex-center'>
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
            </div>
          )
        }
      },
    ]

    return (
      <div className='page' style={{ paddingTop: 0 }}>
        <Form layout="inline" className='search'>
          <div className='flex-between'>
            <div>
              <Form.Item label='代金券名称'>
                <Search
                  placeholder=""
                  onSearch={this.searchCard.bind(this)}
                />
              </Form.Item>
              <Form.Item label='销售渠道'>
                <Select onChange={this.onSellChange.bind(this)} value={sellChannel}>
                  <Option value={-1}>全部</Option>
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
                  新建代金券
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>

        <Table scroll={{ x: 1400 }} rowKey='id' className='table' columns={columns} dataSource={list} pagination={false} />
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
        {visible && <CardEdit type={3} isViewOnly={isViewOnly} editInfo={editInfo} onClose={this.closeEditDialog.bind(this)} submitSuccess={this.submitSuccess.bind(this)} />}
        {
          isShowGrandDetail && <GrandDetail type={3} id={grandDetailId} onClose={this.closeGrandDetail.bind(this)} />
        }
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_cash_voucher' })(CrystalCoupon)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)