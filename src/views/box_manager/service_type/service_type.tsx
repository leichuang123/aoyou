import React from 'react';
import stStyle from './service_type.module.scss';
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user';
import { setDeviceType, getBoxSetting, addDevice } from '../../../server/api';
import { STATEGY_0, STATEGY_1, STATEGY_2 } from '../../../config/config';
import { Form, Modal, Row, Radio, Table, message, Button, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import SelectUser from '../../SelectUser/SelectUser';
interface IProps {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    form: any;
    onClose: (isRefresh: boolean) => void;
    editInfo: any;
    deviceNo: string;
    isBindBox: Boolean;
}

interface IState {
    total: number;
    list: any;
    exportParam: any;
    visible: boolean;
    selectedRowKeys: any;
    strategy: number;
    checkList: any;
    showSelectUser: boolean;
    addDeviceNo: any;
}

class EditActive extends React.PureComponent<IProps, IState> {
    state = {
        total: 0,
        list: [],
        exportParam: {},
        visible: false,
        selectedRowKeys: [],
        strategy: -1,
        checkList: [false, false, false],
        showSelectUser: false,
        addDeviceNo: '',
    };

    componentDidMount() {
        // 是否为新增绑定设备入口
        if (this.props.isBindBox) {
            return;
        }
        this.getStrategy();
    }

    // 获取设备类型详情
    private async getStrategy() {
        const { deviceNo } = this.props;
        let res = await getBoxSetting({ deviceNo: deviceNo });
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        this.setState({
            strategy: res.data.strategy * 1,
            selectedRowKeys: res.data.employeeIds ? res.data.employeeIds : [],
            list: res.data.employees ? res.data.employees : [],
        });
    }
    // 保存
    private async save() {
        let params = {
            deviceNo: this.props.deviceNo,
            strategy: this.state.strategy,
            employeeIds: this.state.strategy * 1 === STATEGY_1 ? this.state.selectedRowKeys : [],
        };
        if (this.state.strategy * 1 === STATEGY_1 && !this.state.selectedRowKeys.length) {
            message.error('请指定使用者');
            return;
        }
        if (this.state.strategy === -1) {
            message.error('请选择服务类型');
            return;
        }
        if (this.props.isBindBox) {
            const { addDeviceNo } = this.state;
            if (addDeviceNo.trim() == '') {
                message.error('请输入设备串号');
                return;
            }
            this.addBoxer(params, addDeviceNo);
            return;
        }
        let res = await setDeviceType(params);
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        message.success('修改成功');
        this.props.onClose(true);
    }
    handleChange = (event: { target: { value: any } }) => {
        this.setState({
            addDeviceNo: event.target.value,
        });
    };
    // 新增设备
    private addBoxer = async (params: any, deviceNo: any) => {
        let res = await addDevice({ ...params, deviceNo: deviceNo });
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        message.success('新增成功');
        this.props.onClose(true);
    };
    private handleCancel() {
        this.props.onClose(false);
    }
    private radioChange(event: any) {
        this.setState({
            strategy: event.target.value,
        });
    }

    private radioUserChange(info: any) {
        this.setState({
            selectedRowKeys: [info.userNo],
            strategy: STATEGY_1,
        });
    }

    private selectRadio(strategy: number) {
        let selectedRowKeys = strategy === STATEGY_1 ? this.state.selectedRowKeys : [];
        this.setState({
            strategy,
            selectedRowKeys,
        });
    }
    // 选择使用者
    private showSelectUserCom = () => {
        this.setState({
            showSelectUser: true,
        });
    };
    private handleCancelSelectUser = () => {
        this.setState({
            showSelectUser: false,
        });
    };
    // 确认选择
    private onSaveUser = (selectedRowKeys: any, selectedRow: any) => {
        this.setState({
            selectedRowKeys: selectedRowKeys,
            list: selectedRow,
            showSelectUser: false,
        });
    };
    render() {
        const { isBindBox } = this.props;
        const { list, selectedRowKeys, strategy, showSelectUser } = this.state;
        const columns = [
            {
                title: '用户昵称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '部门',
                dataIndex: 'departmentNames',
                key: 'departmentNames',
            },
        ];
        // 策略 0:双无 1:双有 2:免密
        return (
            <div>
                <Modal
                    title={isBindBox ? '绑定设备' : '服务类型'}
                    visible={true}
                    maskClosable={false}
                    width="600px"
                    onCancel={this.handleCancel.bind(this)}
                    onOk={this.save.bind(this)}
                >
                    {!isBindBox ? (
                        <div></div>
                    ) : (
                        <div>
                            <h4>
                                设备串号
                                <Input
                                    placeholder="请输入设备串号"
                                    style={{ marginLeft: 20, width: 300 }}
                                    onChange={this.handleChange}
                                />
                            </h4>
                            <h4>服务类型</h4>
                        </div>
                    )}
                    <Row className="vendor-diver">
                        <Radio
                            value={STATEGY_1}
                            checked={strategy === STATEGY_1}
                            onClick={this.selectRadio.bind(this, STATEGY_1)}
                        >
                            <span>限定服务，指定使用者 </span>
                            {strategy === STATEGY_1 && (
                                <Button type="link" title="选择使用者" onClick={this.showSelectUserCom}>
                                    选择使用者
                                </Button>
                            )}
                            {strategy === STATEGY_1 ? (
                                <div>
                                    <Table
                                        rowKey="unionId"
                                        className={`vendor-diver ${stStyle.table}`}
                                        columns={columns}
                                        dataSource={list}
                                        size="small"
                                    ></Table>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </Radio>
                    </Row>
                    <Row>
                        <Radio
                            value={STATEGY_2}
                            checked={strategy === STATEGY_2}
                            onClick={this.selectRadio.bind(this, STATEGY_2)}
                        >
                            免密
                        </Radio>
                    </Row>
                    <Row className="vendor-diver">
                        <Radio
                            value={STATEGY_0}
                            checked={strategy === STATEGY_0}
                            onClick={this.selectRadio.bind(this, STATEGY_0)}
                        >
                            不指定使用者，不限定服务
                        </Radio>
                    </Row>
                    {/* </Radio.Group> */}
                </Modal>
                {showSelectUser && (
                    <SelectUser
                        selectedKeys={selectedRowKeys}
                        selectedList={list}
                        onClose={this.handleCancelSelectUser.bind(this)}
                        onSave={this.onSaveUser.bind(this)}
                    />
                )}
            </div>
        );
    }
}

interface stateType {
    user: userProps;
    isShowLoading: Boolean;
}

interface ComponentPropsInterface extends FormComponentProps {
    onClose: (isRefresh: boolean) => void;
    editInfo: null;
    deviceNo: '';
    isBindBox: false;
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(EditActive);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
