import React from 'react'
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/es/form';

import { Form, Modal, Row, Col, Button, message } from 'antd';

import { 
  crateManualOrder,
  getManualOrderByNo,
  // getManualOrderDeviceInfo,
  updateManualOrder,
} from "../../../../../server/api"
import PreOrderTable from './preOrderTable'
import ServiceTable from './serviceTable'
// import ServiceModal from './serviceModal'
import ServiceTableEdit from './serviceTableEdit'
// const { TextArea, Search } = SearchInput;
let child:any = null;
interface IProps {
  visible: boolean,
  onClose: () => any,
  addOrderType: number,
  orderInfo: any,
  refreshList: () => any,
  editOrderInfo: any,
  manualOrderNo:any,
}

interface IState {
  selectedPreOrderNo: any,
  serviceModalVisible: boolean,
  selecteddeviceNo:any,
  manualOrderValue:any,
}

class OrderModal extends React.PureComponent<IProps, IState> {
  state: any={
    selectedPreOrderNo: null,
    serviceModalVisible: false,
    selecteddeviceNo: null,
    manualOrderValue: null,
  }
  componentDidMount() {
    if (this.props.editOrderInfo) {
      this.setState({
        selectedPreOrderNo: this.props.editOrderInfo.preOrderNo
      })
      // this.getManualOrderDeviceInfo(this.props.editOrderInfo.manualOrderNo);
      this.getManualOrderByNo(this.props.editOrderInfo.manualOrderNo)
    }
  }
  
  private handleCancel() {
    this.props.onClose()
    // this.props.form.resetFields()
  }
  private handleOk() {
    let serviceDetail = child.getServiceDetail()
    if (this.props.editOrderInfo) {
      let params = {
        manualOrderNo: this.state.manualOrderValue.manualOrderNo,
        manualOrderDeviceDTOList: serviceDetail
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
    } else {
      message.error(res.message);
    }
  }
  private async crateManualOrder(params: any) {
    let res = await crateManualOrder(params);
    if (res.code === 200) {
      this.props.refreshList()
      this.props.onClose()
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
  private selectedPreOrder(val:any = null) {
    if (val) {
      this.setState({
        selectedPreOrderNo: ""
      },() => {
        this.setState({
          selectedPreOrderNo: val[0].preOrderNo
        })
      })
    }
  }
  
  private serviceModaClose(val:any){
    if(val) {
      child.markRow(val)
    }
    this.setState({
      serviceModalVisible: false
    })
  }
  private async getManualOrderByNo(manualOrderNo:string) {
    let params = {
      manualOrderNo: manualOrderNo
    }
    let res = await getManualOrderByNo(params);
    if(res.code === 200) {
      this.setState({
        manualOrderValue: res.data
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
  private renderPreOrderTable(editOrderInfo:any) {
    let component = null;
    if (editOrderInfo) {
      if(!this.state.manualOrderValue){
        return false;
      }
      component = (
        <div>
          <Row gutter={[8, 16]}>
            <Col key="1" span={4}>预订单号：</Col>
            <Col key="2" span={8}>{this.state.manualOrderValue.preOrderNo}</Col>
            <Col key="3" span={4}>手工订单号：</Col>
            <Col key="4" span={8}>{this.state.manualOrderValue.manualOrderNo}</Col>
            <Col key="5" span={4}>手机号：</Col>
            <Col key="6" span={8}>{this.state.manualOrderValue.mobile}</Col>
            <Col key="7" span={4}>数量：</Col>
            <Col key="8" span={8}>{this.state.manualOrderValue.number}</Col>
            <Col key="9" span={4}>创建时间：</Col>
            <Col key="10" span={8}>{this.state.manualOrderValue.createTime}</Col>
          </Row>
        </div>
      )
    } else {
      component = <PreOrderTable selected={this.selectedPreOrder.bind(this)} />
    }
    return component
  }
  private renderServiceTable(editOrderInfo: any) {
    // if (editOrderInfo) {
    //   return <ServiceTableEdit  onRef={this.onRef} manualOrderNo={this.state.selectedPreOrderNo} onSelected={this.serviceSelected.bind(this)}  onClose={this.serviceModaClose.bind(this)} />
    // } else {
    //   if (this.state.selectedPreOrderNo) {
    //     return <ServiceTable manualOrderNo={this.props.manualOrderNo} onRef={this.onRef} preOrderNo={this.state.selectedPreOrderNo} onSelected={this.serviceSelected.bind(this)}  onClose={this.serviceModaClose.bind(this)} />
    //   } else {
    //     return null;
    //   }
    // }
    return ""
  }
  onRef = (ref:any) => {
    child = ref
  }
  render() {
    // const { getFieldDecorator } = this.props.form;
    return (
      <Modal
          title="订单"
          visible={this.props.visible}
          width={800}
          centered={true}
          maskClosable={false}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="back" onClick={this.handleCancel.bind(this)}>
              取消
            </Button>,
            <Button disabled={!this.state.selectedPreOrderNo} key="save" type="primary" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
              保存
            </Button>
          ]}
        >
          {/* <PreOrderTable selected={this.selectedPreOrder.bind(this)} /> */}
          {this.renderPreOrderTable(this.props.editOrderInfo)}
          {this.renderServiceTable(this.props.editOrderInfo)}
          
          {
            // this.state.serviceModalVisible &&
            // <ServiceModal serviceModalVisible={this.state.serviceModalVisible} selecteddeviceNo={this.state.selecteddeviceNo} onClose={this.serviceModaClose.bind(this)} />
          }
        {/* <Row gutter={[8, 16]}>
          <Col span={4}>预下单关联：</Col>
          <Col span={20}>
          <Search placeholder="客户手机号" onSearch={this.onSearch.bind(this)} style={{width: 200}} value={this.state.searchPhoneNumber} onChange={this.formatNumber.bind(this)} maxLength={11} allowClear />
          </Col>
        </Row> */}

      </Modal>
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
  manualOrderNo:any,
}
const orderForm = Form.create<ComponentPropsInterface>()(OrderModal);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(orderForm)
