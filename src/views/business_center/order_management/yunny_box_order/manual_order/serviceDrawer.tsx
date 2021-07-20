import React from 'react'
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/es/form';

import { Input, Form, Table, Row, Col, Button, Pagination, Select, InputNumber, message, Drawer } from 'antd';

import { 
  productList,
  queryDictList,
  getManualDeviceInfo
} from "../../../../../server/api"
import { DURATION_UNIT, SELL_CHANNEL, INPUT_MAXLENGTH } from '../../../../../config/config'
import { codeInfoListFilter } from '../../../../../tools/tools'
const { Search } = Input;
const { Option } = Select;
interface IProps {
  serviceModalVisible: boolean,
  selecteddeviceNo:string,
  onClose: (val:any) => any,
  form:any,
  manualOrderNo: any,
  orderInfo: any,
  channelNo: any,
}

interface IState {
  
}

class ServiceTable extends React.PureComponent<IProps, IState> {
  state: any={
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    name: "",
    productList: [],
    durationUnitList: [],
    selectedService: [],
    defaultUnitName: '',
    selectedServiceInfo: null,
    selectedRowKeys: null,
    channelList: {},
  }
  componentDidMount() {
    this.queryDictList();
    this.queryChannelList();
    this.productList();
    this.props.manualOrderNo && this.getManualDeviceInfo()
    if(this.props.orderInfo.serviceInfo) {
      this.setState({
        selectedRowKeys: this.props.orderInfo.serviceInfo.productNo
      })
    }
  }
  private async getManualDeviceInfo() {
    let params = {
      manualOrderNo: this.props.manualOrderNo,
      deviceNo: this.props.selecteddeviceNo,
    }
    let res = await getManualDeviceInfo(params);
    if (res.code !== 200) {
      message.error(res.message);
      return
    }
    if (!res.data) { return }
    this.setState({
      selectedServiceInfo: res.data,
      selectedRowKeys: res.data.productNo,
    })
    
  }
  private async queryDictList() {
    let params = {
      codeTypeNo: DURATION_UNIT,
      pageSize: 9999,
    }
    let res =  await queryDictList(params);
    if (res.code === 200) {
      res.data.dataList = codeInfoListFilter(res.data.dataList)
      this.setState({
        durationUnitList: res.data.dataList,
        defaultUnitName: res.data.dataList[0].serialNo
      })
    } else {
      message.error(res.message);
    }
  }
  private async queryChannelList() {
    let params = {
      codeTypeNo: SELL_CHANNEL,
      pageSize: 9999,
    }
    let res =  await queryDictList(params);
    if (res.code === 200) {
      let channelList = {};
      // res.data.dataList = codeInfoListFilter(res.data.dataList)
      res.data.dataList.forEach((item:any) => {
        channelList[item.serialNo] = item
      })
      this.setState({
        channelList: channelList,
      })
    } else {
      message.error(res.message);
    }
  }
  private handleCancel() {
    this.props.onClose(null)
  }
  private handleOk() {
    this.props.form.validateFields((err:any, fieldsValue:any) => {
      if(err) return;
      if (this.state.selectedService) {
        let params = {
          "deviceNo": this.props.selecteddeviceNo,
          "productNo": this.state.selectedService.productNo,
          "duration": fieldsValue.duration,
          "durationUnit": fieldsValue.durationUnit,
        }
        this.props.onClose(params)
      } else {
        if(this.state.selectedRowKeys) {
          let params = {
            "deviceNo": this.props.selecteddeviceNo,
            "productNo": this.state.selectedRowKeys,
            "duration": fieldsValue.duration,
            "durationUnit": fieldsValue.durationUnit,
          }
          this.props.onClose(params)
        } else {
          this.props.onClose(null)
        }
      }
    });
  }
  private async productList() {
    let params = {
      name: this.state.name,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      channelNo: this.props.channelNo,
      state: 1
    }
    let res = await productList(params);
    if(res.code === 200 ){
      this.setState({
        totalCount: res.data.page.totalCount,
        productList: res.data.dataList
      })
      this.setState({
        selectedService: null
      })
    } else {
      message.error(res.message);
    }
  }
  private searchList(val:any) {
    this.setState({
      name: val
    },() => {
      this.productList()
    })
  }
  private paginationChange(val:number) {
    this.setState({
      currentPage: val
    },() => {
      this.productList()
    })
  }
 
  private selectedServiceRows(val:any) {
    this.setState({
      selectedService: val[0]
    })
  }
  
  render() {
    
    const columns:any = [
      {
        width: 100,
        title: '序号',
        dataIndex: 'index',
        render: (text: any, record: any, index: number) => (
          <span>
            {(this.state.currentPage - 1) * this.state.pageSize + index + 1}
          </span>
        )
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '产品编号',
        dataIndex: 'productNo',
      },
      {
        title: '渠道',
        dataIndex: 'channelNo',
        render: (text: any, record: any, index: number) => (
          <span>
            {this.state.channelList && this.state.channelList[text] ? this.state.channelList[text].name : ''}
          </span>
        )
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text: any, record: any, index: number) => (
          <span>
            {['待发布', '上架', '下架'][text]}
          </span>
        )
      }
    ];
    const rowSelection: any = {
      hideDefaultSelections: true,
      type: "radio",
      fixed: true,
      selectedRowKeys: this.state.selectedRowKeys,
      onChange:(selectedRowKeys:any, selectedRows:any) => {
        this.setState({
          selectedRowKeys:selectedRowKeys[0]
        })
        this.selectedServiceRows(selectedRows);
      }
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Drawer
          title="服务选择"
          visible={this.props.serviceModalVisible}
          maskClosable={true}
          width={700}
          onClose={this.handleCancel.bind(this)}
        >
          <Row gutter={[8, 16]}>
            <Col span={4}>云服务选择：</Col>
            <Col span={20}>
              <Search placeholder="商品名称" maxLength={INPUT_MAXLENGTH} onSearch={this.searchList.bind(this)} enterButton />
            </Col>
          </Row>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={this.state.productList}
            bordered
            pagination={false}
            rowSelection={rowSelection}
            rowKey="productNo"
          />
          <Pagination 
            showQuickJumper defaultCurrent={1} 
            size="small"
            onChange={this.paginationChange.bind(this)}
            current={this.state.currentPage}
            className='vendor-diver'
            pageSize={this.state.pageSize}
            total={this.state.totalCount}/>
          <Form layout="inline" className='vendor-diver'>
              <Form.Item label="时长">
                { getFieldDecorator('duration', {
                  rules: [{ required: true, message: '请输入时长' }],
                  initialValue: this.state.selectedServiceInfo ? this.state.selectedServiceInfo.duration : 1
                })(
                  <InputNumber min={1}/>
                )}
              </Form.Item>
              <Form.Item label="单位">
                { getFieldDecorator('durationUnit', {
                  rules: [{ required: true, message: '请选择单位' }],
                  initialValue: this.state.selectedServiceInfo ? this.state.selectedServiceInfo.durationUnit : this.state.defaultUnitName
                })(
                  <Select style={{ width: 120 }}>
                    {
                      this.state.durationUnitList.map((item:any) => {
                        return (<Option key={item.name} value={item.serialNo}>{item.name}</Option>)
                      })
                    }                
                  </Select>
                )}
              </Form.Item>
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
              <Button key="save" type="primary" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
                保存
              </Button>
            </div>
            
        </Drawer>
      </div>
    )
  }
}

interface stateType {
  isShowLoading: Boolean,
}
interface ComponentPropsInterface extends FormComponentProps {
  serviceModalVisible: boolean,
  selecteddeviceNo: string,
  onClose: (val:any) => any,
  manualOrderNo: any,
  orderInfo: any,
  channelNo: any,
}
const orderForm = Form.create<ComponentPropsInterface>()(ServiceTable);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(orderForm)
