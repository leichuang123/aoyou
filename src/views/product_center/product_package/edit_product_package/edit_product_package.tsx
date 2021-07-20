import React from 'react'
import epStyle from './edit_product_package.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Table, Pagination, message, Input, Modal, Drawer, Row, Cascader, Button, Card, Select} from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { 
  timeQuantumList, 
  productList, 
  queryDictList, 
  upgradeVmListByQuery, 
  getProductTypeList, 
  saveProductUpgrade,
  createProductUpgrade,
  getAreaList,
} from '../../../../server/api'
import {
  PAGE_SIZE,
  // DIALOG_WIDTH,
  // CHANNEL_ID,
  DURATION_UNIT,
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
  DIALOG_MASK_CLOSABLE,
  SELL_CHANNEL,
  INPUT_MAXLENGTH,
} from '../../../../config/config'
import { formatProduct, codeInfoListFilter } from '../../../../tools/tools'
const { Search } = Input
const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  addProductTypeId: number,
  addProductTypeName: string,
  onClose: (isRefresh: boolean) => void,
  editInfo: any
  editId: number,
}

interface IState {
  operateSystemList: any,
  drawerVisible: boolean,
  virtralMachieTable: any,
  productTable: any,
  timeQuantumTable: any,
  productId: any,
  durationUnit: any,
  durationUnitList: any,
  channelList: any,
  systemDiskList: any,
  hardDiskList: any,
  graphicsMemoryList: any,
  typeNo: any,
  isShowTimeCharge: any,
  name: String,
  cascaderOptions: any,
  sellChannel: any,
  sellChannelList: any,
  productList: any,
  productTypeList: any,
  editVmInfo: any,
  upgradeSpecsSet: any,
  areaList: any,
  dataCenterAddressId: number,
}

class EditProductPackage extends React.PureComponent<IProps, IState> {

  state: any = {
    drawerVisible: true,
    virtralMachieTable: {
      name: '',
      currentPage: 1,
      total: 20,
      pageSize: PAGE_SIZE,
      list: [],
      selectRowKes: [],
    },
    productTable: {
      name: '',
      currentPage: 1,
      total: 20,
      pageSize: PAGE_SIZE,
      list: [],
      selectRowKes: [],
    },
    timeQuantumTable: {
      name: '',
      currentPage: 1,
      total: 20,
      pageSize: PAGE_SIZE,
      list: [],
      selectRowKes: [],
    },
    durationUnitList: [],
    productId: -1,
    durationUnit: -1,
    channelList: [],
    systemDiskList: [],
    hardDiskList: [],
    graphicsMemoryList: [],
    operateSystemList: [],
    typeNo: -1,
    isShowTimeCharge: false,
    name: '',
    cascaderOptions: [],
    sellChannel: -1,
    sellChannelList: [],
    productList: [],
    productTypeList: [],
    editVmInfo: {},
    upgradeSpecsSet: [],
    areaList: [],
    dataCenterAddressId: -1,
  }

  componentDidMount() {
    let promiseList = [
      this.getDicList(SELL_CHANNEL),
      this.getDicList(DURATION_UNIT),
      this.getDicList(SYSEM_DISK_ID),
      this.getDicList(HARD_DISK_ID),
      this.getDicList(GRAPHIC_MEMORY_ID),
      this.getDicList(OPERATE_SYSTEM_ID),
    ]
    Promise.all(promiseList).then(() => {
      if (this.props.editInfo === null) {
        this.getChannelList()
        return
      }
      let productTable = JSON.parse(JSON.stringify(this.state.productTable))
      productTable.list = [{
        productNo: this.props.editInfo.productNo,
        name: this.props.editInfo.productInfoVO.name,
        channelName: this.props.editInfo.productInfoVO.channelName,
      }]
      productTable.selectRowKes = [this.props.editInfo.productNo]
      let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
      this.props.editInfo.upgradePackageList.forEach((item: any) => {
        item.vmInfo.operateSystemName = item.vmInfo.operateSystem
        item.vmInfo.systemDiskName = item.vmInfo.systemDisk
        item.vmInfo.graphicsMemoryName = item.vmInfo.graphicsMemory
        item.vmInfo.hardDiskName = item.vmInfo.hardDisk
        item.vmInfo.timeChargeId = -1
        item.vmInfo.upgradeNo = ''
        this.state.operateSystemList.forEach((obj: any) => {
          if (+item.vmInfo.operateSystem === +obj.serialNo) {
            item.vmInfo.operateSystemName = obj.name
          }
        })
        this.state.systemDiskList.forEach((obj: any) => {
          if (+item.vmInfo.systemDisk === +obj.serialNo) {
            item.vmInfo.systemDiskName = obj.name
          }
        })
        this.state.graphicsMemoryList.forEach((obj: any) => {
          if (+item.vmInfo.graphicsMemory === +obj.serialNo) {
            item.vmInfo.graphicsMemoryName = obj.name
          }
        })
        this.state.hardDiskList.forEach((obj: any) => {
          if (+item.vmInfo.hardDisk === +obj.serialNo) {
            item.vmInfo.hardDiskName = obj.name
          }
        })
      })
      virtralMachieTable.list = this.props.editInfo.upgradePackageList.map((item: any) => {
        return {
          name: item.vmInfo.name,
          memory: item.vmInfo.memory + 'G',
          cpu: item.vmInfo.cpu + '核',
          systemDiskName: item.vmInfo.systemDiskName,
          operateSystemName: item.vmInfo.operateSystemName,
          graphicsMemoryName: item.vmInfo.graphicsMemoryName,
          hardDiskName: item.vmInfo.hardDiskName,
          upgradeNo: item.upgradeNo,
          timeChargeId: item.timeCharge === null ? -1 : item.timeCharge.id,
          rank: item.rank,
          id: item.vmInfo.id
        }
      }).sort((a: any, b: any) => {
        return a.rank - b.rank
      })
      virtralMachieTable.selectRowKes = this.props.editInfo.upgradePackageList.filter((item: any) => {
        return item.state === 1
      }).map((item: any) => {
        return item.vmInfo.id
      })
      this.setState({
        productTable,
        virtralMachieTable,
      }, () => {
        // this.getVirtualList(false)
      })
    })
    this.dataCenterList()
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
    })
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
      this.getProductList()
      this.getVirtualList()
    })
  }

  private async getProductList () {
    let params = {
      currentPage: this.state.productTable.currentPage,
      pageSize: this.state.productTable.pageSize,
      name: this.state.name,
    }
    if (this.state.typeNo !== -1) {
      Object.assign(params, { typeNo: this.state.typeNo })
    }

    if (this.state.sellChannel !== -1) {
      Object.assign(params, { channelNo: this.state.sellChannel })
    }

    let res = await productList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    res.data.dataList.forEach((item: any) => {
      item.channelName = item.channelNo
      this.state.sellChannelList.forEach((channel: any) => {
        if (+item.channelNo === +channel.serialNo) {
          item.channelName = channel.name
        }
      })

      item.productTypeName = item.typeNo
      this.state.productTypeList.forEach((product: any) => {
        if (+item.typeNo === +product.id) {
          item.productTypeName = product.name
        }
      })
    })
    let productTable = JSON.parse(JSON.stringify(this.state.productTable))
    productTable.total = res.data.page.totalCount
    productTable.list = res.data.dataList
    this.setState({
      productTable,
    })
  }

  private async getDicList(codeTypeNo: string) {
    let res = await queryDictList({
      codeTypeNo,
      state: 1,
      pageSize: 99999,
      isDisableLoading: true,
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    if (!this.props.editInfo) {
      res.data.dataList = codeInfoListFilter(res.data.dataList);
    }
    if (codeTypeNo === DURATION_UNIT) {
      if (res.data.dataList.length === 0) return
      let durationUnit = -1
      res.data.dataList.forEach((item: any) => {
        if (item.state === 1 && durationUnit === -1) {
          durationUnit = item.serialNo
        }
      })
      this.setState({
        durationUnit,
        durationUnitList: res.data.dataList
      })
    } else if (codeTypeNo === SELL_CHANNEL) {
      this.setState({
        channelList: res.data.dataList
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

  }

  private async getVirtualList(isDisableLoading = false) {
    if (this.state.productTable.selectRowKes.length === 0) {
      return 
    }
    let params = {
      currentPage: this.state.virtralMachieTable.currentPage,
      pageSize: 99999999,
      name: this.state.virtralMachieTable.name,
      isDisableLoading,
      productNo: this.state.productTable.selectRowKes[0],
    }
    let res = await upgradeVmListByQuery(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
    virtralMachieTable.total = res.data.page.totalCount

    res.data.dataList.forEach((item: any) => {
      item.operateSystemName = item.operateSystem
      item.systemDiskName = item.systemDisk
      item.graphicsMemoryName = item.graphicsMemory
      item.hardDiskName = item.hardDisk
      item.timeChargeId = -1
      item.upgradeNo = ''
      item.cpu += '核'
      item.memory += 'G'
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
      // item.rank = 0
      // if (this.props.editInfo !== null && params.productNo === this.props.editInfo.productNo) {
      //   this.props.editInfo.upgradePackageList.forEach((obj: any) => {
      //     if (item.id === obj.vmInfo.id) {
      //       item.timeChargeId = obj.timeCharge.id
      //       item.rank = obj.rank
      //       item.upgradeNo = obj.upgradeNo
      //     }
      //   })
      // }
    })
    virtralMachieTable.list = res.data.dataList
    // virtralMachieTable.list = res.data.dataList.sort((a: any, b: any) => {
    //   return a.rank - b.rank
    // })
    this.setState({
      virtralMachieTable
    })
  }

  private async editSave (state = 0) {
    if (this.state.productTable.selectRowKes.length === 0) {
      message.error('请选择升级包商品')
      return
    }
    let isIncludeUnselectedPrice = false
    this.state.virtralMachieTable.list.forEach((vm: any) => {
      this.state.virtralMachieTable.selectRowKes.forEach((vmId: any) => {
        if (vm.id === vmId && vm.timeChargeId === -1) {
          isIncludeUnselectedPrice = true
        }
      })
    })
    if (isIncludeUnselectedPrice) {
      message.error('请关联价格')
      return
    }
    // 
    let params = {
      productNo: this.state.productTable.selectRowKes[0],
      state: 1,
      upgradeSpecsSet: this.state.virtralMachieTable.list.filter((item: any) => {
        let isSelect = false
        this.state.virtralMachieTable.selectRowKes.forEach((id: any) => {
          if (item.id === id) {
            isSelect = true
          }
        })
        return isSelect
      }).map((item: any, index: number) => {
        return {
          rank: index + 1,
          timeChargeId: item.timeChargeId,
          vmId: item.id,
          upgradeNo: item.upgradeNo || ''
        }
      })
    }
    let res = this.props.editInfo === null ? await createProductUpgrade(params) : await saveProductUpgrade(params)
    // 当一个商品包上架后，create可以创建相同的商品包。暂时用update
    // let res =  await saveProductUpgrade(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('保存成功')
    this.props.onClose(true)
  }


  private handleCancel() {
    this.setState({
      drawerVisible: false,
      typeNo: -1,
    })
    this.props.form.resetFields()
    this.props.onClose(false)
  }

  private search(name = '') {
    let productTable = JSON.parse(JSON.stringify(this.state.productTable))
    productTable.currentPage = 1
    this.setState({
      name,
      productTable,
    }, () => {
      this.getProductList()
    })
  }

  private searchTimeCharge (name = '') {
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    timeQuantumTable.name = name
    timeQuantumTable.currentPage = 1
    this.setState({
      timeQuantumTable,
    }, () => {
      this.getTimeQuantumList()
    })
  }

  private productRadioSelect(item: any) {
    let selectRowKes = [item.productNo]
    let productTable = JSON.parse(JSON.stringify(this.state.productTable))
    productTable.selectRowKes = selectRowKes
    this.setState({
      productId: item.id,
      productTable
    }, () => {
      this.getVirtualList()
    })
  }

  private timequantumSelect (item: any) {
    let selectRowKes = [item.id]
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    timeQuantumTable.selectRowKes = selectRowKes
    this.setState({
      timeQuantumTable
    })
  }

  private onCascaderChange(list: any) {
    if (list.length > 0) {
      let productTable = JSON.parse(JSON.stringify(this.state.productTable))
      productTable.currentPage = 1
      this.setState({
        typeNo: +list[list.length - 1],
        productTable,
      }, () => {
        this.getProductList()
      })
    } else {
      this.setState({
        typeNo: -1,
      }, () => {
          this.getProductList()
      })
    }
  }

  private onSellChange(sellChannel: number) {
    let productTable = JSON.parse(JSON.stringify(this.state.productTable))
    productTable.currentPage = 1
    this.setState({
      sellChannel,
      productTable,
    }, () => {
        this.getProductList()
    })
  }

  private virtralMachieTablePageinChange(currentPage: number) {
    let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
    virtralMachieTable.currentPage = currentPage
    this.setState({
      virtralMachieTable
    }, () => {
      this.getVirtualList()
    })
  }

  private virtralMachieTableshowSizeChange(currentPage: number, pageSize: number) {
    let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
    virtralMachieTable.pageSize = pageSize
    virtralMachieTable.currentPage = 1
    this.setState({
      virtralMachieTable
    }, () => {
        this.getVirtualList()
    })
  }

  private timeQuantumTablePageinChange(currentPage: number) {
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    timeQuantumTable.currentPage = currentPage
    this.setState({
      timeQuantumTable
    }, () => {
      this.getTimeQuantumList()
    })
  }

  private timeQuantumTableshowSizeChange(currentPage: number, pageSize: number) {
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    timeQuantumTable.pageSize = pageSize
    timeQuantumTable.currentPage = 1
    this.setState({
      timeQuantumTable
    }, () => {
      this.getTimeQuantumList()
    })
  }

  private async getTimeQuantumList(isDisableLoading = false) {
    let params = {
      currentPage: this.state.timeQuantumTable.currentPage,
      pageSize: this.state.timeQuantumTable.pageSize,
      name: this.state.timeQuantumTable.name,
      isDisableLoading,
    }

    let res = await timeQuantumList(params)
    if (res.code !== 200) {
      message.error(res.message)
    }
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    timeQuantumTable.total = res.data.page.totalCount
    timeQuantumTable.list = res.data.dataList
    this.setState({
      timeQuantumTable
    })
  }

  private showTimeQuantum (info: any) {
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    if (timeQuantumTable.list.length === 0) {
      this.getTimeQuantumList()
    }
    timeQuantumTable.selectRowKes = info.timeChargeId !== -1 ? [info.timeChargeId] : []
    this.setState({
      timeQuantumTable,
      editVmInfo: info,
      isShowTimeCharge: true,
    })
  }

  private sortVm (index: number, operate: number) {
    let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
    let temp = JSON.parse(JSON.stringify(virtralMachieTable.list[index + operate]))
    virtralMachieTable.list[index + operate] = JSON.parse(JSON.stringify(virtralMachieTable.list[index]))
    virtralMachieTable.list[index] = temp
    this.setState({
      virtralMachieTable
    })
  }

  private productTablePageinChange(currentPage: number) {
    let productTable = JSON.parse(JSON.stringify(this.state.productTable))
    productTable.currentPage = currentPage
    this.setState({
      productTable
    }, () => {
      this.getProductList()
    })
  }

  private productTableshowSizeChange(currentPage: number, pageSize: number) {
    let productTable = JSON.parse(JSON.stringify(this.state.productTable))
    productTable.pageSize = pageSize
    productTable.currentPage = 1
    this.setState({
      productTable
    }, () => {
      this.getProductList()
    })
  }

  private virtualSelect(item: any) {
    let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
    let index = virtralMachieTable.selectRowKes.indexOf(item.id)
    if ( index=== -1) {
      virtralMachieTable.selectRowKes.push(item.id)
    } else {
      virtralMachieTable.selectRowKes.splice(index, 1)
    }
    this.setState({
      virtralMachieTable
    })
  }

  private timeChargeOk () {
    if (this.state.timeQuantumTable.selectRowKes.length === 0) {
      message.error('请选择时长计费')
      return
    }
    let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
    virtralMachieTable.list.forEach((item: any) => {
      if (item.id === this.state.editVmInfo.id) {
        item.timeChargeId = this.state.timeQuantumTable.selectRowKes[0]
      }
    })
    this.setState({
      virtralMachieTable,
      isShowTimeCharge: false,
    })
  }

  private timeChargeCancel () {
    this.setState({
      isShowTimeCharge: false,
    })
  }

  // 获取二级地域
  private async dataCenterList() {
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

  private onAreaCascaderChange(list: any) {
    if (list.length > 0) {
      this.setState({
        dataCenterAddressId: +list[list.length - 1],
        // currentPage: 1,
      }, () => {
        // this.getList()
      })
    } else {
      this.setState({
        dataCenterAddressId: -1,
      }, () => {
        // this.getList()
      })
    }
  }

  render() {
    const {
      virtralMachieTable, productTable, timeQuantumTable, cascaderOptions,
      isShowTimeCharge, sellChannel, sellChannelList, areaList,
      drawerVisible, } = this.state
    const { editInfo } = this.props
    
    const productTableColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text: string, record: any, index: number) => <span>{(productTable.currentPage - 1) * productTable.pageSize + index + 1}</span>,
      },
      {
        title: '商品编号',
        dataIndex: 'productNo',
        key: 'productNo',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '上架渠道',
        dataIndex: 'channelName',
        key: 'channelName',
      }
    ]

    const virtralColumns: any = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text: string, record: any, index: number) => <span>{(virtralMachieTable.currentPage - 1) * virtralMachieTable.pageSize + index + 1}</span>,
      },
      {
        title: '虚拟机名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
      },
      {
        title: '内存',
        dataIndex: 'memory',
        key: 'memory',
      },
      {
        title: 'CPU',
        dataIndex: 'cpu',
        key: 'cpu',
      },
      {
        title: '系统盘',
        dataIndex: 'systemDiskName',
        key: 'systemDisk',
      },
      {
        title: '操作系统',
        dataIndex: 'operateSystemName',
        key: 'operateSystem',
      },
      {
        title: '显存',
        dataIndex: 'graphicsMemoryName',
        key: 'graphicsMemory',
      },
      {
        title: '硬盘',
        dataIndex: 'hardDiskName',
        key: 'hardDisk',
      },
      {
        title: '价格',
        key: 'price',
        width: 150,
        render: (text: any, item: any) => <div className='flex-enter'>
          <span className={epStyle.blue_link} onClick={this.showTimeQuantum.bind(this, item)}>{item.timeChargeId === -1 ? '关联' : '修改'}</span>
        </div>,
      },
      {
        title: '操作',
        key: 'action',
        width: 180,
        fixed: 'right',
        render: (text: any, item: any, index: number) => <div className='flex-enter'>
          {
            index !== 0 && <Button type='link' onClick={this.sortVm.bind(this, index, -1)}>上移</Button>
          }
          {
            index !== virtralMachieTable.list.length - 1 && <Button type='link' onClick={this.sortVm.bind(this, index, 1)}>下移</Button>
          }
          
        </div>,
      }
    ]
    const timeQuantumColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text: string, record: any, index: number) => <span>{(timeQuantumTable.currentPage - 1) * timeQuantumTable.pageSize + index + 1}</span>,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      }, {
        title: '每天',
        dataIndex: 'daily',
        key: 'daily',
        width: 150,
      }, {
        title: '每月',
        dataIndex: 'monthly',
        key: 'monthly',
        width: 150,
      }, {
        title: '每年',
        dataIndex: 'annually',
        key: 'annually',
        width: 150,
      }]
    const Footer = (<div className={`flex-center flex-end ${epStyle.topbtnc}`}>

      {/* {
        editInfo === null && <Button className={epStyle.topbtn} type="primary" onClick={this.editSave.bind(this, 0)}>存入草稿</Button>
      } */}
      {
        editInfo === null && <Button className={epStyle.topbtn} type="primary" onClick={this.editSave.bind(this, 1)}>立即发布</Button>
      }
      {
        editInfo !== null && <Button className={epStyle.topbtn} type="primary" onClick={this.editSave.bind(this, editInfo.state)}>保存</Button>
      }
      <Button className={epStyle.topbtn} onClick={this.handleCancel.bind(this)}>取消</Button>
    </div>)
    return (
      <Drawer
        title={editInfo === null ? '新建商品升级包' : '编辑商品升级包'}
        visible={drawerVisible}
        maskClosable={DIALOG_MASK_CLOSABLE}
        // onCancel={this.handleCancel.bind(this)}
        onClose={this.handleCancel.bind(this)}
        width={1200}
      // footer={Footer}
      >
        <div className={`drawer-operation-btn`}>
          {Footer}
        </div>
        <Card title="基础信息" className={`${epStyle.saleInfo}`}>
          {
            editInfo === null && <div>
              <Form layout="inline" className='search'>
                <div className='flex-between'>
                  <div>
                    <Form.Item label='名称'>
                      <Search
                        placeholder=""
                        onSearch={this.search.bind(this)}
                        maxLength={INPUT_MAXLENGTH}
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
                </div>
              </Form>
              <Row>
                {
                  <Table
                    scroll={{ x: true }}
                    rowKey='productNo'
                    className='table'
                    columns={productTableColumns}
                    dataSource={productTable.list}
                    rowSelection={{ type: 'radio', selectedRowKeys: productTable.selectRowKes, onSelect: (item) => this.productRadioSelect(item) }} pagination={false}
                    onRow={(record: any) => {
                      return {
                        onClick: () => {
                          this.productRadioSelect(record)
                        }
                      }
                    }}
                  />
                }
                {
                  <Pagination className={epStyle.goodsGagination}
                    current={productTable.currentPage}
                    total={productTable.total}
                    onChange={this.productTablePageinChange.bind(this)}
                    onShowSizeChange={this.productTableshowSizeChange.bind(this)}
                    pageSize={productTable.pageSize}
                    showSizeChanger
                    showQuickJumper
                    showTotal={() => { return `共${productTable.total}条数据` }} />
                }

              </Row>
            </div>
          }
          {
            editInfo !== null && <Table
              scroll={{ x: true }}
              rowKey='productNo'
              className='table'
              columns={productTableColumns}
              dataSource={productTable.list}
              pagination={false}
            />
          }
        </Card>
        <Card title="销售规格" className={`${epStyle.saleInfo}`}>
          <Table
            scroll={{ x: true }}
            rowKey='id'
            className='table'
            columns={virtralColumns}
            dataSource={virtralMachieTable.list}
            rowSelection={{ type: 'checkbox', selectedRowKeys: virtralMachieTable.selectRowKes, onSelect: (item) => this.virtualSelect(item) }} pagination={false}
            
          />
          {/* <Pagination className={epStyle.goodsGagination}
            current={virtralMachieTable.currentPage}
            total={virtralMachieTable.total}
            onChange={this.virtralMachieTablePageinChange.bind(this)}
            onShowSizeChange={this.virtralMachieTableshowSizeChange.bind(this)}
            pageSize={virtralMachieTable.pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={() => { return `共${virtralMachieTable.total}条数据` }} /> */}
        </Card>

        <div className={epStyle.bottomPlaceholder}></div>

        <Modal 
          visible={isShowTimeCharge}
          width={800}
          onOk={this.timeChargeOk.bind(this)}
          onCancel={this.timeChargeCancel.bind(this)}>
          <Form layout="inline" className='search'>
            <div className='flex-between'>
              <div>
                <Form.Item label='名称'>
                  <Search
                    placeholder=""
                    onSearch={this.searchTimeCharge.bind(this)}
                    maxLength={INPUT_MAXLENGTH}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
          <Table
            scroll={{ x: true, y: 300 }}
            rowKey='id'
            className='table'
            columns={timeQuantumColumns}
            dataSource={timeQuantumTable.list}
            rowSelection={{ type: 'radio', selectedRowKeys: timeQuantumTable.selectRowKes, onSelect: (item) => this.timequantumSelect(item) }} pagination={false}
            onRow={(record: any) => {
              return {
                onClick: () => {
                  this.timequantumSelect(record)
                }
              }
            }}
          />
          <Pagination className={epStyle.goodsGagination}
            current={timeQuantumTable.currentPage}
            total={timeQuantumTable.total}
            onChange={this.timeQuantumTablePageinChange.bind(this)}
            onShowSizeChange={this.timeQuantumTableshowSizeChange.bind(this)}
            pageSize={timeQuantumTable.pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={() => { return `共${timeQuantumTable.total}条数据` }} />
        </Modal>
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
  addProductTypeId: -1,
  addProductTypeName: '',
  id: -1,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_goods_edit' })(EditProductPackage)
export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)