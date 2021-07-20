import React from 'react'
// import esStyle from './edit_software.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, message, Input, Modal, Row, Col, Upload, Button, Icon, Select, } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { BASE_URL, } from '../../../../config/request_config'
import { logVisitAdd, logVisitEdit } from '../../../../server/api'
import {
  UPLOAD_IMAGE_TYPE,
  UPLOAD_MAX_SIZE,
  IMAGE_PREFIX,
} from '../../../../config/config'
import {  getUploadHeader } from '../../../../tools/tools'

const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: (isRefresh: boolean) => void,
  editInfo: any,  
}

interface IState {
  uploadUrl: string,
  smallFileList: any,
  previewImage: string,
  previewVisible: boolean,
  
}

class EditSoftWare extends React.PureComponent<IProps, IState> {

  state: any = {
    uploadUrl: BASE_URL + '/oss/upload',
    smallFileList: [],
    previewImage: '',
    previewVisible: false,
  }

  componentDidMount() {
    if (this.props.editInfo !== null) {
      let url = this.props.editInfo.logUrl.indexOf('http') !== 0 ? IMAGE_PREFIX + this.props.editInfo.logUrl : this.props.editInfo.logUrl
      this.setState({
        smallFileList: [{
          uid: 0,
          name: url.substring(0, url.lastIndexOf('/')),
          status: 'done',
          url
        }]
      })
    }
  }

  private handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }

      if (this.state.smallFileList.length === 0) {
        message.error('请上传logo')
        return
      }

      let res = null
      let item = this.state.smallFileList[0]
      let logUrl = typeof item.response !== 'undefined' ? item.response.data.url : item.url
      if (!logUrl.startsWith('http')) {
        logUrl = IMAGE_PREFIX + logUrl
      }
      let params = {
        logUrl
      }
      Object.assign(params, data)
      // Object.assign(params, {channelNo: params.channel[0]})
      if (this.props.editInfo === null) {
        res = await logVisitAdd(params)
      } else {
        Object.assign(params, { id: this.props.editInfo.id })
        res = await logVisitEdit(params)
      }
      if (res.code !== 200) {
        message.error(res.message)
        return
      }
      this.props.form.resetFields()
      message.success('保存成功！')
      this.props.onClose(true)
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose(false)
  }

  private getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error: any) => reject(error);
    });
  }

  private handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  private closePriview = () => this.setState({ previewVisible: false });

  private handleSmallChange(options: any) {
    this.setState({
      smallFileList: [...options.fileList]
    })
  }

  private beforeUpload(file: any) {
    const isMax = file.size / 1024 / 1024 < UPLOAD_MAX_SIZE;
    if (!isMax) {
      message.error(`图片最大上传${UPLOAD_MAX_SIZE}MB!`);
    }
    return isMax
  }

  render() {
    const { uploadUrl, smallFileList, previewImage, previewVisible } = this.state
    const { editInfo } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const Footer = (<div className='flex-end'>
      <Button type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
      <Button onClick={this.handleCancel.bind(this)}>取消</Button>
    </div>)
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const headers: any = getUploadHeader()
    return (
      <Modal
        title={editInfo === null ? '新建应用':'编辑应用'}
        visible={true}
        maskClosable={false}
        footer={ Footer }
        width='800px'
        onCancel={this.handleCancel.bind(this)}
      >
        <Form {...formItemLayout} className="edit-form" onSubmit={this.handleOk.bind(this)}>
          <Row>
            <Col span={12}>
              <Form.Item label='应用名称'>
                {getFieldDecorator('name', {
                  initialValue: editInfo !== null ? editInfo.name : '',
                  rules: [{ required: true, message: '请输入应用名称' }],
                })(
                  <Input
                    // placeholder="最多15个字"
                    // maxLength={15}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="应用logo" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                <Upload
                  action={uploadUrl}
                  data={{ type: UPLOAD_IMAGE_TYPE }}
                  listType="picture-card"
                  fileList={smallFileList}
                  onPreview={this.handlePreview.bind(this)}
                  onChange={this.handleSmallChange.bind(this)}
                  beforeUpload={this.beforeUpload.bind(this)}
                  headers={headers}
                >
                  {smallFileList.length > 0 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='应用地址'>
                {getFieldDecorator('logLink', {
                  initialValue: editInfo !== null ? editInfo.logLink : '',
                  rules: [{ required: true, message: '请输入应用地址' }],
                })(
                  <Input
                  // placeholder="最多15个字"
                  // maxLength={15}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label='状态' labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                {getFieldDecorator('state', {
                  initialValue: editInfo !== null ? editInfo.state * 1 : 0,
                  rules: [{ required: true, message: '请选择状态' }],
                })(
                  <Select  style={{ width: 120 }}>
                    <Option value={1}>上架</Option>
                    <Option value={0}>下架</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Modal visible={previewVisible} footer={null} onCancel={this.closePriview}>
            <img alt="icon" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form>
      </Modal>
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
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_software_edit' })(EditSoftWare)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)