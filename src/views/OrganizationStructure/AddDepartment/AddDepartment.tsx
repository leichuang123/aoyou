import React from 'react';
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user';
import { Form, Col, Row, Input, Drawer, Button, TreeSelect } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { PAGE_SIZE } from '../../../config/config';
import addStyle from './AddDepartment.module.scss';

const { TreeNode } = TreeSelect;
interface IProps {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    form: any;
    addInfo: any;
    onClose: Function;
    onSave: Function;
    organizationStructureData: any;
}

interface IState {
    currentPage: number;
    pageSize: number;
    total: number;
    list: any;
    name: string;
    exportParam: any;
    inputError: boolean;
    parentId: any;
}

class AddDepartment extends React.PureComponent<IProps, IState> {
    state: any = {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        total: 0,
        list: [],
        exportParam: {},
        inputError: false,
        name: '',
        parentId: null,
    };

    componentDidMount() {}
    private handleOkInvite = () => {
        this.props.onSave();
    };

    private handleCancelInvite = () => {
        this.props.onClose();
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

    render() {
        const { addInfo } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        };
        return (
            <div>
                <Drawer
                    title="添加部门"
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
                                        initialValue: addInfo.name,
                                        rules: [{ required: true, message: '请输入部门名称' }],
                                    })(<Input placeholder="请输入部门名称" style={{ width: 290 }} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col>
                                <Form.Item label="上级部门" {...formItemLayout}>
                                    {getFieldDecorator('parentId', {
                                        initialValue: addInfo.parentId,
                                        rules: [{ required: true, message: '请选择上级部门' }],
                                    })(
                                        <TreeSelect
                                            showSearch
                                            style={{ width: 290 }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="请选择上级部门"
                                            allowClear
                                            treeDefaultExpandAll
                                        >
                                            {this.renderTreeNode(this.props.organizationStructureData)}
                                        </TreeSelect>
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
    onSave: () => void;
    addInfo: null;
    organizationStructureData: null;
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_super_admin' })(
    AddDepartment
);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
