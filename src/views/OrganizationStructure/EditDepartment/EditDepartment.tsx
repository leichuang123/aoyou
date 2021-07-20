import React from 'react';
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user';
import { Form, Modal, Col, Row, Input, Drawer, Button, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import addStyle from './EditDepartment.module.scss';
import { getRowDepartmentOption } from '../../../server/api';
const { Option } = Select;

interface IProps {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    form: any;
    editInfo: any;
    onClose: Function;
    onSave: Function;
    onSureDelDepartment: Function;
}

interface IState {
    inputError: boolean;
    childrenOption: any;
}

class EditDepartment extends React.PureComponent<IProps, IState> {
    state: any = {
        inputError: false,
        childrenOption: [],
    };

    componentDidMount() {
        this.getDepartmentDetail();
    }
    // 获取部门详情
    private getDepartmentDetail = async () => {
        console.log(this.props.editInfo.departmentId);
        let res = await getRowDepartmentOption(this.props.editInfo.departmentId);
        if (res.code == 200) {
            this.setState({
                childrenOption: res.data,
            });
        }
    };
    private handleOkInvite = () => {
        this.props.onSave(this.props.editInfo.departmentId);
    };

    private handleCancelInvite = () => {
        this.props.onClose();
    };
    // 删除部门
    private handleDelInvite = () => {
        Modal.confirm({
            title: '温馨提示',
            content: '确认删除该部门？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.props.onSureDelDepartment(this.props.editInfo.departmentId);
            },
        });
    };
    // 生成树结构函数
    // private renderTreeNode = (data: any[]) => {
    //     if (data.length == 0) {
    //         return;
    //     }
    //     return data.map((item) => {
    //         if (item.children && item.children.length > 0) {
    //             return (
    //                 <TreeNode title={item.title} value={item.key} key={item.key}>
    //                     {this.renderTreeNode(item.children)}
    //                 </TreeNode>
    //             );
    //         }
    //         return <TreeNode key={item.key} {...item} value={item.key}></TreeNode>;
    //     });
    // };
    render() {
        const { editInfo } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { childrenOption } = this.state;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        };
        return (
            <div>
                <Drawer
                    title="编辑部门"
                    width={600}
                    onClose={this.handleCancelInvite}
                    visible={true}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Form layout="inline">
                        <div className={addStyle.c_action_content}>部门信息</div>
                        <Row>
                            <Col>
                                <Form.Item label="部门名称" {...formItemLayout}>
                                    {getFieldDecorator('name', {
                                        initialValue: editInfo.name,
                                        rules: [{ required: true, message: '请输入部门名称' }],
                                    })(<Input placeholder="请输入部门名称" style={{ width: 290 }} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <Form.Item label="设置主管" {...formItemLayout}>
                                    {getFieldDecorator('adminUnionIds', {
                                        initialValue: editInfo.adminUnionIds,
                                    })(
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            placeholder="请选择主管"
                                            style={{ width: 290 }}
                                        >
                                            {childrenOption.map((item: any) => {
                                                return <Option key={item.unionId}>{item.name}</Option>;
                                            })}
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
                        <Button onClick={this.handleOkInvite} style={{ marginRight: 8 }} type="primary">
                            保存
                        </Button>
                        <Button onClick={this.handleDelInvite} style={{ marginRight: 8 }} type="danger">
                            删除
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
    onSureDelDepartment: (departmentId: any) => void;
    editInfo: null;
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_super_admin' })(
    EditDepartment
);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
