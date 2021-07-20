import React from 'react';
// import blStyle from './box_manager.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../interface/user';
import { Form, Button, Table, Pagination, message } from 'antd';
import { getDeviceList } from '../../server/api';
import { PAGE_SIZE } from '../../config/config';
import ServiceType from './service_type/service_type';

interface IProps {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    location: any;
    form: any;
}

interface IState {
    currentPage: number;
    pageSize: number;
    total: number;
    list: any;
    name: string;
    exportParam: any;
    visible: boolean;
    inputError: boolean;
    preSoftWare: string[];
    editInfo: any;
    radioList: any;
    radioValue: number;
    isShowServiceType: boolean;
    deviceNo: string;
    isBindBox: boolean;
}

class BoxManager extends React.PureComponent<IProps, IState> {
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
        isShowServiceType: false,
        deviceNo: '',
        isBindBox: false,
    };

    componentDidMount() {
        this.getList();
    }

    private handleSubmit() {
        this.setState(
            {
                currentPage: 1,
                list: [],
            },
            () => {
                this.getList();
            }
        );
    }

    private addVirtualMachine() {
        this.setState({
            visible: true,
        });
    }
    // 获取设备列表
    private async getList() {
        let params = {
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
        };
        if (params.currentPage === 1) {
            this.setState({
                exportParam: params,
            });
        }
        let res = await getDeviceList(params);
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        res.data.dataList.forEach((item: any, index: number) => {
            item.index = (this.state.currentPage - 1) * this.state.pageSize + index + 1;
        });
        this.setState({
            total: res.data.page.totalCount,
            list: res.data.dataList,
        });
    }

    private pageinChange(currentPage: number) {
        this.setState(
            {
                currentPage,
            },
            () => {
                this.getList();
            }
        );
    }

    private showSizeChange(current: number, pageSize: number) {
        this.setState(
            {
                currentPage: 1,
                pageSize,
            },
            () => {
                this.getList();
            }
        );
    }

    private joinGroup(item: any) {
        this.setState({
            editInfo: item,
            visible: true,
        });
    }

    private searchVm(name = '') {
        if (name.trim() === '') {
            return;
        }
        this.setState(
            {
                name,
                currentPage: 1,
            },
            () => {
                this.getList();
            }
        );
    }

    private handleOk() {
        this.setState({
            visible: false,
        });
    }

    private handleCancel(type: any) {
        this.setState({
            isShowServiceType: false,
        });
        if (type) {
            this.getList();
        }
    }
    // 绑定设备
    private bindBox = () => {
        this.setState({
            isBindBox: true,
            isShowServiceType: true,
        });
    };
    // 设置服务类型
    private async showServiceType(info: any) {
        this.setState({
            isBindBox: false,
            deviceNo: info.deviceNo,
            isShowServiceType: true,
        });
    }
    render() {
        const { list, currentPage, total, pageSize, editInfo, isShowServiceType, deviceNo, isBindBox } = this.state;
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
                title: '激活时间',
                dataIndex: 'activateTime',
                key: 'activateTime',
            },
            {
                title: '绑定手机',
                dataIndex: 'mobile',
                key: 'mobile',
            },

            {
                title: '激活码',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text: any, item: any) => (
                    <div>
                        <Button type="link" onClick={this.showServiceType.bind(this, item)}>
                            服务类型
                        </Button>
                    </div>
                ),
            },
        ];
        return (
            <div className="new-user page">
                <div className="sk-pulse"></div>
                <div>
                    <Button type="primary" style={{ marginBottom: 10 }} onClick={this.bindBox}>
                        绑定设备
                    </Button>
                </div>
                {/* <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <Form.Item label='虚拟机名称'>
            <Search
              placeholder=""
              onSearch={this.searchBox.bind(this)}
            />
          </Form.Item>
        </Form> */}
                <Table rowKey="deviceNo" className="table" columns={columns} dataSource={list} pagination={false} />
                <Pagination
                    className="pagination"
                    current={currentPage}
                    total={total}
                    onChange={this.pageinChange.bind(this)}
                    onShowSizeChange={this.showSizeChange.bind(this)}
                    pageSize={pageSize}
                    showSizeChanger
                    showQuickJumper
                    showTotal={() => {
                        return `共${total}条数据`;
                    }}
                />
                {isShowServiceType && (
                    <ServiceType
                        isBindBox={isBindBox}
                        deviceNo={deviceNo}
                        editInfo={editInfo}
                        onClose={this.handleCancel.bind(this)}
                    ></ServiceType>
                )}
            </div>
        );
    }
}

interface stateType {
    user: userProps;
    isShowLoading: Boolean;
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_box_manager' })(BoxManager);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
