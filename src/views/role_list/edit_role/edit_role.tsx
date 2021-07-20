import React from 'react';
// import erStyle from './edit_role.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user';
import { Form, message, Input, Modal, Row, Col, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { editCompanyRole, addCompanyRole } from '../../../server/api';
import { PAGE_SIZE } from '../../../config/config';

const { Option } = Select;
const { TextArea } = Input;

interface IProps {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    form: any;
    onClose: (isRefresh: boolean) => void;
    editInfo: any;
}

interface IState {
    currentPage: number;
    pageSize: number;
    total: number;
    editList: any;
    exportParam: any;
    visible: boolean;
    open: boolean;
    unitList: any;
    unit: any;
    name: string;
    selectProductNo: string;
}

class EditRole extends React.PureComponent<IProps, IState> {
    state = {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        total: 0,
        exportParam: {},
        visible: false,
        open: false,
        editList: [],
        unit: '',
        unitList: [],
        name: '',
        selectProductNo: '',
    };

    componentDidMount() {}
    // 确认编辑
    private handleOk() {
        this.props.form.validateFields(async (err: any, data: any) => {
            if (err) {
                return;
            }

            let params: any = {};
            Object.assign(params, data);
            let res = null;
            if (this.props.editInfo === null) {
                params.companyCode = localStorage.getItem('companyCode');
                res = await addCompanyRole(params);
            } else {
                Object.assign(params, { id: this.props.editInfo.id });
                res = await editCompanyRole(params);
            }
            if (res.code === 200) {
                message.success('保存成功！');
                this.props.form.resetFields();
                this.props.onClose(true);
            } else {
                message.error(res.message);
            }
        });
    }
    // 取消编辑
    private handleCancel() {
        this.props.form.resetFields();
        this.props.onClose(false);
    }

    private eidtSave() {}

    private onUnitChange(unit: any) {
        this.setState({
            unit,
        });
    }

    private productSelect(item: any) {
        this.setState({
            selectProductNo: item.productNo,
        });
    }
    render() {
        // const {  } = this.state
        const { getFieldDecorator } = this.props.form;
        const { editInfo } = this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Modal
                title={editInfo === null ? '新建角色' : '编辑角色'}
                visible={true}
                maskClosable={false}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                width="800px"
            >
                <Form {...formItemLayout} className="edit-form" onSubmit={this.eidtSave.bind(this)}>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="角色名称">
                                {getFieldDecorator('name', {
                                    initialValue: editInfo !== null ? editInfo.name : '',
                                    rules: [{ required: true, message: '请输入角色名称' }],
                                })(<Input placeholder="最多8个字" maxLength={8} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="状态">
                                {getFieldDecorator('status', {
                                    initialValue: editInfo !== null ? editInfo.status : '',
                                    rules: [{ required: true, message: '请选择状态' }],
                                })(
                                    <Select>
                                        <Option value={1}>可用</Option>
                                        <Option value={0}>不可用</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="角色说明" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                                {getFieldDecorator('description', {
                                    initialValue: editInfo !== null ? editInfo.description : '',
                                    rules: [
                                        { required: true, message: '请输入角色说明' },
                                        { max: 200, message: '最大长度120个字' },
                                    ],
                                })(<TextArea rows={5} maxLength={200} placeholder="最多120个字" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
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
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_role_edit' })(EditRole);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
