import React from 'react'
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/es/form';
import { getUploadHeader } from '../../../../../tools/tools'
import { Input, Form, Modal, Row, Col, Button, Icon, Upload, message } from 'antd';

import { 
  createPreOrder,
  preOrderUpdate
} from "../../../../../server/api"
import { UPLOAD_IMAGE_TYPE, UPLOAD_MAX_SIZE, IMAGE_PREFIX } from '../../../../../config/config'
import { BASE_URL } from '../../../../../config/request_config'
const { TextArea } = Input;
interface IProps {
  dispatch: Function,
  form: any,
  addOrderType:any,
  visible: boolean,
  onClose: () => void,
  refreshList: () => void,
  orderInfo: any,
}

interface IState {
  fileList:any,
  previewImage: string,
  previewVisible: boolean,
  uploadListLength: number,
  boxInfo: object[],
  visible: boolean,
}
let uploadListLength = 0 // 当前上传队列长度
// let id = 0;

let refList: any = []

// const timstamp = new Date().getTime()

class OrderModal extends React.PureComponent<IProps, IState> {
  state: any={
    visible: false,
    loading: false,

    fileList: [],
    previewImage: "",
    previewVisible: false,
    uploadMaxCount: 8,
    uploadFileMaxSize: 2*1024,
    boxInfo: [
      {
        deviceNo: ""
      }
    ]
  }
  private async createPreOrder(params: any) {
    let res = await createPreOrder(params);
    if (res.code === 200) {
      this.props.refreshList();
      this.props.onClose();
      this.props.form.resetFields();
    } else {
      message.error(res.message);
    }
  }
  private async preOrderUpdate(params: any) {
    let res = await preOrderUpdate(params);
    if (res.code === 200) {
      this.props.refreshList();
      this.props.onClose();
      this.props.form.resetFields();
    } else {
      message.error(res.message);
    }
  }
  
  private handleOk() {
    this.props.form.validateFields((err:any, fieldsValue:any) => {
      if (err) return;
      // let preOrderDeviceDTOList:any = [];
      let preOrderDeviceDTOList:any = fieldsValue.this.state.boxInfo;
      // this.state.boxInfo.forEach((item:any) => {
      //   preOrderDeviceDTOList.push({
      //     deviceNo: item.serial_number
      //   })
      // })
      let type = this.props.addOrderType
      let params:any = {
        type: type,
        remark: fieldsValue.remark,
        preOrderDeviceDTOList: preOrderDeviceDTOList,
        preOrderPictureDTOList: this.state.fileList.map((item: any) => {
          let url = typeof item.response !== 'undefined' ? item.response.data.url : item.url.replace(IMAGE_PREFIX, '')
          return { url }
        })
      }
      if (type === 0) {
        params.mobile = fieldsValue.mobile
      } else {
        params.mobile = ""
      }
      if(this.props.orderInfo) {
        params.preOrderNo = this.props.orderInfo.preOrderNo;
        this.preOrderUpdate(params);
      } else {
        this.createPreOrder(params);
      }
      
    })
  }

  private handleCancel() {
    this.setState({
      boxInfo: []
    })
    this.props.form.resetFields()
    this.props.onClose()
  }

  private previewHandleCancel() {
    this.setState({
      previewVisible:false
    })
  }

  private add() {
    let boxInfo = JSON.parse(JSON.stringify(this.state.boxInfo))
    boxInfo.push({key: new Date().getTime(),serial_number: ""})
    refList.push('')
    this.setState({
      boxInfo,
    }, () => {
      refList[boxInfo.length-1].focus()
    })
  }
  private delete(item:any, index: number) {
    // 模拟删除
    let boxInfo = JSON.parse(JSON.stringify(this.state.boxInfo))
    boxInfo.splice(index, 1)
    refList.splice(index, 1)
    this.setState({
      boxInfo
    })
  }
  private uploadButton () {
    return (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    )
  }
  componentDidMount() {
    if(this.props.orderInfo) {
      this.setState({
        boxInfo: this.props.orderInfo.preOrderDeviceVOList,
        // fileList: this.props.orderInfo.preOrderPictureVOList
      })
      
    }
  }
  
  private getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  private checkImage(fileObj:any) {
    // if(fileObj.size > this.state.uploadFileMaxSize) {
    //   return false
    // }
    // if(!(fileObj.type === "image/png" || fileObj.type === "image/jpg" || fileObj.type === "image/jpeg")) {
    //   return false
    // }
    return true
  }
  private beforeUpload(file:any, fileList:any):any {
    
    if(uploadListLength >= this.state.uploadMaxCount) {
      return false
    } else {
      const isMax = file.size / 1024 / 1024 < UPLOAD_MAX_SIZE;
      if (!isMax) {
        message.error(`图片最大上传${UPLOAD_MAX_SIZE}MB!`);
      }
      return isMax
    }
  }

  private async handlePreview (file:any) {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  private handleChange({fileList}:any) {
  let delIndex = -1
    fileList.forEach((item: any, index: number) => {
      if (!sessionStorage.getItem(item.uid)) {
        if (item.response && item.response.code !== 200) {
          message.error(item.response.message)
          sessionStorage.setItem(item.uid, '123')
          delIndex = index
        }
      }
    })
    if (delIndex !== -1) {
      fileList.splice(delIndex, 1)
    }
    this.setState({
      fileList: [...(fileList.slice(0,8))]
    });
    uploadListLength = fileList.length
  }

  private inputEnter(val:any) {
    this.add()
  }
  private getInitValue(name: string,defaultVal:any = "") {
    if(!name) {
      return defaultVal
    }
    return this.props.orderInfo ? this.props.orderInfo[name] : defaultVal
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const headers: any = getUploadHeader()
    return (
      <Modal
          title={this.props.addOrderType === 0 ? "新建代销订单" : "新建集采订单"}
          visible={this.props.visible}
          width={800}
          centered={true}
          maskClosable={false}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="back" onClick={this.handleCancel.bind(this)}>
              取消
            </Button>,
            <Button key="save" type="primary" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
              保存
            </Button>
          ]}
        >
          <Form layout="inline" > 
          {
            !this.props.addOrderType && 
            <Row gutter={[8, 16]}>
              <Col span={24}>
                <Form.Item label="用户手机号">
                  {
                    getFieldDecorator("mobile", {
                      rules: [{required: true, message: '请输入用户手机号'}],
                      initialValue: this.getInitValue('mobile',"")
                    })(
                      <Input style={{ width: 150 }} allowClear placeholder="用户手机号"  />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          }
          <Row gutter={[8, 16]}>
            <Col span={24}>
              <span>盒子信息：</span>
            </Col>
          </Row>
          {
            this.state.boxInfo.map((item:any, index:number) => {
              return (
                <Row key={index}>
                  <Col span={20}>
                    <Form.Item label="盒子串号">
                      {
                        getFieldDecorator(`this.state.boxInfo[${index}].deviceNo`, {
                          rules: [{required: true, message: '请输入盒子串号'}],
                          initialValue: item.deviceNo
                        })(
                          <Input key={item.key} ref={input => {refList[index] = input}} style={{ width: 200 }} allowClear placeholder="请输入盒子串号" onPressEnter={this.inputEnter.bind(this, item)}  />
                          )
                      }
                    </Form.Item>
                    <Form.Item label="云服务">
                      {
                        getFieldDecorator(`this.state.boxInfo[${index}].cloudService`, {
                          rules: [{required: true, message: '请输入云服务'}],
                          initialValue: item.cloudService
                        })(
                          <Input key={item.key} style={{ width: 200 }} allowClear placeholder="请输入云服务"  />
                          )
                      }
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button type="danger" shape="circle" icon="close" onClick={this.delete.bind(this,item, index)} />
                  </Col>
                </Row>
              )
            })
          }
          <Row gutter={[8, 16]}>
            <Col span={24}>
              <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '100' }}>
                <Icon type="plus" /> 添加
              </Button>
            </Col>
          </Row>
          <Row gutter={[8, 16]}>
            <Col span={24}>
              <Form.Item label="备注" style={{width: "100%"}}>
                {
                  getFieldDecorator("remark", {
                    rules: [{required: true, message: '请输入备注'}],
                    initialValue: this.getInitValue('remark',"")
                  })(
                    <TextArea
                      placeholder="备注"
                      autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                  )
                }
              </Form.Item>
            </Col>
          </Row>  
          <Row gutter={[8, 16]}>
            <Col span={24}>
              <div>
                <p>证据图：</p>
                <p>支持上传Png、jpg、jpeg，最多上传{this.state.uploadMaxCount}张，每张大小最多{UPLOAD_MAX_SIZE}M</p>
              </div>
              {/* TODO */}
              <Upload
                action={BASE_URL + '/oss/upload'}
                listType="picture-card"
                data={{ type: UPLOAD_IMAGE_TYPE }}
                multiple={true}
                accept="image/*"
                fileList={this.state.fileList}
                onPreview={this.handlePreview.bind(this)}
                onChange={this.handleChange.bind(this)}
                beforeUpload={this.beforeUpload.bind(this)}
                headers={headers}
              >
                {this.state.fileList.length >= this.state.uploadMaxCount ? null : this.uploadButton()}
              </Upload>
              <Modal visible={this.state.previewVisible} footer={null} onCancel={this.previewHandleCancel.bind(this)}>
                <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
              </Modal>
            </Col>
          </Row>
          </Form>
        </Modal>
      
    )
  }
}

interface stateType {
  isShowLoading: Boolean,
  onClose: () => {},
}
interface ComponentPropsInterface extends FormComponentProps {
  addOrderType: null,
  visible: boolean,
  onClose: () => void,
  refreshList: () => void,
  orderInfo:any,
}
const orderForm = Form.create<ComponentPropsInterface>()(OrderModal);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(orderForm)
