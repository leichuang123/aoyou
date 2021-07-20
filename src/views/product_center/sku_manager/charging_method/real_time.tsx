import React from 'react'
import rtStyle from './real_time.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Button, Table, Pagination, message, Input, Modal, Row, Col, InputNumber, TimePicker } from 'antd'
import { realTimelList } from '../../../../server/api'
import { PAGE_SIZE } from '../../../../config/config'
import moment from 'moment'
const { TextArea, Search } = Input

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface timeListItem {
  startTime: string,
  endTime: string,
  crystal: number
}

interface timeListInterface {
  [index: number]: timeListItem
}

interface IState {
  currentPage: number,
  pageSize: number,
  startTime: number,
  endTime: number,
  placeNo: string,
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  open: boolean,
  timeList: timeListInterface
}

class RealTime extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    startTime: 0,
    endTime: 0,
    placeNo: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    open: false,
    timeList: [{
      startTime: '00:00',
      endTime: '23:59',
      crystal: 0
    }]
  }

  componentDidMount() {
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

  private addRealTime() {
    this.setState({
      visible: true,
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await realTimelList(params)
    if (res.code === 200) {
      this.setState({
        total: res.data.page.totalCount,
        list: res.data.dataList
      })
    } else {
      message.error(res.message)
    }
  }

  private pageinChange(currentPage: number) {
    this.setState({
      currentPage
    }, () => {
      this.getList()
    })
  }

  private showSizeChange(current: number, pageSize: number) {
    this.setState({
      currentPage: 1,
      pageSize
    }, () => {
      this.getList()
    })
  }

  private handleOk() {
    this.setState({
      visible: false,
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.setState({
      visible: false,
    })
  }

  private eidtSave() {
    console.log('edit save')
  }

  private editStatus (item: any) {}

  private addDateItem () {
    let timeList = JSON.parse(JSON.stringify(this.state.timeList))
    if (timeList[timeList.length - 1].endTime === '23:59') {
      return
    }
    timeList.push({
      startTime: timeList[timeList.length - 1].endTime,
      endTime: '23:59',
      crystal: 0
    })
    this.setState({
      timeList
    })
  }

  delDateItem (index: number) {
    let timeList = JSON.parse(JSON.stringify(this.state.timeList))
    timeList.splice(index, 1)
    this.setState({
      timeList
    })
  }

  onDateChange (index: number, time: moment.Moment, timeString: string) {
    let timeList = JSON.parse(JSON.stringify(this.state.timeList))
    timeList[index].endTime = timeString
    this.setState({
      timeList
    })
  }

  onDateCrystalChange(index: number, crystal: number) {
    let timeList = JSON.parse(JSON.stringify(this.state.timeList))
    timeList[index].crystal = crystal
    this.setState({
      timeList
    })
  }

  render() {
    const { list, currentPage, total, pageSize, timeList } = this.state
    const { getFieldDecorator } = this.props.form
    // const columns: any = [
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '时间段数',
        dataIndex: 'num',
        key: 'type',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      render: (text: any, item: any) => <span>{item.status === 1 ? '禁用' : '启用'}</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, item: any) => <span onClick={this.editStatus.bind(this, item)} className='tableEdit'>{item.status === 1 ? '禁用' : '启用'}</span>,
      }
    ];
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <Form.Item label='名称'>
            <Search
              placeholder=""
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.addRealTime.bind(this)}>
              新建实时续费
            </Button>
          </Form.Item>
        </Form>
        <Table scroll={{ x: true }} rowKey='Id' className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />

        <Modal
          title="新建/编辑实时续费"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          maskClosable={false}
          onCancel={this.handleCancel.bind(this)}
          width='800px'
        >
          <Form {...formItemLayout} className="edit-form" onSubmit={this.eidtSave.bind(this)}>
            <Row>
              <Col span={24}>
                <Form.Item labelCol={{ span: 2 }} label='名称'>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入名称' }],
                  })(
                    <Input
                      placeholder=""
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className={`flex-center ${rtStyle.balanceContent}`}>
                账户剩余
                <Form.Item className={rtStyle.balanceItem}>
                  {getFieldDecorator('balance', {
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Input
                      className={rtStyle.balanceInput}
                      placeholder=""
                    />,
                  )}
                </Form.Item>
                水晶时提示，提示内容为：
                <Form.Item className={rtStyle.balanceItem}>
                  {getFieldDecorator('balanceMsg', {
                    rules: [{ required: true, message: '请输入提示内容' }],
                  })(
                    <Input
                      className={rtStyle.balanceMsgInput}
                      placeholder="可使用$代替时长,例如您还剩下$水晶。"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item className={rtStyle.dateContent} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label='阶段计费'>
                  {
                    timeList.map((item, index) => {
                      return <Row className={`flex-center ${rtStyle.dateInfo}`} key={index} >
                        <TimePicker disabled format='HH:mm' defaultValue={moment(item.startTime, 'HH:mm')} />
                        <span className={rtStyle.separator}>至</span>
                        <TimePicker disabled={index !== timeList.length -1} onChange={this.onDateChange.bind(this, index)} format='HH:mm' defaultValue={moment(item.endTime, 'HH:mm')} disabledHours={() => {
                          if (index > 0) {
                            const list = []
                            for (let i = 0; i < +timeList[index-1].endTime.split(':')[0]; i++) {
                              list.push(i)
                            }
                            return list
                          }
                          return []
                        }}/>
                        {getFieldDecorator('dateItemCrystal', {
                          rules: [{ required: true, message: '' }],
                        })(
                          <InputNumber
                            className={rtStyle.dateCrystal}
                            placeholder=""
                            onChange={(value: any) => {
                              this.onDateCrystalChange(index, value)
                            }}
                          />,
                        )}
                        水晶/分钟
                        {
                          (timeList.length > 1 && index === timeList.length - 1) && <Button className={rtStyle.delDateBtn} type="danger" icon='minus' onClick={this.delDateItem.bind(this, index)}>删除</Button>
                        }
                      </Row>
                    })
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Button className={rtStyle.addDateBtn} type="primary" icon='plus' onClick={this.addDateItem.bind(this)}>添加</Button>
            </Row>
            <Row>
              <Col span={20} className={rtStyle.leftAlign}>
                <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label='描述'>
                  {getFieldDecorator('desc', {
                    rules: [{ required: true, message: '' }],
                  })(
                    <TextArea
                      maxLength={200}
                      rows={4}
                      placeholder="最多200字"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_vm_edit' })(RealTime)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)