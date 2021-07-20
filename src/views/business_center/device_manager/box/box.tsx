import React from 'react'
import boxStyle from './box.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Button, Table, Pagination, message, Input, Modal, Row, Col, InputNumber } from 'antd'
import { timeQuantumList, createTimeQuantum, updateTimeQuantum, getTimeQuantumById } from '../../../../server/api'
import { PAGE_SIZE } from '../../../../config/config'

const { Search } = Input

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
  name: string,
  list: any,
  exportParam: any,
  visible: boolean,
  editInfo: any
}

class boxListPage extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    name: '',
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    editInfo: null,
  }

  componentDidMount() {
    this.getList()
  }

  private handleSubmit() {
    // this.setState({
    //   currentPage: 1,
    //   list: []
    // }, () => {
    //   this.getList()
    // })
  }

  private addRealTime() {
    this.setState({
      editInfo: null,
      visible: true,
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      name: this.state.name,
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await timeQuantumList(params)
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
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let params = {
        state: 1
      }
      Object.assign(params, data)
      let res = null
      if (this.state.editInfo === null) {
        res = await createTimeQuantum(params)
      } else {
        Object.assign(params, { id: this.state.editInfo.id })
        res = await updateTimeQuantum(params)
      }
      if (res.code === 200) {
        message.success('保存成功！')
        this.props.form.resetFields()
        this.setState({
          currentPage: this.state.editInfo === null ? 1 : this.state.currentPage,
          visible: false,
          editInfo: null,
        })
        this.getList()
      } else {
        message.error(res.message)
      }
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.setState({
      visible: false,
    })
  }


  private async editTimeQuantum(info: any) {
    let params = {
      id: info.id
    }
    let res = await getTimeQuantumById(params)
    if (res.code === 200) {
      res.data.id = info.id
      this.setState({
        editInfo: res.data,
        visible: true
      })
    } else {
      message.error(res.message)
    }
  }

  private search(name = '') {
    this.setState({
      name,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  render() {
    const { list, currentPage, total, pageSize, editInfo } = this.state
    const { getFieldDecorator } = this.props.form
    // const columns: any = [
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '设备串号',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '绑定手机',
        dataIndex: 'daily',
        key: 'daily',
      },
      {
        title: '激活时间',
        dataIndex: 'monthly',
        key: 'monthly',
      },
      {
        title: '激活卡券编号',
        dataIndex: 'annually',
        key: 'annually',
      },
      {
        title: '归属小组',
        dataIndex: 'annually',
        key: 'annually',
      },
      {
        title: '虚拟主机id',
        dataIndex: 'annually',
        key: 'annually',
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, item: any) => <Button type='link' onClick={this.editTimeQuantum.bind(this, item)}>编辑</Button>,
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
              onSearch={this.search.bind(this)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.addRealTime.bind(this)}>
              新建时长续费
            </Button>
          </Form.Item>
        </Form>
        <Table scroll={{ x: true }} rowKey="id" className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />

        <Modal
          maskClosable={false}
          title={editInfo === null ? '新建时长计费' : '编辑时长计费'}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width='800px'
        >
          <Form {...formItemLayout} className="edit-form" onSubmit={this.handleOk.bind(this)}>
            <Row>
              <Col span={12}>
                <Form.Item label='名称'>
                  {getFieldDecorator('name', {
                    initialValue: editInfo !== null ? editInfo.name : '',
                    rules: [{ required: true, message: '请输入名称' }],
                  })(
                    <Input
                      placeholder=""
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='每天'>
                  {getFieldDecorator('daily', {
                    initialValue: editInfo !== null ? editInfo.daily : '',
                    rules: [{ required: true, message: '请输入每天水晶数' }],
                  })(
                    <InputNumber
                      min={0}
                      className={boxStyle.crystalInput}
                      placeholder="水晶数"
                    />,
                  )}

                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='每月'>
                  {getFieldDecorator('monthly', {
                    initialValue: editInfo !== null ? editInfo.monthly : '',
                    rules: [{ required: true, message: '请输入每月水晶数' }],
                  })(
                    <InputNumber
                      min={0}
                      className={boxStyle.crystalInput}
                      placeholder="水晶数"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='每年'>
                  {getFieldDecorator('annually', {
                    initialValue: editInfo !== null ? editInfo.annually : '',
                    rules: [{ required: true, message: '请输入每年水晶数' }],
                  })(
                    <InputNumber
                      min={0}
                      className={boxStyle.crystalInput}
                      placeholder="水晶数"
                    />,
                  )}

                </Form.Item>
              </Col>
            </Row>
            <Row className='flex-center flex-start'>
              <Form.Item label='剩余'>
                {getFieldDecorator('showTime', {
                  initialValue: editInfo !== null ? editInfo.showTime : '',
                  rules: [{ required: true, message: '请输入时长' }],
                })(
                  <InputNumber
                    className={`${boxStyle.balanceInput} ${boxStyle.balanceMinute}`}
                    placeholder=""
                    min={0}
                  />,
                )}
              </Form.Item>
              <Form.Item className={boxStyle.balanceMsgInfo} label='分钟时提示，提示内容为：' labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator('showMessage', {
                  initialValue: editInfo !== null ? editInfo.showMessage : '',
                  rules: [{ required: true, message: '请输入提示消息' }],
                })(
                  <Input
                    className={`${boxStyle.balanceInput} ${boxStyle.balanceMsg}`}
                    placeholder="可使用$代替时长,例如您还剩下$水晶。"
                  />,
                )}
              </Form.Item>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item className={boxStyle.timeContent} label='保留时长'>
                  满{getFieldDecorator('retentionLimit', {
                    initialValue: editInfo !== null ? editInfo.retentionLimit : '',
                    rules: [{ required: true, message: '请输入天数' }],
                  })(
                    <InputNumber
                      min={0}
                      className={`${boxStyle.dayInput}`}
                      placeholder=""
                    />,
                  )}
                  天，保留时长
                </Form.Item>

              </Col>
              <Col span={12}>
                <Form.Item className={`${boxStyle.timeContent} ${boxStyle.hourContent}`}>
                  {getFieldDecorator('retentionTime', {
                    initialValue: editInfo !== null ? editInfo.retentionTime : '',
                    rules: [{ required: true, message: '请输入保留时长' }],
                  })(
                    <InputNumber
                      min={0}
                      className={`${boxStyle.hourInput}`}
                      placeholder=""
                    />,
                  )}
                  小时
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

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_vm_edit' })(boxListPage)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)