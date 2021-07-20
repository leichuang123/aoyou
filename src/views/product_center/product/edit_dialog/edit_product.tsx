import React from 'react'
import epStyle from './edit_product.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Table, Pagination, message, Input, Modal, Drawer, Row, Col, Button, Card, Select, Checkbox, Tag, Upload, Icon, InputNumber, Cascader} from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { timeQuantumList, queryDictList, realTimelList, virtualList, createProduct, updateProduct, getProductTypeList, getAreaList } from '../../../../server/api'
import { PAGE_SIZE, UPLOAD_IMAGE_TYPE, 
  DIALOG_WIDTH,
  // CHANNEL_ID,
  DURATION_UNIT,
  SMALL_IMAGE_TYPE,
  BIG_IMAGE_TYPE,
  IMAGE_PREFIX,
  UPLOAD_MAX_SIZE,
  SYSEM_DISK_ID,
  HARD_DISK_ID,
  GRAPHIC_MEMORY_ID,
  OPERATE_SYSTEM_ID,
  DIALOG_MASK_CLOSABLE,
  SELL_CHANNEL,
  INPUT_MAXLENGTH,
 } from '../../../../config/config'
import { BASE_URL, } from '../../../../config/request_config'
import { formatProduct, getUploadHeader, codeInfoListFilter } from '../../../../tools/tools'
const { Search, TextArea } = Input
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
}

interface IState {
  currentPage: number,
  pageSize: number,
  total: number,
  list: any,
  exportParam: any,
  drawerVisible: boolean,
  virtralMachieTable: any,
  timeQuantumTable: any,
  realTimeTable: any,
  quickDuration: string[],
  smallFileList: any,
  bigFileList: any,
  previewVisible: boolean,
  previewImage: string,
  channelList: any,
  durationUnitList: any,
  isCheckedTimequantum: boolean,
  isCheckedRealTime: boolean,
  durationUnit: number,
  cascaderOptions: any,
  vmId: number,
  typeNo: number,
  timeChargeId: number,
  quickTime: number,
  uploadUrl: string,
  systemDiskList: any,
  hardDiskList: any,
  graphicsMemoryList: any,
  operateSystemList: any,
  areaList: any,
  dataCenterAddressId: number,
  defaultValue: any,
}

class EditGoods extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    list: [],
    exportParam: {},
    drawerVisible: false,
    virtralMachieTable: {
      name: '',
      currentPage: 1,
      total: 20,
      pageSize: PAGE_SIZE,
      list: [],
      selectRowKes: [],
    },
    realTimeTable: {
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
    quickDuration: [],
    smallFileList: [],
    bigFileList: [],
    previewVisible: false,
    previewImage: '',
    channelList: [],
    durationUnitList: [],
    isCheckedTimequantum: true,
    isCheckedRealTime: false,
    durationUnit: -1,
    cascaderOptions: [],
    vmId: -1,
    typeNo: -1,
    timeChargeId: -1,
    quickTime: 0,
    uploadUrl: BASE_URL + '/oss/upload',
    systemDiskList: [],
    hardDiskList: [],
    graphicsMemoryList: [],
    operateSystemList: [],
    areaList:[],
    dataCenterAddressId: 0,
    defaultValue: ['1','9'],
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
      this.getVirtualList(true)
    })
    // this.getRealTimeList(true)
    this.getTimequantumList(true)
    // this.getSelectProductTypeList()
    if (this.props.editInfo !== null) {
      let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
      virtralMachieTable.selectRowKes = [this.props.editInfo.vmId]
      let timeQuantumTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
      timeQuantumTable.selectRowKes = [this.props.editInfo.timeChargeId]
      this.setState({
        virtralMachieTable,
        timeQuantumTable,
        isCheckedTimequantum: true,
        timeChargeId: this.props.editInfo.timeChargeId,
        vmId: this.props.editInfo.vmId
      })
      if (typeof this.props.editInfo.shortcutDurationVOList !== 'undefined') {
        this.setState({
          quickDuration: JSON.parse(JSON.stringify(this.props.editInfo.shortcutDurationVOList))
        })
      }
      if (typeof this.props.editInfo.productPictureVOList !== 'undefined') {
        let smallFileList: any = []
        let bigFileList: any = []
        this.props.editInfo.productPictureVOList.forEach((item: any, index: number) => {
          if (item.url) {
            let url = item.url.indexOf('http') !== 0 ? IMAGE_PREFIX + item.url : item.url
            let newItem = {
              uid: index,
              name: item.url.substring(0, item.url.lastIndexOf('/')),
              status: 'done',
              url
            }
            if (+item.type === SMALL_IMAGE_TYPE) {
              smallFileList.push(newItem)
            } else if (+item.type === BIG_IMAGE_TYPE) {
              bigFileList.push(newItem)
            }
          }

        })
        this.setState({
          smallFileList,
          bigFileList
        })
      }
    }
    this.getOrderAreaList()
  }

  private async getSelectProductTypeList () {
    let params = {
      name: '',
      isDisableLoading: true,
      pageSize: 99999,
    }
    let res = await getProductTypeList(params)
    if (res.code === 200) {
      if (res.data.dataList.length === 0) return
      this.setState({
        cascaderOptions: formatProduct(res.data.dataList)
      })
    } else {
      message.error(res.message)
    }
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
    if(!this.props.editInfo) {
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
    let params = {
      currentPage: this.state.virtralMachieTable.currentPage,
      pageSize: this.props.editInfo === null ? this.state.virtralMachieTable.pageSize : 99999999,
      name: this.state.virtralMachieTable.name,
      isDisableLoading,
    }
    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await virtualList(params)
    if (res.code === 200) {
      let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
      virtralMachieTable.total = res.data.page.totalCount
     
      res.data.dataList.forEach((item: any) => {
        item.operateSystemName = item.operateSystem
        item.systemDiskName = item.systemDisk
        item.graphicsMemoryName = item.graphicsMemory
        item.hardDiskName = item.hardDisk
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
      if (this.props.editInfo === null) {
        virtralMachieTable.list = res.data.dataList
      } else {
        virtralMachieTable.list = res.data.dataList.filter((item: any) => {
          return +item.id === +this.props.editInfo.vmId
        })
      }
      if (!this.state.drawerVisible) {
        this.setState({
          drawerVisible: true
        })
      }
      this.setState({
        virtralMachieTable
      })
    } else {
      message.error(res.message)
    }
  }

  private async getRealTimeList(isDisableLoading = false) {
    let params = {
      currentPage: this.state.realTimeTable.currentPage,
      pageSize: this.state.realTimeTable.pageSize,
      name: this.state.realTimeTable.name,
      isDisableLoading,
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await realTimelList(params)
    if (res.code === 200) {
      let realTimeTable = JSON.parse(JSON.stringify(this.state.realTimeTable))
      realTimeTable.total = res.data.page.totalCount
      realTimeTable.list = res.data.dataList
      this.setState({
        realTimeTable
      })
    } else {
      message.error(res.message)
    }
  }

  private async getTimequantumList(isDisableLoading = false) {
    let params = {
      currentPage: this.state.timeQuantumTable.currentPage,
      pageSize: this.props.editInfo === null ? this.state.timeQuantumTable.pageSize : 9999,
      name: this.state.timeQuantumTable.name,
      isDisableLoading,
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await timeQuantumList(params)
    if (this.props.editInfo !== null) {
      res.data.dataList = res.data.dataList.filter((item: any) => {
        return +this.props.editInfo.timeChargeId === +item.id
      })
    }
    if (res.code === 200) {
      let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
      timeQuantumTable.total = res.data.page.totalCount
      timeQuantumTable.list = res.data.dataList
      this.setState({
        timeQuantumTable
      })
    } else {
      message.error(res.message)
    }
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

  private timeQuantumTablePageinChange(currentPage: number) {
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    timeQuantumTable.currentPage = currentPage
    this.setState({
      timeQuantumTable
    }, () => {
      this.getTimequantumList()
    })
  }

  private realTimeTablePageinChange(currentPage: number) {
    let realTimeTable = JSON.parse(JSON.stringify(this.state.realTimeTable))
    realTimeTable.currentPage = currentPage
    this.setState({
      realTimeTable
    }, () => {
        this.getRealTimeList()
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

  private timeQuantumTableShowSizeChange(currentPage: number, pageSize: number) {
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    timeQuantumTable.pageSize = pageSize
    timeQuantumTable.currentPage = 1
    this.setState({
      timeQuantumTable
    }, () => {
      this.getVirtualList()
    })
  }

  private realTimeTableShowSizeChange(currentPage: number, pageSize: number) {
    let realTimeTable = JSON.parse(JSON.stringify(this.state.realTimeTable))
    realTimeTable.pageSize = pageSize
    realTimeTable.currentPage = 1
    this.setState({
      realTimeTable
    }, () => {
        this.getRealTimeList()
    })
  }


  private handleCancel() {
    this.setState({
      drawerVisible: false,
      isCheckedTimequantum: false,
      quickDuration: [],
      typeNo: -1,
      timeChargeId: -1,
      vmId: -1,
      quickTime: 0,
      dataCenterAddressId: 0,
    })
    this.props.form.resetFields()
    this.props.onClose(false)
  }

  private editSave(state: number) {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      // this.props.editInfo
      let params = {
        durationUnit: this.state.durationUnit,
        timeChargeId: this.state.timeChargeId,
        state,
        vmId: this.state.vmId,
        // dataCenterAddressId: this.props.editInfo.dataCenterAddressId
        dataCenterAddressId: this.state.dataCenterAddressId == 0 ? this.props.editInfo.dataCenterAddressId : this.state.dataCenterAddressId
      }
      if (data.diyTime < 0) {
        message.error('最小购买时长必须大于0')
        return
      }
      if (this.props.addProductTypeId !== -1) {
        Object.assign(params, { typeNo: this.props.addProductTypeId})
        if (!data.diyTime) {
          delete data.diyTime
        }
      }

      if (this.state.vmId === -1) {
        message.error('请选择虚拟机')
        return
      }

      if (!this.state.isCheckedTimequantum && !this.state.isCheckedRealTime) {
        message.error('请选择计费方式')
        return
      }

      if (this.state.isCheckedTimequantum) {
        if (this.state.timeChargeId === -1) {
          message.error('请先选择时长计费规则')
          return
        }

        if (this.state.quickDuration.length === 0) {
          message.error('请添加快捷时长')
          return
        }
        Object.assign(params, { shortcutDurationList: this.state.quickDuration})
      }
      Object.assign(params, data)
      if (this.state.bigFileList.length === 0 ) {
        message.error('请上传大图')
        return
      }
      if (this.state.smallFileList.length === 0) {
        message.error('请上传小图')
        return
      }
      let productPictureList: any = []
      this.state.smallFileList.forEach((item: any) => {
        let url = typeof item.response !== 'undefined' ? item.response.data.url : item.url.replace(IMAGE_PREFIX, '')
        productPictureList.push({
          type: SMALL_IMAGE_TYPE,
          url,
        })
        
      })
      this.state.bigFileList.forEach((item: any) => {
        let url = typeof item.response !== 'undefined' ? item.response.data.url : item.url.replace(IMAGE_PREFIX, '')
        productPictureList.push({
          type: BIG_IMAGE_TYPE,
          url
        })
      })
      Object.assign(params, { productPictureList })
      let res = null
      if (this.props.editInfo === null) {
        res = await createProduct(params)
      } else {
        Object.assign(params, { productNo: this.props.editInfo.productNo, state: this.props.editInfo.state})
        res = await updateProduct(params)
      }
      if (res.code === 200) {
        message.success('保存成功！')
        this.setState({
          bigFileList: [],
          smallFileList: [],
          quickDuration: []
        })
        this.props.onClose(true)
      } else {
        message.error(res.message || '服务器异常')
      }
    })
  }

  private onChannelChange() {}

  private vmRadioSelect(item: any) {
    let selectRowKes = [item.id]
    let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
    virtralMachieTable.selectRowKes = selectRowKes
    this.setState({
      vmId: item.id,
      virtralMachieTable
    })
  }

  private realTimeRadioSelect (item: any) {}

  private timeQuantumRadioSelect (info: any) {
    let selectRowKes = [info.id]
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    timeQuantumTable.selectRowKes = selectRowKes
    this.setState({
      timeQuantumTable,
      timeChargeId: info.id
    })
  }

  private deleteTag(info: any) {
    const quickDuration = this.state.quickDuration.filter((item: any) => {
      return +item.duration !== +info.duration || +info.durationUnit !== item.durationUnit
    })
    this.setState({
      quickDuration
    })
  }
  private onCascaderChange (list: any) {
    if (list.length > 0) {
      this.setState({
        typeNo: +list[list.length -1]
      })
    }
  }

  private searchVm (name = '') {
    let virtralMachieTable = JSON.parse(JSON.stringify(this.state.virtralMachieTable))
    virtralMachieTable.name = name
    virtralMachieTable.currentPage = 1
    this.setState({
      virtralMachieTable
    }, () => {
        this.getVirtualList()
    })
  }

  private searchRealTime (name = '') {
    let realTimeTable = JSON.parse(JSON.stringify(this.state.realTimeTable))
    realTimeTable.name = name
    realTimeTable.currentPage = 1
    this.setState({
      realTimeTable
    }, () => {
      this.getRealTimeList()
    })
  }

  private searchTimequantum(name = '') {
    let timeQuantumTable = JSON.parse(JSON.stringify(this.state.timeQuantumTable))
    timeQuantumTable.name = name
    timeQuantumTable.currentPage = 1
    this.setState({
      timeQuantumTable
    }, () => {
      this.getTimequantumList()
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

  private closePriview = () => this.setState({ previewVisible: false });

  private handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  private handleSmallChange (options: any) {
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
      smallFileList: [...options.fileList]
    })
  }

  private handleBigChange (options: any) {
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
      bigFileList: [...options.fileList]
    })
  }

  private onTimeQuantumChange () {
    this.setState({
      isCheckedTimequantum: !this.state.isCheckedTimequantum
    })
  }

  private addQuickTime () {
    if (this.state.quickTime === 0) {
      message.error('请输入快捷时长')
      return
    }

    if (this.state.quickTime < 0) {
      message.error('快捷时长必须大于0')
      return
    }
    let quickDuration = JSON.parse(JSON.stringify(this.state.quickDuration))
    let isExist = false
    quickDuration.forEach((item: any) => {
      if (+this.state.quickTime === +item.duration && +this.state.durationUnit === +item.durationUnit) {
        isExist = true
      }
    })
    if (isExist) {
      message.error('快捷时长已存在')
      return
    }
    quickDuration.push({
      duration: this.state.quickTime,
      durationUnit: this.state.durationUnit
    })
    this.setState({
      quickDuration
    })
  }

  private quickTimeChange (e: any) {
    this.setState({
      quickTime: e.target.value
    })
  }

  private durationChange(durationUnit: any) {
    this.setState({
      durationUnit
    })
  }

  private beforeUpload(file: any) {
    const isMax = file.size / 1024 / 1024 < UPLOAD_MAX_SIZE;
    if (!isMax) {
      message.error(`图片最大上传${ UPLOAD_MAX_SIZE }MB!`);
    }
    return isMax
  }

  private onAreaBind(item) {
    this.setState({
      dataCenterAddressId: item[item.length - 1]
    })
  }

  private async getOrderAreaList() {
    let res = await getAreaList()
    if (res.code !== 200) {
      message.error(res.message)
      return
    }else{
      this.setState({
        areaList: res.data,
        defaultValue: [this.props.editInfo !== null ? this.props.editInfo.parentId : '', this.props.editInfo !== null ? this.props.editInfo.dataCenterAddressId : '']
      })
    }
    
  }

  render() {
    const { durationUnit, 
      virtralMachieTable, isCheckedTimequantum, channelList, durationUnitList, 
      realTimeTable, timeQuantumTable, quickDuration, smallFileList, bigFileList, 
      previewVisible, previewImage, uploadUrl,
      drawerVisible, dataCenterAddressId} = this.state
    const { editInfo, addProductTypeName } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const goodsColumns = [
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
      }
    ]

    const realTimeColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text: string, record: any, index: number) => <span>{(realTimeTable.currentPage - 1) * realTimeTable.pageSize + index + 1}</span>,
      },
      {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      }, {
        title: '时间段数',
        dataIndex: 'number',
        key: 'number',
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, item: any) => <Button type='link'>明细</Button>
      }]
    const timequantumColumns = [
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
      }, {
        title: '每天',
        dataIndex: 'daily',
        key: 'daily',
      }, {
        title: '每月',
        dataIndex: 'monthly',
        key: 'monthly',
      }, {
        title: '每年',
        dataIndex: 'annually',
        key: 'annually',
      }]
    
    const selectAfter = (
      <Select value={durationUnit} style={{ width: 80 }} onChange={this.durationChange.bind(this)}>
        {
          durationUnitList.map((item: any) => {
            return <Option disabled={item.state !== 1} key={item.serialNo} value={item.serialNo}>{item.name}</Option>
          })
        }
      </Select>
    )
    // const rowSelection = {
    //   type: 'radio',
    //   // columnTitle: "选择",
    //   // onSelect: (selectedRowKeys: any, selectedRows: any) => {
    //   //   console.log(selectedRowKeys, selectedRows)
    //   // },
    // };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const Footer = (<div className='flex-center flex-end'>
      
      {
        editInfo === null && <Button className={epStyle.topbtn} type="primary" onClick={this.editSave.bind(this, 0)}>存入草稿</Button>
      }
      {
        editInfo === null && <Button className={epStyle.topbtn} type="primary" onClick={this.editSave.bind(this, 1)}>立即发布</Button>
      }
      {
        editInfo !== null && <Button className={epStyle.topbtn} type="primary" onClick={this.editSave.bind(this, editInfo.state)}>保存</Button>
      }
      <Button className={epStyle.topbtn} onClick={this.handleCancel.bind(this)}>取消</Button>
    </div>)
      const headers: any = getUploadHeader()
    return (
      <Drawer
          title={editInfo === null ? '新建商品' : '编辑商品'}
        visible={drawerVisible}
        maskClosable={DIALOG_MASK_CLOSABLE}
        // onCancel={this.handleCancel.bind(this)}
          onClose={this.handleCancel.bind(this)}
        width={DIALOG_WIDTH}
          // footer={Footer}
        >
        <div className={`drawer-operation-btn`}>
          {Footer}
        </div>
          <Form {...formItemLayout} className="edit-form">
            <Card title="基础信息">
              <Row className='flex-center'>
                {
                addProductTypeName!=='' && <Col span={12}>
                 <p>商品类型：{ addProductTypeName }</p>
                </Col>
                }
                
              <Col span={addProductTypeName !== '' ? 12 : 24 }>
                  <Form.Item label='商品名称'>
                  {getFieldDecorator('name', {
                      initialValue: editInfo !== null ? editInfo.name : '',
                      rules: [{ required: true, message: '请输入商品名称' }],
                    })(
                      <Input
                        placeholder=""
                        maxLength={INPUT_MAXLENGTH}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label='名称'>
                    <Search
                      placeholder="名称"
                      maxLength={INPUT_MAXLENGTH}
                      onSearch={this.searchVm.bind(this)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='绑定地区' required>
                  <Cascader
                      onChange={this.onAreaBind.bind(this)}
                      placeholder="请选择绑定地区"
                      style={{ width: "150px" }}
                      defaultValue= {this.state.defaultValue}
                      options={this.state.areaList}
                      disabled={this.props.editInfo !== null && this.props.editInfo.state !== 0 ? true : false}
                    />
                  {/* {getFieldDecorator('dataCenterAddressId', {
                    initialValue: editInfo !== null ? editInfo.dataCenterAddressId : null,
                    rules: [{ required: true, message: '请选择绑定地区' }],
                })(
                    <Cascader
                      onChange={this.onAreaBind.bind(this)}
                      placeholder="请选择绑定地区"
                      style={{ width: "150px" }}
                      options={this.state.areaList}
                    />
                  )} */}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                {
                  editInfo === null && <Table 
                  scroll={{ x: true }}
                  rowKey='id' 
                  className='table' 
                  columns={goodsColumns} 
                  dataSource={virtralMachieTable.list} 
                  rowSelection={{ type: 'radio', selectedRowKeys: virtralMachieTable.selectRowKes, onSelect: (item) => this.vmRadioSelect(item) }} pagination={false}
                  onRow={(record: any) => {
                    return {
                      onClick: () => {
                        this.vmRadioSelect(record)
                      }
                    }
                  }}
                  />
                }

                {
                editInfo !== null && <Table scroll={{ x: true }} rowKey='id' className='table' columns={goodsColumns} dataSource={virtralMachieTable.list} pagination={false} />
                }
                {
                  editInfo === null && <Pagination className={epStyle.goodsGagination} current={virtralMachieTable.currentPage} total={virtralMachieTable.total} onChange={this.virtralMachieTablePageinChange.bind(this)} onShowSizeChange={this.virtralMachieTableshowSizeChange.bind(this)} pageSize={virtralMachieTable.pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${virtralMachieTable.total}条数据` }} />
                }
                
              </Row>
            </Card>
          <Card title="销售信息" className={`${epStyle.saleInfo}`}>
            <div className={`epStyle.realTime  none`}>
                <div className={`flex-center flex-start`}>
                  <Checkbox>实时计费</Checkbox>
                  <Search
                    className={epStyle.search}
                    placeholder="名称"
                    maxLength={INPUT_MAXLENGTH}
                  onSearch={this.searchRealTime.bind(this)}
                  />
                </div>
              <Table scroll={{ x: true }} rowKey='id' className={epStyle.table} columns={realTimeColumns} dataSource={realTimeTable.list} rowSelection={{ type: 'radio', onSelect: (item) => this.realTimeRadioSelect(item) }} pagination={false} />
              <Pagination className={epStyle.goodsGagination} current={realTimeTable.currentPage} total={realTimeTable.total} onChange={this.realTimeTablePageinChange.bind(this)} onShowSizeChange={this.realTimeTableShowSizeChange.bind(this)} pageSize={realTimeTable.pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${realTimeTable.total}条数据` }} />
              </div>
              
              <div className={epStyle.timeQuantum}>
                <div className={`flex-center flex-start`}>
                <Checkbox checked={isCheckedTimequantum} onChange={this.onTimeQuantumChange.bind(this)}>时长计费</Checkbox>
                  <Search
                    className={epStyle.search}
                    onSearch={this.searchTimequantum.bind(this)}
                    placeholder="名称"
                  />
                </div>
                {
                editInfo === null && <Table
                  scroll={{ x: true }}
                  rowKey='id'
                  className={epStyle.table}
                  columns={timequantumColumns}
                  dataSource={timeQuantumTable.list}
                  rowSelection={{ type: 'radio', selectedRowKeys: timeQuantumTable.selectRowKes, onSelect: (item) => this.timeQuantumRadioSelect(item) }}
                  pagination={false}
                  onRow={(record: any) => {
                    return {
                      onClick: () => {
                        this.timeQuantumRadioSelect(record)
                      }
                    }
                  }}
                />
                }

                {
                editInfo !== null && <Table
                  scroll={{ x: true }}
                  rowKey='id'
                  className={epStyle.table}
                  columns={timequantumColumns}
                  dataSource={timeQuantumTable.list}
                  pagination={false}
                  
                />
                }
                {
                  editInfo === null && <Pagination className={epStyle.goodsGagination} current={timeQuantumTable.currentPage} total={timeQuantumTable.total} onChange={this.timeQuantumTablePageinChange.bind(this)} onShowSizeChange={this.timeQuantumTableShowSizeChange.bind(this)} pageSize={timeQuantumTable.pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${timeQuantumTable.total}条数据` }} />
                }
                
                <div className={epStyle.quickDuration}>
                  <Row className='flex-center flex-start'>
                    {/* <Checkbox >快捷时长</Checkbox> */}
                    <div className={epStyle.quickTitle}>
                      <span className={epStyle.xin}>*</span>
                      快捷时长
                    </div>
                    
                    <div className={epStyle.quickList}>
                      {
                      quickDuration.map((item: any, index: number) => {
                          return <Tag
                            closable
                            onClose={() => { this.deleteTag(item) }}
                            key={item.duration + item.durationUnit}
                            >
                            {item.duration + ['天', '月', '年'][item.durationUnit-1]}
                          </Tag>
                        })
                      }
                    </div>
                  </Row>
                  <Row className={`${epStyle.addQuick} flex-center flex-start`}>
                    <div className={epStyle.addInput}>
                      <Input type='number' min={0} onChange={this.quickTimeChange.bind(this)} addonAfter={selectAfter} ></Input>
                    </div>
                    
                    <Button type='primary' icon='plus' onClick={this.addQuickTime.bind(this)}>添加</Button>
                  </Row>
                  <Row className={`${epStyle.customer} flex-center flex-start`}>
                    {/* <Checkbox>自定义时间长</Checkbox> */}
                  {getFieldDecorator('diyTime', {
                      initialValue: editInfo !== null ? editInfo.diyTime : '',
                      rules: [{ required: false, message: '请输入最小购买时长（天）' }],
                    })(
                      <InputNumber
                        min={0}
                        placeholder=""
                        className={epStyle.diyTime}
                      />,
                    )}
                    最小购买时长（天）
                  </Row>
                </div>
              </div>
            </Card>
          <Card title='图文信息' className='vendor-diver '>
              <Row>
                <Col span={24}>
                <Form.Item label={<span className={epStyle.itemLabel}><span className={epStyle.xin}>*</span>{`小图：支持上传Png、jpg、jpeg，最多上传8张，每张大小最多${UPLOAD_MAX_SIZE}M`}</span>}  labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
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
                      {smallFileList.length >= 8 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                <Form.Item label={<span className={epStyle.itemLabel}><span className={epStyle.xin}>*</span>{`大图：支持上传Png、jpg、jpeg，最多上传8张，每张大小最多${UPLOAD_MAX_SIZE}M`}</span>} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                    <Upload
                      action={uploadUrl}
                      data={{ type: UPLOAD_IMAGE_TYPE}}
                      listType="picture-card"
                      fileList={bigFileList}
                      onPreview={this.handlePreview.bind(this)}
                      onChange={this.handleBigChange.bind(this)}
                      beforeUpload={this.beforeUpload.bind(this)}
                      headers={headers}
                    >
                      {bigFileList.length >= 8 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label='使用说明' labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
              {getFieldDecorator('instructions', {
                initialValue: editInfo !== null ? editInfo.instructions : '',
                  rules: [{ required: true, message: '请输入使用说明' }],
                })(
                  <TextArea
                    placeholder=""
                    rows={5}
                  />,
                )}   
              </Form.Item>
            </Card>
          </Form>
          <Modal visible={previewVisible} footer={null} onCancel={this.closePriview}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
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
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_goods_edit' })(EditGoods)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)