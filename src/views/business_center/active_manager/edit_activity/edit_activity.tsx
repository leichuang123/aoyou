import React from 'react'
import eaStyle from './edit_activity.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, DatePicker, message, Input, Modal, Row, Col, Select, Radio, Button, Cascader} from 'antd'
import { FormComponentProps } from 'antd/es/form';
import moment from 'moment'
import { createActivity, updateActivity, queryDictList, getAreaList } from '../../../../server/api'
import {
  ACTIVITY_TYPE_ID,
  SELL_CHANNEL,
  DATETIME_FORMAT,
} from '../../../../config/config'
const { Option } = Select
const { TextArea } = Input

const { RangePicker } = DatePicker;

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: (isRefresh: boolean) => void,
  editActivityInfo: any,
  isViewOnly: boolean,
}

interface IState {
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  startTime: string,
  endTime: string,
  channelList: any,
  activityTypeList: any,
  sellChannel: number,
  dataCenterAddressId: number,
  areaList: any,
}

class EditActive extends React.PureComponent<IProps, IState> {

  state: any = {
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    startTime: '',
    endTime: '',
    channelList: [],
    activityTypeList: [],
    sellChannel: '',
    dataCenterAddressId: null,
    areaList:[],
  }

  componentDidMount() {
    if (this.props.editActivityInfo !== null) {
      this.setState({
        startTime: this.props.editActivityInfo.startTime,
        endTime: this.props.editActivityInfo.endTime,
        sellChannel: this.props.editActivityInfo.channelNo
      })
    }
    this.getDicList(ACTIVITY_TYPE_ID)
    this.getDicList(SELL_CHANNEL)
    this.getOrderAreaList()
  }

  private async getDicList(codeTypeNo: string) {
    let params = {
      codeTypeNo,
      pageSize: 99999,
      state: 1
    }
    let res = await queryDictList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    if (this.props.editActivityInfo === null) {
      res.data.dataList = res.data.dataList.filter((item: any) => {
        return item.state === 1
      })
    }
    if (res.code === 200) {
      if (codeTypeNo === ACTIVITY_TYPE_ID) {
        this.setState({
          activityTypeList: res.data.dataList,
        })
      } else if (codeTypeNo === SELL_CHANNEL) {
        this.setState({
          channelList: res.data.dataList.map((item: any) => {
            return {
              label: item.name,
              value: item.serialNo
            }
          }),
        })
      }
    }
  }

  private activeTimeChange (dates: any) {
    this.setState({
      startTime: dates[0].valueOf(),
      endTime: dates[1].valueOf()
    })
  }

  private handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      data.dataCenterAddressId = data.dataCenterAddressId[data.dataCenterAddressId.length - 1]
      let res = null
      let params = {
        startTime: moment(this.state.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.state.endTime).format('YYYY-MM-DD HH:mm:ss'),
        id: this.props.editActivityInfo === null ? '' : this.props.editActivityInfo.id,
        state: 2,
      }
      if (params.id === '') {
        delete params.id
      }
      delete data.rangekcyTime
      Object.assign(params, data)
      // Object.assign(params, {channelNo: params.channel[0]})
      if (this.props.editActivityInfo === null) {
        res = await createActivity(params)
      } else {
        Object.assign(params, { activityNo: this.props.editActivityInfo.activityNo})
        res = await updateActivity(params)
      }
      if (res.code === 200) {
        this.props.form.resetFields()
        message.success('保存成功！')
        this.props.onClose(true)
      } else {
        message.error(res.message)
      }
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose(false)
  }

  private channelChange (index: number) {
    let channelList = JSON.parse(JSON.stringify(this.state.channelList))
    channelList[index].checked = !channelList[index].checked
    this.setState({
      channelList
    })
  }

  private radioChange(e: any) {
    this.setState({
      sellChannel: e.target.value
    })
  }
  private onAreaBind(value) {
    this.setState({
      dataCenterAddressId: value[value.length - 1]
    })
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
  render() {
    const { startTime, endTime, channelList, activityTypeList, sellChannel  } = this.state
    const { editActivityInfo, isViewOnly } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const Footer = (<div className='flex-end'>
      <Button type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
      <Button onClick={this.handleCancel.bind(this)}>取消</Button>
    </div>)
    const title = editActivityInfo === null ? '新建活动' : '编辑活动'
    return (
      <Modal
        title={isViewOnly ? '活动详情' : title}
        visible={true}
        maskClosable={false}
        footer={isViewOnly ? null : Footer}
        width='800px'
        onCancel={this.handleCancel.bind(this)}
      >
        <Form {...formItemLayout} className="edit-form" onSubmit={this.handleOk.bind(this)}>
          <Row>
            <Col span={12}>
              <Form.Item label='活动类型'>
                {getFieldDecorator('type', {
                  initialValue: editActivityInfo !== null ? editActivityInfo.type : '',
                  rules: [{ required: true, message: '请选择活动类型' }],
                })(
                  <Select disabled={isViewOnly || editActivityInfo !== null}>
                    <Option value="">请选择</Option>
                    {
                      activityTypeList.map((item: any, index: number) => {
                        return <Option key={item.id} value={item.serialNo}>{item.name}</Option>
                      })
                    }
                    
                  </Select>,
                )}

              </Form.Item>
              
            </Col>
            <Col span={12}>
              <Form.Item label='活动标题'>
                {getFieldDecorator('title', {
                  initialValue: editActivityInfo !== null ? editActivityInfo.title : '',
                  rules: [{ required: true, message: '请输入活动标题' }],
                })(
                  <Input
                    disabled={isViewOnly}
                    placeholder="最多15个字"
                    maxLength={15}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} className='flex-center flex-start'>
              <Form.Item label='活动时间'>
                {getFieldDecorator('rangekcyTime', {
                  initialValue: startTime !== '' && endTime !== '' ? [moment(startTime), moment(endTime)] : [],
                  rules: [{ required: true, message: '请选择活动范围' }],
                })(
                  <RangePicker
                    // defaultValue={startTime !== '' && endTime !== '' ? [moment(startTime), moment(endTime)] : []}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    disabled={isViewOnly}
                    showTime
                    format={DATETIME_FORMAT}
                    // onOk={this.activeTimeChange.bind(this)}
                    onChange={this.activeTimeChange.bind(this)}
                />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className='flex flex-start'>
            <Form.Item label='数据中心' labelCol={{ span: 3 }}>
              {getFieldDecorator('dataCenterAddressId', {
                rules: [{ required: true, message: '请选择绑定地区' }],
              })(
                // <Radio.Group disabled={editActivityInfo !== null} options={channelList} onChange={this.radioChange.bind(this)} />
                <Cascader
                  onChange={this.onAreaBind.bind(this)}
                  placeholder="请选择绑定地区"
                  style={{ width: "200px" }}
                  options={this.state.areaList}
                />
              )}
            </Form.Item>
          </Row>
          <Row className='flex flex-start'>
            <Form.Item label='活动内容' labelCol={{ span: 3 }}>
              {getFieldDecorator('content', {
                initialValue: editActivityInfo !== null ? editActivityInfo.content : '',
                rules: [{ required: true, message: '请输入活动内容' }],
              })(
                <TextArea disabled={isViewOnly} placeholder="最多200个字" className={eaStyle.content} rows={5} maxLength={200} />,
              )}
            </Form.Item>
          </Row>
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
  editActivityInfo: null,
  isViewOnly: boolean,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(EditActive)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)