import React from 'react'
import cpStyle from './china_prize.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, message, Input, Drawer, Row, Col, Button, Table, Pagination, InputNumber } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { usableCardList, activityConnectCard, activeCodeList, activeCodeListExport, getAwardStockInfo, activeCardList, } from '../../../../server/api'
import { PAGE_SIZE, DIALOG_WIDTH, DIALOG_MASK_CLOSABLE } from '../../../../config/config'

const { Search } = Input

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: () => void,
  onSave: () => void,
  chinaPrizeType: string,
  editInfo: any,
  activityId: string,
  activityNo: string,
  channelNo: number,
  dataCenterAddressId: number,
}

interface IState {
  currentPage: number,
  pageSize: number,
  name: string,
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  open: boolean,
  selectActiveCard: string,
  codeTable: any,
  code: string,
  selectRowsInfo: any,
  prizeStockInfo: any,
}

class EditChinaPirze extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    name: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    open: false,
    selectActiveCard: '',
    codeTable: {
      currentPage: 1,
      pageSize: PAGE_SIZE,
      total: 0,
      list: []
    },
    code: '',
    selectRowsInfo: null,
    prizeStockInfo: null,
  }

  componentDidMount() {
    this.getList()
    if (this.props.editInfo !== null) {
      this.setState({
        selectRowsInfo: this.props.editInfo,
        selectActiveCard: this.props.editInfo.id,
      })
    }
  }

  private async getPrizeStock() {
    let params = {
      id: this.props.editInfo.id,
      activityNo: this.props.activityNo
    }
    let res = await getAwardStockInfo(params)
    if (res.code === 200) {
      this.setState({
        prizeStockInfo: res.data
      })
    } else {
      message.error(res.message)
    }
  }

  private searchActiviCard (name: any) {
    this.setState({
      name
    }, () => {
      this.getList()
    })
  }

  private async getList() {
    console.log('props', this.props)
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.props.editInfo === null ? this.state.pageSize : 9999999,
      name: this.state.name,
      channelNo: this.props.channelNo,
      dataCenterAddressId: this.props.dataCenterAddressId,
    }

    if (params.name.trim() === '') {
      delete params.name
    }
    
    let res = this.props.chinaPrizeType === 'add' ? await usableCardList(params) : await activeCardList(params)
    if (res.code === 200) {
      this.setState({
        total: res.data.page.totalCount,
        list: this.props.chinaPrizeType === 'add' ? res.data.dataList : res.data.dataList.filter((item: any) => {
          return item.id === this.props.editInfo.id
        }),
      }, () => {
        if (this.props.chinaPrizeType !== 'add') {
          this.getCodeList()
        }
        if (this.props.editInfo !== null) {
          this.getPrizeStock()
        }
        
      })
    } else {
      message.error(res.message)
    }
  }

  private async getCodeList () {
    if (this.state.list.length === 0) {
      message.error('活动数据异常')
      return
    }
    let params = {
      awardId: this.props.editInfo.id,
      activityNo: this.props.activityNo,
      cardNo: this.state.list[0].cardNo,
      currentPage: this.state.codeTable.currentPage,
      pageSize: this.state.codeTable.pageSize,
      code: this.state.code,
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await activeCodeList(params)
    if (res.code === 200) {
      let codeTable = JSON.parse(JSON.stringify(this.state.codeTable))
      codeTable.total = res.data.page.totalCount
      codeTable.list = res.data.dataList
      this.setState({
        codeTable,
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

  private codePageinChange(currentPage: number) {
    let codeTable = JSON.parse(JSON.stringify(this.state.codeTable))
    codeTable.currentPage = currentPage
    this.setState({
      codeTable
    }, () => {
      this.getCodeList()
    })
  }

  private codeShowSizeChange(current: number, pageSize: number) {
    let codeTable = JSON.parse(JSON.stringify(this.state.codeTable))
    codeTable.currentPage = 1
    codeTable.pageSize = pageSize
    this.setState({
      codeTable
    }, () => {
      this.getCodeList()
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose()
  }

  private handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      
      if (err) {
        return
      }

      if (this.state.selectActiveCard === '') {
        message.error('请选择奖品')
        return
      }

      if (data.stock <= 0) {
        message.error('请输入发放数量')
        return
      }

      if (data.stock > this.state.selectRowsInfo.remainStock) {
        message.error('库存不足')
        return
      }
      let res = null
      let params = {
        // awardType: 1,
        // awardId: this.state.selectActiveCard,
        id: this.props.activityId,
        activationList: [{
          id: this.state.selectActiveCard,
          num: data.stock,
        }]
      }
      // Object.assign(params, data)
      res = await activityConnectCard(params)
      // if (this.props.editInfo === null) {
      //   res = await saveChinaPrize(params)
      // } else {
      //   res = await updateActivity(params)
      // }
      if (res.code === 200) {
        message.success('保存成功！')
        this.props.onClose()
      } else {
        message.error(res.message)
      }
    })
  }

  private activeRadioSelect (info: any) {
    this.setState({
      selectRowsInfo: info,
      selectActiveCard: info.id
    })
  }

  private exportData () {
    activeCodeListExport(this.state.exportParam)
  }

  private searchCode (code: string) {
    this.setState({
      code: code.trim()
    }, () => {
      this.getCodeList()
    })
  }

  render() {
    const { total, pageSize, currentPage, selectActiveCard, list, codeTable, prizeStockInfo, } = this.state
    const { chinaPrizeType } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const Footer = (<div className={`drawer-operation-btn`}>
      <Button className='sure-btn' type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
      <Button className='cancel-btn' onClick={this.handleCancel.bind(this)}>取消</Button>
    </div>)
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '激活卡名称',
        dataIndex: 'name',
        key: 'cardName',
      },
      // {
      //   title: '商品名称',
      //   dataIndex: 'goodsName',
      //   key: 'goodsName',
      // },
      // {
      //   title: '虚拟机名称',
      //   dataIndex: 'vmName',
      //   key: 'vmName',
      // },
      {
        title: '时长',
        dataIndex: 'duration',
        key: 'duration',
      },
      {
        title: '价值（水晶）',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '总库存',
        dataIndex: 'stock',
        key: 'stock',
      },
      {
        title: '已发放',
        dataIndex: 'usedStock',
        key: 'usedStock',
      },
      {
        title: '剩余库存',
        dataIndex: 'remainStock',
        key: 'remainStock',
      },
    ];
    const codeColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(codeTable.currentPage - 1) * codeTable.pageSize + index + 1}</span>,
      },
      {
        title: '活动编号',
        dataIndex: 'activityNo',
        key: 'activityNo',
        // render: (text: any) => <span>{this.props.activityNo}</span>
      },
      {
        title: '激活卡编号',
        dataIndex: 'cardNo',
        key: 'cardNo',
      },
      {
        title: '激活码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text: any, item: any) => <span>{['未激活', '已激活'][item.state]}</span>,
      },
      {
        title: '激活日期',
        dataIndex: 'activationTimeDesc',
        key: 'activationTimeDesc',
        width: 150,
      },
    ];
    // const maxNum = selectRowsInfo === null ? Infinity : selectRowsInfo.remainStock
    // console.log('maxNum ', maxNum)
    return (
      <Drawer
        title="奖品"
        visible={true}
        width={DIALOG_WIDTH}
        maskClosable={DIALOG_MASK_CLOSABLE}
        // onCancel={this.handleCancel.bind(this)}
        onClose={this.handleCancel.bind(this)}
      >
        {
          chinaPrizeType === 'add' && Footer
        }
        <Form {...formItemLayout} className="edit-form" onSubmit={this.handleOk.bind(this)}>
          {
            chinaPrizeType === 'add' && <Row>
              <Col span={24} className='flex-center flex-start'>
                <Form.Item label='关联激活卡'>
                  {getFieldDecorator('code', {
                    rules: [{ required: false, message: '请输入活动标题' }],
                  })(
                    <Search
                      className={cpStyle.search}
                      placeholder=""
                      onSearch={this.searchActiviCard.bind(this)}
                    />,
                  )}
                </Form.Item>

              </Col>
            </Row>
          }
          <Row>
            {
              chinaPrizeType !== 'add' && <Table rowKey='id' className='table' columns={columns} dataSource={list} pagination={false} />
            }
            {
              chinaPrizeType === 'add' && <Table 
                rowKey='id' className='table' 
                columns={columns} 
                dataSource={list} 
                pagination={false} 
                rowSelection={{ type: 'radio', selectedRowKeys: selectActiveCard === '' ? [] : [selectActiveCard], onSelect: (item) => this.activeRadioSelect(item) }}
                onRow={(record: any) => {
                  return {
                    onClick: () => {
                      this.activeRadioSelect(record)
                    }
                  }
                }}
              />
            }
            {
              chinaPrizeType === 'add' && <Pagination className='vendor-diver' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
            }
          </Row>
          <Row className='vendor-diver'>
            <Form.Item label='数量' labelCol={{span: 2}}>
              {getFieldDecorator('stock', {
                initialValue: prizeStockInfo !== null ? prizeStockInfo.stock : '',
                rules: [{ required: true, message: '请输入数量' }],
              })(
                <InputNumber
                  type='number'
                  min={0}
                  max={Infinity}
                  placeholder=""
                  disabled={chinaPrizeType !== 'add'}
                  className={cpStyle.inputnum}
                />,
              )}
              张
            </Form.Item>
          </Row>
          {
            chinaPrizeType !== 'add' && <Row className='vendor-diver'>
              <Search placeholder='激活码' className={cpStyle.search} onSearch={this.searchCode.bind(this)}></Search>
            </Row>
          }
          {
            chinaPrizeType !== 'add' && <Row className={`vendor-diver ${cpStyle.exportBtnc}`}>
              <Button type='primary' onClick={this.exportData.bind(this)}>导出</Button>
            </Row>
          }
          {
            chinaPrizeType !== 'add' && <Row className='vendor-diver'>
              <Table scroll={{ x: true }} rowKey='id' className='table' columns={codeColumns} dataSource={codeTable.list} pagination={false} />
              <Pagination className='pagination vendor-diver' current={codeTable.currentPage} total={codeTable.total} onChange={this.codePageinChange.bind(this)} onShowSizeChange={this.codeShowSizeChange.bind(this)} pageSize={codeTable.pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${codeTable.total}条数据` }} />
            </Row>
          }
        </Form>
      </Drawer>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: () => void,
  onSave: () => void,
  editInfo: null,
  activityId: any,
  activityNo: any,
  chinaPrizeType: any,
  channelNo: any,
  dataCenterAddressId: any,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(EditChinaPirze)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)