import React from 'react'
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/es/form';

import { Form, Row, Col, Button, message, Drawer, Divider } from 'antd';

import { 
  crateManualOrder,
  getManualOrderByNo,
  // getManualOrderDeviceInfo,
  updateManualOrder,
} from "../../../../../server/api"
import PreOrderTable from './preOrderTable'
import ServiceTable from './serviceTable'
// import ServiceModal from './serviceModal'
// import ServiceTableEdit from './serviceTableEdit'
// const { TextArea, Search } = SearchInput;
let child:any = null;
interface IProps {
  visible: boolean,
  onClose: () => any,
  addOrderType: number,
  orderInfo: any,
  refreshList: () => any,
  editOrderInfo: any,
  type?: string,
  sellChannelList: any,
}

interface IState {
  serviceModalVisible: boolean,
  selecteddeviceNo:any,
  manualOrderValue:any,
  selectedPreOrderNo: any,
  manualOrderNo: any,
  selectedPreChannelNo: number,
}

class OrderModal extends React.PureComponent<IProps, IState> {
  state: any={
    serviceModalVisible: false,
    selecteddeviceNo: null,
    manualOrderValue: null, // 编辑-手工订单信息
    selectedPreOrderNo: null, // 当前的预订单号
    manualOrderNo: null,
    selectedPreChannelNo: -1,
  }
  
  componentDidUpdate(prevProps:any, a:any) {
    
    if(this.props.visible !== prevProps.visible) {
      // 监听抽屉是否打开，是，则执行相关操作
      if(this.props.visible) {
        this.props.editOrderInfo && this.getManualOrderByNo(this.props.editOrderInfo.manualOrderNo)
        this.props.editOrderInfo && this.setState({
          manualOrderNo: this.props.editOrderInfo.manualOrderNo
        })
      } else { // 否则清空相关参数
        this.setState({
          manualOrderValue: null,
          selectedPreOrderNo: null
        })
      }
      
    }
  }
  
  private onClose() {
    this.props.onClose()
    // this.props.form.resetFields()
  }
  private handleOk() {
    let serviceDetail = child.getServiceDetail()
    if(serviceDetail.length === 0) {
      message.error("至少选择一个服务")
      return
    }
    if (this.props.editOrderInfo) {
      let params = {
        manualOrderNo: this.state.manualOrderValue.manualOrderNo,
        manualOrderDeviceDTOList: serviceDetail,
        preOrderNo: this.state.selectedPreOrderNo,
      }
      this.updateManualOrder(params)
    } else {
      let params = {
        preOrderNo: this.state.selectedPreOrderNo,
        manualOrderDeviceDTOList: serviceDetail
      }
      this.crateManualOrder(params)
    }
    
  }
  private async updateManualOrder(params: any) {
    let res =  await updateManualOrder(params);
    if(res.code === 200) {
      this.props.refreshList()
      this.props.onClose()
      message.success("操作成功");
    } else {
      message.error(res.message);
    }
  }
  private async crateManualOrder(params: any) {
    let res = await crateManualOrder(params);
    if (res.code === 200) {
      this.props.refreshList()
      this.props.onClose()
      message.success("操作成功");
    } else {
      message.error(res.message)
    }
  }
  private serviceSelected(val:any) {
    this.setState({
      selecteddeviceNo: val.deviceNo
    },() => {
      this.setState({
        serviceModalVisible: true,
      })
    })
  }
  private selectedPreOrder(preOrderNo:any = null, channelNo: number) {
    this.setState({
      selectedPreOrderNo: preOrderNo,
      selectedPreChannelNo: channelNo,
    })
  }
  
  private serviceModaClose(val:any){
    if(val) {
      child.markRow(val)
    }
    this.setState({
      serviceModalVisible: false
    })
  }
  // 根据编号获取手工订单信息
  private async getManualOrderByNo(manualOrderNo:string) {
    let params = {
      manualOrderNo: manualOrderNo
    }
    let res = await getManualOrderByNo(params);
    this.props.sellChannelList.forEach((item: any) => {
      if (item.serialNo === res.data.channelNo) {
        res.data.channelName = item.name
      }
    })
    if(res.code === 200) {
      this.setState({
        manualOrderValue: res.data,
        selectedPreOrderNo: res.data.preOrderNo
      })
    } else {
      message.error(res.message)
    }
  }
  // private async getManualOrderDeviceInfo(manualOrderNo:string) {
  //   let params = {
  //     manualOrderNo: manualOrderNo,
  //     // state: "",
  //     currentPage: 1,
  //     pageSize: 2000,
  //   }
  //   let res = await getManualOrderDeviceInfo(params);
  //   if (res.code === 200 ) {}
  // }
  private renderPreOrderInfo(manualOrderValue:any = null) {
    let content:any = "";
    if(manualOrderValue) {
      content = (
        <div>
          <Divider orientation="left">预订单信息</Divider>
          <Row gutter={[8, 16]}>
            <Col span={4}>预订单号：</Col>
            <Col span={8}>{manualOrderValue.preOrderNo}</Col>
            <Col span={4}>手工订单号：</Col>
            <Col span={8}>{manualOrderValue.manualOrderNo}</Col>
            <Col span={4}>手机：</Col>
            <Col span={8}>{manualOrderValue.mobile}</Col>
            <Col span={4}>盒子数量：</Col>
            <Col span={8}>{manualOrderValue.number}</Col>
            <Col span={4}>销售渠道：</Col>
            <Col span={8}>{manualOrderValue.channelName}</Col>
          </Row>
        </div>
      )
    }
    return content;
  }
  private renderServiceTable(editOrderInfo: any) {
    // if (editOrderInfo) {
    //   return <ServiceTableEdit onRef={this.onRef} manualOrderNo={this.state.selectedPreOrderNo} onSelected={this.serviceSelected.bind(this)}  onClose={this.serviceModaClose.bind(this)} />
    // } else {
    //   return <ServiceTable onRef={this.onRef} preOrderNo={this.state.selectedPreOrderNo} onSelected={this.serviceSelected.bind(this)}  onClose={this.serviceModaClose.bind(this)} />
    // }
    return <ServiceTable channelNo={this.state.selectedPreChannelNo} manualOrderNo={this.state.manualOrderNo} onRef={this.onRef} preOrderNo={this.state.selectedPreOrderNo} onSelected={this.serviceSelected.bind(this)}  onClose={this.serviceModaClose.bind(this)} />
  }
  onRef = (ref:any) => {
    child = ref
  }
  render() {
    // const { getFieldDecorator } = this.props.form;
    return (
      <Drawer
          title={`${this.state.manualOrderValue ? "编辑" : "新建" }订单`}
          visible={this.props.visible}
          width={800}
          maskClosable={true}
          destroyOnClose={true}
          onClose={this.onClose.bind(this)}
        >
          {this.renderPreOrderInfo(this.state.manualOrderValue)}
          <Divider orientation="left">预订单列表</Divider>
          <PreOrderTable selected={this.selectedPreOrder.bind(this)} />
          <Divider orientation="left" >设备列表</Divider>
          {this.renderServiceTable(this.props.editOrderInfo)}
          <div style={{height: '60px',width:'100%'}}></div>
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
            <Button onClick={this.onClose.bind(this)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.handleOk.bind(this)} type="primary">
              提交
            </Button>
          </div>
      </Drawer>
    )
  }
}

interface stateType {
  isShowLoading: Boolean,
  onClose: () => {},
}
interface ComponentPropsInterface extends FormComponentProps {
  visible: boolean,
  onClose: () => any,
  orderInfo: any,
  refreshList: () => any,
  editOrderInfo: any,
  sellChannelList: any,
}
const orderForm = Form.create<ComponentPropsInterface>()(OrderModal);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(orderForm)
