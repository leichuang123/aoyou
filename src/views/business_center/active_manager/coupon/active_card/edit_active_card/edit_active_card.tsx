import React from 'react'
import eacStyle from './edit_active_card.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../../interface/user'
import { Form, message, Input, Drawer, Row, Col, Select, Table, Pagination, Button, InputNumber, Cascader } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { queryDictList, activeCardProductList, createActivityCard, updateActivityCard, getAreaList } from '../../../../../../server/api'
import { 
  PAGE_SIZE, 
  DURATION_UNIT,
  SELL_CHANNEL,
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
  DIALOG_WIDTH,
  DIALOG_MASK_CLOSABLE,
  CHINANET_SELLCHANNEL,
  INPUT_MAXLENGTH,
  INPUT_MAXVALUE,
 } from '../../../../../../config/config'
import { codeInfoListFilter } from '../../../../../../tools/tools'

const { Option } = Select
const { Search } = Input

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: (isRefresh: boolean) => void,
  editInfo: any,
  isViewOnly: boolean,
}

interface IState {
  currentPage: number,
  pageSize: number,
  total: number,
  editList: any,
  exportParam: any,
  visible: boolean,
  open: boolean,
  unitList: any,
  unit: any,
  name: string,
  selectProductNo: string,
  systemDiskList: any,
  hardDiskList: any,
  graphicsMemoryList: any,
  operateSystemList: any,
  sellChannelList: any,
  sellChannel: number,
  areaList: any,
  dataCenterAddressId: number,
}

class EditActiveCard extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    exportParam: {},
    visible: false,
    open: false,
    editList: [],
    unit: '',
    unitList: [],
    name: '',
    selectProductNo: '',
    systemDiskList: [],
    hardDiskList: [],
    graphicsMemoryList: [],
    operateSystemList: [],
    sellChannelList: [],
    sellChannel: CHINANET_SELLCHANNEL,
    areaList:[],
    dataCenterAddressId: null,
  }

  componentDidMount() {
    this.getOrderAreaList()
    let promiseList = [
      this.getDicList(DURATION_UNIT),
      this.getDicList(SYSEM_DISK_ID),
      this.getDicList(HARD_DISK_ID),
      this.getDicList(GRAPHIC_MEMORY_ID),
      this.getDicList(OPERATE_SYSTEM_ID),
      this.getDicList(SELL_CHANNEL),
    ]
    console.log('promiseList', promiseList)
    Promise.all(promiseList).then(() => {
      
      if (this.props.editInfo !== null) {
        this.setState({
          // sellChannel: this.props.editInfo.channelNo,
          dataCenterAddressId: this.state.dataCenterAddressId,
          selectProductNo: this.props.editInfo.productNo
        }, () => {
          this.getProductList()
        })
      } else {
        this.getProductList()
      }
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

  private async getDicList(codeTypeNo: string) {
    let params = {
      codeTypeNo,
      pageSize: 99999,
      isDisableLoading: true
    }
    let res = await queryDictList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    if(!this.props.editInfo) {
      res.data.dataList = codeInfoListFilter(res.data.dataList);
    }
    
    if (codeTypeNo === DURATION_UNIT) {
      let unit = ''
      if (this.props.editInfo === null) {
        unit = res.data.dataList.length > 0 ? res.data.dataList[0].serialNo : ''
      } else {
        unit = this.props.editInfo.durationUnit
      }
      this.setState({
        unit,
        unitList: res.data.dataList
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
    } else if (codeTypeNo === SELL_CHANNEL) {
      this.setState({
        sellChannelList: res.data.dataList
      })
    }
    return new Promise(resolve => {
      resolve(true)
    })
  }

  private async getProductList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.props.isViewOnly ? 99999999 : this.state.pageSize,
      name: this.state.name,
      // channelNo: this.state.sellChannel
      dataCenterAddressId: this.state.dataCenterAddressId
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    console.log('params0531', params)
    let res = await activeCardProductList(params)
    if (res.code === 200) {
      let viewList: any = []
      res.data.dataList.forEach((item: any, index: number) => {
        item.operateSystemName = item.system
        item.systemDiskName = item.system
        item.graphicsMemoryName = item.memory
        item.hardDiskName = item.disk
        this.state.operateSystemList.forEach((obj: any) => {
          if (+item.system === +obj.serialNo) {
            item.operateSystemName = obj.name
          }
        })
        this.state.systemDiskList.forEach((obj: any) => {
          if (+item.disk === +obj.serialNo) {
            item.systemDiskName = obj.name
          }
        })
        this.state.graphicsMemoryList.forEach((obj: any) => {
          if (+item.memory === +obj.serialNo) {
            item.graphicsMemoryName = obj.name
          }
        })
        this.state.hardDiskList.forEach((obj: any) => {
          if (+item.hardDisk === +obj.serialNo) {
            item.hardDiskName = obj.name
          }
        })

        if (this.props.isViewOnly && (this.props.editInfo !== null && item.productNo === this.props.editInfo.productNo)) {
          viewList.push(item)
        }
      })
      console.log('res0531', res)
      this.setState({
        total: res.data.page.totalCount,
        editList: this.props.isViewOnly ? viewList : res.data.dataList
      })
    } else {
      message.error(res.message)
    }
  }

  private pageinChange(currentPage: number) {
    this.setState({
      currentPage
    }, () => {
      this.getProductList()
    })
  }

  private showSizeChange(current: number, pageSize: number) {
    this.setState({
      currentPage: 1,
      pageSize
    }, () => {
      this.getProductList()
    })
  }

  private handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      if (this.state.selectProductNo === '') {
        message.error('请选择商品')
        return
      }
      data.dataCenterAddressId = data.dataCenterAddressId[data.dataCenterAddressId.length - 1]
      console.log('data', data)
      let params = {
        state: 1,
        productNo: this.state.selectProductNo,
        durationUnit: this.state.unit,
      } 
      Object.assign(params, data)
      let res = null
      if (this.props.editInfo === null) {
        // 创建激活卡
        res = await createActivityCard(params)
      } else {
        Object.assign(params, { id: this.props.editInfo.id })
        res = await updateActivityCard (params)
      }
      if (res.code === 200) {
        message.success('保存成功！')
        this.props.form.resetFields()
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

  private search(name = '') {
    this.setState({
      name,
      currentPage: 1,
    }, () => {
      this.getProductList()
    })
  }

  private onUnitChange (unit: any) {
    this.setState({
      unit
    })
  }

  private onSellChange(sellChannel: number) {
    this.setState({
      sellChannel
    }, () => {
      this.getProductList()
    })
  }

  private productSelect (item: any) {
    this.setState({
      selectProductNo: item.productNo
    })
  }

  private onAreaBind(value) {
    this.setState({
      dataCenterAddressId: value[value.length - 1]
    })
  }

  render() {
    const { total, pageSize, editList, currentPage, unitList, unit, selectProductNo, sellChannel, sellChannelList } = this.state
    const { getFieldDecorator } = this.props.form
    const { editInfo, isViewOnly } = this.props
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 200,
      },
      {
        title: '虚拟机名称',
        dataIndex: 'vmName',
        key: 'vmName',
        width: 200,
      },
      {
        title: '内存',
        dataIndex: 'memory',
        key: 'memory',
        width: 100,
      },
      {
        title: 'CPU',
        dataIndex: 'cpu',
        key: 'cpu',
        width: 100,
      },
      // {
      //   title: '系统盘',
      //   dataIndex: 'systemDisk',
      //   key: 'systemDisk',
      // },
      {
        title: '操作系统',
        dataIndex: 'operateSystemName',
        key: 'operateSystemName',
        width: 150,
      },
      // {
      //   title: '显存',
      //   dataIndex: 'graphicsMemory',
      //   key: 'graphicsMemory',
      // },
      {
        title: '硬盘',
        dataIndex: 'hardDiskName',
        key: 'hardDiskName',
        width: 100,
      },
      {
        title: '每天(水晶)',
        dataIndex: 'daily',
        key: 'daily',
        width: 200,
      },
      {
        title: '每月(水晶)',
        dataIndex: 'monthly',
        key: 'monthly',
        width: 200,
      },
      {
        title: '每年(水晶)',
        dataIndex: 'annually',
        key: 'annually',
        width: 200,
      }
    ];
    
    const selectAfter = () => {
      return (<Select disabled={isViewOnly} onChange={this.onUnitChange.bind(this)} value={unit} style={{ width: 80 }}>
        {
          unitList.map((item: any) => {
            return <Option key={item.id} disabled={item.state !== 1} value={item.serialNo}>{item.name}</Option>
          })
        }
      </Select>)
    }
    let title = ''
    if (editInfo === null) {
      title = '新建激活卡'
    } else {
      title = isViewOnly ? '激活卡详情' : '编辑激活卡'
    }
    return (
      <Drawer
        title={ title }
        visible={true}
        maskClosable={DIALOG_MASK_CLOSABLE}
        // onOk={this.handleOk.bind(this)}
        // onCancel={this.handleCancel.bind(this)}
        onClose={this.handleCancel.bind(this)}
        width={DIALOG_WIDTH}
      >
        <div className={`drawer-operation-btn`}>
          <Button className='sure-btn' type="primary" onClick={this.handleOk.bind(this)}>确定</Button>
          <Button className='cancel-btn' onClick={this.handleCancel.bind(this)}>取消</Button>
        </div>
        <Form {...formItemLayout} className="edit-form" onSubmit={this.handleOk.bind(this)}>
          <Row>
            <Col span={12}>
              <Form.Item label='名称'>
                {getFieldDecorator('name', {
                  initialValue: editInfo !== null ? editInfo.name : '',
                  rules: [{ required: true, message: '请输入名称' }],
                })(
                  <Input
                    disabled={isViewOnly}
                    maxLength={INPUT_MAXLENGTH}
                    placeholder=""
                  />,
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
                    disabled={isViewOnly}
                    max={INPUT_MAXVALUE}
                    placeholder=""
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          {
            !isViewOnly && <Row>
              <Col span={12} className='flex-center flex-start'>
                <Form.Item label='云服务选择：'>
                  <Search className={eacStyle.search} maxLength={INPUT_MAXLENGTH} placeholder='商品名称' onSearch={this.search.bind(this)}></Search>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='数据中心' required>
                    {/* <Cascader
                      onChange={this.onAreaBind.bind(this)}
                      placeholder="请选择绑定地区"
                      style={{ width: "150px" }}
                      options={this.state.areaList}
                    />  */}
                  {getFieldDecorator('dataCenterAddressId', {
                    rules: [{ required: true, message: '请选择绑定地区' }],
                  })(
                    // <Select onChange={this.onSellChange.bind(this)}>
                    //   {
                    //     sellChannelList.map((item: any) => {
                    //       return <Option key={item.id} disabled={item.state !== 1} value={item.serialNo}>{item.name}</Option>
                    //     })
                    //   }
                    // </Select>,
                    <Cascader
                      onChange={this.onAreaBind.bind(this)}
                      placeholder="请选择绑定地区"
                      style={{ width: "200px" }}
                      options={this.state.areaList}
                    />
                    
                  )}
                </Form.Item>
              </Col>
            </Row>
          }

          <Row>
            {
              isViewOnly && <Table scroll={{ x: 1000 }} rowKey='productNo' className='table' columns={columns} dataSource={editList} pagination={false} />
            }
            {
              !isViewOnly && <Table 
              rowKey='productNo' 
              className='table' 
                scroll={{ x: 1000 }}
              columns={columns} 
              dataSource={editList} 
              pagination={false} 
              rowSelection={{ type: 'radio', selectedRowKeys: selectProductNo === '' ? [] : [selectProductNo], 
              onSelect: (item) => this.productSelect(item) }}
              onRow={(record: any) => {
                return {
                  onClick: () => {
                    this.productSelect(record)
                  }
                }
              }}
               />
            }
            {
              !isViewOnly && <Pagination className='vendor-diver' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
            }
          </Row>
          
          <Row className='flex flex-start vendor-diver'>
            <Form.Item label='赠送时间长' labelCol={{ span: 3 }}>
              {getFieldDecorator('duration', {
                initialValue: editInfo !== null ? +editInfo.duration : 0,
                rules: [
                  { required: true, message: '请输入时长' },
                  // { min: 0, message: '不能小于0' }
                ],
              })(
                <InputNumber min={0} disabled={isViewOnly} className={eacStyle.time}></InputNumber>
              )}
              {
                selectAfter()
              }
            </Form.Item>
          </Row>
          <Row className='flex flex-start'>
            <Form.Item label='价值' labelCol={{ span: 2 }}>
              {getFieldDecorator('price', {
                initialValue: editInfo !== null ? editInfo.price : '',
                rules: [{ required: true, message: '请输入价值水晶' }],
              })(
                <InputNumber min={0} disabled={isViewOnly} type='number' className={eacStyle.price} />
              )}水晶
            </Form.Item>
          </Row>
        </Form>
      </Drawer>
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
  isViewOnly: boolean
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(EditActiveCard)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)