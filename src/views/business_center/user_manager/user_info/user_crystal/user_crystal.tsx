import React from 'react'
import ucStyle from './user_crystal.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { Form, message, Drawer, Row, Select, Table, Pagination } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { userCrystalList } from '../../../../../server/api'
import { PAGE_SIZE } from '../../../../../config/config'

const { Option } = Select

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  userNo: '',
  onClose: () => void
}

interface IState {
  currentPage: number,
  pageSize: number,
  placeNo: string,
  total: number,
  crystalList: any,
  exportParam: any,
  visible: boolean,
  open: boolean,
  type: number,
}

class UserCrystal extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    placeNo: '',
    total: 0,
    exportParam: {},
    visible: false,
    open: false,
    type: -1, // 0充值  消费1
    crystalList: []
  }

  componentDidMount() {
    this.getList()
  }

  private async getList() {
    let params: any = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      userNo: this.props.userNo,
    }

    if (this.state.type !== -1) {
      params.type = this.state.type
    }


    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await userCrystalList(params)
    if (res.code === 200) {
      this.setState({
        total: res.data.page.totalCount,
        crystalList: res.data.dataList
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
    this.props.onClose()
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose()
  }

  private eidtSave() {

  }

  private selectChange (type: any) {
    this.setState({
      type,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  render() {
    const { total, pageSize, crystalList, currentPage, type } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let columns = [
      {
        title: '类型',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '金额',
        dataIndex: 'changeAmount',
        key: 'changeAmount',
      },
      {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
      }
    ]
    return (
      <Drawer
        title="用户水晶"
        visible={true}
        maskClosable={true}
        // onOk={this.handleOk.bind(this)}
        // onCancel={this.handleCancel.bind(this)}
        onClose={this.handleCancel.bind(this)}
        width='800px'
      >
        <Form {...formItemLayout} className="edit-form" onSubmit={this.eidtSave.bind(this)}>
          <Row>
            <Select className={ucStyle.select} onChange={this.selectChange.bind(this)} value={type}>
              <Option value={-1}>全部</Option>
              <Option value={0}>充值</Option>
              <Option value={1}>消费</Option>
            </Select>
          </Row>
          <Row>
            <Table
              scroll={{ x: true }}
              className='table vendor-diver' 
              columns={columns} 
              dataSource={crystalList} 
              pagination={false} 
              rowKey=""
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

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'user_crystal' })(UserCrystal)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)