import React from 'react'
import './new_user.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../interface/user'
import { Form, Button, DatePicker, Select, Table, Pagination, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN'
import { PlaceItem } from '../../interface/common'
import { newUserList, newUserListExport, singSelectList } from '../../server/api'
import { PAGE_SIZE } from '../../config/config'

const { Option } = Select;
const { RangePicker } = DatePicker;
interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function
}

interface placeListInfo {
  [index: number]: PlaceItem
}

interface IState {
  pageno: number,
  pagesize: number,
  startTime: number,
  endTime: number,
  placeNo: string,
  total: number,
  list: any,
  exportParam: any,
  placeList: placeListInfo,
}

class newUser extends React.PureComponent<IProps, IState> {

  state = {
    pageno: 1,
    pagesize: PAGE_SIZE,
    startTime: 0,
    endTime: 0,
    placeNo: '',
    total: 0,
    list: [],
    exportParam: {},
    placeList: [{
      dictionarykey: 0,
      dictionaryvalue: '全部',
      id: -1,
      status: 1,
      typeid: -1,
    }]
  }

  componentDidMount () {
    this.getSelectList()
  }

  async getSelectList () { // 测试环境传15
    let params = {
      typeid: 15
    }
    let res = await singSelectList(params)
    if (res.success === 'true') {
      this.setState({
        placeList: res.info.TDictionarydetailList,
        placeNo: res.info.TDictionarydetailList[0].dictionarykey
      }, () => {
        this.getList()
      })
    } else {
      message.error(res.msg)
    }
  }

  private handleSubmit () {
    this.setState({
      pageno: 1,
      list: []
    }, () => {
      this.getList()
    })
  }

  private async getList () {
    let params = {
      pageno: this.state.pageno,
      pagesize: this.state.pagesize,
      pageNo: this.state.pageno,
      pageSize: this.state.pagesize,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      placeNo: this.state.placeNo,
    }

    if (params.startTime * 1 === 0 && params.endTime * 1 === 0) {
      delete params.startTime
      delete params.endTime
    }

    if (params.pageno === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await newUserList(params)
    if (res.success === 'true') {
      if (!res.info.recordList) {
        res.info.recordList = res.info.retentionList || []
      }
      res.info.recordList.forEach((item: any, index: number) => {
        item.key = index
        
      })
      this.setState({
        total: res.info.count,
        list: res.info.recordList
      })
    } else {
      message.error(res.msg)
    }
  }

  private onDateChange (date: any) {
    this.setState({
      startTime: date.length > 0 ? new Date(date[0].format('YYYY/MM/DD') + ' 00:00:00').getTime() : 0,
      endTime: date.length > 0 ? new Date(date[1].format('YYYY/MM/DD') + ' 23:59:59').getTime() : 0
    })
  }

  private sourceChange (placeNo: any) {
    this.setState({
      placeNo
    })
  }

  private pageinChange (pageno: number) {
    this.setState({
      pageno
    }, () => {
      this.getList()
    })
  }

  private showSizeChange (current: number, pagesize: number) {
    this.setState({
      pageno: 1,
      pagesize
    }, () => {
      this.getList()
    })
  }

  private async exportList () {
    await newUserListExport(this.state.exportParam)
  }

  render () {
    const { list, pageno, total, placeList, pagesize } = this.state
    // const columns: any = [
	const columns = [
      {
		// align: "center",
        title: '时间',
        dataIndex: 'registerDate',
        key: 'registerDate',
        // eslint-disable-next-line
        // render: (text: string) => <a>{text}</a>,
      },
      {
		// align: "center",
        title: '新注册用户数',
        dataIndex: 'registerCount',
        key: 'registerCount',
      },
      {
		// align: "center",
        title: '用户来源',
        dataIndex: 'placeNo',
        key: 'placeNo',
      }
    ];
    return (
      <div className='new-user page'>
	  <div className="sk-pulse"></div>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <Form.Item label="时间段">
            <RangePicker locale={locale} onChange={this.onDateChange.bind(this)} placeholder={['开始时间', '结束时间']} format='YYYY-MM-DD'/>
          </Form.Item>
          <Form.Item label='用户来源'>
            <Select defaultValue={placeList[0].dictionarykey} style={{ width: 120 }} onChange={this.sourceChange.bind(this)}>
              {
                placeList.map(item => {
                  return <Option key={item.dictionarykey} value={item.dictionarykey}>{item.dictionaryvalue}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary"  onClick={this.handleSubmit.bind(this)}>
              搜索
            </Button>
            <Button type="primary" onClick={this.exportList.bind(this)} className='export-btn'>
              导出
            </Button>
          </Form.Item>
        </Form>
        <Table className='table' columns={columns} dataSource={list} pagination={false}/>
        <Pagination className='pagination' current={pageno} total={ total }  onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pagesize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据`}} />
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(newUser)