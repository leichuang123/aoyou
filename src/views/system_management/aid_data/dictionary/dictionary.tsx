import React from 'react'
import dictStyle from './dictionary.module.scss'
import { connect } from 'react-redux';
import { Input, Button, Form, Select, Pagination, Table, Modal, message } from 'antd';
// import locale from 'antd/es/date-picker/locale/zh_CN'
import DictTypeForm from './dictTypeForm'
import DictDetailForm from './dictDetailForm'
import { 
  queryDictType,
  queryDictList,
  addDictType,
  editDictType,
  addDictDetail,
  editDictDetail
} from '../../../../server/api'
const { Option } = Select;
const { Search } = Input;
// const { RangePicker } = DatePicker;
let dictTypeFormRef:any = null
let dictDetailFormRef:any  = null
interface IProps {
  dispatch: Function,
  form: any,
}

interface IState {
  expandedRowList: any,
  detailAboutModalInitValue: any,
  [item: string]:any
  
}

class Dictionary extends React.PureComponent<IProps, IState> {
  state = {
    isUseful: '全部',
    addDictionaryModalVisible: false,
    addDictionaryModalLoading: false,
    detailAboutModalVisible: false,
    detailAboutModalLoading: false,
    dictTypeModalInitValue: null,
    detailAboutModalInitValue: null,
    dictTypeList: [], // 表格-字典类型列表
    dictTypeSearchName: '',
    dictTypeListTotalCount: 0, // 表格-字典类型总数
    dictTypeState: -1, // 表格-字典类型状态
    dictTypeCurrentPage: 1, // 表格-字典类型当前页码
    dictTypePageSize: 10, // 表格-字典类型展示的条数
    expandedRowList:{}, // 子表格数据
    
  }

  private stateFilter(state: number = 1) {
    return state ? '有效' : '无效'
  }

  private usedTypeChange(val:any) {
    this.setState({
      dictTypeState: val,
      dictTypeCurrentPage: 1
    },() => {
      this.queryDictType();
    })
  }


  componentDidMount () {
    
    this.queryDictType()
  }
  // 搜索回车
  private dictTypeSearch(val:any) {
    this.setState({
      dictTypeSearchName: val,
      dictTypeCurrentPage: 1
    },() => {
      this.queryDictType();
    })
  }
  // 查询字典类型列表
  private async queryDictType() {
    let params:any = {
      
      currentPage: this.state.dictTypeCurrentPage,
      pageSize: this.state.dictTypePageSize,
    }
    if (this.state.dictTypeSearchName) {
      params.name = this.state.dictTypeSearchName
    } 
    if (this.state.dictTypeState !== -1) {
      params.state = this.state.dictTypeState
    }
    
      
    const res = await queryDictType(params);
    if(res.code === 200) {
      this.setState({
        dictTypeList: res.data.dataList,
        dictTypeListTotalCount: res.data.page.totalCount
      });
    }
  }

  private async queryDictList(val: any) {
    const codeTypeNo = val.codeTypeNo;
    
    let params = {
      codeTypeNo: codeTypeNo,
      currentPage: 1,
      pageSize: 99999
    }
    const res = await queryDictList(params);
    if(res.code === 200) {
      let list:any = [];
      res.data.dataList.forEach((item:any) => {
        item.codeTypeNo = val.typeNo
        list.push(item)
      })
      return {[val.id]: list}
    } else {
      return {}
    }
  }

  // 显示新建字典弹窗
  private editDictionary(value:any) {
    
    this.setState({
      addDictionaryModalVisible: true,
      dictTypeModalInitValue: value
    })
  }
  
  private editDetail(pNode:any,cNode:any = null) {
    
    if (cNode) {
      pNode.cNode = cNode
    } else {
      pNode.cNode = null
    }
    this.setState({
      detailAboutModalInitValue: pNode,
      detailAboutModalVisible: true,
    })
    
  }
  // 新建字典类型
  private async addDictType(val: object) {
    let params = val;
    const res = await addDictType(params);
    this.setState({
      addDictionaryModalLoading: false
    })
    if (res.code === 200) {
      this.setState({ 
        addDictionaryModalVisible: false ,
        dictTypeCurrentPage: 1,
      },() => {
        dictTypeFormRef.props.form.resetFields()
        this.queryDictType()
      });
    } else {
      message.error(res.message)
    }
    this.setState({
      addDictionaryModalLoading: false, 
    })
  }
  // 修改字典类型
  private async editDictType(val: any) {
    let params = {
      state: val.state,
      id: val.id
    }
    let res = await editDictType(params);
    if(res.code === 200) {
      this.setState({
        addDictionaryModalLoading: false,
      })
      this.addDictionaryHandleCancel();
      this.queryDictType()
    } else {
      message.error(res.message)
    }
  }
  private dictionaryTypeHandleOk = () => {
    dictTypeFormRef.props.form.validateFields((err:any, fieldsValue:any) => {
      if (err) return;
      this.setState({ addDictionaryModalLoading: true });
      fieldsValue.state = fieldsValue.state ? 1 : 0;
      if(this.state.dictTypeModalInitValue) {
        this.editDictType(Object.assign({}, this.state.dictTypeModalInitValue, fieldsValue))
      } else {
        this.addDictType(fieldsValue);
      }
    });
  }

  private addDictionaryHandleCancel = () => {
    dictTypeFormRef.props.form.resetFields()
    this.setState({ 
      addDictionaryModalVisible: false,
      dictTypeModalInitValue: null
    });
    dictTypeFormRef.props.form.resetFields()
  }

  // 新建字典详情
  private async addDictDetail(val: any) {
    let detailAboutModalInitValue:any = this.state.detailAboutModalInitValue
    
    let params = {
      codeTypeNo: detailAboutModalInitValue.codeTypeNo,
      name: val.name,
      serialNo: val.serialNo,
      state: val.state ? 1 : 0,
    };
    const res = await addDictDetail(params);
    this.setState({
      detailAboutModalLoading: false
    })
    if (res.code === 200) {
      this.setState({ 
        detailAboutModalLoading: false, 
        detailAboutModalVisible: false ,
      });
      dictDetailFormRef.props.form.resetFields()
      let expandedRowList:any = this.state.expandedRowList
      this.setState({
        expandedRowList: Object.assign({}, expandedRowList, await this.queryDictList(detailAboutModalInitValue)) 
      })
    } else {
      message.error(res.message)
    }
  }
  // 编辑字典详情
  private async editDictDetail(pNode:any, newVal: any) {
    let params = {
      codeTypeNo: pNode.codeTypeNo,
      name: newVal.name,
      serialNo: newVal.serialNo,
      state: newVal.state ? 1 : 0,
      id: pNode.cNode.id
    }
    let res = await editDictDetail(params);
    if(res.code === 200) {
      this.setState({ 
        detailAboutModalLoading: false, 
        detailAboutModalVisible: false ,
      });
      dictDetailFormRef.props.form.resetFields()
      let expandedRowList:any = this.state.expandedRowList
      
      this.setState({
        expandedRowList: Object.assign({}, expandedRowList, await this.queryDictList(pNode)) 
      })
    } else {
      message.error(res.message)
    }
  }
  private dictionaryDetailHandleOk = (val:any) => {
    this.setState({ detailAboutModalLoading: true });
    dictDetailFormRef.props.form.validateFields((err:any, fieldsValue:any) => {
      if (err) return;
      let detailAboutModalInitValue:any = this.state.detailAboutModalInitValue;
      if(detailAboutModalInitValue.cNode) {
        this.editDictDetail(detailAboutModalInitValue,fieldsValue)
      } else {
        this.addDictDetail(fieldsValue)
      }
    });
  }

  private dictionaryDetailHandleCancel = () => {
    this.setState({ 
      detailAboutModalVisible: false,
      detailAboutModalInitValue: null,
    });
    dictDetailFormRef.props.form.resetFields()
  }
  private async onExpand(e:any,val:any) {
    if (e) {
      let expandedRowList:any = this.state.expandedRowList
      this.setState({
        expandedRowList: Object.assign({}, expandedRowList, await this.queryDictList(val)) 
      })
    }
  }
  // 分页器每页展示数量改变
  private onShowSizeChange(current:number, size:number) {
    this.setState({
      dictTypeCurrentPage: 1,
      dictTypePageSize: size
    },() => {
      this.queryDictType()
    })
  }
  // 分页器change
  private paginationChange(page:number) {
    this.setState({
      dictTypeCurrentPage: page
    },() => {
      this.queryDictType()
    })
    
  }
  private expandedRowRender = (record:any,) => {
    const columns:any = [
      // { title: '序号', dataIndex: 'id', key: 'id' },
      { title: '名称', dataIndex: 'name', key: 'name' },
      { title: '编号', dataIndex: 'serialNo', key: 'serialNo' },
      { title: '是否可用', 
        dataIndex: 'state', 
        key: 'state',
        render: (text:any, record:any) => (
          <div>{this.stateFilter(text)}</div>
        )
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        // fixed:'right',
        render: (text:any, rowVaule:any) => (
          <Button type="link" onClick={this.editDetail.bind(this, record, rowVaule)}>编辑</Button>
        ),
      },
    ];
    
    
    return <Table scroll={{ x: true }} size="small" rowKey={(record:any) => record.id} columns={columns} dataSource={this.state.expandedRowList[record.id]} />;
  };

  render () {
    const { isUseful } = this.state
    const columns:any = [
      { title: '序号', dataIndex: 'id', key: 'id',
        render: (text: any, record: any, index: number) => (
          <span>
            {(this.state.dictTypeCurrentPage - 1) * this.state.dictTypePageSize + index + 1}
          </span>
        ),
      },
      { title: '字典类型', dataIndex: 'name', key: 'name' },
      { title: '字典编号', dataIndex: 'codeTypeNo', key: 'codeTypeNo' },
      {
        title: '是否可用',
        dataIndex: 'state',
        key: 'state',
        render: (text: any, record: any) => (
          <div>{this.stateFilter(text)}</div>
        )
      },
      {
        title: '操作',
        dataIndex: 'operating',
        key: 'operating',
        width: '200px',
        render: (text: any, record: any) => (
          <div>
            <Button type="link" onClick={this.editDictionary.bind(this, record)}>编辑</Button>
            <Button type="link" onClick={this.editDetail.bind(this, record, null)}>添加明细</Button>
          </div>
        ),
      },
    ]
    // const { getFieldDecorator } = this.props.form;
    let detailAboutModalInitValue:any = this.state.detailAboutModalInitValue
    let editDetailTiele = "新增"
    if (detailAboutModalInitValue) {
      editDetailTiele = detailAboutModalInitValue.isCreate ? "新增" : "修改"
    }
    return (
      <div className={dictStyle.body}>
        <div className={dictStyle.nav}>
          <div>
            <Search onSearch={this.dictTypeSearch.bind(this)} style={{ width: 180 }} allowClear  placeholder="字典类型" />
            <span style={{marginLeft: '20px'}}>
              是否有效：
              <Select defaultValue={isUseful} style={{ width: 120 }} onChange={this.usedTypeChange.bind(this)}>
                <Option value={-1}>全部</Option>
                <Option value={1}>有效</Option>
                <Option value={0}>无效</Option>
              </Select>
            </span>
          </div>
          <Button type="primary" onClick={this.editDictionary.bind(this, null)}>新建字典</Button>
        </div>
        <div>
        <Table
          scroll={{ x: true }}
          rowKey="codeTypeNo"
          columns={columns}
          bordered
          size="small"
          onExpand={this.onExpand.bind(this)}
          expandedRowRender={this.expandedRowRender}
          dataSource={this.state.dictTypeList}
          pagination={false}
        />
        {
          <Pagination
          className='vendor-diver' 
          showSizeChanger 
          onShowSizeChange={this.onShowSizeChange.bind(this)} 
          showQuickJumper defaultCurrent={1} 
          onChange={this.paginationChange.bind(this)}
          current={this.state.dictTypeCurrentPage}
          total={this.state.dictTypeListTotalCount}/>
        }
        </div>
        <Modal
          maskClosable={false}
          visible={this.state.addDictionaryModalVisible}
          title={`${this.state.dictTypeModalInitValue ? "编辑" : "新建"}字典`}
          onOk={this.dictionaryTypeHandleOk}
          onCancel={this.addDictionaryHandleCancel}
          width={"300px"}
          footer={[
            <Button key="back" onClick={this.addDictionaryHandleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={this.state.addDictionaryModalLoading} onClick={this.dictionaryTypeHandleOk}>
              保存
            </Button>,
          ]}>
            <DictTypeForm
              wrappedComponentRef={(form:any) => dictTypeFormRef = form}
              dictTypeModalInitValue={this.state.dictTypeModalInitValue}
            />
        </Modal>
        <Modal
          maskClosable={false}
          visible={this.state.detailAboutModalVisible}
          title={`${editDetailTiele}明细`}
          onOk={this.dictionaryDetailHandleOk}
          onCancel={this.dictionaryDetailHandleCancel}
          footer={[
            <Button key="back" onClick={this.dictionaryDetailHandleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" loading={this.state.detailAboutModalLoading} onClick={this.dictionaryDetailHandleOk}>
              保存
            </Button>
          ]}>
          <DictDetailForm detailAboutModalInitValue={this.state.detailAboutModalInitValue} wrappedComponentRef={(form:any) => dictDetailFormRef = form} />
        </Modal>
      </div>
    )
  }
}

interface stateType {
  // user: userProps,
  isShowLoading: Boolean
}

const dictForm = Form.create({ name: 'add_dict_form' })(Dictionary)


export default connect(
  (state: stateType) => ({
    // user: state.user,
    isShowLoading: state.isShowLoading
  })
)(dictForm)