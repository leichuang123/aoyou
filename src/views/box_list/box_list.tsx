import React from 'react'
// import blStyle from './box_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../interface/user'
import { Form, Button, Table, Pagination, message, Modal, Radio } from 'antd'
import { boxList, groupList, addDeviceToGroup } from '../../server/api'
import { PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE } from '../../config/config'

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  currentPage: number,
  pageSize: number,
  total: number,
  list: any,
  name: string,
  exportParam: any,
  visible: boolean,
  inputError: boolean,
  preSoftWare: string[],
  editInfo: any,
  radioList: any,
  radioValue: number,
  deviceNo: string,
  
}

class BoxList extends React.PureComponent<IProps, IState> {

  state: any = {
    currentPage: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    list: [],
    exportParam: {},
    visible: false,
    inputError: false,
    name: '',
    preSoftWare: new Array<string>(),
    editInfo: null,
    radioList: [],
    radioValue: -1,
    deviceNo: '',
    
  }

  componentDidMount() {
    this.getList()
    this.getGrouptList()
  }

  private handleSubmit() {
    this.setState({
      currentPage: 1,
      list: []
    }, () => {
      this.getList()
    })
  }

  private addVirtualMachine() {
    this.setState({
      visible: true,
    })
  }

  private async getList() {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      name: this.state.name
    }

    if (params.currentPage === 1) {
      this.setState({
        exportParam: params
      })
    }
    let res = await boxList(params)
    if (res.code === 200) {
      
      res.data.dataList.forEach((item: any, index: number) => {
        item.index = (this.state.currentPage - 1) * this.state.pageSize + index + 1
      })

      this.setState({
        total: res.data.page.totalCount,
        list: res.data.dataList,
      })
    } else {
      message.error(res.message)
    }
  }

  private async getGrouptList() {
    let params = {
      currentPage: MIN_PAGE,
      pageSize: MAX_PAGE_SIZE
    }

    let res = await groupList(params)
    if (res.code === 200) {
       this.setState({
         radioList: res.data.dataList.map((item: any) => {
           return {
             label: item.name,
             value: item.groupId
           }
         })
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

  private joinGroup(item: any) {
    this.setState({
      deviceNo: item.deviceNo,
      visible: true
    })
  }

  private searchVm(name = '') {
    if (name.trim() === '') {
      return
    }
    this.setState({
      name,
      currentPage: 1,
    }, () => {
      this.getList()
    })
  }

  private async handleOk () {
    if (this.state.radioValue === -1) {
      message.error('请先选择小组')
      return
    }
    let param = {
      groupId: this.state.radioValue,
      deviceNoList: [this.state.deviceNo]
    }
    let res = await addDeviceToGroup(param)
    if (res.code * 1 !== 200) {
      message.error(res.message || res.msg)
      return
    }
    this.setState({
      deviceNo: '',
      visible: false
    })
    this.getList()
  }

  private handleCancel () {
    this.setState({
      visible: false
    })
  }

  private radioChange (e: any) {
    this.setState({
      radioValue: e.target.value
    })
  }

  render() {
    const { list, currentPage, total, pageSize, radioList, radioValue, } = this.state
    // const columns: any = [
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '盒子串号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
      },
      {
        title: '绑定手机',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '激活时间',
        dataIndex: 'activateTime',
        key: 'activateTime',
      },
      {
        title: '激活码',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '虚拟主机ID',
        dataIndex: 'machineId',
        key: 'machineId',
      },
      {
        title: '归属小组',
        dataIndex: 'group',
        key: 'group',
        render: (text: any, item: any) =><span>{item.groupName || '无'}</span>
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text: any, item: any) => <div>{!item.groupId ? <Button onClick={this.joinGroup.bind(this, item)} type='link'>加入小组</Button> : null}</div>,
      }
    ]
    return (
      <div className='new-user page'>
        <div className="sk-pulse"></div>
        {/* <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <Form.Item label='虚拟机名称'>
            <Search
              placeholder=""
              onSearch={this.searchBox.bind(this)}
            />
          </Form.Item>
        </Form> */}
        <Table rowKey="index" className='table' columns={columns} dataSource={list} pagination={false} />
        <Pagination className='pagination' current={currentPage} total={total} onChange={this.pageinChange.bind(this)} onShowSizeChange={this.showSizeChange.bind(this)} pageSize={pageSize} showSizeChanger showQuickJumper showTotal={() => { return `共${total}条数据` }} />
        <Modal
          title="选择小组"
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width='600px'
        >
          <Radio.Group options={radioList} onChange={this.radioChange.bind(this)} value={radioValue} />
        </Modal>
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_vm_edit' })(BoxList)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)