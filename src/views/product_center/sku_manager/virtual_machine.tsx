import React from 'react'
import vmStyle from './virtual_machine.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { Form, Button, Table, Pagination, message, Input, Drawer, Row, Col, Select, InputNumber,Cascader } from 'antd'
import { 
  virtualList, 
  createVirtual, 
  updateVirtual, 
  queryDictList, 
  getVirtualMachineById,
  preinstallSoftwareList,
  getDataCenterList
 } from '../../../server/api'
import { PAGE_SIZE, 
  PREPARE_SOFTWARE_ID, 
  AGREEMENT_TYPE_ID, 
  VIRTUAL_MACHINE_ID,
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
  DIALOG_MASK_CLOSABLE,
  INPUT_MAXLENGTH,
} from '../../../config/config'
import { codeInfoListFilter } from '../../../tools/tools'

const { Option } = Select
const { TextArea, Search } = Input

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
  vmSoftwareDTOList: any,
  editInfo: any,
  agreementTypeList: any,
  vmTypeList: any
  systemDiskList: any,
  hardDiskList: any,
  graphicsMemoryList: any,
  operateSystemList: any,
  isCopy: any,
  dataCenterList: any,
}

class VirtualMachine extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    name: '',
    vmSoftwareDTOList: [],
    editInfo: null,
    agreementTypeList: [],
    vmTypeList: [],
    systemDiskList: [],
    hardDiskList: [],
    graphicsMemoryList: [],
    operateSystemList: [],
    dataCenterList: [],
    isCopy: false,
  }

  componentDidMount () {
    let promiseList = [
      // this.getDicList(PREPARE_SOFTWARE_ID),
      this.getPreInstallList(),
      this.getDicList(PREPARE_SOFTWARE_ID),
      this.getDicList(AGREEMENT_TYPE_ID),
      this.getDicList(VIRTUAL_MACHINE_ID),
      this.getDicList(SYSEM_DISK_ID),
      this.getDicList(HARD_DISK_ID),
      this.getDicList(GRAPHIC_MEMORY_ID),
      this.getDicList(OPERATE_SYSTEM_ID),
      this.getVirtualDataCenterList()
    ]
    Promise.all(promiseList).then(() => {
      this.getList()
    })
  }

  private handleSubmit () {
    this.setState({
      currentPage: 1,
      list: []
    }, () => {
      this.getList()
    })
  }

  private addVirtualMachine () {
    this.setState({
      visible: true,
    })
  }

  private async getPreInstallList () {
    return new Promise(async (resolve, reject) => {
      let res = await preinstallSoftwareList({ currentPage: 1, pageSize: 9999 })
      if (res.code !== 200) {
        message.error(res.message)
        reject(res.message)
        return
      }
      this.setState({
        vmSoftwareDTOList: res.data.dataList
      })
      resolve(true)
    })
  }

  private async getList () {
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
    let res = await virtualList(params)
    if (res.code === 200) {
      res.data.dataList.forEach((item: any) => {
        item.typeName = ''
        item.operateSystemName = item.operateSystem
        item.systemDiskName = item.systemDisk
        item.graphicsMemoryName = item.graphicsMemory
        item.hardDiskName = item.hardDisk

        this.state.vmTypeList.forEach((vmType: any) => {
          if (+item.type === +vmType.serialNo) {
            item.typeName = vmType.name
          }
        })
        this.state.operateSystemList.forEach((obj: any) => {
          if (+item.operateSystem === +obj.serialNo) {
            item.operateSystemName = obj.name
          }
        })
        this.state.systemDiskList.forEach((obj: any) => {
          if (+item.systemDisk === +obj.serialNo) {
            item.systemDiskName = obj.name
          }
        })
        this.state.graphicsMemoryList.forEach((obj: any) => {
          if (+item.graphicsMemory === +obj.serialNo) {
            item.graphicsMemoryName = obj.name
          }
        })
        this.state.hardDiskList.forEach((obj: any) => {
          if (+item.hardDisk === +obj.serialNo) {
            item.hardDiskName = obj.name
          }
        })
      })
      this.setState({
        total: res.data.page.totalCount,
        list: res.data.dataList
      })
    } else {
      message.error(res.message)
    }
  }

  private pageinChange (currentPage: number) {
    this.setState({
      currentPage
    }, () => {
      this.getList()
    })
  }

  private showSizeChange (current: number, pageSize: number) {
    this.setState({
      currentPage: 1,
      pageSize
    }, () => {
      this.getList()
    })
  }

  private async getVirtualDataCenterList() {
    let res = await getDataCenterList()
    if (res.code !== 200) {
      message.error(res.message)
      return
    }else{
      this.setState({
        dataCenterList: res.data
      })
    }
    
  }

  private handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      data.vmSoftwareDTOList = data.vmSoftwareDTOList.map((softwareId: number) => {
        return { softwareId }
      })
      data.dataCenterAddressId = data.dataCenterAddressId[2]
      let res = null
      let params = {
        state: 1
      }
      Object.assign(params, data)
      if (this.state.editInfo === null || (this.state.editInfo !== null && this.state.isCopy) ) {
        res = await createVirtual(params)
      } else {
        Object.assign(params, {id: this.state.editInfo.id})
        res = await updateVirtual(params)
      }
      if (res.code !== 200) {
        message.error(res.message)
        return
      }
      this.props.form.resetFields()
      message.success('保存成功！')
      this.setState({
        currentPage: this.state.editInfo === null ? 1 : this.state.currentPage,
        visible: false,
        editInfo: null,
      })
      this.getList()
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.setState({
      visible: false,
      editInfo: null,
    })
  }

  private async editVm (item: any) {
    let res = await getVirtualMachineById({id: item.id})
    if (res.code === 200) {
      this.setState({
        editInfo: res.data,
        visible: true,
        isCopy: false
      })
    } else {
      message.error(res.message)
    }
  }

  private async getDicList(codeTypeNo: string) {
    let params = {
      codeTypeNo,
      pageSize: 99999,
      isDisableLoading: true
    }
    let res = await queryDictList(params)
    if (res.code === 200) {
      // if (codeTypeNo === PREPARE_SOFTWARE_ID) {
      //   this.setState({
      //     vmSoftwareDTOList: res.data.dataList,
      //   })
      // } else 
      if(!this.state.editInfo) {
        res.data.dataList = codeInfoListFilter(res.data.dataList)
      }
      if (codeTypeNo === AGREEMENT_TYPE_ID) {
        this.setState({
          agreementTypeList: res.data.dataList,
        })
      } else if (codeTypeNo === VIRTUAL_MACHINE_ID) {
        this.setState({
          vmTypeList: res.data.dataList,
        })
      } else if (codeTypeNo === SYSEM_DISK_ID) {
        this.setState({
          systemDiskList: res.data.dataList
        })
      } else if (codeTypeNo === HARD_DISK_ID) {
        this.setState({
          hardDiskList: res.data.dataList
        })
      } else if (codeTypeNo === GRAPHIC_MEMORY_ID) {
        this.setState({
          graphicsMemoryList: res.data.dataList
        })
      } else if (codeTypeNo === OPERATE_SYSTEM_ID) {
        this.setState({
          operateSystemList: res.data.dataList
        })
      }
    } else {
      message.error(res.message)
    }
    return new Promise(resolve => {
      resolve(true)
    })
  }

  searchVm (name = '') {
    this.setState({
      name,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  async copyVm (info: any) {
    let res = await getVirtualMachineById({ id: info.id })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }

    this.setState({
      editInfo: res.data,
      visible: true,
      isCopy: true,
    })
  }

  render () {
    const { list, currentPage, total, visible, pageSize, editInfo, vmSoftwareDTOList,
       agreementTypeList, vmTypeList, systemDiskList, operateSystemList, hardDiskList, graphicsMemoryList, isCopy, } = this.state
    const { getFieldDecorator } = this.props.form
    // const columns: any = [
  const columns: any = [
      {
        title: '序号',
        dataIndex: 'id',
        // key: 'id',
        width: 100,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '虚拟机名称',
        dataIndex: 'name',
         // key: 'name',
        width: 150,
      },
      {
        title: '机型',
        dataIndex: 'typeName',
         // key: 'typeName',
        width: 120,
      },
      {
        title: '内存',
        dataIndex: 'memory',
         // key: 'menory',
        width: 120,
      },
      {
        title: 'CPU',
        dataIndex: 'cpu',
         // key: 'cpu',
        width: 100,
      },
      {
        title: '系统盘',
        dataIndex: 'systemDiskName',
         // key: 'systemDisk',
        width: 100,
      },
      {
        title: '操作系统',
        dataIndex: 'operateSystemName',
         // key: 'operateSystem',
        //  width: 150,
      },
      {
        title: '显存',
        dataIndex: 'graphicsMemoryName',
         // key: 'graphicsMemory',
        width: 150,
      },
      {
        title: '硬盘',
        dataIndex: 'hardDiskName',
         // key: 'hardDisk',
        width: 100,
      },
      {
        title: '总库存',
        dataIndex: 'stock',
        // key: 'stock',
        width: 100,
      },
      {
        title: '剩余库存',
        dataIndex: 'availableStock',
        // key: 'availableStock',
        width: 100,
      },
      {
        title: '操作',
        width: 150,
        fixed: 'right',
        dataIndex: 'action',
        // key: 'action',
        render: (text: any, item: any) => 
        <div>
          <span onClick={this.editVm.bind(this, item)} className={vmStyle.tableEdit}>编辑</span>
          <span onClick={this.copyVm.bind(this, item)} className={vmStyle.tableCopy}>复制</span>
        </div>,
      }
    ];

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
    return (
      <div className='new-user page'>
      <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='flex-between'>
            <div>
              <Form.Item label='虚拟机名称'>
                <Search
                  placeholder=""
                  onSearch={this.searchVm.bind(this)}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button type="primary" onClick={this.addVirtualMachine.bind(this)}>
                  新建虚拟机
                </Button>
              </Form.Item>
            </div>
          </div>
          
          
        </Form>
        <Table
          rowKey="id"
          scroll={{ x: 1500 }}
          className='table' 
          columns={columns}  
          dataSource={list} 
          pagination={false}
        />
       <Pagination className='pagination' current={currentPage} total={ total }  onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据`}} />
      
        <Drawer
          title={(editInfo === null || isCopy) ? '新建虚拟机' : '编辑虚拟机'}
          maskClosable={DIALOG_MASK_CLOSABLE}
          visible={visible}
          // onOk={this.handleOk.bind(this)}
          onClose={this.handleCancel.bind(this)}
          width={800}
          // width='800px'
        >
          <Form {...formItemLayout} className="edit-form" onSubmit={this.handleOk.bind(this)}>
            <Row>
              <Col span={12}>
                <Form.Item label='虚拟机名称'>
                  {getFieldDecorator('name', {
                    initialValue: editInfo !== null ? editInfo.name : '',
                    rules: [{ required: true, message: '请输入虚拟机名称' }],
                  })(
                    <Input
                      disabled={editInfo !== null && !isCopy}
                      maxLength={INPUT_MAXLENGTH}
                      placeholder=""
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='机型'>
                  {getFieldDecorator('type', {
                    initialValue: editInfo !== null ? editInfo.type : '',
                    rules: [{ required: true, message: '请选择虚拟机类型' }],
                  })(
                    <Select disabled={ editInfo !== null } >
                      {/* <Option value="">请选择</Option> */}
                      {
                        (editInfo === null ? vmTypeList.filter((item: any) => { return item.state === 1 }) : vmTypeList).map((item: any, index: number) => {
                          return <Option disabled={item.state !== 1} key={item.id} value={item.serialNo}>{item.name}</Option>
                        })
                      }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='CPU'>
                  {getFieldDecorator('cpu', {
                    initialValue: editInfo !== null ? editInfo.cpu : '',
                    rules: [{ required: true, message: '请输入CPU' }],
                  })(
                    <InputNumber
                      type='number'
                      min={0}
                      placeholder=""
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='内存' >
                  {getFieldDecorator('memory', {
                    initialValue: editInfo !== null ? editInfo.memory : '',
                    rules: [{ required: true, message: '请输入内存' }],
                  })(
                    <InputNumber
                      type='number'
                      min={0}
                      placeholder=""
                    />,
                  )}

                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='操作系统'>
                  {getFieldDecorator('operateSystem', {
                    initialValue: editInfo !== null ? +editInfo.operateSystem : '',
                    rules: [{ required: true, message: '请输入操作系统' }],
                  })(
                    // <Input
                    //   placeholder=""
                    // />,
                    <Select>
                      {
                        (editInfo === null ? operateSystemList.filter((item: any) => {return item.state === 1}) : operateSystemList).map((item: any) => {
                        return <Option disabled={item.state !== 1} key={item.id} value={item.serialNo} >{item.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='系统盘' >
                  {getFieldDecorator('systemDisk', {
                    initialValue: editInfo !== null ? +editInfo.systemDisk : '',
                    rules: [{ required: true, message: '请选择系统盘' }],
                })(
                  <Select>
                    {
                      (editInfo === null ? systemDiskList.filter((item: any) => { return item.state === 1 }) : systemDiskList).map((item: any) => {
                        return <Option disabled={item.state !== 1} key={item.id} value={item.serialNo} >{item.name}</Option>
                      })
                    }
                  </Select>
                  )}

                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='硬盘'>
                  {getFieldDecorator('hardDisk', {
                    initialValue: editInfo !== null ? +editInfo.hardDisk : '',
                    rules: [{ required: true, message: '请选择硬盘' }],
                })(
                  <Select>
                    {
                      (editInfo === null ? hardDiskList.filter((item: any) => { return item.state === 1 }) : hardDiskList).map((item: any) => {
                        return <Option disabled={item.state !== 1} key={item.id} value={item.serialNo} >{item.name}</Option>
                      })
                    }
                  </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='显存' >
                  {getFieldDecorator('graphicsMemory', {
                    initialValue: editInfo !== null ? +editInfo.graphicsMemory : '',
                    rules: [{ required: true, message: '请选择显存' }],
                  })(
                    <Select>
                      {
                        (editInfo === null ? graphicsMemoryList.filter((item: any) => { return item.state === 1 }) : graphicsMemoryList).map((item: any) => {
                          return <Option disabled={item.state !== 1} key={item.id} value={item.serialNo} >{item.name}</Option>
                        })
                      }
                    </Select>
                  )}

                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='预装软件'>
                  {getFieldDecorator('vmSoftwareDTOList', {
                    initialValue: editInfo !== null ? editInfo.vmSoftwareVOList.map((item: any) => {return item.softwareId}) : [],
                    rules: [{ required: true, message: '请选择预装软件'}],
                  })(
                    <Select
                      mode="multiple"
                    // defaultValue={['a10', 'c12']}
                    // onChange={this.softWareChange.bind(this)}
                    >
                      {
                        (editInfo === null ? vmSoftwareDTOList.filter((item: any) => { return item.state === 1 }) : vmSoftwareDTOList).map((item: any, index: number) => {
                          return <Option disabled={item.state !== 1} key={item.id} value={item.id}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='总库存'>
                  {getFieldDecorator('stock', {
                    initialValue: editInfo !== null ? editInfo.stock : '',
                    rules: [{ required: true, message: '请输入总库存' }],
                  })(
                    <InputNumber
                      type='number'
                      min={0}
                      placeholder=""
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} className={vmStyle.leftAlign}>
                <Form.Item labelCol={{span: 5}} label='使用说明'>
                  {getFieldDecorator('instructions', {
                    initialValue: editInfo !== null ? editInfo.instructions : '',
                    rules: [{ required: true, message: '请输入使用说明' }],
                  })(
                    <TextArea
                      maxLength={INPUT_MAXLENGTH*10}
                      rows={4}
                      placeholder="请输入使用说明"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='间隔'>
                  {getFieldDecorator('resetIntervalTime', {
                    initialValue: editInfo !== null ? editInfo.resetIntervalTime : 24,
                    rules: [{ required: true, message: '请输入重置时间间隔' }],
                  })(
                    <InputNumber
                      type='number'
                      min={0}
                      placeholder=""
                    />,
                  )}
                  &nbsp;小时后可重置1次
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='拥有最大数量'>
                  {getFieldDecorator('quantity', {
                    initialValue: editInfo !== null ? editInfo.quantity : '',
                    rules: [{ required: true, message: '请输入最大拥有数量' }],
                  })(
                    <InputNumber
                      type='number'
                      min={0}
                      placeholder=""
                    />,
                  )}
                  &nbsp;个
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='协议类型'>
                  {getFieldDecorator('agreement', {
                    initialValue: editInfo !== null ? editInfo.agreement : '',
                    rules: [{ required: true, message: '请选择协议类型' }],
                  })(
                    <Select>
                      {/* <Option value="">请选择</Option> */}
                      {
                        (editInfo === null ? agreementTypeList.filter((item: any) => { return item.state === 1 }) : agreementTypeList).map((item: any, index: number) => {
                          return <Option disabled={item.state !== 1} key={item.id} value={item.serialNo}>{item.name}</Option>
                        })
                      }
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
            <Col span={14}>
              <Form.Item label="绑定数据中心">
                {
                  getFieldDecorator(`dataCenterAddressId`, {
                    rules: [{ required: true, message: '请选择绑定数据中心' }],
                  })(
                    <Cascader
                      placeholder="请选择绑定数据中心"
                      style={{ width: "320px" }}
                      options={this.state.dataCenterList}
                    /> 
                    )
                  }
              </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className={vmStyle.bottomPlaceholder}></div>
          <div className={`drawer-operation-btn`}>
            <Button className='sure-btn' type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
            <Button className='cancel-btn' onClick={this.handleCancel.bind(this)}>取消</Button>
          </div>
        </Drawer>
        
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_vm_edit' })(VirtualMachine)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)