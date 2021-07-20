import React from 'react'
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/es/form';
import { getUploadHeader } from '../../../../../tools/tools'
import { Input, Form, Modal, Row, Col, Button, Icon, Upload, message, Drawer, Select, Cascader} from 'antd';

import { 
  createPreOrder,
  preOrderUpdate,
  queryDictList,
  getAreaList
} from "../../../../../server/api"
import { UPLOAD_IMAGE_TYPE, UPLOAD_MAX_SIZE, IMAGE_PREFIX, SELL_CHANNEL } from '../../../../../config/config'
import { BASE_URL } from '../../../../../config/request_config'
import { codeInfoListFilter } from '../../../../../tools/tools'

const { TextArea } = Input;
const { Option } = Select
interface IProps {
  dispatch: Function,
  form: any,
  addOrderType:any,
  visible: boolean,
  onClose: () => void,
  refreshList: () => void,
  orderInfo: any,
  isViewOnly: any,
}

interface IState {
  fileList:any,
  previewImage: string,
  previewVisible: boolean,
  uploadListLength: number,
  boxInfo: object[],
  visible: boolean,
  channelList: any,
  areaList: any,
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
    ],
    channelList: [],
    areaList:[],
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

  private async getDicList(codeTypeNo: string) {
    let res = await queryDictList({
      codeTypeNo,
      state: 1,
      pageSize: 9999,
      isDisableLoading: true,
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    if(!this.props.orderInfo) {
      res.data.dataList = codeInfoListFilter(res.data.dataList);
    }
    if (codeTypeNo === SELL_CHANNEL) {
      this.setState({
        channelList: res.data.dataList
      })
    }
    
  }

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

  private handleOk() {
    this.props.form.validateFields((err:any, fieldsValue:any) => {
      if (err) return;
      // let preOrderDeviceDTOList:any = [];
      //地域选择只选择第二级数据
      fieldsValue.this.state.boxInfo[0].dataCenterAddressId = fieldsValue.this.state.boxInfo[0].dataCenterAddressId[1]
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
      Object.assign(params, fieldsValue)
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
    this.getDicList(SELL_CHANNEL)
    this.getOrderAreaList()
    if(this.props.orderInfo) {
      
      let preOrderPictureVOList = this.props.orderInfo.preOrderPictureVOList;
      let fileList = preOrderPictureVOList.map((item: any) => {
        return {
          uid: new Date().getTime(),
          name: 'image.png',
          status: 'done',
          url: `${IMAGE_PREFIX}${item.url}`,
        }
      })
      this.setState({
        boxInfo: this.props.orderInfo.preOrderDeviceVOList,
        fileList: fileList
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
  private picRemove(val:any) {
    
    let fileList = this.state.fileList;
    let newFileList:any = []
    fileList.forEach((item:any) => {
      if(item.url !== val.url) {
        newFileList.push(item);
      }
    });
    this.setState({
      fileList: newFileList
    })
    return false
  }

  private onChannelChange() {}

  private onAreaBind() {
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { channelList } = this.state
    const { areaList } = this.state
    const { isViewOnly } = this.props
    const headers: any = getUploadHeader()
    const prefix = this.props.orderInfo ? '编辑' : '新建'
    const text = this.props.addOrderType === 0 ? '代销订单' : '集采订单'
    let title = isViewOnly ? (text + '详情') : (prefix + text)
    return (
      <Drawer
          // title={this.props.addOrderType === 0 ? "新建代销订单" : "新建集采订单"}
          title = {title}
          visible={this.props.visible}
          width={800}
          onClose={this.handleCancel.bind(this)}
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
                      <Input disabled={isViewOnly} maxLength={11} style={{ width: 150 }} allowClear placeholder="用户手机号"  />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          }
          {/* {
            <Row gutter={[8, 16]}>
              <Col span={24}>
                <Form.Item label='销售渠道'>
                  {getFieldDecorator('channelNo', {
                    initialValue: this.getInitValue('channelNo', ""),
                    rules: [{ required: true, message: '请选择' }],
                })(
                  <Select disabled={isViewOnly}  style={{ width: 120 }} onChange={this.onChannelChange.bind(this)}>
                      {
                        channelList.map((item: any) => {
                          return <Option key={item.id} value={item.serialNo}>{item.name}</Option>
                        })
                      }
                    </Select>,
                  )}
                  </Form.Item>
              </Col>
            </Row>
          } */}
          <Row gutter={[8, 16]}>
            <Col span={24}>
              <span>盒子信息：</span>
            </Col>
          </Row>
          {
            this.state.boxInfo.map((item:any, index:number) => {
              return (
                <Row key={index}>
                  <Col span={22}>
                    <Form.Item label="盒子串号">
                      {
                        getFieldDecorator(`this.state.boxInfo[${index}].deviceNo`, {
                          rules: [
                            {required: true, message: '请输入盒子串号'},
                            {max: 25, message: "串号长度为25,使用扫码枪时，请使用英文输入法"}
                          ],
                          initialValue: item.deviceNo
                        })(
                          <Input 
                          disabled={isViewOnly} 
                          key={item.key} 
                          ref={input => {refList[index] = input}} 
                          style={{ width: "320px" }} 
                          allowClear 
                          placeholder="请输入盒子串号" 
                          onPressEnter={this.inputEnter.bind(this, item)}  />
                          )
                      }
                    </Form.Item>
                    <Form.Item label="云服务">
                      {
                        getFieldDecorator(`this.state.boxInfo[${index}].cloudService`, {
                          rules: [{ required: true, message: '请输入云服务' }, { max: 255, message: '最大长度255位' }],
                          initialValue: item.cloudService
                        })(
                          <Input disabled={isViewOnly} key={item.key} style={{ width: "180px" }} allowClear placeholder="最大长度255位"  />
                          )
                      }
                    </Form.Item>
                    <Form.Item label="绑定地区">
                      {
                        getFieldDecorator(`this.state.boxInfo[${index}].dataCenterAddressId`, {
                          rules: [{ required: true, message: '请选择绑定地区' }],
                          initialValue: item.bindArea
                        })(
                          <Cascader
                            onChange={this.onAreaBind}
                            placeholder="请选择绑定地区"
                            style={{ width: "320px" }}
                            options={this.state.areaList}
                          /> 
                          )
                      }
                    </Form.Item>
                  </Col>
                  {
                    !isViewOnly && <Col span={2}>
                      <Button type="danger" shape="circle" icon="close" onClick={this.delete.bind(this, item, index)} />
                    </Col>
                  }
                  
                  
                </Row>
              )
            })
          }
          {
            !isViewOnly && <Row gutter={[8, 16]}>
              <Col span={24}>
                <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '100' }}>
                  <Icon type="plus" /> 添加
              </Button>
              </Col>
            </Row>
          }
          
          <Row gutter={[8, 16]}>
            <Col span={24}>
              <Form.Item label="备注" style={{width: "100%"}}>
                {
                  getFieldDecorator("remark", {
                    rules: [
                      {
                        required: true, message: '请输入备注'
                      },
                      { max: 500, message: '内容最大长度为500位！' }
                    ],
                    initialValue: this.getInitValue('remark',"")
                  })(
                    <TextArea
                      style={{width: "500px"}}
                      disabled={isViewOnly}
                      placeholder="内容最大长度为500位！"
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
                disabled={isViewOnly}
                fileList={this.state.fileList}
                onPreview={this.handlePreview.bind(this)}
                onChange={this.handleChange.bind(this)}
                beforeUpload={this.beforeUpload.bind(this)}
                // onRemove={this.picRemove.bind(this)}
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
          {
          !isViewOnly && <div
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
            <Button key="back" style={{marginRight: '16px'}} onClick={this.handleCancel.bind(this)}>
              取消
            </Button>
            <Button key="save" type="primary" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
              保存
            </Button>
          </div>
          }
          
        </Drawer>
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
  isViewOnly: any,
}
const orderForm = Form.create<ComponentPropsInterface>()(OrderModal);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(orderForm)
