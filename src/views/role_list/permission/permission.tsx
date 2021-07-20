import React from 'react';
// import permissionStyle from './permissionStyle.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../interface/user';
import { Form, message, Modal, Tree } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { getAllRoleList, getRoleHaveResource, updateRoleResource } from '../../../server/api';

interface IProps {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    form: any;
    onClose: (isRefresh: boolean) => void;
    editInfo: any;
    roleId: number;
}

interface IState {
    treeList: any;
    selectKeys: any;
    defaultExpandedKeys: any;
}

class Permission extends React.PureComponent<IProps, IState> {
    state = {
        treeList: [],
        selectKeys: [],
        defaultExpandedKeys: [],
    };

    componentDidMount() {
        this.getPermission();
    }

    private async handleOk() {
        if (!this.state.selectKeys.length) {
            message.error('请选择权限！');
            return;
        }
        let params = {
            roleId: this.props.roleId,
            resourceIdList: this.state.selectKeys,
        };

        let res = await updateRoleResource(params);
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        message.success('权限更新成功！');
        this.props.onClose(true);
    }
    // 递归数据
    private loop = (data: any) =>
        data.map((item: any) => {
            const title = item.name;
            if (item.children) {
                return { title, key: item.id, parentId: item.parentId, children: this.loop(item.children) };
            }

            return {
                title,
                key: item.key,
            };
        });
    // 将树形节点扁平化一维数组
    private generateList = (data: any, dataList: any[]) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { key, title, parentId, children } = node;
            dataList.push({ key, title, parentId, children });
            if (node.children) {
                this.generateList(node.children, dataList);
            }
        }
        return dataList;
    };
    // 获取权限列表
    private async getPermission() {
        let selectKeys: any = [];
        let resRole = await getRoleHaveResource({ roleId: this.props.roleId });
        if (resRole.code !== 200) {
            message.error(resRole.message);
            return;
        }
        // 处理勾选过的权限
        selectKeys = resRole.data.map((item: { id: any }) => {
            return item.id + '';
        });

        let res = await getAllRoleList();
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        let list: any = [];

        list = this.loop(res.data);
        // 展开权限tree
        let defaultExpandedKeys = this.generateList(list, []).map((i) => {
            return i.key + '';
        });
        this.setState({
            selectKeys,
            defaultExpandedKeys,
            treeList: list,
        });
    }

    private handleCancel() {
        this.props.form.resetFields();
        this.props.onClose(false);
    }

    private eidtSave() {}

    private onCheck(selectKeys: any, info: any) {
        this.setState({
            selectKeys,
        });
    }

    render() {
        const { treeList, selectKeys, defaultExpandedKeys } = this.state;
        return (
            <Modal
                title="权限配置"
                visible={true}
                maskClosable={false}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                width="800px"
            >
                {treeList && treeList.length > 0 && (
                    <Tree
                        checkable
                        defaultExpandedKeys={defaultExpandedKeys}
                        defaultCheckedKeys={selectKeys}
                        onCheck={this.onCheck.bind(this)}
                        treeData={treeList}
                    />
                )}
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
    roleId: -1;
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_permission_edit' })(
    Permission
);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
