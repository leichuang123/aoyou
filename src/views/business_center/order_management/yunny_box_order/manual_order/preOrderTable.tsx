import React from 'react'
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/es/form';

import { Input, Form, Table, Row, Col, Pagination, message } from 'antd';

import { 
  getPreOrderList
} from "../../../../../server/api"
const { Search } = Input;
interface IProps {
  selected:(val:any, channelNo: number) => any,
}

interface IState {
  
}

class PreOrderTable extends React.PureComponent<IProps, IState> {
  state: any={
    currentPage: 1,
    pageSize: 10,
    preOrderList: [],
    totalCount: 0,
    searchPhoneNumber: ""
  }
  componentDidMount() {
    this.getPreOrderList();
  }
  private async getPreOrderList() {
    let params:any = {
      
      state: 1, // 已提交状态
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    }
    if (this.state.searchPhoneNumber !== '') {
      params.mobile = this.state.searchPhoneNumber
    }
    let res = await getPreOrderList(params);
    if (res.code === 200) {
      this.setState({
        preOrderList: res.data.dataList,
        totalCount: res.data.page.totalCount,
      })
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
  private onSearch() {
    this.getPreOrderList()
  }
  private onShowSizeChange(current:number, size: number) {
    this.setState({
      pageSize: size,
      currentPage: 1,
    },() => {
      this.getPreOrderList();
    })
  }
  private paginationChange(val:number) {
    this.setState({
      currentPage: val,
    },() => {
      this.getPreOrderList();
    })
  }
  private selectedPreOederRows(selectedRows:any) {
    this.props.selected(selectedRows[0].preOrderNo, selectedRows[0].channelNo)
  }
  render() {
    const rowSelection: any = {
      hideDefaultSelections: true,
      type: "radio",
      fixed: true,
      onChange:(selectedRowKeys:any, selectedRows:any) => {
        this.selectedPreOederRows(selectedRows);
      }
    }
    // const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        render: (text: any, record: any, index: number) => (
          <span>
            {(this.state.currentPage - 1) * this.state.pageSize + index + 1}
          </span>
        )
      },
      {
        title: '订单号',
        dataIndex: 'preOrderNo',
      },
      {
        title: '用户手机号',
        dataIndex: 'mobile',
      },
      {
        title: '总盒子数',
        dataIndex: 'number',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
    ];
    return (
      <div>
        <Row gutter={[8, 16]}>
          <Col span={20}>
          <Search placeholder="客户手机号" onSearch={this.onSearch.bind(this)} style={{width: 200}} value={this.state.searchPhoneNumber} onChange={this.formatNumber.bind(this)} maxLength={11} allowClear />
          </Col>
        </Row>
        <Table
          scroll={{ x: true }}
          columns={columns}
          dataSource={this.state.preOrderList}
          bordered
          pagination={false}
          size="small"
          rowSelection={rowSelection}
          rowKey="preOrderNo"
        />
        <Pagination 
          style={{marginTop: '10px'}}
          onShowSizeChange={this.onShowSizeChange.bind(this)} 
          showQuickJumper defaultCurrent={1} 
          showSizeChanger
          size="small"
          onChange={this.paginationChange.bind(this)}
          current={this.state.currentPage}
          total={this.state.totalCount}/>
      </div>
    )
  }
}

interface stateType {
  isShowLoading: Boolean,
}
interface ComponentPropsInterface extends FormComponentProps {
  selected: (val: any, channelNo: number) => any,
}
const orderForm = Form.create<ComponentPropsInterface>()(PreOrderTable);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(orderForm)
