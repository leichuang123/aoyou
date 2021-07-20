import React from 'react'
import noticeStyle from './station_notice.module.scss'
import { connect } from 'react-redux';
import { Row, Col, message, Radio, Input, Button, Form, Pagination, Table, Modal, Checkbox, DatePicker, Tag, Tooltip, Drawer, Cascader } from 'antd';
import moment from 'moment'
// import locale from 'antd/es/date-picker/locale/zh_CN'
import { 
  queryNoticeList,
  queryDictList,
  addNotice,
  editNotice,
  sendNotice,
  getAreaList,
  queryDataCenterList,
} from '../../../../server/api'
// import { codeInfoListFilter } from '../../../../tools/tools'
import { 
  // TITLE_SLICE_LENGTH, 
  NOTICE_TYPE_ID,
  NOTICE_RECEIVER_TYPE_ID,
  SELL_CHANNEL,
  INPUT_MAXLENGTH,
} from "../../../../config/config"
// const { Option } = Select;
const { TextArea, Search } = Input;


interface IProps {
  dispatch: Function,
  form:any,
}

interface IState {
  formType:string,
  tableData: any,
  visible: boolean,
  channelList: any,
  channelObjList: any,
  noticeTypeList:any,
  noticeReceiverTypeList:any,
  noticeTypeValue: number,
  noticeReceiverTypeValue: number,
  sendTime: any,
  channelNoList: Array<number>,
  currentPage: number,
  pageSize: number,
  totalCount: number,
  title: string,
  tableInitValue: any,
  noticeNo: string,
  noticeInfoVisible: boolean,
  noticeInfoValue: any,
  areaList: any,
  dataCenterAddressList: any,  //数据中心的id数组，支持多选
  dataCenterList: any,
}

// let fomartTime = (val:any) => {
//   let times = "";
//   if(val) {
//     let date = new Date(val);
//     times = date.toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')  
//   }
  
//   return times;
// }
class Notice extends React.PureComponent<IProps, IState> {
  constructor(props:any) {
    super(props)
    this.addNotice = this.addNotice.bind(this);
  }
  state:any = {
    formType: "",
    title: "",
    currentPage: 1,
    pageSize: 10,
    visible: false,
    tableData: [],
    channelList: [],
    channelObjList: {},
    noticeTypeList: [],
    noticeReceiverTypeList: [],
    noticeTypeValue: -1,
    noticeReceiverTypeValue: -1,
    sendTime: null,
    channelNoList: [],
    totalCount: 0,
    tableInitValue: null, // 表格初始化参数
    noticeNo: "",
    noticeInfoVisible: false,
    noticeInfoValue: null,
    areaList:[],
    dataCenterAddressList: [],
    dataCenterList: [],
  }
  
  componentDidMount () {
    this.queryNoticeList();
    this.getChannelList();
    this.getNoticeTypeList();
    this.getNoticeReceiverTypeList();
    this.getOrderAreaList()
    this.dataCenterList()
  }
  // 获取渠道
  private async getChannelList() {
    let list:any = await this.queryDictList(SELL_CHANNEL)
    this.setState({
      channelList: list.dataList
    },() =>{
      if(list.dataList.length > 0 ){
        this.setDefaultChanne();
      }
    })
  }
  private setDefaultChanne() {
    let objList:any = {};
    // console.log('channelList', this.state.channelList)
    this.state.channelList.forEach((item:any) => {
      objList[item.serialNo] = item.name
    })
    this.setState({
      channelObjList: objList
    })
    
  }
  // 获取通知类型
  private async getNoticeTypeList() {
    let list:any = await this.queryDictList(NOTICE_TYPE_ID)
    
    this.setState({
      noticeTypeList: list.dataList
    }, () => {
      this.setDefaultNoticeType()
    })
    
  }
  private setDefaultNoticeType() {
    // let defaultSerialNo = -1;
    // this.state.noticeTypeList.forEach((item:any) => {
    //   if(defaultSerialNo === -1 && item.name === '站内消息') {
    //     defaultSerialNo = item.serialNo
    //   }
    // })
    this.setState({
      noticeTypeValue: 1
    })
  }
  // 获取接收类型
  private async getNoticeReceiverTypeList() {
    let list:any = await this.queryDictList(NOTICE_RECEIVER_TYPE_ID)
    
    this.setState({
      noticeReceiverTypeList: list.dataList
    },() => {
      this.setDefaultReceiverType();
    })
  }
  private setDefaultReceiverType() {
    // let noticeReceiverTypeValue = -1;
    // this.state.noticeReceiverTypeList.forEach((item:any) => {
    //   if(noticeReceiverTypeValue === -1 && item.state === 1) {
    //     noticeReceiverTypeValue = item.serialNo
    //   }
    // })
    this.setState({
      noticeReceiverTypeValue: 1
    })
  }
  private renderChannelCheckbox () {
    let list = []
    if(this.state.formType === 'add'){
      list = this.state.channelList.filter((item: any) => {
        return item.state ===1 
      }).map((item:any) => { // 考虑可以取消选中，编辑时不处理disabled属性
        return (<Checkbox key={item.serialNo} value={item.serialNo}>{item.name}</Checkbox>)
      })
    } else {
      list = this.state.channelList.map((item: any) => { // 考虑可以取消选中，编辑时不处理disabled属性
        return (<Checkbox key={item.serialNo} value={item.serialNo}>{item.name}</Checkbox>)
      })
    }
    
    return list
  }
  private renderNoticeTypeList () {
    let list = this.state.noticeTypeList.filter((item: any) => {
      return item.state === 1
    }).map((item:any, index:number) => {
      return (
        <Radio key={item.serialNo} value={item.serialNo}>{item.name}</Radio>
      )
    })
    return list
  }
  private renderNoticeReceiverTypeList() {
    let list = this.state.noticeReceiverTypeList.filter((item: any) => {
      return item.state === 1
    }).map((item:any, index:number) => {
      return (
        
        <Radio key={item.serialNo} value={item.serialNo}>{item.name}</Radio>
        
      )
    })
    return list
  }
  // 查询字典
  private async queryDictList(codeTypeNo:string) {
    let params = {
      codeTypeNo: codeTypeNo,
      pageSize: 99999,
    }
    let returnVal = {}
    let res = await queryDictList(params);
    if(res.code === 200) {
      // res.data.dataList = codeInfoListFilter(res.data.dataList);
      returnVal = res.data 
    }
    return returnVal;
  }
  // 获取消息列表
  private async queryNoticeList() {
    let params = {
      title: this.state.title,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    }
    let res:any = await queryNoticeList(params);
    if (res.code === 200) {
      // fomartTime
      let dataList = res.data.dataList.map((item:any) => {
        // item.sendTime = fomartTime(item.sendTime);
        item.sendTime = (item.sendTime + '').replace('T', ' ')
        return item;
      })

      this.setState({
        tableData: dataList,
        totalCount: res.data.page.totalCount,
      })
    } else {
      message.warning(res.message);
    }
  }
  // 列表搜索
  private searchTable(val:string) {
    this.setState({
      title: val,
      currentPage: 1
    },() => {
      this.queryNoticeList()
    })
  }
  // 新增消息
  private async addNotice(params: any) {
    let res =  await addNotice(params);
    if (res.code === 200) {
      message.success('通知添加成功')
      this.props.form.resetFields()
      this.setState({
        currentPage: 1
      }, () => {
        this.setState({
          visible: false,
          // dataCenterAddressList: []  //新增成功后清空数据中心id数组
        })
        // 刷新列表
        this.queryNoticeList()
      })
    } else {
      message.error(res.message);
    }
  }
  private toSendNotice(val: any) {
    let params = {
      noticeNo: val.noticeNo
    }
    this.sendNotice(params);
  }
  private async sendNotice(params:any) {
    let res = await sendNotice(params);
    if (res.code === 200) {
      this.setState({
        visible: false
      })
      message.success('发送成功')
      this.queryNoticeList()
    } else {
      message.error(res.message);
    }
  }
  private async editNotice(params: any) {
    let res = await editNotice(params);
    if (res.code === 200) {
      message.success('通知添加成功')
      this.props.form.resetFields()
      this.setState({
        visible: false
      })
      this.queryNoticeList()
    } else {
      message.error(res.message);
    }
  }
  private handleOk() {
    this.props.form.validateFields((err:any, fieldsValue:any) => {
      if (err) return;
      let params:any = {
        title: fieldsValue.title,
        content: fieldsValue.content,
        sendTime: this.state.sendTime,
        receiverType: fieldsValue.receiver_type,
        type: fieldsValue.type,
        // channelNoList: fieldsValue.channel_noList,
        dataCenterAddressList: this.state.dataCenterAddressList,
        url: fieldsValue.url,
      }
      
      if(this.state.formType === 'add') {
        this.addNotice(params);
      } else {
        params.noticeNo = this.state.noticeNo
        this.editNotice(params);
      }
      
    });
  }
  private handleCancel() {
    this.setState({
      visible: false,
    })
    this.props.form.resetFields()
  }
  private timeOnChange(val:any,time:any) {
    this.setState({
      sendTime: time
    })
  }
  
  private toEditNotice(val:any = null) {
    
    this.setState({
      visible: true,
      tableInitValue: val,
      formType: "add",
      noticeNo: "",
      dataCenterAddressList: []
    })
    if(val) {
      this.setState({
        sendTime: val.sendTime,
        channelNoList: val.channelNoList,
        noticeTypeValue: val.type,
        noticeReceiverTypeValue: val.receiverType,
        formType: "edit",
        noticeNo: val.noticeNo
      }, () => {
        // console.log(this.state.sendTime)
      })
    } else {
      this.props.form.resetFields()
      this.setState({
        formType: "add",
        sendTime: null,
        noticeNo: "",
      })
      
    }
  }
  // private fomartChannelNoList (val:any) {
  //   if (val.length > 0) {
  //     let tags = val.map((item:any, index: number) => {
  //       let nameString:string | undefined = this.state.channelObjList[item]
  //       if (nameString) {
  //         return (<Tag key={index} color="blue">{nameString}</Tag>)
  //       } else {
  //         return ""
  //       }
  //     })
  //     return (
  //       <div>{tags}</div>
  //     )
  //   } else {
  //     return ""
  //   }
  // }
  private fomartDataCenterList (val:any) {
    if (val.length > 0) {
      let tags = val.map((item:any, index: number) => {
        return this.state.dataCenterList.map((obj: any) => {
          if(item === obj.id){
            return (<Tag key={index} color="blue">{obj.name}</Tag>)
          }else{
            return ""
          }
        })
        
      })
      return (
        <div>{tags}</div>
      )
    } else {
      return ""
    }
  }
  private fomartState(val:any = 0){
    let state = "未发送";
    switch (val) {
      case 0:
        state = "未发送";
        break;
      case 1:
        state = "已发送";
        break;
      default:
        state = "未发送";
        break;
    }
    return state;
  }
  private fomartType(val:any) {
    let content:string = "";
    this.state.noticeTypeList.forEach((item:any) => {
      if(item.serialNo === val) {
        content = item.name
      }
    })
    return content;
  }
  private fomartReceiverType(val:any) {
    let content:string = "";
    this.state.noticeReceiverTypeList.forEach((item:any) => {
      if(item.serialNo === val) {
        content = item.name
      }
    })
    return content;
  }
  // 分页器相关
  private onShowSizeChange(currentPage:any,pageSize:any) {
    this.setState({
      currentPage: 1,
      pageSize: pageSize
    },() => {
      this.queryNoticeList()
    })
  }
  private paginationChange(val:any) {
    this.setState({
      currentPage: val
    },() => {
      this.queryNoticeList()
    })
  }
  // 消息详情相关
  private toShowNotice(val:any) {
    this.setState({
      noticeInfoVisible: true,
      noticeInfoValue: val,
    })
  }
  private noticeInfoHandleOk(val:any) {
    this.setState({
      noticeInfoVisible: false,
      noticeInfoValue: null
    })
  }
  private setNoticeTypeValue(val: any) {
    let selectedType = val.target.value;
    
    if(selectedType === 2) {
      this.props.form.setFieldsValue({
        receiver_type: 2
      })
    } else {
      this.props.form.setFieldsValue({
        receiver_type: 1
      })
    }
  }

  private onAreaBind(value) {
    let dataCenterAddressId = value[value.length - 1]
    if(this.state.dataCenterAddressList.indexOf(dataCenterAddressId) === -1){
      this.state.dataCenterAddressList.push(dataCenterAddressId)
      message.success('数据中心添加成功')
    }else{
      message.error('该数据中心已添加')
    }
    // let arr = []
    // if(arr.indexOf(dataCenterAddressId) === -1){
    //   arr.push(dataCenterAddressId)
    //   console.log('arr', arr)
    //   message.success('数据中心添加成功')
    // }else{
    //   message.error('该数据中心已添加')
      
    // }
    // this.setState({
    //   dataCenterAddressList: arr
    // })
  }

  // 获取二级数据中心
  private async getOrderAreaList() {
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
        dataCenterList: res.data.dataList,
      })
    }else{
      message.error(res.message)
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const columns:any = [
      {
        title: '序号',
        // dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text: string, record: any, index: number) => <span>{(this.state.currentPage - 1) * this.state.pageSize + index + 1}</span>,
      },
      {
        title: '通知编号',
        key: 'noticeNo',
        dataIndex: 'noticeNo',
        width:220,
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (text:any) => {
          return (
            <div>
              <Tooltip placement="top" title={text}>
                <div className={noticeStyle.overflow}>{text}</div>
              </Tooltip>
            </div>
            
          )
        }
      },
      {
        title: '发送时间',
        key: 'sendTime',
        dataIndex: 'sendTime',
        render: (text:any, item:any) => {
          return (<div>{+item.state === 0 ? '' : text}</div>)
        }
      },
      {
        title: '发送类型',
        dataIndex: 'type',
        key: 'type',
        width: 90,
        render: (text:any) => {
          return (<div>{this.fomartType(text)}</div>)
        }
      },
      {
        title: '接收类型',
        width: 90,
        key: 'receiverType',
        dataIndex: 'receiverType',
        render: (text:any) => {
          let content:string = "";
          switch (+text) {
            case 1:
              content = "全部";
              break;
            case 2:
              content = "指定";
              break;
            default:
              content = "未知类型"
              break;
          }
          return (<div>{content}</div>)
        }
      },
      // {
      //   title: 'url',
      //   dataIndex: 'url',
      //   key: 'url',
      //   render: (text:string) => {
      //     return (
      //       <Tooltip placement="top" title={text}>
      //         <div className={noticeStyle.overflow}>{text}</div>
      //       </Tooltip>
      //     )
      //   }
      // },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 90,
        render: (text:any) => {
          return (
            <div>
              {this.fomartState(text)}
            </div>
          )
        }
      },
      {
        title: '数据中心',
        dataIndex: 'dataCenterAddressList',
        key: 'dataCenterAddressList',
        render: (text:any) => {
          return (
            <div>
              {this.fomartDataCenterList(text)}
            </div>
          )
        }
      },
      // {
      //   title: '渠道',
      //   dataIndex: 'channelNoList',
      //   key: 'channelNoList',
      //   render: (text:any) => {
      //     return (
      //       <div>
      //         {this.fomartChannelNoList(text)}
      //       </div>
      //     )
      //   }
      // },
      {
        title: '操作',
        width: 200,

        key: 'action',
        fixed: 'right',
        render: (text:any,rowValue:any) => {
          return (
            <div>
              {text.state === 0 && <Button type="link" onClick={this.toEditNotice.bind(this, rowValue)}>编辑</Button>}
              {text.state === 0 && <Button type="link" onClick={this.toSendNotice.bind(this, rowValue)}>立即发送</Button>}
              {text.state === 1 && <Button type="link" onClick={this.toShowNotice.bind(this, rowValue)}>详情</Button>}              
            </div>
          )
        }
      }
    ];
    const { tableInitValue,noticeInfoValue } = this.state
    return (
      <div className='new-user page'>
        <div className={noticeStyle.nav}>
        <Search
          placeholder="标题"
          onSearch={this.searchTable.bind(this)}
          maxLength={INPUT_MAXLENGTH}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={this.toEditNotice.bind(this,null)}>添加通知</Button>
        </div>
        <Table
          columns={columns}
          dataSource={this.state.tableData}
          bordered
          pagination={false}
          scroll={{ x: 1500}}
          rowKey="noticeNo"
        />
        <Pagination 
          showSizeChanger 
          onShowSizeChange={this.onShowSizeChange.bind(this)} 
          showQuickJumper defaultCurrent={1} 
          onChange={this.paginationChange.bind(this)}
          current={this.state.currentPage}
          total={this.state.totalCount}/>
        <Drawer
          title={this.state.formType === 'add' ? "新增消息" : "编辑消息"}
          visible={this.state.visible}
          onClose={this.handleCancel.bind(this)}
          width={700}
        >
          <Form layout="inline" > 
            <Row>
              <Col span={12}>
                <Form.Item label="标题">
                  {
                    getFieldDecorator("title", {
                      rules: [
                        {required: true, message: '请输入标题'},
                        {max: 255, message: '最大长度255位'}
                      ],
                      initialValue: tableInitValue !== null ? tableInitValue.title : "",
                    })(
                      <Input maxLength={256} disabled={this.state.formType === "show"} style={{ width: 150 }} allowClear placeholder="最大长度255"  />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="发送时间">
                  {
                    getFieldDecorator("sendTime", {
                      rules: [{required: false, message: '请选择时间'}],
                      initialValue: this.state.sendTime ? moment(this.state.sendTime) : null
                    })(
                      <DatePicker 
                        showTime
                        placeholder="请选择时间" 
                        onChange={this.timeOnChange.bind(this)}/>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <Form.Item label="动作链接">
                  {
                    getFieldDecorator("url", {
                      rules: [
                        {required: true, message: '请填写动作链接'},
                        {max: 127, message: '动作链接最大长度127位'}
                      ],
                      initialValue: tableInitValue !== null ? tableInitValue.url : "",
                    })(
                      <Input
                        style={{ width: 500 }}
                        placeholder="动作链接最大长度127位"
                        allowClear
                        maxLength={128}
                      />
                    )
                  }
                </Form.Item>
              </Col>
            </Row> */}
            <Row style={{marginTop: '12px'}}>
              <Col>
                <Form.Item label="内容">
                  {
                    getFieldDecorator("content", {
                      rules: [
                        {required: true, message: '请填写内容'},
                        {max: 200, message: '内容最大长度为200位'}
                      ],
                      initialValue: tableInitValue !== null ? tableInitValue.content : ""
                    })(
                      <TextArea
                        style={{ width: 500 }}
                        placeholder="内容最大长度为200位"
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        maxLength={201}
                      />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                {/* <Form.Item label="渠道">
                  {
                    getFieldDecorator("channel_noList", {
                      rules: [{required: true, message: '请选择渠道'}],
                      initialValue: this.state.channelNoList
                    })(
                      <Checkbox.Group style={{ width: '100%' }}>
                        {
                          this.renderChannelCheckbox()
                        }
                      </Checkbox.Group>
                    )
                  }
                </Form.Item> */}
                <Form.Item label="绑定地区">
                  {
                    getFieldDecorator("dataCenterAddressId", {
                      rules: [{required: true, message: '请选择绑定地区'}],
                    })(
                      <Cascader
                        onChange={this.onAreaBind.bind(this)}
                        placeholder="请选择绑定地区"
                        style={{ width: "320px" }}
                        options={this.state.areaList}
                      /> 
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row className='none'>
              <Col span={24}>
                <Form.Item label="发送类型">
                  {
                    getFieldDecorator("type", {
                      rules: [{required: true, message: '请选择发送类型'}],
                      initialValue: this.state.noticeTypeValue
                    })(
                      <Radio.Group onChange={this.setNoticeTypeValue.bind(this)}>
                        {this.renderNoticeTypeList()}
                      </Radio.Group>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item label="接收类型">
                  {
                    getFieldDecorator("receiver_type", {
                      rules: [{required: true, message: '接收类型'}],
                      initialValue: this.state.noticeReceiverTypeValue
                    })(
                      <Radio.Group disabled>
                        <Row>
                          <Col span={10} style={{width: "100%"}}>
                            {
                              this.renderNoticeReceiverTypeList()
                            }
                          </Col>
                        </Row>
                      </Radio.Group>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
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
              <Button key="save" type="primary" onClick={this.handleOk.bind(this)}>
                保存
              </Button>
            </div>
        </Drawer>
        <Modal
          title="消息详情"
          visible={this.state.noticeInfoVisible}
          onOk={this.noticeInfoHandleOk.bind(this)}
          onCancel={this.noticeInfoHandleOk.bind(this)}
          width={700}
        >
          {/* noticeInfoValue */}
          {
            noticeInfoValue &&
            <div>
              <Row>
                <Col span={12}>
                  <span>通知编号: {noticeInfoValue.noticeNo}</span>
                </Col>
                <Col span={12}>
                  <span>发送时间: {noticeInfoValue.sendTime}</span>
                </Col>
              </Row>
              
              {/* <Row>
                <Col span={24}>
                  <span>url: {noticeInfoValue.url}</span>
                </Col>
              </Row> */}
              <Row>
                {/* <Col span={24}>
                  <span>渠道: {this.fomartChannelNoList(noticeInfoValue.channelNoList)}</span>
                </Col> */}
              </Row>
              <Row>
                <Col span={8}>
                  <span>发送类型: {this.fomartType(noticeInfoValue.type)}</span>
                </Col>
                <Col span={8}>
                  <span>接收类型: {this.fomartReceiverType(noticeInfoValue.receiverType)}</span>
                </Col>
                <Col span={8}>
                  <span>状态: {this.fomartState(noticeInfoValue.state)}</span>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <span>内容: {noticeInfoValue.content}</span>
                </Col>
              </Row>
            </div>
          }
        </Modal>
      </div>
    )
  }
}

interface stateType {
  isShowLoading: Boolean
}
const WrappedMessageForm = Form.create({ name: 'notice' })(Notice);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(Form.create()(WrappedMessageForm))