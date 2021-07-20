import React from 'react'
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/es/form';

import { Form, Table, Row, Col, Button, Select, message } from 'antd';
import ServiceModal from './serviceModal'

import { 
  getDeviceListByPreNo,
} from "../../../../../server/api"
// const { TextArea, Search } = Input;
const { Option } = Select;
interface IProps {
  onSelected:(val:any) => any,
  manualOrderNo: any,
  onRef: (val:any) => any,
  onClose: (val:any) => any,
}

interface IState {
  
}

class ServiceTable extends React.PureComponent<IProps, IState> {
  state: any={
    currentPage: 1,
    pageSize: 2000,
    serviceList: [],
    totalCount: 0,
    state: "",
    serviceModalVisible: false,
    selecteddeviceNo: null,
  }
  componentDidMount() {
    this.getDeviceListByPreNo();
    this.props.onRef(this)
  }

  public markRow(val: any) {
    
    let list = this.state.serviceList;
    list.forEach((item:any) => {
      if(item.deviceNo === val.deviceNo) {
        item.state = 1;
        item.serviceInfo = val;
      }
    })
    this.setState({
      serviceList: list
    })
  }
  public getServiceDetail() {
    let list = this.state.serviceList;
    let manualOrderDeviceDTOList = []
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      if(item.serviceInfo) {
        manualOrderDeviceDTOList.push({
          ...item.serviceInfo
        })
      }
    }
    return manualOrderDeviceDTOList;
  }
  private async getDeviceListByPreNo() {
    let params:any = {
      preOrderNo: this.props.manualOrderNo,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    }
    if(this.state.state !== "") {
      params.state = this.state.state;
    }
    let res = await getDeviceListByPreNo(params);
    if (res.code === 200) {
      this.setState({
        serviceList: res.data.dataList,
        totalCount: res.data.page.totalCount,
      })
    } else {
      message.error(res.message);
    }
  }
  
  
 
  private handleChange(val:any) {
    this.setState({
      state: val
    },() => {
      this.getDeviceListByPreNo();
    })
    
  }
  
  private onSelected(val:any) {
    
    this.setState({
      selecteddeviceNo: val.deviceNo
    },() => {
      this.setState({
        serviceModalVisible: true
      })
    })
    

  }
  private serviceModaClose(val:any){
    if(val) {
      this.markRow(val);
    }
    this.setState({
      serviceModalVisible: false
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
        title: '设备编号',
        dataIndex: 'deviceNo',
      },
      {
        title: '云服务',
        dataIndex: 'cloudService',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text:any) => {
          return (text === 0 ? "未选择" : "已选择")
        }
      },
      {
        title: '操作',
        dataIndex: "operate",
        render: (text:any, record: any) => {
          return (
            <Button type="link" onClick={this.onSelected.bind(this, record)}>服务选择</Button>
          )
        }
      }
    ];
    return (
      <div>
        <Row gutter={[8, 16]}>
          <Col span={8}>预下单关联：</Col>
          <Col span={10}>
          <Select size="small" defaultValue="" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
            <Option value="">全部</Option>
            <Option value="0">未选择</Option>
            <Option value="1">已选择</Option>
          </Select>
          </Col>
        </Row>
        <Table
          scroll={{ x: true }}
          columns={columns}
          dataSource={this.state.serviceList}
          bordered
          // pagination={false}
          size="small"
          rowKey="deviceNo"
        />
        {
          this.state.serviceModalVisible && 
          <ServiceModal serviceModalVisible={this.state.serviceModalVisible} selecteddeviceNo={this.state.selecteddeviceNo} onClose={this.serviceModaClose.bind(this)} />
        }
        {/* <Pagination 
          onShowSizeChange={this.onShowSizeChange.bind(this)} 
          showQuickJumper defaultCurrent={1} 
          showSizeChanger
          size="small"
          onChange={this.paginationChange.bind(this)}
          current={this.state.currentPage}
          total={this.state.totalCount}/> */}
      </div>
    )
  }
}

interface stateType {
  isShowLoading: Boolean,
}
interface ComponentPropsInterface extends FormComponentProps {
  onSelected:(val:any) => any,
  manualOrderNo: any,
  onRef: (val:any) => any,
  onClose: (val:any) => any,
}
const orderForm = Form.create<ComponentPropsInterface>()(ServiceTable);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(orderForm)
