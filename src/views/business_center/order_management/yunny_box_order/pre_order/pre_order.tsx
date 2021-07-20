import React from 'react'
import { connect } from 'react-redux';
import { Input, Button, Pagination, Table, message, Modal, Popconfirm } from 'antd';
import order from './pre_order.module.scss'

// import OrderModal from './orderModal'
import OrderDrawer from './orderDrawer'
import { IMAGE_PREFIX, SELL_CHANNEL } from '../../../../../config/config'

import { 
  getPreOrderList,
  preOrderSubmit,
  queryPreOrderByNo,
  cancelPreOrder,
  queryDictList,
  queryDataCenterList,
} from '../../../../../server/api'
// import { codeInfoListFilter } from '../../../../../tools/tools'
// const { confirm } = Modal;
const { Search } = Input;
interface IProps {
  dispatch: Function,
  
}

interface IState {
  searchPhoneNumber: string,
  searchState: number,
  currentPage: number,
  pageSize: number,
  orderList: any,
  totalCount: number,
  addOrderType: number,
  orderModalVisible: boolean,
  chosedOrder:any,
  detailVisible:boolean,
  preOrderDetiailValue: any,
  imgDetail: boolean,
  previewImage: any,
  sellChannelList: any,
  isViewOnly: boolean,
}

class PreOrder extends React.PureComponent<IProps, IState> {
  state:any = {
    // 请求列表参数
    searchPhoneNumber: "",
    searchState: 1,
    currentPage:  1,
    pageSize: 10,
    // 订单列表
    orderList: [],
    totalCount: 0,
    // 新建订单类型 0： 代销 1： 集采
    addOrderType: 0,
    orderModalVisible: false,
    chosedOrder: null,
    detailVisible: true,
    preOrderDetiailValue: null,
    imgDetail: false,
    previewImage: null,
    sellChannelList: [],
    isViewOnly: false,
  }

  componentDidMount () {
    this.getSellChanelList()
    this.getDataCenterList()
  }
    // 获取数据中心数据
    private async getDataCenterList(){
      let res = await queryDataCenterList()
      if(res.code == 200){
        this.setState({
          // orderList: res.data.dataList,
        })
      }else{
        message.error(res.message)
      }
    }
  
  // 获取订单列表
  private async getPreOrderList() {
    let params:any = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize
    }
    this.state.searchPhoneNumber && (params.mobile = this.state.searchPhoneNumber);
    let res = await getPreOrderList(params);
    // console.log('获取订单列表', res)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    res.data.dataList.forEach((item: any) => {
      this.state.sellChannelList.forEach((obj: any) => {
        if (item.channelNo === obj.serialNo) {
          item.channelName = obj.name
        }
      })
    })
    this.setState({
      orderList: res.data.dataList,
      totalCount: res.data.page.totalCount,
    })
  }
  // 预订单提交
  private async preOrderSubmit(val:any) {
    let params = {
      preOrderNo: val.preOrderNo
    }
    let res = await preOrderSubmit(params)
    if(res.code === 200) {
      this.getPreOrderList()
    } else {
      message.error(res.message);
    }
  }
  private formatNumber(e:any) {
    const { value } = e.target;
    this.setState({
      searchPhoneNumber: value.replace(/[^0-9]+/g,'')
    });
  }
  // 搜索 
  private onSearch() {
    this.getPreOrderList()
  }
  // 分页相关
  private paginationChange(val:number) {
    this.setState({
      currentPage: val,
    },() => {
      this.getPreOrderList();
    })
  }

  private async getSellChanelList() {
    let params = {
      codeTypeNo: SELL_CHANNEL,
      pageSize: 99999,
    }
    let res = await queryDictList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    // res.data.dataList =  codeInfoListFilter(res.data.dataList)
    this.setState({
      sellChannelList: res.data.dataList,
    }, () => {
        this.getPreOrderList()
    })
  }

  private onShowSizeChange(current:number, size: number) {
    this.setState({
      pageSize: size,
      currentPage: 1,
    },() => {
      this.getPreOrderList();
    })
  }
  private async editOrder(type: number, record:any, isViewOnly: any) {
    let params = {
      preOrderNo: record.preOrderNo
    }
    let res = await queryPreOrderByNo(params);
    if (res.code === 200) {
      if(record) {
        this.setState({
          isViewOnly,
          chosedOrder: res.data
        }, () => {
          this.toCreateOrder(res.data.type)
        })
      }
      
    } else {
      message.error(res.message);
    }
  }
  // 订单弹窗
  private toCreateOrder(type: number) {
    this.setState({
      orderModalVisible: true,
      addOrderType: type,
    })
    
  }
  private closeOrderModal() {
    this.setState({
      orderModalVisible: false,
      chosedOrder: null,
      isViewOnly: false
    })
  }
  // 详情弹窗
  private detailModalHandleCancel() {
    this.setState({
      detailVisible: false
    })
  }

  private async showDetail(val:any) {
    let params = {
      preOrderNo: val.preOrderNo
    }
    let res = await queryPreOrderByNo(params);
    if (res.code === 200) {
      this.setState({
        detailVisible: true,
      })
    } else {
      message.error(res.message);
    }
  }

  private async preOrderCancel(val: any) {
    let params = {
      preOrderNo: val.preOrderNo
    }
    let res = await cancelPreOrder(params);
    if(res.code === 200) {
      this.getPreOrderList()
      message.success("操作成功")
    } else {
      message.error(res.message);
    }
  }
  private formatState(state: number){
    let text = ""
    switch (state) {
      case 0:
        text = "新下单"
        break;
      case 1:
        text = "已提交";
        break;
      case 2:
        text = "已下单";
        break;
      case 3:
        text = "已绑定";
        break;
      case 4:
        text = "已结束";
        break;
      default:
        text = "未知状态"
        break;
    }
    return text;
  }
  private formatType(type:number) {
    return (<div>{type === 0 ? "代销订单" : "集采订单"}</div>)
  }
  private renderImgList(imgList:any) {
    return (
      <div>
        {
          imgList.map((item:any) => {
            return <img className={order.showimg} onClick={this.showImgDetail.bind(this,`${IMAGE_PREFIX}${item.url}`)} key={item.url} src={`${IMAGE_PREFIX}${item.url}`} alt={item.url}/>
          })
        }
        <Modal visible={this.state.imgDetail} footer={null} onCancel={this.hideImgDetail.bind(this)}>
          <img style={{ width: '100%' }} src={this.state.previewImage} alt='预览图' />
        </Modal>
      </div>
    )
  }
  private hideImgDetail(){
    this.setState({
      imgDetail: false,
    },() => {
      this.setState({
        previewImage: null,
      })
    })
  }
  private showImgDetail(url: any) {
    this.setState({
      imgDetail: true,
      previewImage: url,
    })
  }
  render () {    
    const columns:any = [
      {
        width: 100,
        title: '序号',
        dataIndex: 'index',
        render: (text: any, record: any, index: number) => (
          <span>
            {(this.state.currentPage - 1) * this.state.pageSize + index + 1}
          </span>
        )
      },
      {
        width: 200,
        title: '订单号',
        dataIndex: 'preOrderNo',
      },
      {
        title: '订单类型',
        dataIndex: 'type',
        width: 100,
        render: (text:number) => {
          return this.formatType(text)
        }
      },
      // {
      //   title: '数据中心',
      //   dataIndex: 'city',
      //   width: 100,
      // },
      {
        title: '用户手机号',
        dataIndex: 'mobile',
        width: 200,
      },
      {
        title: '盒子数量',
        dataIndex: 'number',
        width: 100,
      },
      {
        // width: 200,
        title: '创建时间',
        dataIndex: 'createTime',
      },
      {
        title: '创建人',
        dataIndex: 'createMan',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'state',
        width: 100,
        render: (text:number) => {
          return this.formatState(text)
        }
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: 150,
        fixed: 'right',
        render: (text:any, record: any) => {
          let button;
          if(record.state === 0) {
            button = (
              <div>
                <Button type="link" onClick={this.editOrder.bind(this,record.type, record, false)}>编辑</Button>
                <Popconfirm onConfirm={this.preOrderSubmit.bind(this, record)} title="确认提交？" okText="提交" cancelText="再想想">
                  <Button type="link">提交</Button>
                </Popconfirm>
              </div>
              )
          } else if(record.state === 1) {
            button = (
              <div>
                <Button type="link" onClick={this.editOrder.bind(this, record.type, record, true)}>详情</Button>
                <Popconfirm onConfirm={this.preOrderCancel.bind(this,record)} title="确认撤销？" okText="确定" cancelText="再想想">
                  <Button type="link">撤销</Button> 
                </Popconfirm>
              </div>
            )
          } else {
            button = (
              <Button type="link" onClick={this.editOrder.bind(this, record.type, record, true)}>详情</Button>
            )
          }
          return button;
        }
      }
    ];
    
    return (
      <div className={order.body}>
        <div className={order.nav}>
          <Search placeholder="客户手机号" onSearch={this.onSearch.bind(this)} style={{width: 200}} value={this.state.searchPhoneNumber} onChange={this.formatNumber.bind(this)} maxLength={11} allowClear />
          <div className={order.button_area}>
            <Button type="primary" onClick={this.toCreateOrder.bind(this,0)}>新建代销订单</Button>
            <Button type="primary" onClick={this.toCreateOrder.bind(this,1)}>新建集采订单</Button>
          </div>
        </div>
        <Table
          scroll={{ x: true }}
          rowKey="preOrderNo"
          columns={columns}
          dataSource={this.state.orderList}
          bordered
          pagination={false}
          size="middle"
          // scroll={{ x: 1200}}
        />
        <Pagination 
        className='vendor-diver'
        onShowSizeChange={this.onShowSizeChange.bind(this)} 
        showQuickJumper defaultCurrent={1} 
        showSizeChanger
        onChange={this.paginationChange.bind(this)}
        current={this.state.currentPage}
        total={this.state.totalCount}/>
        {
          this.state.orderModalVisible &&
          <OrderDrawer isViewOnly={this.state.isViewOnly} addOrderType={this.state.addOrderType} visible={this.state.orderModalVisible} refreshList={this.getPreOrderList.bind(this)} onClose={this.closeOrderModal.bind(this)} orderInfo={this.state.chosedOrder} />
        }
      </div>
    )
  }
}

interface stateType {
  isShowLoading: Boolean
}



export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(PreOrder)