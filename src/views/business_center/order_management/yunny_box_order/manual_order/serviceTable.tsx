import React from 'react'
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/es/form';

import { Form, Table, Row, Col, Button, Select, message } from 'antd';
// import ServiceModal from './serviceModal'
import ServiceDrawer from './serviceDrawer'
import { 
  getDeviceListByPreNo,
} from "../../../../../server/api"
// const { TextArea, Search } = Input;
const { Option } = Select;
interface IProps {
  onSelected:(val:any) => any,
  preOrderNo: any,
  onRef: (val:any) => any,
  onClose: (val:any) => any,
  manualOrderNo:any,
  channelNo: number,
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
    orderInfo: null,
  }
  componentDidMount() {
    // this.getDeviceListByPreNo();
    this.props.onRef(this)
  }
  componentDidUpdate(prevProps:any, a:any) {
    if(this.props.preOrderNo !== prevProps.preOrderNo) {
      if(this.props.preOrderNo) {
        this.setState({
          preOrderNo: this.props.preOrderNo
        },() =>{
          this.getDeviceListByPreNo();
        })
        
      } else { // 否则清空相关参数
        this.setState({
          preOrderNo: null,
        })
        // let params:any = {
        //   preOrderNo: this.props.preOrderNo,
        //   currentPage: this.state.currentPage,
        //   pageSize: this.state.pageSize,
        // }
      }
    }
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
      preOrderNo: this.props.preOrderNo,
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
  
  
  // private onSearch() {
  //   this.getDeviceListByPreNo()
  // }
  private handleChange(val:any) {
    this.setState({
      state: val
    },() => {
      this.getDeviceListByPreNo();
    })
    
  }
  // private onShowSizeChange(current:number, size: number) {
  //   this.setState({
  //     pageSize: size,
  //     currentPage: 1,
  //   },() => {
  //     this.getDeviceListByPreNo();
  //   })
  // }
  // private paginationChange(val:number) {
  //   this.setState({
  //     currentPage: val,
  //   },() => {
  //     this.getDeviceListByPreNo();
  //   })
  // }
  private onSelected(val:any) {
    // this.props.onSelected(val);
    this.setState({
      selecteddeviceNo: val.deviceNo,
      orderInfo: val,
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
    
    // const { getFieldDecorator } = this.props.form;
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
          <ServiceDrawer manualOrderNo={this.props.manualOrderNo} channelNo={this.props.channelNo} serviceModalVisible={this.state.serviceModalVisible} selecteddeviceNo={this.state.selecteddeviceNo} orderInfo={this.state.orderInfo} onClose={this.serviceModaClose.bind(this)} />
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
  preOrderNo: any,
  onRef: (val:any) => any,
  onClose: (val:any) => any,
  manualOrderNo: any,
  channelNo: any,
}
const orderForm = Form.create<ComponentPropsInterface>()(ServiceTable);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(orderForm)
