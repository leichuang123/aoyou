import React from 'react'
// import productStyle from './product_package.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user'
import { Form, Button, Table, Pagination, message, Input, Modal, Cascader, Select, } from 'antd'
import { managerProductNoByList, getProductTypeList, queryDictList, saveProductUpgrade, asyncProduct, queryDataCenterList, getDataCenterList } from '../../../server/api'
import { PAGE_SIZE, SELL_CHANNEL } from '../../../config/config'
import { formatProduct } from '../../../tools/tools'
import EditProductPakcage from './edit_product_package/edit_product_package'
// import TypeDialog from './type_dialog/type_dialog'

const { Search } = Input
const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  currentPage: number,
  pageSize: number,
  name: string,
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  editInfo: any,
  productTypeList: any,
  typeNo: number,
  cascaderOptions: any,
  statusList: any,
  isShowTypeDialog: boolean,
  addProductTypeId: number,
  addProductTypeName: string,
  sellChannelList: any,
  sellChannel: number,
  editId: number,
  areaList: any,
  dataCenterAddressId: number,
}

class ProductPackageList extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    startTime: 0,
    endTime: 0,
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    name: '',
    editInfo: null,
    productTypeList: [],
    typeNo: -1,
    cascaderOptions: [],
    statusList: ['待发布', '已上架', '已下架'],
    isShowTypeDialog: false,
    addProductTypeId: -1,
    addProductTypeName: '',
    sellChannelList: [],
    sellChannel: -1,
    editId: -1,
    areaList: [],
    dataCenterAddressId: -1,
  }

  async componentDidMount() {
    // this.getChannelList()
    this.getDataCenterList()
    this.dataCenterList()
  }

  private async getProductTypeList() {
    let params = {
      pageSize: 99999
    }
    let res = await getProductTypeList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      productTypeList: res.data.dataList,
      cascaderOptions: formatProduct(res.data.dataList),
    }, () => {
      this.getList()
    })
  }

  private async getChannelList() {
    let res = await queryDictList({
      codeTypeNo: SELL_CHANNEL,
      pageSize: 99999,
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      sellChannelList: res.data.dataList
    }, () => {
      this.getProductTypeList()
      // this.getList()
    })
  }

  // 获取数据中心数据
  private async getDataCenterList(){
    let res = await queryDataCenterList()
    if(res.code == 200){
      this.setState({
        sellChannelList: res.data.dataList,
      }, () => {
        this.getProductTypeList()
        // this.getList()
      })
    }else{
      message.error(res.message)
    }
  }

    // 获取三级地域
    private async dataCenterList() {
      let res = await getDataCenterList()
      if (res.code !== 200) {
        message.error(res.message)
        return
      }else{
        this.setState({
          areaList: res.data
        })
      }
    }

  private handleSubmit() {
    this.setState({
      currentPage: 1,
      list: []
    }, () => {
      this.getList()
    })
  }

  private addProductPakcage() {
    this.setState({
      editInfo: null,
      visible: true,
      editId: -1,
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      name: this.state.name,
    }
    if (this.state.typeNo !== -1) {
      Object.assign(params, { typeNo: this.state.typeNo })
    }

    if (this.state.sellChannel !== -1) {
      Object.assign(params, { channelNo: this.state.sellChannel })
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await managerProductNoByList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    res.data.dataList.forEach((item: any) => {
      // item.productInfoVO.channelName = item.channelNo
      // this.state.sellChannelList.forEach((channel: any) => {
      //   if (+item.productInfoVO.channelNo === +channel.serialNo) {
      //     item.productInfoVO.channelName = channel.name
      //   }
      // })
      this.state.sellChannelList.forEach((obj: any) => {
        if (item.productInfoVO.dataCenterAddressId === obj.id) {
          // 修改数据中心
          item.productInfoVO.city = obj.name
        }
      })
      item.productInfoVO.productTypeName = item.typeNo
      this.state.productTypeList.forEach((product: any) => {
        if (+item.productInfoVO.typeNo === +product.id) {
          item.productInfoVO.productTypeName = product.name
        }
      })
    })
    this.setState({
      total: res.data.page.totalCount,
      list: res.data.dataList
    })
  }

  private onCascaderChange(list: any) {
    if (list.length > 0) {
      this.setState({
        typeNo: +list[list.length - 1],
        currentPage: 1,
      }, () => {
        this.getList()
      })
    } else {
      this.setState({
        typeNo: -1,
      }, () => {
        this.getList()
      })
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

  private closeEditDialog(isRefresh = false) {
    if (isRefresh) {
      this.setState({
        currentPage: 1,
      }, () => {
        this.getList()
      })
    }
    this.setState({
      editInfo: null,
      visible: false,
      addProductTypeId: -1,
      addProductTypeName: '',
    })
  }

  private cosleTypeDialog() {
    this.setState({
      isShowTypeDialog: false
    })
  }

  private search(name = '') {
    this.setState({
      name,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  private async editGoods(info: any) {
    this.setState({
      editInfo: info,
      visible: true
    })
  }

  private onOk(addProductTypeId: number, addProductTypeName: string) {
    this.setState({
      addProductTypeId,
      addProductTypeName,
      isShowTypeDialog: false,
    }, () => {
      this.setState({
        visible: true
      })
    })
  }

  private async operateStatus(info: any, state: number) {
    let newStatetxt = ''
    if (info.state === 0) {
      newStatetxt = '发布'
    } else {
      newStatetxt = state === 1 ? '上架' : '下架'
    }

    let sure = await new Promise(resolve => {
      Modal.confirm({
        title: '温馨提示',
        content: `确认${newStatetxt}？`,
        onOk: () => {
          resolve(true)
        },
        onCancel: () => {
          resolve(false)
        }
      })
    })
    if (!sure) {
      return
    }
    let params = {
      productNo: info.productNo,
      state,
      upgradeSpecsSet: info.upgradePackageList.map((item: any) => {
        return {
          rank: item.rank,
          timeChargeId: item.timeCharge.id,
          vmId: item.vmInfo.id,
        }
      })
    }
    let res = await saveProductUpgrade(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success(newStatetxt + '成功')
    this.getList()
  }

  private onSellChange(sellChannel: number) {
    this.setState({
      sellChannel,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  private async asyncProduct (info: any) {
    let res = await asyncProduct({
      productNo: info.productNo
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('操作成功')
    this.getList()
  }

  private onAreaCascaderChange(list: any) {
    if (list.length > 0) {
      this.setState({
        dataCenterAddressId: +list[list.length - 1],
        currentPage: 1,
      }, () => {
        this.getList()
      })
    } else {
      this.setState({
        dataCenterAddressId: -1,
      }, () => {
        this.getList()
      })
    }
  }

  render() {
    const { list, currentPage, total, pageSize, visible, editInfo, sellChannel, sellChannelList,
      cascaderOptions, addProductTypeId, addProductTypeName, editId, areaList } = this.state
    // const columns: any = [
    const columns: any = [
      {
        title: '序号',
        width: 100,
        dataIndex: 'index',
        key: 'index',
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      {
        title: '商品编号',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 200,
      },
      {
        title: '商品名称',
        dataIndex: 'productInfoVO.name',
        key: 'productInfoVO.name',
        width: 200,
      },
      {
        title: '商品类型',
        dataIndex: 'productInfoVO.productTypeName',
        key: 'productInfoVO.productTypeName',
        width: 120,
      },
      // {
      //   title: '销售渠道',
      //   dataIndex: 'productInfoVO.channelName',
      //   key: 'productInfoVO.channelName',
      //   width: 120,
      // },
      {
        title: '数据中心',
        dataIndex: 'productInfoVO.city',
        key: 'productInfoVO.city',
        width: 120,
      },
      // {
      //   title: '状态',
      //   dataIndex: 'state',
      //   key: 'state',
      //   width: 100,
      //   render: (text: any, item: any) => <span>{['待发布', '已上架', '已下架'][item.state]}</span>,
      // },
      // {
      //   title: '创建时间',
      //   dataIndex: 'createTime',
      //   key: 'createTime',
      //   width: 200,
      //   render: (text: any) => <span>{(text + '').replace('T', ' ')}</span>,
      // },
      // {
      //   title: '更新时间',
      //   dataIndex: 'updateTime',
      //   key: 'updateTime',
      //   width: 200,
      //   render: (text: any) => <span>{(text + '').replace('T', ' ')}</span>,
      // },
      // {
      //   title: '操作人',
      //   dataIndex: 'updateMan',
      //   key: 'updateMan',
      // },
      {
        title: '操作',
        key: 'action',
        width: 200,
        fixed: 'right',
        render: (text: any, item: any) => <div className='flex-enter'>
          <Button type='link' onClick={this.editGoods.bind(this, item)}>编辑</Button>
          {
            item.state === 0 && (<div className='inline-block'><Button type='link' onClick={this.operateStatus.bind(this, item, 1)}>发布</Button></div>)
          }
          {
            item.state === 1 && (<div className='inline-block'><Button type='link' onClick={this.operateStatus.bind(this, item, 2)}>下架</Button></div>)
          }
          {
            item.state === 2 && (<div className='inline-block'><Button type='link' onClick={this.operateStatus.bind(this, item, 1)}>上架</Button></div>)
          }
          <div className='inline-block'><Button type='link' onClick={this.asyncProduct.bind(this, item)}>同步</Button></div>
        </div>,
      }
    ];
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='flex-between'>
            <div style={{ display: 'none' }}>
              <Form.Item label='名称' >
                <Search
                  placeholder=""
                  onSearch={this.search.bind(this)}
                />
              </Form.Item>
              <Form.Item label="商品类型">
                <Cascader
                  options={cascaderOptions}
                  onChange={this.onCascaderChange.bind(this)}
                  placeholder="请选择"
                />
              </Form.Item>
              {/* <Form.Item label='渠道'>
                <Select onChange={this.onSellChange.bind(this)} value={sellChannel}>
                  <Option key='' value={-1}>全部</Option>
                  {
                    sellChannelList.filter((item: any) => { return item.state === 1 }).map((item: any, index: number) => {
                      return <Option key={item.id} value={item.serialNo}>{item.name}</Option>
                    })
                  }
                </Select>
              </Form.Item> */}
              <Form.Item label='数据中心'>
                <Cascader
                  options={areaList}
                  onChange={this.onAreaCascaderChange.bind(this)}
                  placeholder="请选择"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button type="primary" onClick={this.addProductPakcage.bind(this)}>
                  新建商品包
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
        <Table scroll={{ x: 1600 }} rowKey='productNo' className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        {
          visible && <EditProductPakcage 
          id={editId}
          addProductTypeId={addProductTypeId} 
          addProductTypeName={addProductTypeName} 
          onClose={this.closeEditDialog.bind(this)} 
          editInfo={editInfo} />
        }
        {/* {
          isShowTypeDialog && <TypeDialog onClose={this.cosleTypeDialog.bind(this)} onOk={this.onOk.bind(this)} />
        } */}
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_product_package_edit' })(ProductPackageList)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)