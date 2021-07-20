import React from 'react'
import cpStyle from './connect.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, message, Input, Drawer, Row, Col, Button, Table, Pagination, InputNumber } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { crystalListGet, activityConnectCard, cashVoucherGet, experienceVoucherGet, activePrize, activityAlreadyAward  } from '../../../../../server/api'
import { PAGE_SIZE, DIALOG_WIDTH, DIALOG_MASK_CLOSABLE } from '../../../../../config/config'

const { Search } = Input

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: () => void,
  operateType: string,
  activityId: string,
  activityNo: string,
  channelNo: number,
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
  crystalTable: any,
  cashTable: any,
  experienceTable: any,
  defaultAwardList: [],
  obj: any,
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
    obj: {},
    cashTable: {
      name: '',
      currentPage: 1,
      pageSize: PAGE_SIZE,
      total: 0,
      list: [],
      selectRowKeys: []
    },
    crystalTable: {
      name: '',
      currentPage: 1,
      pageSize: PAGE_SIZE,
      total: 0,
      list: [],
      selectRowKeys: []
    },
    experienceTable: {
      name: '',
      currentPage: 1,
      pageSize: PAGE_SIZE,
      // pageSize: 999,
      total: 0,
      list: [],
      selectRowKeys: []
    },
    code: '',
    selectRowsInfo: null,
    prizeStockInfo: null,
    defaultAwardList: []
  }

  async componentDidMount() {
    // this.getList(2)
    // this.getList(3)
    // this.getList(4)
    this.getAlaredyAward()
  }

  private async getAlaredyAward () {
    let res = await activityAlreadyAward({
      activityNo: this.props.activityNo,
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    let crystalTable = JSON.parse(JSON.stringify(this.state.crystalTable))
    let cashTable = JSON.parse(JSON.stringify(this.state.cashTable))
    let experienceTable = JSON.parse(JSON.stringify(this.state.experienceTable))
    let obj = {}
    res.data.forEach((item: any) => {
      switch (item.awardType) {
        case 2:
          crystalTable.selectRowKeys.push(item.awardId)
          break;
        case 3:
          cashTable.selectRowKeys.push(item.awardId)
          break;
        case 4:
          experienceTable.selectRowKeys.push(item.awardId)
          break;
        default:
          break;
      }
      obj[item.awardType + '_' + item.awardId] = {
        num: item.stock,
        id: item.awardId,
      }
    })
    this.setState({
      crystalTable,
      experienceTable,
      cashTable,
      obj
    }, () => {
      this.getList(2)
      this.getList(3)
      this.getList(4)
      // this.setState({
      //   defaultAwardList: []
      // })
    })
  }

  private crystalPageinChange(currentPage: number) {
    let crystalTable = JSON.parse(JSON.stringify(this.state.crystalTable))
    crystalTable.currentPage = currentPage
    this.setState({
      crystalTable
    }, () => {
      this.getList(2)
    })
  }

  private crystalShowSizeChange(current: number, pageSize: number) {
    let crystalTable = JSON.parse(JSON.stringify(this.state.crystalTable))
    crystalTable.currentPage = 1
    crystalTable.pageSize = pageSize
    this.setState({
      crystalTable
    }, () => {
      this.getList(2)
    })
  }

  private cashPageinChange(currentPage: number) {
    let cashTable = JSON.parse(JSON.stringify(this.state.cashTable))
    cashTable.currentPage = currentPage
    this.setState({
      cashTable
    }, () => {
      this.getList(3)
    })
  }

  private cashShowSizeChange(current: number, pageSize: number) {
    let cashTable = JSON.parse(JSON.stringify(this.state.cashTable))
    cashTable.currentPage = 1
    cashTable.pageSize = pageSize
    this.setState({
      cashTable
    }, () => {
      this.getList(3)
    })
  }

  private experiencePageinChange(currentPage: number) {
    let experienceTable = JSON.parse(JSON.stringify(this.state.experienceTable))
    experienceTable.currentPage = currentPage
    this.setState({
      experienceTable
    }, () => {
      this.getList(4)
    })
  }

  private experienceShowSizeChange(current: number, pageSize: number) {
    let experienceTable = JSON.parse(JSON.stringify(this.state.experienceTable))
    experienceTable.currentPage = 1
    experienceTable.pageSize = pageSize
    this.setState({
      experienceTable
    }, () => {
      this.getList(4)
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose()
  }

  private async handleOk() {
    if (this.state.crystalTable.selectRowKeys.length === 0
      && this.state.cashTable.selectRowKeys.length === 0
      && this.state.experienceTable.selectRowKeys.length === 0) {
      message.error('请先关联奖品')
      return
    }
    let isEmpty = false
    let crystalList: any = [], cashList: any = [], experienceList: any = [], obj = JSON.parse(JSON.stringify(this.state.obj))
    this.state.crystalTable.selectRowKeys.forEach((id: number) => {
      if (!obj[`2_${id}`] || !obj[`2_${id}`].num) {
        isEmpty = true
      } else {
        crystalList.push({
          id,
          num: obj[`2_${id}`].num
        })
      }
    })
    this.state.cashTable.selectRowKeys.forEach((id: number) => {
      if (!obj[`3_${id}`] || !obj[`3_${id}`].num) {
        isEmpty = true
      } else {
        cashList.push({
          id,
          num: obj[`3_${id}`].num
        })
      }
    })
    this.state.experienceTable.selectRowKeys.forEach((id: number) => {
      if (!obj[`4_${id}`] || !obj[`4_${id}`].num) {
        isEmpty = true
      } else {
        experienceList.push({
          id,
          num: obj[`4_${id}`].num
        })
      }
    })
    if (isEmpty) {
      message.error('请填写发放数量')
      return
    }
    let param = {
      id: this.props.activityId,
      crystalList,
      cashList,
      experienceList,
    }
    let res = await activityConnectCard(param)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('奖品关联成功')
    this.props.onClose()
  }

  private crystalNumChange(value: number, index: number) {
    let crystalTable = JSON.parse(JSON.stringify(this.state.crystalTable))
    let obj = JSON.parse(JSON.stringify(this.state.obj))
    let key = `2_${crystalTable.list[index].id}`
    if (!obj[key]) {
      obj[key] = {
        num: '',
        id: crystalTable.list[index].id,
      }
    }
    obj[key].num = value
    // crystalTable.list[index].num = value
    this.setState({
      obj
    })
  }

  private experiencelNumChange(value: number, index: number) {
    let experienceTable = JSON.parse(JSON.stringify(this.state.experienceTable))
    let obj = JSON.parse(JSON.stringify(this.state.obj))
    let key = `4_${experienceTable.list[index].id}`
    if (!obj[key]) {
      obj[key] = {
        num: '',
        id: experienceTable.list[index].id,
      }
    }
    obj[key].num = value
    // experienceTable.list[index].num = value
    this.setState({
      obj
    })
  }

  private cashNumChange(value: number, index: number) {
    
    let cashTable = JSON.parse(JSON.stringify(this.state.cashTable))
    let obj = JSON.parse(JSON.stringify(this.state.obj))
    let key = `3_${cashTable.list[index].id}`
    if (!obj[key]) {
      obj[key] = {
        num: '',
        id: cashTable.list[index].id,
      }
    }
    obj[key].num = value
    // cashTable.list[index].num = value
    this.setState({
      obj,
    })
  }

  private searchCrystal (name: string) {
    let crystalTable = JSON.parse(JSON.stringify(this.state.crystalTable))
    crystalTable.name = name
    crystalTable.currentPage = 1
    this.setState({
      crystalTable
    }, () => {
      this.getList(2)
    })
  }

  private searchCash(name: string) {
    let cashTable = JSON.parse(JSON.stringify(this.state.cashTable))
    cashTable.name = name
    cashTable.currentPage = 1
    this.setState({
      cashTable
    }, () => {
      this.getList(3)
    })
  }

  private searchExperience(name: string) {
    let experienceTable = JSON.parse(JSON.stringify(this.state.experienceTable))
    experienceTable.name = name
    experienceTable.currentPage = 1
    this.setState({
      experienceTable
    }, () => {
      this.getList(4)
    })
  }

  // awardType 2.水晶券 3.代金券  4.体验券
  private async getList(awardType: number, ) {
    let currentPage = 1, pageSize = 10
    let name = ''
    switch (awardType) {
      case 2:
        currentPage = this.state.crystalTable.currentPage
        pageSize = this.state.crystalTable.pageSize
        name = this.state.crystalTable.name
        break;
      case 3:
        currentPage = this.state.cashTable.currentPage
        pageSize = this.state.cashTable.pageSize
        name = this.state.cashTable.name
        break;
      case 4:
        currentPage = this.state.experienceTable.currentPage
        pageSize = this.state.experienceTable.pageSize
        name = this.state.experienceTable.name
        break;
      default:
        message.error('未知奖品类型')
        break;
    }
    let res: any = null
    if (this.props.operateType === 'add') {
      let param = {
        currentPage,
        pageSize,
        channelNo: this.props.channelNo,
        name,
        stateList: [1, 2],
      }
      switch (awardType) {
        case 2:
          res = await crystalListGet(param)
          break;
        case 3:
          res = await cashVoucherGet(param)
          break;
        case 4:
          res = await experienceVoucherGet(param)
          break;
        default:
          message.error('未知奖品类型')
          break;
      }
    } else {
      res = await activePrize({ channelNo: this.props.channelNo, awardType, activityNo: this.props.activityNo, currentPage, pageSize })
    }
    
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    switch (awardType) {
      case 2:
        let crystalTable = JSON.parse(JSON.stringify(this.state.crystalTable))
        crystalTable.list = res.data.dataList
        crystalTable.total = res.data.page.totalCount
        this.setState({
          crystalTable
        })
        break;
      case 3:
        let cashTable = JSON.parse(JSON.stringify(this.state.cashTable))
        cashTable.list = res.data.dataList
        cashTable.total = res.data.page.totalCount
        this.setState({
          cashTable
        })
        break;
      case 4:
        let experienceTable = JSON.parse(JSON.stringify(this.state.experienceTable))
        experienceTable.list = res.data.dataList
        experienceTable.total = res.data.page.totalCount
        this.setState({
          experienceTable
        })
        break;
      default:
        message.error('未知奖品类型')
      break;
    }
    
  }

  private onCrystalRowSelection (info: any) {
    let crystalTable = JSON.parse(JSON.stringify(this.state.crystalTable))
    if (crystalTable.selectRowKeys.indexOf(info.id) === -1) {
      crystalTable.selectRowKeys.push(info.id)
    } else {
      crystalTable.selectRowKeys.splice(crystalTable.selectRowKeys.indexOf(info.id), 1)
    }
    this.setState({
      crystalTable
    })
  }

  private onCashRowSelection(info: any) {
    let cashTable = JSON.parse(JSON.stringify(this.state.cashTable))
    if (cashTable.selectRowKeys.indexOf(info.id) === -1) {
      cashTable.selectRowKeys.push(info.id)
    } else {
      cashTable.selectRowKeys.splice(cashTable.selectRowKeys.indexOf(info.id), 1)
    }
    this.setState({
      cashTable
    })
  }

  private onExperienceRowSelection(info: any) {
    let experienceTable = JSON.parse(JSON.stringify(this.state.experienceTable))
    if (experienceTable.selectRowKeys.indexOf(info.id) === -1) {
      experienceTable.selectRowKeys.push(info.id)
    } else {
      experienceTable.selectRowKeys.splice(experienceTable.selectRowKeys.indexOf(info.id), 1)
    }
    this.setState({
      experienceTable
    })
  }

  render() {
    const { pageSize, currentPage, cashTable, crystalTable, experienceTable, obj } = this.state
    const { operateType } = this.props
    const Footer = (<div className={`drawer-operation-btn`}>
      <Button className='sure-btn' type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
      <Button className='cancel-btn' onClick={this.handleCancel.bind(this)}>取消</Button>
    </div>)
    const crystalColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '减免金额（水晶）',
        dataIndex: 'waiverAmount',
        key: 'waiverAmount',
      },
      // {
      //   title: '有效期',
      //   dataIndex: 'price',
      //   key: 'price',
      // },
      {
        title: '总库存',
        dataIndex: 'stock',
        key: 'stock',
      },
      // {
      //   title: '已发放',
      //   dataIndex: 'usedStock',
      //   key: 'usedStock',
      // },
      // {
      //   title: '剩余库存',
      //   dataIndex: 'remainStock',
      //   key: 'remainStock',
      // },
      {
        title: '发放数量',
        dataIndex: '',
        key: '',
        render: (text: any, item: any, index: number) => 
          this.props.operateType === 'add' ?
            <InputNumber placeholder='请输入' value={obj[`2_${item.id}`] ? obj[`2_${item.id}`].num : ''} min={0} max={item.remainStock} onChange={(value: any) => {
            this.crystalNumChange(value, index)
          }}  /> :
          <span>{ item.num }</span>
      },
    ];
    const experienceColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(experienceTable.currentPage - 1) * experienceTable.pageSize + index + 1}</span>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'cardName',
      },
      {
        title: '使用时长（分钟）',
        dataIndex: 'useTime',
        key: 'useTime',
      },
      // {
      //   title: '有效期',
      //   dataIndex: 'price',
      //   key: 'price',
      // },
      {
        title: '总库存',
        dataIndex: 'stock',
        key: 'stock',
      },
      // {
      //   title: '已发放',
      //   dataIndex: 'usedStock',
      //   key: 'usedStock',
      // },
      // {
      //   title: '剩余库存',
      //   dataIndex: 'remainStock',
      //   key: 'remainStock',
      // },
      {
        title: '发放数量',
        dataIndex: '',
        key: '',
        render: (text: any, item: any, index: number) =>
          this.props.operateType === 'add' ?
            <InputNumber placeholder='请输入' min={0} value={obj[`4_${item.id}`] ? obj[`4_${item.id}`].num : ''} max={item.remainStock} onChange={(value: any) => {
              this.experiencelNumChange(value, index)
            }} /> :
            <span>{item.num}</span>
      },
    ];
    const cashColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(cashTable.currentPage - 1) * cashTable.pageSize + index + 1}</span>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '减免金额',
        dataIndex: 'waiverAmount',
        key: 'waiverAmount',
      },
      // {
      //   title: '有效期',
      //   dataIndex: 'price',
      //   key: 'price',
      // },
      {
        title: '总库存',
        dataIndex: 'stock',
        key: 'stock',
      },
      // {
      //   title: '已发放',
      //   dataIndex: 'usedStock',
      //   key: 'usedStock',
      // },
      // {
      //   title: '剩余库存',
      //   dataIndex: 'remainStock',
      //   key: 'remainStock',
      // },
      {
        title: '发放数量',
        dataIndex: '',
        key: '',
        render: (text: any, item: any, index: number) =>
          this.props.operateType === 'add' ?
            <InputNumber placeholder='请输入' value={obj[`3_${item.id}`] ? obj[`3_${item.id}`].num : ''} min={0} max={item.remainStock} onChange={(value: any) => {
              this.cashNumChange(value, index)
            }} /> :
            <span>{item.num}</span>
      },
    ];
    return (
      <Drawer
        title="奖品"
        visible={true}
        width={DIALOG_WIDTH}
        maskClosable={DIALOG_MASK_CLOSABLE}
        // onCancel={this.handleCancel.bind(this)}
        className={cpStyle.drawerContent}
        onClose={this.handleCancel.bind(this)}
      >
        {
          operateType === 'add' && Footer
        }
        <Row className='vendor-diver'>
          <Row>
            <Col span={6}>
              <Search onSearch={this.searchCrystal.bind(this)} placeholder='请输入水晶券名称'></Search>
            </Col>
          </Row>
          {
            operateType === 'add' && <Table
              rowKey='id'
              className='table vendor-diver'
              columns={crystalColumns}
              dataSource={crystalTable.list}
              pagination={false}
              rowSelection={{ type: 'checkbox', selectedRowKeys: crystalTable.selectRowKeys, onSelect: (item: any) => this.onCrystalRowSelection(item) }}
              onRow={(record: any) => {
                return {
                  onClick: () => {
                    // this.onCrystalRowSelection(record)
                  }
                }
              }}
            />
          }

          {
            operateType !== 'add' && <Table
              rowKey='id'
              className='table vendor-diver'
              columns={crystalColumns}
              dataSource={crystalTable.list}
              pagination={false}
            />
          }
          
          <Pagination 
            className='pagination vendor-diver' 
            current={crystalTable.currentPage} 
            total={crystalTable.total} 
            onChange={this.crystalPageinChange.bind(this)} 
            onShowSizeChange={this.crystalShowSizeChange.bind(this)} 
            pageSize={crystalTable.pageSize} 
            showSizeChanger 
            showQuickJumper 
            showTotal={() => { return `共${crystalTable.total}条数据`}}
           />
        </Row>
        <Row className={cpStyle.cash}>
          <Row>
            <Col span={6}>
              <Search onSearch={this.searchCash.bind(this)} placeholder='请输入代金券名称'></Search>
            </Col>
          </Row>
          {
            operateType === 'add' && <Table
              rowKey='id'
              className='table  vendor-diver'
              columns={cashColumns}
              dataSource={cashTable.list}
              pagination={false}
              rowSelection={{ type: 'checkbox', selectedRowKeys: cashTable.selectRowKeys, onSelect: (item: any) => this.onCashRowSelection(item) }}
              onRow={(record: any) => {
                return {
                  onClick: () => {
                    // this.onCashRowSelection(record)
                  }
                }
              }}
            />
          }
          {
            operateType !== 'add' && <Table
              rowKey='id'
              className='table  vendor-diver'
              columns={cashColumns}
              dataSource={cashTable.list}
              pagination={false}
            />
          }
          <Pagination
            className='pagination vendor-diver'
            current={cashTable.currentPage}
            total={cashTable.total}
            onChange={this.cashPageinChange.bind(this)}
            onShowSizeChange={this.cashShowSizeChange.bind(this)}
            pageSize={cashTable.pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={() => { return `共${cashTable.total}条数据`}}
          />
        </Row>
        <Row className={cpStyle.experience}>
          <Row>
            <Col span={6}>
              <Search onSearch={this.searchExperience.bind(this)} placeholder='请输入体验券名称'></Search>
            </Col>
          </Row>
          {
            operateType === 'add' && <Table
              rowKey='id'
              className='table vendor-diver'
              columns={experienceColumns}
              dataSource={experienceTable.list}
              pagination={false}
              rowSelection={{ type: 'checkbox', selectedRowKeys: experienceTable.selectRowKeys, onSelect: (item: any) => this.onExperienceRowSelection(item) }}
              onRow={(record: any) => {
                return {
                  onClick: () => {
                    // this.onExperienceRowSelection(record)
                  }
                }
              }}
            />
          }
          {
            operateType !== 'add' && <Table
              rowKey='id'
              className='table vendor-diver'
              columns={experienceColumns}
              dataSource={experienceTable.list}
              pagination={false}
            />
          }
          <Pagination
            className='pagination vendor-diver'
            current={experienceTable.currentPage}
            total={experienceTable.total}
            onChange={this.experiencePageinChange.bind(this)}
            onShowSizeChange={this.experienceShowSizeChange.bind(this)}
            pageSize={experienceTable.pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={() => { return `共${experienceTable.total}条数据`}}
          />
        </Row>
        <div className={cpStyle.bottomPlaceholder}></div>
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
  activityId: any,
  activityNo: any,
  operateType: any
  channelNo: any,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(EditChinaPirze)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)