import React from 'react'
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/es/form';

import { Input, Form, Table, Row, Col, Button, Pagination, Select, Modal, InputNumber, message } from 'antd';

import { 
  productList,
  queryDictList,
} from "../../../../../server/api"
import { DURATION_UNIT } from '../../../../../config/config'
import { codeInfoListFilter } from '../../../../../tools/tools'
const { Search } = Input;
const { Option } = Select;
interface IProps {
  serviceModalVisible: boolean,
  selecteddeviceNo:string,
  onClose: (val:any) => any,
  form:any,
}

interface IState {
  
}

class ServiceTable extends React.PureComponent<IProps, IState> {
  state: any={
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    name: "",
    productList: [],
    durationUnitList: [],
    selectedService: [],
    defaultUnitName: '',
  }
  componentDidMount() {
    this.productList();
    this.queryDictList();
  }
  private async queryDictList() {
    let params = {
      codeTypeNo: DURATION_UNIT,
      pageSize: 9999,
    }
    let res =  await queryDictList(params);
    if (res.code === 200) {
      res.data.dataList = codeInfoListFilter(res.data.dataList)
      this.setState({
        durationUnitList: res.data.dataList,
        defaultUnitName: res.data.dataList[0].serialNo
      })
    } else {
      message.error(res.message);
    }
  }
  private handleCancel() {
    this.props.onClose(null)
  }
  private handleOk() {
    this.props.form.validateFields((err:any, fieldsValue:any) => {
      if(err) return;
      if (this.state.selectedService) {
        let params = {
          "deviceNo": this.props.selecteddeviceNo,
          "productNo": this.state.selectedService.productNo,
          "duration": fieldsValue.duration,
          "durationUnit": fieldsValue.durationUnit,
        }
        this.props.onClose(params)
      } else {
        message.error("请选择服务");
      }
    });
  }
  private async productList() {
    let params = {
      name: this.state.name,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize
    }
    let res = await productList(params);
    if(res.code === 200 ){
      this.setState({
        totalCount: res.data.page.totalCount,
        productList: res.data.dataList
      })
      this.setState({
        selectedService: null
      })
    } else {
      message.error(res.message);
    }
  }
  private searchList(val:any) {
    this.setState({
      name: val
    },() => {
      this.productList()
    })
  }
  private paginationChange(val:number) {
    this.setState({
      currentPage: val
    },() => {
      this.productList()
    })
  }
 
  private selectedServiceRows(val:any) {
    this.setState({
      selectedService: val[0]
    })
  }
  
  render() {
    
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
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '产品编号',
        dataIndex: 'productNo',
      },
      {
        title: '渠道号',
        dataIndex: 'channelNo',
      },
      {
        title: '状态',
        dataIndex: 'state',
      }
    ];
    const rowSelection: any = {
      hideDefaultSelections: true,
      type: "radio",
      fixed: true,
      onChange:(selectedRowKeys:any, selectedRows:any) => {
        this.selectedServiceRows(selectedRows);
      }
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="服务选择"
          visible={this.props.serviceModalVisible}
          width={800}
          centered={true}
          maskClosable={false}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="back" onClick={this.handleCancel.bind(this)}>
              取消
            </Button>,
            <Button key="save" type="primary" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
              保存
            </Button>
          ]}
        >
          <Row gutter={[8, 16]}>
            <Col span={4}>云服务选择：</Col>
            <Col span={20}>
              <Search placeholder="商品名称" onSearch={this.searchList.bind(this)} enterButton />
            </Col>
          </Row>
          <Table
            scroll={{ x: true }}
            columns={columns}
            dataSource={this.state.productList}
            bordered
            pagination={false}
            rowSelection={rowSelection}
            rowKey="productNo"
          />
          <Pagination 
            showQuickJumper defaultCurrent={1} 
            size="small"
            onChange={this.paginationChange.bind(this)}
            current={this.state.currentPage}
            total={this.state.totalCount}/>
            <Form layout="inline">
              <Form.Item label="时长">
                { getFieldDecorator('duration', {
                  rules: [{ required: true, message: '请输入时长' }],
                  initialValue: 1
                })(
                  <InputNumber min={1}  />
                )}
              </Form.Item>
              <Form.Item label="单位">
                { getFieldDecorator('durationUnit', {
                  rules: [{ required: true, message: '请选择单位' }],
                  initialValue: this.state.defaultUnitName
                })(
                  <Select style={{ width: 120 }}>
                    {
                      this.state.durationUnitList.map((item:any) => {
                        return (<Option key={item.name} value={item.serialNo}>{item.name}</Option>)
                      })
                    }                
                  </Select>
                )}
              </Form.Item>
            </Form>
          {/* <Row gutter={[8, 16]}>
            <Col span={4}>默认自定义时长：</Col>
            <Col span={10}>
              时长：
              
            </Col>
            <Col span={10}>
              {
                this.state.durationUnitList[0] && 
                <Select defaultValue={this.state.durationUnitList[0].name} style={{ width: 120 }}>
                  {
                    this.state.durationUnitList.map((item:any) => {
                      return (<Option value={item.serialNo}>{item.name}</Option>)
                    })
                  }                
                </Select>
              }
              
            </Col>
          </Row> */}
        </Modal>
      </div>
    )
  }
}

interface stateType {
  isShowLoading: Boolean,
}
interface ComponentPropsInterface extends FormComponentProps {
  serviceModalVisible: boolean,
  selecteddeviceNo: string,
  onClose: (val:any) => any,
}
const orderForm = Form.create<ComponentPropsInterface>()(ServiceTable);
export default connect(
  (state: stateType) => ({
    isShowLoading: state.isShowLoading
  })
)(orderForm)
