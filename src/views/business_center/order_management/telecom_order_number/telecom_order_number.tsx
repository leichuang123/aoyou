import React from 'react'
import telecomStyle from './telecom_order_number.module.scss'
import { connect } from 'react-redux';
import { Form, Input, Button, message, Modal, Table, Pagination, DatePicker, InputNumber, Select} from 'antd';

import { 
  queryDeliveryNumber, 
  batchGenDeliveryNumber, 
  bindingDeliveryNo, 
  changeBindingDeliveryNo, 
  bindErrorDeliveryNo, 
  deliveryNumberListExport,
  getBatchList,
} from '../../../../server/api'
import { PAGE_SIZE } from '../../../../config/config'
import  moment from 'moment'

const { Option } = Select
// import { 
  
// } from '../../../../server/api'
const { MonthPicker } = DatePicker;


interface IProps {
  dispatch: Function,
  form: any,
}

interface IState {
  selectDate:any,
  showCreateModal:boolean,
  bindModal: boolean,
  exportParam: any,
  total:number,
  list:any,
  currentPage: number,
  pageSize: number,
  selectItem: any,
  deliveryNo: string,
  deviceNo:string,
  bindModalType: number,
  isShowBatch: boolean,
  batchList: any,
}

class Order extends React.PureComponent<IProps, IState> {
  state:any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total:0,
    showCreateModal: false,
    bindModal: false,
    list: [],
    selectDate: moment(new Date(), 'YYYY/MM'),
    selectItem: {},
    deliveryNo: "",
    deviceNo: "",
    bindModalType: 0, // 0.绑定或换绑  1.绑定错误串号
    isShowBatch: false,
    batchList: []
  }
  
  private handleSubmit() {

  }

  private showCreateModalCancel() {
    this.setState({
      showCreateModal: false
    })
  }

  private async showCreateModalOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let params = {
        count: data.count.toString()
      }
      let response = await batchGenDeliveryNumber(params);
      if (response.code !== 200) {
        message.error(response.message)
        return 
      }
      message.success(response.message)
      this.setState({
        currentPage:1,
        showCreateModal: false,
      },() => {
        this.getList()
      })
    });
  }

  private async bindModalOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let params:any = {
        deliveryNo: this.state.selectItem.deliveryNo
      }
      let response: any = null;
      if (this.state.bindModalType === 0) {
        params.deviceNo = data.deviceNo
        response = this.state.selectItem.state === 1 ? await changeBindingDeliveryNo(params) : await bindingDeliveryNo(params)
      } else {
        params.errorDeviceNo = data.deviceNo
        response = await bindErrorDeliveryNo(params)
      }

      if(response.code !== 200) {
        message.error(response.message)
        return;
      }
      message.success(response.message);
      this.setState({
        bindModal: false
      })
      this.getList();
    });
  }

  handleSubmitExport () {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let params: any = {
        batch: data.batch,
        yearStr: this.state.exportParam.yearStr.substr(2, 2),
        monthStr: this.state.exportParam.monthStr,
      }
      this.setState({
        isShowBatch: false,
      })
      deliveryNumberListExport(params)
    });
  }

  private bindModalCancel() {
    this.setState({
      bindModal: false
    })
  }

  private async getList() {
    
    
    let params: any = {
      deliveryNo: this.state.deliveryNo,
      deviceNo: this.state.deviceNo,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      // name: this.state.name,
    }
    if (this.state.selectDate && this.state.selectDate.get) {
      let monthStr = this.state.selectDate.get('month') + 1;
      params.yearStr = this.state.selectDate.get('year').toString()
      params.monthStr = monthStr < 10 ? "0" + monthStr : monthStr.toString()
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await queryDeliveryNumber(params)
    if (res.code === 200) {
      this.setState({
        total: res.data.page.totalCount,
        list: res.data.dataList
      })
    } else {
      message.error(res.message)
    }
  }

  private createOrder() {
    this.setState({
      showCreateModal: true,
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

  private dateChange(val:any) {
    this.setState({
      selectDate: val,
      currentPage: 1,
    },() => {
      this.getList();
    })
  }

  private bindCode(item:any) {
    this.setState({
      bindModal: true,
      bindModalType: 0,
      selectItem: item,
    })
  }

  private deliveryNoChange(e:any) {
    this.setState({
      deliveryNo: e.target.value
    })
  }

  private deviceNoChange(e:any) {
    this.setState({
      deviceNo: e.target.value
    })
  }

  private search() {
    this.setState({
      currentPage:1,
    },() => {
      this.getList();
    });
  }

  private bindErrorCode (item: any) {
    this.setState({
      bindModal: true,
      bindModalType: 1,
      selectItem: item,
    })
  }

  private cancelExport () {
    this.setState({
      isShowBatch: false
    })
  }

  private async export () {
    let res = await getBatchList({
      yearStr: this.state.exportParam.yearStr.substr(2, 2),
      monthStr: this.state.exportParam.monthStr
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }

    this.setState({
      batchList: res.data,
      isShowBatch: true
    })
  }

  componentDidMount () {
    this.getList();
  }

  render () {    
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (text: string, record: any, index: number) => <span>{(this.state.currentPage - 1) * this.state.pageSize + index + 1}</span>,
      },
      {
        title: '年份',
        dataIndex: 'year',
        key: 'year',
      },
      {
        title: '月份',
        dataIndex: 'month',
        key: 'month',
      },
      {
        title: '出库号',
        dataIndex: 'deliveryNo',
        key: 'deliveryNo',
      },
      {
        title: '盒子串号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '错误串号',
        dataIndex: 'errorDeviceNo',
        key: 'errorDeviceNo',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text: any, item: any) => {
          return ['未绑定','已绑定'][text]
        }
      },
      {
        title: '生成时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '创建人',
        dataIndex: 'createMan',
        key: 'createMan',
      },
      {
        title: '操作',
        key: 'action',
        width: 200,
        render: (text: any, item: any) => {
          return [
            item.state === 1 ? <Button type='link' onClick={this.bindCode.bind(this,item)}>换绑</Button> : <Button type='link' onClick={this.bindCode.bind(this,item)}>绑定</Button>,
            <Button type='link' onClick={this.bindErrorCode.bind(this, item)}>错误串号</Button>
          ]
        }
      }
    ];
    return (
      <div className={telecomStyle.body}>
        <div className={telecomStyle.nav}>
          {/* <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
            <Form.Item label='名称'>
              
            </Form.Item>
            <Form.Item>
              <Button type="primary">
                搜索
              </Button>
            </Form.Item>
          </Form> */}
          <MonthPicker  style={{width: '100px'}} defaultValue={this.state.selectDate} onChange={this.dateChange.bind(this)} placeholder="Select month" />
          <label>
            出库号：
            <Input onPressEnter={this.search.bind(this)} onChange={this.deliveryNoChange.bind(this)} value={this.state.deliveryNo} maxLength={16} allowClear  style={{width: '200px'}} placeholder="请输入出库号" />
          </label>
          
          <label>
            串号：
            <Input onPressEnter={this.search.bind(this)} onChange={this.deviceNoChange.bind(this)} value={this.state.deviceNo} maxLength={25} allowClear style={{width: '250px'}} placeholder="请输入串号" />
          </label>
          <Button type="primary" onClick={this.search.bind(this)}>搜索</Button>
          <Button type="primary" onClick={this.createOrder.bind(this)}>生成出库号</Button>
          <Button type="primary" onClick={this.export.bind(this)}>导出</Button>
        </div>
        <Table scroll={{ x: true }} rowKey="deliveryNo" className='table' columns={columns} dataSource={this.state.list} pagination={false} />
        <Pagination className='pagination vendor-diver' current={this.state.currentPage} total={this.state.total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={this.state.pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${this.state.total}条数据` }} />
        <Modal
          maskClosable={false}
          title='生成本月出库号'
          visible={this.state.showCreateModal}
          onOk={this.showCreateModalOk.bind(this)}
          onCancel={this.showCreateModalCancel.bind(this)}
          width='400px'
        >
          <div>本月为： {moment().format('ll')}</div>
          <div>生成数量范围：1-5000</div>
          {
            this.state.showCreateModal && 
            <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
              <Form.Item label='生成个数'>
                {
                  getFieldDecorator('count',{
                    initialValue: 1,
                    rules: [
                      { required: true, message: '请输入数量' },
                    ],
                  })(
                    <InputNumber precision={0} min={1} step={1} max={5000}></InputNumber>
                  )
                }
              </Form.Item>
            </Form>
          }
        </Modal>
        <Modal
          maskClosable={false}
          title={[this.state.selectItem.state === 1 ? "换绑" : "绑定", '绑定错误串号'][this.state.bindModalType]}
          visible={this.state.bindModal}
          onOk={this.bindModalOk.bind(this)}
          onCancel={this.bindModalCancel.bind(this)}
          width='450px'
        >
          {
            this.state.bindModal &&
            <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
              <Form.Item label='盒子串号'>
                {
                  getFieldDecorator('deviceNo',{
                    initialValue: this.state.bindModalType === 0 ? this.state.selectItem.deviceNo : this.state.selectItem.errorDeviceNo,
                    rules: [
                      { required: true, message: '请输入串号' },
                    ],
                  })(
                    <Input style={{width:300+'px'}} allowClear maxLength={25} ></Input>
                  )
                }
              </Form.Item>
            </Form>
          }
        </Modal>
        <Modal
          maskClosable={true}
          title="出库号导出"
          visible={this.state.isShowBatch}
          onOk={this.handleSubmitExport.bind(this)}
          onCancel={this.cancelExport.bind(this)}
          width='450px'
        >
          {
            this.state.isShowBatch &&
            <Form layout="inline" onSubmit={this.handleSubmitExport.bind(this)}>
              <Form.Item label='批次'>
                {
                  getFieldDecorator('batch', {
                    initialValue: '',
                    rules: [
                      { required: true, message: '请选择批次' },
                    ],
                  })(
                    <Select style={{width: '200px'}} >
                      {
                        this.state.batchList.map((item: any, index: number) => {
                          return <Option key={item} value={item}>{item}</Option>
                        })
                      }

                    </Select>,
                  )
                }
              </Form.Item>
            </Form>
          }
        </Modal>
      </div>
    )
  }
}

interface stateType {
  isShowLoading: Boolean
}

const order = Form.create({ name: 'order' })(Order)


export default connect(
  (state: stateType) => ({
    // user: state.user,
    isShowLoading: state.isShowLoading
  })
)(order)