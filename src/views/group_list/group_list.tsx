import React from 'react'
import glStyle from './group_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../interface/user'
import { Form, Button, message, Modal, Checkbox, Card, Row, Input, Upload, Col, Icon, } from 'antd'
import { addDeviceGroup, groupList, updateGroup, notJoinBoxList, quitGroup, checkOperatePermission, saveCover } from '../../server/api'
import { 
  PAGE_SIZE,
  PERMISSION,
  UPLOAD_IMAGE_TYPE,
  UPLOAD_MAX_SIZE,
  IMAGE_PREFIX,
} from '../../config/config'

import { RouteComponentProps  } from 'react-router-dom'
import { BASE_URL, } from '../../config/request_config'
import {
  getUploadHeader
} from '../../tools/tools'

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  currentPage: number,
  pageSize: number,
  total: number,
  list: any,
  name: string,
  exportParam: any,
  visible: boolean,
  inputError: boolean,
  preSoftWare: string[],
  editInfo: any,
  checkboxList: any,
  radioValue: number,
  hideAdd: boolean,
  baseUrl: string,
  isShowCover: boolean,
  uploadUrl: string,
  bigFileList: any,
  previewVisible: boolean,
  previewImage: string,
  
}

class GroupList extends React.PureComponent<RouteComponentProps & IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    inputError: false,
    name: '',
    preSoftWare: new Array<string>(),
    editInfo: null,
    checkboxList: [],
    hideAdd: true,
    baseUrl: '',
    uploadUrl: BASE_URL + '/oss/upload',
    isShowCover: false,
    bigFileList: [],
    previewVisible: false,
    previewImage: '',
  }

  componentDidMount() {
    const href = window.location.href
    const baseUrl = href.substring(0, href.indexOf('#/') + 2)
    this.setState({
      baseUrl
    })
    this.getList()
  }

  private handleSubmit() {
    this.setState({
      currentPage: 1,
      list: []
    }, () => {
      this.getList()
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      name: this.state.name
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await groupList(params)
    if (res.code === 200) {
      // let isCreate = false
      res.data.dataList.forEach((item: any) => {
        // if (item.userNo === this.props.user.userNo) {
        //   isCreate = true
        // }
      })
      this.getUserDeviceList()
      this.setState({
        total: res.data.page.totalCount,
        list: res.data.dataList,
        // hideAdd: isCreate
      })
    } else {
      message.error(res.message)
    }
  }

  private createGroup() {
    this.setState({
      editInfo: null,
      visible: true
    })
  }

  private handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      this.setState({
        visible: false
      })
    })
  }

  private async getUserDeviceList () {
    let params = {
      currentPage: 1,
      pageSize: 9999999,
    }

    let res = await notJoinBoxList(params)
    if (res.code === 200) {
      this.setState({
        checkboxList: res.data.dataList.map((item: any) => {
          return {
            label: item,
            value: item,
            checked: false,
          }
        })
      })
    } else {
      message.error(res.message)
    }
  }

  private handleCancel() {
    this.setState({
      editInfo: null,
      visible: false
    })
  }

  private exitGroup(info: any) {
    const modal = Modal.confirm({
      title: '确定退出该小组？',
      content: '退出小组后你将失去该小组盒子的所有权！',
      onOk: async () => {
        let param = {
          groupId: info.groupId,
          userNo: this.props.user.userNo,
        }
        let res = await quitGroup(param)
        if (res.code !== 200) {
          message.error(res.message)
          return
        }
        message.success('退出成功')
        this.getList()
        modal.destroy()
      },
      onCancel: () => {
        modal.destroy()
      }
    })
  }

  private editSave () {
    // addGroup
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let res = null
      let params = {
        deviceNoList: this.state.checkboxList.filter((item: any) => {
          return item.checked
        }).map((item: any) => {
          return item.value
        })
      }
      Object.assign(params, data)
      if (this.state.editInfo === null) {
        res = await addDeviceGroup(params)
      } else {
        delete params.deviceNoList
        Object.assign(params,{
          groupId: this.state.editInfo.groupId
        })
        res = await updateGroup(params)
      }
      if (res.code !== 200) {
        message.error(res.message)
        return
      }
      this.setState({
        editInfo: null,
        visible: false
      })
      this.getList()
      message.success('保存成功！')
    })
  }

  private checkboxChane(index: number) {
    let checkboxList = JSON.parse(JSON.stringify(this.state.checkboxList))
    checkboxList[index].checked = !checkboxList[index].checked
    this.setState({
      checkboxList
    })
  }

  private async editGroup (info: any) {
    let isPermission = await checkOperatePermission({ groupId: info.groupId, resourceId: PERMISSION.edit_group_name.id })
    if (isPermission.code !== 200) {
      message.error(isPermission.message)
      return
    }
    this.setState({
      editInfo: info,
      visible: true,
    })
  }

  private toGroupUserist = (info: any) => {
    window.open(this.state.baseUrl + `group_user_list?groupId=${info.groupId}&config_group=true`)
    // console.log(this.state.baseUrl + `group_user_list?groupId=${info.groupId}`)
    // this.props.history.push(`/group_user_list?groupId=${info.groupId}`)
  }

  private toManager = (info: any) => {
    window.open(this.state.baseUrl + `group_manager?groupId=${info.groupId}&config_group=true`)
    
  }

  private showCover = (info: any) => {
    let bigFileList = []
    if (info.backGroundUrl) {
      let bgurl = info.backGroundUrl
      let url = bgurl.indexOf('http') !== 0 ? IMAGE_PREFIX + bgurl : bgurl
      let newItem = {
        uid: 0,
        name: bgurl.substring(0, bgurl.lastIndexOf('/')),
        status: 'done',
        url
      }
      bigFileList.push(newItem)
    }
    this.setState({
      bigFileList,
      editInfo: info,
      isShowCover: true,
    })
  }

  private editSaveCover () {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let backGroundUrl = ''
      this.state.bigFileList.forEach((item: any) => {
        backGroundUrl = typeof item.response !== 'undefined' ? item.response.data.url : item.url.replace(IMAGE_PREFIX, '')
      })
      
      let res = await saveCover({
        groupId: this.state.editInfo.groupId,
        groupTitle: data.groupTitle,
        backGroundUrl
      })
      if (res.code !== 200) {
        message.error(res.message)
        return
      }
      message.success('保存成功')
      this.setState({
        isShowCover: false,
        editInfo: null
      })
      this.getList()
    })
  }

  private cancelCover () {
    this.setState({
      editInfo: null,
      isShowCover: false,
    })
  }

  private getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error: any) => reject(error);
    });
  }

  private handleBigChange(options: any) {
    let delIndex = -1
    options.fileList.forEach((item: any, index: number) => {
      if (!sessionStorage.getItem(item.uid)) {
        if (item.response && item.response.code !== 200) {
          message.error(item.response.message)
          sessionStorage.setItem(item.uid, '123')
          delIndex = index
        }
      }
    })
    if (delIndex !== -1) {
      options.fileList.splice(delIndex, 1)
    }

    this.setState({
      // bigFileList: [...options.fileList]
      bigFileList: options.fileList.length > 0 ? [options.fileList[options.fileList.length - 1]] : []
    })
  }

  private beforeUpload(file: any) {
    const isMax = file.size / 1024 / 1024 < UPLOAD_MAX_SIZE;
    if (!isMax) {
      message.error(`图片最大上传${UPLOAD_MAX_SIZE}MB!`);
    }
    return isMax
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

  render() {
    const { list, checkboxList, visible, editInfo, isShowCover, uploadUrl, bigFileList, previewVisible, previewImage } = this.state
    const { getFieldDecorator } = this.props.form
    // const { user } = this.props
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{bigFileList.length === 0 ? '上传' : '更换'}</div>
      </div>
    );
    const headers = getUploadHeader()
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Button type='primary' onClick={this.createGroup.bind(this)}>创建小组</Button>
        
        <div className='card-list vendor-diver'>
          {
            list.map((item: any, index: number) => {
              return <Card
                key={index}
                title={item.name}
                className={glStyle.card}
              >
                <p>创建时间：{item.createTime}</p>
                <p className='hidden'>加入时间：{item.joinTime}</p>
                <p className='flex-center flex-around'>
                  {
                    item.state !== 0 && <Button type='primary' className={glStyle.btn} onClick={this.toManager.bind(this, item)}>管理</Button>
                  }
                  <Button type='primary' className={glStyle.btn} onClick={this.editGroup.bind(this, item)}>编辑</Button>
                  <Button type='primary' className={glStyle.btn} onClick={this.showCover.bind(this, item)}>封面图</Button>
                  {/* <Button type='danger' className={glStyle.btn} onClick={this.exitGroup.bind(this, item)}>退出</Button> */}
                  
                </p>
              </Card>
            })
          }
          
        </div>
        {
          visible && <Modal
            title={editInfo === null ? '创建小组' : '编辑组名'}
            visible={this.state.visible}
            onOk={this.editSave.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            width='600px'
          >
            <Form {...formItemLayout} className="edit-form" onSubmit={this.editSave.bind(this)}>
              <Row>
                <Form.Item label='小组名称'  >
                  {getFieldDecorator('name', {
                    initialValue: editInfo === null ? '' : editInfo.name,
                    rules: [{ required: true, message: '请输小组名称' }],
                  })(
                    <Input
                      className={glStyle.createName}
                      placeholder="最多10个字"
                      maxLength={10}
                    />,
                  )}
                </Form.Item>
              </Row>
              {
                editInfo === null && <Row>
                  <Form.Item label='选择设备'>
                    {
                      checkboxList.map((item: any, index: number) => {
                        return <Checkbox key={index} onChange={this.checkboxChane.bind(this, index)}>{item.label}</Checkbox>
                      })
                    }
                  </Form.Item>
                </Row>
              }
            </Form>
          </Modal>
        }
        {
          isShowCover && <Modal
            title="封面设置"
            visible={true}
            onOk={this.editSaveCover.bind(this)}
            onCancel={this.cancelCover.bind(this)}
            width='600px'
          >
            <Form {...formItemLayout} className="edit-form" onSubmit={this.editSaveCover.bind(this)}>
              <Row>
                <Form.Item label='标题' labelCol={{ span: 3 }} >
                  {getFieldDecorator('groupTitle', {
                    initialValue: editInfo === null ? '' : editInfo.groupTitle,
                    rules: [{ required: false, message: '' }],
                  })(
                    <Input
                      className={glStyle.createName}
                      placeholder=""
                      maxLength={20}
                    />,
                  )}
                </Form.Item>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label={<span className={glStyle.itemLabel}><span className={glStyle.xin}>*</span>{`支持上传Png、jpg、jpeg，图片大小最多${UPLOAD_MAX_SIZE}M`}</span>} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                    <Upload
                      action={uploadUrl}
                      data={{ type: UPLOAD_IMAGE_TYPE }}
                      listType="picture-card"
                      fileList={bigFileList}
                      onPreview={this.handlePreview.bind(this)}
                      onChange={this.handleBigChange.bind(this)}
                      beforeUpload={this.beforeUpload.bind(this)}
                      headers={headers}
                    >
                      {bigFileList.length >= 2 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        }
        
        <Modal visible={previewVisible} footer={null} onCancel={this.closePriview}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_group_list' })(GroupList)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)