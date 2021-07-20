import React from 'react';
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user';
import { Form, Col, Row, Input, Drawer, Button, Select, TreeSelect } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import addStyle from './AddMember.module.scss';
import { getRoleOption } from '../../../server/api';
import { debounce } from '../../../tools/tools';

const { Option } = Select;
const { TreeNode } = TreeSelect;

interface IProps {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    form: any;
    addMemberInfo: any;
    onClose: Function;
    onSave: Function;
    organizationStructureData: any;
    platformType: any;
}

interface IState {
    inputError: boolean;
    roleOption: any[];
    timer: any;
}

class AddMember extends React.PureComponent<IProps, IState> {
    state: any = {
        inputError: false,
        roleOption: [],
        timer: null,
    };
    // 生成树结构函数
    private renderTreeNode = (data: any[]) => {
        if (data.length == 0) {
            return;
        }
        return data.map((item) => {
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode title={item.title} value={item.key} key={item.key}>
                        {this.renderTreeNode(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} value={item.key}></TreeNode>;
        });
    };
    componentDidMount() {
        this.getRoleList();
    }
    // 获取角色下拉数据
    private getRoleList = async () => {
        let res = await getRoleOption();
        if (res.code == 200) {
            this.setState({
                roleOption: res.data,
            });
        }
    };
    private handleOkInvite = () => {
        this.props.onSave();
    };

    private handleCancelInvite = () => {
        this.props.onClose();
    };
    render() {
        const { addMemberInfo, platformType } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        };
        const formItemLayout1 = {
            labelCol: { span: 9 },
            wrapperCol: { span: 12 },
        };
        const { roleOption } = this.state;
        return (
            <div>
                <Drawer
                    title={addMemberInfo.unionId ? '编辑成员' : '添加成员'}
                    width={600}
                    onClose={this.handleCancelInvite}
                    visible={true}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Form layout="inline">
                        <div className={addStyle.c_action_content}>成员信息</div>
                        <Row>
                            <Col>
                                <Form.Item label="姓名" {...formItemLayout}>
                                    {getFieldDecorator('name', {
                                        initialValue: addMemberInfo.name,
                                        rules: [{ required: true, message: '请输入姓名' }],
                                    })(
                                        <Input
                                            placeholder="请输入姓名"
                                            style={{ width: 290 }}
                                            disabled={platformType !== 10}
                                            title={
                                                platformType !== 10
                                                    ? '不允许修改来自第三方平台的组织架构信息'
                                                    : '请输入姓名'
                                            }
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        {!addMemberInfo.unionId ? (
                            <div>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label="手机号" {...formItemLayout1}>
                                            {getFieldDecorator('mobile', {
                                                initialValue: addMemberInfo.mobile,
                                                rules: [
                                                    { required: true, message: '请输入手机号' },
                                                    {
                                                        pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                                                        message: '请输入正确的手机号',
                                                    },
                                                ],
                                            })(
                                                <Input
                                                    placeholder="请输入手机号"
                                                    type="number"
                                                    style={{ width: 290, marginLeft: 3 }}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <Form.Item label="部门" {...formItemLayout}>
                                    {getFieldDecorator('departmentIds', {
                                        initialValue: addMemberInfo.departmentIds,
                                        rules: [{ required: true, message: '请选择部门' }],
                                    })(
                                        <TreeSelect
                                            showSearch
                                            style={{ width: 290 }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="请选择部门"
                                            allowClear
                                            treeDefaultExpandAll
                                            disabled={platformType !== 10}
                                        >
                                            {this.renderTreeNode(this.props.organizationStructureData)}
                                        </TreeSelect>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <Form.Item label="角色" {...formItemLayout}>
                                    {getFieldDecorator('roleIds', {
                                        initialValue: addMemberInfo.roleIds,
                                        // rules: [{ required: true, message: '请选择角色' }],
                                    })(
                                        <Select
                                            allowClear
                                            placeholder="请选择角色"
                                            style={{ width: 290 }}
                                            mode="multiple"
                                        >
                                            {roleOption.map((item: any) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <Form.Item label="状态" {...formItemLayout}>
                                    {getFieldDecorator('status', {
                                        initialValue: addMemberInfo.status,
                                        rules: [{ required: true, message: '请选择状态' }],
                                    })(
                                        <Select allowClear placeholder="请选择状态" style={{ width: 290 }}>
                                            <Option key="1" value={1}>
                                                启用
                                            </Option>
                                            <Option key="0" value={0}>
                                                禁用
                                            </Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'center',
                        }}
                    >
                        <Button onClick={debounce(this.handleOkInvite, 500)} style={{ marginRight: 8 }} type="primary">
                            保存
                        </Button>
                        <Button onClick={this.handleCancelInvite}>取消</Button>
                    </div>
                </Drawer>
            </div>
        );
    }
}

interface stateType {
    user: userProps;
    isShowLoading: Boolean;
}

interface ComponentPropsInterface extends FormComponentProps {
    onClose: () => void;
    onSave: (departmentId: any) => void;
    addMemberInfo: null;
    platformType: any;
    organizationStructureData: any;
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_super_admin' })(AddMember);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
