import React from 'react'
// import ucStyle from './user_coupon.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, message, Drawer, Row, Select, Table, Pagination } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { userCoupon } from '../../../../../server/api'
import { PAGE_SIZE } from '../../../../../config/config'

const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  userNo: String,
  onClose: () => void,
  type: Number,
}

interface IState {
  currentPage: number,
  pageSize: number,
  total: number,
  couponList: any,
  exportParam: any,
  visible: boolean,
  open: boolean,
  awardType: number,
}

class UserCouponInfo extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    startTime: 0,
    endTime: 0,
    total: 0,
    exportParam: {},
    visible: false,
    open: false,
    couponList: [],
    awardType: 1, // 激活卡: 1 水晶卷: 2 代金券: 3 体验卷: 4
  }

  componentDidMount() {
    this.getList()
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      awardType: this.state.awardType,
      userNo: this.props.userNo
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await userCoupon(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      total: res.data.page.totalCount,
      couponList: res.data.dataList
    })
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
    this.props.onClose()
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose()
  }

  private eidtSave() {

  }

  private awardTypeChange (awardType: number) {
    this.setState({
      awardType,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  private closeDrawer () {
    this.props.onClose()
  }

  render() {
    const { total, pageSize, couponList, currentPage, awardType } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let columns: any = []
    if (awardType === 1) {
      columns = [ // 后续需要根据内容切换表头
        {
          title: '活动编号',
          dataIndex: 'activityNo',
          key: 'activityNo',
        },
        {
          title: '激活卡名称',
          dataIndex: 'activationCardName',
          key: 'activationCardName',
        },
        {
          title: '激活卡编号',
          dataIndex: 'activationCardNo',
          key: 'activationCardNo',
        },
        {
          title: '激活码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '激活时间',
          dataIndex: 'activationTime',
          key: 'activationTime',
        },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          render: (text: any, item: any) => <span>{['未激活', '已激活', '激活中'][item.state]}</span>,
        }
      ]
    } else {
      columns = [
        {
          title: '活动编号',
          dataIndex: 'activityNo',
          key: 'activityNo',
        },
        {
          title: '卡券名称',
          dataIndex: 'cardName',
          key: 'cardName',
        },
        {
          title: '有效期',
          dataIndex: 'expireTime',
          key: 'expireTime',
          width: 220,
          render: (text: string, record: any, index: number) => <span>{
            record.type === 0 ? `领取后${record.validityReceive}天生效，有效天数${record.validityRange}天` : `${record.validityBegin} 至 ${record.validityEnd}`
          }</span>
        },
        {
          title: '卡券编号',
          dataIndex: 'cardNo',
          key: 'cardNo',
        },
        {
          title: '状态',
          dataIndex: 'state',
          key: 'state',
          render: (text: any, item: any) => <span>{['已失效', '生效中', '待发布'][item.state]}</span>,
        }
      ]
    }
    return (
      <Drawer
        title="优惠券"
        visible={true}
        maskClosable={true}
        // onOk={this.handleOk.bind(this)}
        // onCancel={this.handleCancel.bind(this)}
        onClose={this.closeDrawer.bind(this)}
        width='800px'
      >
        <Form {...formItemLayout} className="edit-form" onSubmit={this.eidtSave.bind(this)}>
          <Row>
            <Select style={{width: '200px'}} onChange={this.awardTypeChange.bind(this)} value={awardType}>
              <Option value={1}>激活卡</Option>
              <Option value={2}>水晶券</Option>
              <Option value={3}>代金券</Option>
              <Option value={4}>水晶券</Option>
            </Select>
          </Row>
          <Row>
            <Table 
              scroll={{ x: true }}
              className='table vendor-diver' 
              columns={columns} 
              dataSource={couponList} 
              pagination={false}
              rowKey="code"
            />
            <Pagination className='pagination vendor-diver' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
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
  onClose: () => void,
  userNo: any,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'user_coupon' })(UserCouponInfo)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)