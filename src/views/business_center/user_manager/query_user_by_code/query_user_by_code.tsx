import React from 'react'

import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Table, message, Input } from 'antd'
import { queryUserByActiveCode } from '../../../../server/api'
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
  startTime: number,
  endTime: number,
  placeNo: string,
  total: number,
  list: any,
  exportParam: any,
  visible: boolean,
  open: boolean,
  isShowUserCoupon: boolean,
  mobile: string,
  userNo: string,
  code: string,
}

class QueryUserByCode extends React.PureComponent<IProps, IState> {

  state = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    startTime: 0,
    endTime: 0,
    placeNo: '',
    total: 0,
    list: [],
    mobile: '',
    exportParam: {},
    visible: false,
    open: false,
    timeList: [{
      startTime: '00:00',
      endTime: '23:59',
    }],
    isShowCategory: false, // 控制创建的第一个弹窗
    isShowEditDialog: false,
    isShowUserCoupon: false,
    userNo: '',
    code: '',
  }

  componentDidMount() {
    // this.getList()
  }

  private handleSubmit() {
    this.setState({
      currentPage: 1,
      list: []
    }, () => {
      this.getList()
    })
  }

  private async getList() {
    let params = {
      code: this.state.code.replace(/\s+/g, "") // 去除空格
    }

  
    let res = await queryUserByActiveCode(params)
    if (res.code !== 200) {
      message.error(res.message)
      this.setState({
        list: []
      })
      return
    }
    if (res.code === 200) {
      this.setState({
        total: 1,
        list: [res.data]
      })
    }
  }


  private search(code: any) {
    this.setState({
      code,
    }, () => {
      this.getList()
    })
  }

  render() {
    const { list } = this.state
    // const columns: any = [
    const columns: any = [
      {
        title: '昵称',
        dataIndex: 'userNickName',
        key: 'userNickName',
        width: 150,
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 150,
      },
      {
        title: '用户编号',
        dataIndex: 'userNo',
        key: 'userNo',
        width: 200,
      }
    ];
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        <Form layout="inline" className='search'>
          <div className='text-left'>
            <Form.Item label='激活码'>
              <Search
                placeholder=""
                maxLength={15}
                onSearch={this.search.bind(this)}
              />
            </Form.Item>
          </div>

        </Form>
        <Table
          // scroll={{ x: 1600 }}
          className='table'
          columns={columns}
          dataSource={list}
          pagination={false}
          rowKey="userNo"
        />
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_user_info' })(QueryUserByCode)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)