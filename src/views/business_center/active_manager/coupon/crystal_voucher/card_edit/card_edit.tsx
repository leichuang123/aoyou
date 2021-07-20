import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../../../../../../interface/user'
import { FormComponentProps } from 'antd/es/form';
import { Form, Drawer, Button, Row, Col, Card, Input, InputNumber, Radio, Select, Checkbox, Table, Pagination, DatePicker, message } from 'antd'
import { 
  PAGE_SIZE, 
  DIALOG_WIDTH,
  DIALOG_MASK_CLOSABLE,
  MAXIMUM_RELIEF_AMOUNT,
  MAX_STOCK,
  MAXIMUM_CONSUMPTION,
  SELL_CHANNEL,
  INPUT_MAXLENGTH,
 } from '../../../../../../config/config'

import { 
  queryDictList, 
  activeCardProductList, 
  crystalVoucherCreate, 
  cashVoucherCreate, 
  experienceVoucherCreate,
  crystalDetailGet,
  cashVoucherDetailGet,
  experienceVoucherDetailGet,
  crystalVoucherUpdata,
  cashVoucherUpdata,
  experienceVoucherUpdata
} from '../../../../../../server/api'
import moment from 'moment';
import { codeInfoListFilter } from '../../../../../../tools/tools'

const { TextArea, Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const DATEfORMAT = 'YYYY-MM-DD HH:mm:ss';
const weekIdOptions = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周天', value: 7 },
];
interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: (isRefresh: boolean) => void,
  isViewOnly: boolean,
  editInfo: any,
  submitSuccess: () => void,
  type: any, // 2.水晶券  3.代金券   4.体验券
}

interface IState {
  // editInfo: any,
  cardInfo: any,
  indeterminate: boolean,
  checkAll: boolean,
  currentPage: number,
  pageSize: number,
  total: number,
  channelNoOptions: any,
  productList: any,
  startTime: any,
  endTime: any,
  selectedRowKeys: any,
  searchName: string,
  showDefaultDate: any,
}

class CardEdit extends React.PureComponent<IProps, IState> {

  state = {
    // editInfo: null,
    indeterminate: false,
    checkAll: false,
    cardInfo: {
      name: '',
      waiverAmount: '',
      stock: '',
      limitReceive: '',
      weekIdList: [],
      type:0,
      minCost: 0,
      content: '',
      channelNo: null,
      validityReceive: 1, // 领取后多少天生效
      validityRange: 1, // 领取后生效天数
      validityBegin: '', // 有效期开始日期
      validityEnd: '', // 有效期结束日期
    },
    total: 0,
    channelNoOptions: [],
    productList: [],
    currentPage: 1,
    pageSize: PAGE_SIZE,
    // pageSize: 3,
    startTime: '',
    endTime: '',
    selectedRowKeys:[],
    searchName: "",
    showDefaultDate: [[moment(new Date(), DATEfORMAT), moment(new Date(), DATEfORMAT)]]
  }

  componentDidMount() {
    this.queryDictList();
    this.initValue();
  }

  private async initValue(){
    if (this.props.editInfo === null) {
      return
    }
    let res: any = null
    let param = { id: this.props.editInfo.id }
    switch (+this.props.type) {
      case 2:
        res = await crystalDetailGet(param)
        break;
      case 3:
        res = await cashVoucherDetailGet(param)
        break;
      case 4:
        res = await experienceVoucherDetailGet(param)
        break;
      default:
        message.error('未知type类型，网页参数异常')
        break;
    }
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    if (this.props.type === 4) {
      if (res.data.length === 0) {
        message.error('数据异常，请联系后端人员排查')
        return
      }
      const weekIdList = res.data[0].weekId !== null ? res.data[0].weekId.split('/').map((item: any) => { return item * 1 }) : []
      this.setState({
        selectedRowKeys: [+res.data[0].productId],
        cardInfo: { 
          ...res.data[0],
          weekIdList,
          waiverAmount: +res.data[0].useTime,
        }
      }, async () => {
        // await this.sleep() // 暂时修复偶现渠道没初始化就查询了商品列表的bug
        // this.getProductList()
      })
      return
    }
    if (res.data.info.length === 0) {
      message.error('数据异常，请联系后端人员排查')
      return
    }
    const weekIdList = res.data.info[0].weekId !== null ? res.data.info[0].weekId.split('/').map((item: any) => { return item * 1 }) : []
    this.setState({
      selectedRowKeys: typeof res.data.productId === 'string' ? res.data.productId.split('/').map((item: number) => {return item * 1}) : [],
      cardInfo: {
        ...res.data.info[0],
        weekIdList,
      }
    }, async () => {
      // await this.sleep()  // 暂时修复偶现渠道没初始化就查询了商品列表的bug
      // this.getProductList()
    })
    
  }

  private sleep (t = 1000) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, t)
    })
  }

  private async queryDictList() {
    let params = {
      pageSize: 99999,
      codeTypeNo: SELL_CHANNEL,
    }
    let response = await queryDictList(params);
    if(response.code === 200) {
      if(!this.props.editInfo) {
        response.data.dataList = codeInfoListFilter(response.data.dataList)
      }
      
      let channelNoList = response.data.dataList
      this.setState({
        channelNoOptions: response.data.dataList,
        cardInfo:{...this.state.cardInfo, channelNo: channelNoList[0].serialNo}
      },() => {
        // 获取完渠道之后，获取一下商品列表
        this.getProductList();
      })
    } else {
      message.error(response.message)
    }
    // this.setState({
    //   channelNoOptions: channelNoList,
    //   cardInfo: { ...this.state.cardInfo, channelNo: channelNoList[0].serialNo }
    // }, () => {
    //   // 获取完渠道之后，获取一下商品列表
    //   this.getProductList();
    // })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose(false)
  }
  
  private handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      // 检查用户是否输入完整
      if (+data.cardInfo.type === 0 && (!this.state.cardInfo.validityReceive || !this.state.cardInfo.validityRange)) {
        if (!this.state.cardInfo.validityReceive) {
          message.error('请输入生效时间');
          return false;
        }
        if (!this.state.cardInfo.validityRange) {
          message.error('请输入有效时间');
          return false;
        }
        return false;
      }
      if (+data.cardInfo.type === 1 && (!this.state.cardInfo.validityBegin || !this.state.cardInfo.validityEnd)) {
        if (!this.state.cardInfo.validityBegin) {
          message.error('请选择开始时间');
          return false;
        }
        if (!this.state.cardInfo.validityEnd) {
          message.error('请选择结束时间');
          return false;
        }
        return false;
      }
      if (!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0) {
        message.error('请选择商品');
        return false;
      }
      let params:any = {
        name: data.cardInfo.name,
        stock: data.cardInfo.stock,
        minCost: data.cardInfo.minCost,
        content: data.cardInfo.content,
        limitReceive: data.cardInfo.limitReceive === '' ? 1 : data.cardInfo.limitReceive,
        type: data.cardInfo.type,
        weekIdList: data.cardInfo.weekIdList,
        channelNo: data.cardInfo.channelNo,
        validityReceive: this.state.cardInfo.validityReceive || 0,
        validityRange: this.state.cardInfo.validityRange || 0,
        validityBegin: this.state.cardInfo.validityBegin || "",
        validityEnd: this.state.cardInfo.validityEnd || "",
      }
      if (this.props.type === 4) {
        params.useTime = data.cardInfo.waiverAmount
        params.productId = this.state.selectedRowKeys[0]
      } else {
        params.waiverAmount = data.cardInfo.waiverAmount
        params.productIdList = this.state.selectedRowKeys
      }
      if (this.props.editInfo !== null) {
        params.id = this.props.editInfo.id
      }
      let response: any = null
      switch (+this.props.type) {
        case 2:
          response = this.props.editInfo === null ? await crystalVoucherCreate(params) : await crystalVoucherUpdata(params)
          break;
        case 3:
          response = this.props.editInfo === null ? await cashVoucherCreate(params) : await cashVoucherUpdata(params)
          break;
        case 4:
          response = this.props.editInfo === null ? await experienceVoucherCreate(params) : await experienceVoucherUpdata(params)
          break;
        default:
          message.error('传入参数错误，未知类型')
          break;
      }
      if (response == null) return
      if (response.code !== 200) {
        message.error(response.message)
        return
      }
      this.props.submitSuccess()
      message.success('保存成功')
    })
  }

  onChange(weekIdList :any) {
    this.setState({
      cardInfo: {...this.state.cardInfo, weekIdList},
      indeterminate: !!weekIdList.length && weekIdList.length < weekIdOptions.length,
      checkAll: weekIdList.length === weekIdOptions.length,
    });
  };

  onCheckAllChange(e:any){
    let weekIdList:any = [];
    if(e.target.checked) {
      weekIdList = weekIdOptions.map((item:any) => {
        return item.value;
      })
    } 
    this.setState({
      cardInfo: {...this.state.cardInfo, weekIdList: weekIdList},
      indeterminate: false,
      checkAll: e.target.checked,
    },() => {
      this.props.form.resetFields()
    });
  };

  private async getProductList() {
    let params = {
      name: this.state.searchName,
      currtenPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      channelNo: this.state.cardInfo.channelNo,
    }
    let response = await activeCardProductList(params);
    if(response.code === 200) {
      this.setState({
        productList: response.data.dataList,
        total: response.data.page.totalCount
      })
    }
  }

  private searchProductList(name:any) {
    this.setState({
      searchName: name
    }, () => {
      this.getProductList();
    })
  }

  private onSelectChange(selectedRowKeys: any) {
    if (this.props.type === 4) {
      return
    }
    this.setState({ selectedRowKeys },() => {
      // console.log(this.state.selectedRowKeys)
    });
  }

  private pageinChange(currentPage: number) {
    this.setState({
      currentPage
    }, () => {
      this.getProductList();
    });
  }

  private showSizeChange(current: number, pageSize: number) {
    this.setState({
      currentPage: 1,
      pageSize
    }, () => {
      this.getProductList();
    })
  }

  private channelNoChange(options: any) {
    this.setState({
      cardInfo: {...this.state.cardInfo, channelNo: options}
    },() => {
      this.getProductList();
      this.resetSelectPsoductList();
    })
  }

  private resetSelectPsoductList() {
    this.setState({
      selectedRowKeys: [],
    })
  }
  private disabledDate = (current:any) => {
    return current <= moment().startOf('day');
  }

  private changeValidityReceive(val:any) {
    let cardInfo = JSON.parse(JSON.stringify(this.state.cardInfo))
    cardInfo.validityReceive = val
    this.setState({
      cardInfo
    })
  }

  private changeValidityRange (val: any) {
    let cardInfo = JSON.parse(JSON.stringify(this.state.cardInfo))
    cardInfo.validityRange = val
    this.setState({
      cardInfo
    })
  }

  private dateChange(val:any) {

    let startTime = val.length > 0 ? `${val[0].format(DATEfORMAT)}` : '';
    let endTime = val.length > 1 ? `${val[1].format(DATEfORMAT)}` : '';
    let cardInfo = JSON.parse(JSON.stringify(this.state.cardInfo))
    cardInfo.validityBegin = startTime
    cardInfo.validityEnd = endTime
    this.setState({
      showDefaultDate: val,
      cardInfo
    })
  }

  private waiverAmountChange (value: any) {
    let cardInfo = JSON.parse(JSON.stringify(this.state.cardInfo))
    if(isNaN(value)) {
      return false
    }
    cardInfo.waiverAmount = value
    this.setState({
      cardInfo
    })
  }

  private minCostChange (value: any) {
    let cardInfo = JSON.parse(JSON.stringify(this.state.cardInfo))
    cardInfo.minCost = value
    this.setState({
      cardInfo
    })
  }

  render() {
    const { currentPage, pageSize, total, productList, selectedRowKeys } = this.state;
    const { getFieldDecorator } = this.props.form
    const { editInfo, type, isViewOnly } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    const rowSelection = {
      selectedRowKeys,
      columnTitle: '',
      onSelect: (record: any, selected: boolean, keys: any) => {
        if (this.props.type !== 4) {
          this.setState({
            selectedRowKeys: keys.map((item: any) => {
              return item.id
            })
          })
          return
        }
        if (selected) {
          this.setState({
            selectedRowKeys: [record.id]
          })
          return
        }
        let selectedRowKeys = JSON.parse(JSON.stringify(this.state.selectedRowKeys))
        selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
        this.setState({
          selectedRowKeys
        })
      },
      onChange: this.onSelectChange.bind(this),
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: '虚拟机名称',
        dataIndex: 'vmName',
        key: 'vmName',
      },
      {
        title: '内存',
        dataIndex: 'memory',
        key: 'memory',
      },
      {
        title: 'CPU',
        dataIndex: 'cpu',
        key: 'cpu',
      },
      // {
      //   title: '系统盘',
      //   dataIndex: 'systemDisk',
      //   key: 'systemDisk',
      // },
      {
        title: '操作系统',
        dataIndex: 'system',
        key: 'system',
      },
      // {
      //   title: '显存',
      //   dataIndex: 'graphicsMemory',
      //   key: 'graphicsMemory',
      // },
      {
        title: '硬盘',
        dataIndex: 'disk',
        key: 'disk',
      },
      {
        title: '每天(水晶)',
        dataIndex: 'daily',
        key: 'daily',
      },
      {
        title: '每月(水晶)',
        dataIndex: 'monthly',
        key: 'monthly',
      },
      {
        title: '每年(水晶)',
        dataIndex: 'annually',
        key: 'annually',
      }
    ];
    let title = ['水晶券', '代金券', '体验券'][type - 2]
    // this.props.editInfo === null ? [null, null] : [moment(this.state.cardInfo.validityBegin), moment(this.state.cardInfo.validityEnd)]
    let defaultRange: any = null
    if (this.state.cardInfo.validityBegin&& this.state.cardInfo.validityEnd) {
      defaultRange = [
        moment(this.state.cardInfo.validityBegin),
        moment(this.state.cardInfo.validityEnd)
      ]
    }
    return (
      <Drawer
        title={editInfo === null ? `新建${title}` : `编辑${title}`}
        visible={true}
        maskClosable={DIALOG_MASK_CLOSABLE}
        
        onClose={this.handleCancel.bind(this)}
        width={DIALOG_WIDTH}
      >
        <Form {...formItemLayout} className="edit-form"  onSubmit={this.handleOk.bind(this)}>
          <Card title="基础信息">
            <Row>
              <Col span={12}>
                <Form.Item label='名称' >
                {getFieldDecorator('cardInfo.name', {
                    rules: [{ required: true, message: '请输入名称' }],
                    initialValue: this.state.cardInfo.name,
                  })(
                    <Input disabled={isViewOnly} placeholder="请输入名称" maxLength={30} />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={type === 4 ? '使用时长' : '减免金额'}>
                  {
                    getFieldDecorator('cardInfo.waiverAmount', {
                      rules: [{ required: true, message: `请输入${ type === 4 ? '使用时长' : '减免金额'}`}],
                      initialValue: this.state.cardInfo.waiverAmount,
                    })(
                      <div className='flex-center'>
                        <InputNumber disabled={isViewOnly} style={{ flex: 1 }} min={0} onChange={this.waiverAmountChange.bind(this)} value={+this.state.cardInfo.waiverAmount} max={MAXIMUM_RELIEF_AMOUNT} className="widthfull" placeholder="最大输入9999999" />
                        { ['水晶', 'RMB', '分钟'][type - 2] }
                      </div>
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='总库存'>
                  {
                    getFieldDecorator('cardInfo.stock', {
                      rules: [{ required: true, message: '请输入总库存'}],
                      initialValue: this.state.cardInfo.stock,
                    })(
                      <InputNumber disabled={isViewOnly} min={1} max={MAX_STOCK} className="widthfull" placeholder="最大输入9999999" />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='领券限制'>
                  {
                    getFieldDecorator('cardInfo.limitReceive', {
                      rules: [{ required: false, message: '请输入用户领取上限' }],
                      initialValue: this.state.cardInfo.limitReceive,
                    })(
                      <InputNumber disabled={isViewOnly} min={0} max={MAX_STOCK} className="widthfull" placeholder="用户领券上限，如不填，默认1张" />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='渠道'>
                  {
                    getFieldDecorator('cardInfo.channelNo', {
                      rules: [{ required: true, message: '请选择销售渠道' }],
                      initialValue: this.state.cardInfo.channelNo,
                    })(
                      <Select disabled={this.props.editInfo !== null || isViewOnly } style={{ width: 120 }} onChange={this.channelNoChange.bind(this)}>
                        {
                          this.state.channelNoOptions.map((item:any) => {
                            return <Option key={item.id} value={item.serialNo}>{item.name}</Option>
                          })
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label='有效期' labelCol={{ span: 4 }} wrapperCol={{span: 20}} >
                  {
                    getFieldDecorator('cardInfo.type', {
                      rules: [{ required: true, message: '请选择有效期' }],
                      initialValue: this.state.cardInfo.type
                    })(
                      <Radio.Group disabled={isViewOnly}>
                        <Row>
                            <Radio value={0}>领取后</Radio>
                            <InputNumber style={{marginRight: '8px'}} disabled={isViewOnly} onChange={this.changeValidityReceive.bind(this)} min={1} max={9999999} value={this.state.cardInfo.validityReceive} />
                          天生效，有效天数
                          <InputNumber style={{marginLeft: '8px', marginRight: '8px'}} disabled={isViewOnly} onChange={this.changeValidityRange.bind(this)} min={1} max={9999999} value={this.state.cardInfo.validityRange} />
                          天
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Radio value={1}>固定日期</Radio>
                            <RangePicker
                              style={{ width: '400px' }}
                              disabledDate={this.disabledDate}
                              disabled={isViewOnly}
                              showTime={
                                { 
                                  format: 'HH:mm:ss', 
                                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')]
                                }
                              }
                              value={defaultRange}
                              onChange={this.dateChange.bind(this)}
                              format={DATEfORMAT}
                            />
                            {/* <DatePicker
                           placeholder="开始时间"
                           format={DATEfORMAT}
                          //  defaultValue={startTime}
                           disabledDate={this.disabledStartDate}
                          />
                          <DatePicker
                           placeholder="结束时间" 
                           format={DATEfORMAT}
                          //  defaultValue={endTime}
                           disabledDate={this.disabledEndDate}
                          /> */}
                          </Col>
                        </Row>
                      </Radio.Group>
                    )
                  }

                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label='可用时间段' labelCol={{ span: 4 }} wrapperCol={{span: 20}}>
                  {/* <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange.bind(this)}
                    checked={this.state.checkAll}
                  >
                    全选
                  </Checkbox> */}
                  {
                    getFieldDecorator('cardInfo.weekIdList', {
                      rules: [{ required: true, message: '请选择可用时间段' }],
                      initialValue: this.state.cardInfo.weekIdList,
                    })(
                      <Checkbox.Group disabled={isViewOnly} onChange={this.onChange.bind(this)} options={weekIdOptions} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="使用条件" className='vendor-diver'>
            <Row>
              {/* <Col span={24}> */}
              <Search
                placeholder="拥有计费时长的商品"
                onSearch={this.searchProductList.bind(this)}
                maxLength={INPUT_MAXLENGTH}
                style={{ width: 200 }}
              />
              {/* </Col> */}
              {
                !isViewOnly && <Table
                  rowKey='id'
                  scroll={{x: true}}
                  // className='table' 
                  columns={columns}
                  className='vendor-diver'
                  dataSource={productList}
                  pagination={false}
                  rowSelection={rowSelection}
                  // onSelect: (item) => this.productSelect(item) }}
                  onRow={(record: any) => {
                    return {
                      onClick: () => {
                        // this.productSelect(record)
                      }
                    }
                  }}
                />
              }

              {
                isViewOnly && <Table
                  rowKey='id'
                  scroll={{ x: true }}
                  // className='table' 
                  columns={columns}
                  className='vendor-diver'
                  dataSource={productList}
                  pagination={false}
                />
              }
              
               <Pagination className='vendor-diver' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
              <Col>
                <Form.Item label='限定最小消费'>
                {
                  getFieldDecorator('cardInfo.minCost', {
                    rules: [{ required: true, message: '请选择最小消费' }],
                    initialValue: this.state.cardInfo.minCost,
                  })(
                    <div>
                      <InputNumber disabled={isViewOnly} onChange={this.minCostChange.bind(this)} value={this.state.cardInfo.minCost} min={0} max={MAXIMUM_CONSUMPTION} />
                      <em>若输入0则不限定消费</em>
                    </div>
                  )
                } 
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label='使用说明'>
                  {
                    getFieldDecorator('cardInfo.content', {
                      rules: [{ required: true, message: '请填写使用说明' }],
                      initialValue: this.state.cardInfo.content,
                    })(
                      <TextArea disabled={isViewOnly} maxLength={INPUT_MAXLENGTH*10} rows={4} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 999,
          }}
        >
          <Button key="back" onClick={this.handleCancel.bind(this)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={this.handleOk.bind(this)}>
            保存
          </Button>
        </div>
      </Drawer>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: (isRefresh: boolean) => void,
  editInfo: null,
  isViewOnly: boolean,
  submitSuccess: () => void,
  type: number,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(CardEdit)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)