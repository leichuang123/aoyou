import React from 'react'
import cdStyle from './card_detail.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../../interface/user'
import { Form, message, Input, Modal, Row, Table, Pagination } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { activeCodeList } from '../../../../../../server/api'
import { PAGE_SIZE } from '../../../../../../config/config'

const { Search } = Input

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: () => void,
  cardNo: number,
  awardId: number,
}

interface IState {
  currentPage: number,
  pageSize: number,
  total: number,
  detailList: any,
  exportParam: any,
  visible: boolean,
  open: boolean,
  code: string,
}

class CardDetail extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    exportParam: {},
    visible: false,
    open: false,
    detailList: [],
    code: ''
  }

  componentDidMount() {
    this.getCardCodeList()
  }

  private async getCardCodeList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      code: this.state.code,
      cardNo: this.props.cardNo,
      awardId: this.props.awardId,
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await activeCodeList(params)
    if (res.code === 200) {
      this.setState({
        total: res.data.page.totalCount,
        detailList: res.data.dataList
      })
    } else {
      message.error(res.message)
    }
  }

  private pageinChange(currentPage: number) {
    this.setState({
      currentPage
    }, () => {
      this.getCardCodeList()
    })
  }

  private showSizeChange(current: number, pageSize: number) {
    this.setState({
      currentPage: 1,
      pageSize
    }, () => {
      this.getCardCodeList()
    })
  }

  private handleOk() {
    this.props.onClose()
  }

  private handleCancel() {
    this.props.onClose()
  }

  private eidtSave() {

  }

  private searchCode(code: string) {
    this.setState({
      code,
    }, () => {
      this.getCardCodeList()
    })
   }

  render() {
    const { total, pageSize, detailList, currentPage } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text: string, record: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
      },
      // {
      //   title: '活动编号',
      //   dataIndex: 'activityNo',
      //   key: 'activityNo',
      // },
      
      {
        title: '激活卡号',
        dataIndex: 'cardNo',
        key: 'cardNo',
      },
      {
        title: '激活码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text: any, item: any) => <span>{['未激活', '已激活'][item.state]}</span>,
      },
      // {
      //   title: '会员昵称',
      //   dataIndex: 'userName',
      //   key: 'userName',
      // },
      // {
      //   title: '手机号',
      //   dataIndex: 'mobile',
      //   key: 'mobile',
      // },
      {
        title: '激活时间',
        dataIndex: 'activationTimeDesc',
        key: 'activationTimeDesc',
      }
    ];
    return (
      <Modal
        title="发放明细"
        visible={true}
        maskClosable={false}
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        width='800px'
      >
        <Form {...formItemLayout} className="edit-form" onSubmit={this.eidtSave.bind(this)}>
          
          <Row>
            <Search className={cdStyle.search} placeholder="激活码" onSearch={this.searchCode.bind(this)}></Search>
          </Row>
          <Row>
            <Table scroll={{ x: true }} rowKey='id' className='table vendor-diver' columns={columns} dataSource={detailList} pagination={false} />
            <Pagination className='vendor-diver' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
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
  onClose: () => void,
  cardNo: number,
  awardId: number,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_card_detail' })(CardDetail)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)