import React from 'react';
import organization from './index.module.scss';
import { connect } from 'react-redux';
import { userProps } from '../../interface/user';
import { Icon, Form, Button, Table, Pagination, message, Tree, Input, Breadcrumb } from 'antd';
import {
    getCompanyTree,
    createDepartment,
    getRowDepartmentList,
    getRowDepartmentDetail,
    updateRowDepartment,
    deleteRowDepartment,
    editMember,
    addMember,
    editMemberStatusAndRole,
    getInfo,
} from '../../server/api';
import { PAGE_SIZE, PERMISSION } from '../../config/config';
import AddDepartment from './AddDepartment/AddDepartment';
import EditDepartment from './EditDepartment/EditDepartment';
import { switch_loading, authority } from '../../actions/index';
import AddMember from './AddMember/AddMember';

const { Search } = Input;
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
    editInfo: any;
    checkboxList: any;
    inviteForm: any;
    superAdminForm: any;
    addInfoForm: any;
    editInfoForm: any;
    addMemberInfoForm: any;
    groupId: number;
    expandedKeys: any;
    searchValue: string;
    autoExpandParent: Boolean;
    childrenData: any[];
    organizationStructureData: any[];
    showAddDepartment: boolean;
    showEditDepartment: boolean;
    addInfo: any;
    showAddMember: Boolean;
    addMemberInfo: any;
    currentShowName: any;
    departmentId: any;
    childDepts: any[];
    breadcrumb: any[];
    defaultSelectedKeys: any[];
    platformType: any;
}

class index extends React.PureComponent<IProps, IState> {
    state: any = {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        total: 0,
        list: [],
        exportParam: {},
        visible: false,
        inputError: false,
        name: '',
        inviteForm: null,
        superAdminForm: null,
        addInfoForm: null,
        editInfoForm: null,
        addMemberInfoForm: null,
        groupId: -1,
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        organizationStructureData: [],
        childrenData: [],
        showAddDepartment: false,
        showEditDepartment: false,
        addInfo: {
            name: '',
            parentId: null,
        },
        editInfo: {
            name: '',
            departmentId: null,
            adminUnionIds: [],
        },
        addMemberInfo: {
            mobile: '',
            unionId: '',
            status: 1,
            name: '',
            departmentIds: [],
            roleIds: [],
        },
        showAddMember: false,
        currentShowName: '',
        departmentId: 0,
        childDepts: [],
        breadcrumb: [],
        defaultSelectedKeys: [],
        platformType: 0,
    };

    componentDidMount() {
        let platformType = Number(localStorage.getItem('platformType'));
        this.setState({
            platformType,
        });
        this.getTreeData();
    }
    // 获取公司组织架构
    private getTreeData = async (departmentId = null) => {
        let res = await getCompanyTree();
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        let organizationStructureData = [
            {
                title: res.data.title,
                key: res.data.key.toString(),
                children: [],
            },
        ];
        if (res.data.children.length) {
            organizationStructureData[0].children = res.data.children;
        }
        const { editInfo } = this.state;
        const editInfoNew = Object.assign({}, editInfo, { departmentId: res.data.key });
        this.setState({
            currentShowName: res.data.title,
            departmentId: departmentId ? departmentId : res.data.key,
            organizationStructureData: organizationStructureData,
            breadcrumb: [{ key: res.data.key, title: res.data.title }],
            editInfo: editInfoNew,
            defaultSelectedKeys: [],
            childrenData: [],
        });
    };
    // 展开tree
    private onExpand = (expandedKeys: any) => {
        this.setState({
            expandedKeys,
        });
    };
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
    // 获取上级部门
    private getParentData = (data: any, departmentId: any, dataList: any[]) => {
        data.forEach((item: any) => {
            if (item.key == departmentId) {
                dataList.unshift(item);
                if (item.parentId) {
                    this.getParentData(data, item.parentId, dataList);
                }
            }
        });
        return dataList;
    };
    // antd tree树形递归匹配方法
    private getParentKey = (key: number | string, tree: any) => {
        let parentKey: any;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some((item: any) => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };
    // 处理搜索时树形数据高亮
    private loop = (data: any) =>
        data.map((item: any) => {
            const { searchValue } = this.state;
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span className={organization.site_tree_search_value}>{searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{item.title}</span>
                );
            if (item.children) {
                return { title, key: item.key, children: this.loop(item.children) };
            }

            return {
                title,
                key: item.key,
            };
        });
    // tree搜索
    private onTreeChange = (e: any) => {
        let { value } = e.target;
        value = String(value).trim();
        let { organizationStructureData } = this.state;
        const dataList: any[] = this.generateList(organizationStructureData, []);
        let expandedKeys: any = dataList
            .map((item: any) => {
                if (item.title.indexOf(value) > -1) {
                    return this.getParentKey(item.key, organizationStructureData);
                }
                return null;
            })
            .filter((item: any, i: number, self: any) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };
    // 搜索与输入框匹配的节点
    private getParentKeys = (key: any, tree: string | any[]) => {
        let parentKey: any;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some((item: { key: any }) => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKeys(key, node.children)) {
                    parentKey = this.getParentKeys(key, node.children);
                }
            }
        }
        return parentKey;
    };
    // 分页
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
    // 修改分页数据
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
    // 选择tree的某一个部门
    private onSelect = (selectedKeys: any) => {
        const dataList: any[] = this.generateList(this.state.organizationStructureData, []);
        if (!selectedKeys.length) {
            return;
        }
        const breadcrumb = this.getParentData(dataList, selectedKeys[0], []);
        const current = dataList.filter((item) => {
            return item.key == selectedKeys[0];
        })[0];
        // 某个部门下的一级子部门
        const childrenData = dataList.filter((item) => {
            return item.parentId == selectedKeys[0];
        });
        const addInfoNew = { ...this.state.addInfo, parentId: current.key };
        const editInfoNew = { ...this.state.editInfo, departmentId: current.key, name: current.title };
        const addMemberInfo = { ...this.state.addMemberInfo, departmentIds: [current.key] };
        const defaultSelectedKeys = [];
        defaultSelectedKeys.push(selectedKeys[0]);
        this.setState(
            {
                breadcrumb: breadcrumb,
                addInfo: addInfoNew,
                editInfo: editInfoNew,
                addMemberInfo: addMemberInfo,
                currentShowName: current.title,
                childrenData: childrenData,
                currentPage: 1,
                departmentId: selectedKeys[0],
                defaultSelectedKeys: defaultSelectedKeys,
            },
            () => {
                this.getList();
            }
        );
    };
    // 获取单个部门下的成员列表
    private getList = async () => {
        const { pageSize, departmentId, currentPage } = this.state;
        let res = await getRowDepartmentList({
            departmentId: departmentId,
            pageSize: pageSize,
            currentPage: currentPage,
        });
        if (res.code !== 200) {
            message.error(res.message);
            this.setState({
                list: [],
                total: 0,
            });
            return;
        }
        this.setState({
            list: res.data.dataList,
            total: res.data.page.totalCount,
        });
    };
    // 选择子部门下的部门
    private chooseRowChildren = (row: any) => {
        let expandedKeys = [];
        expandedKeys.push(row.key);
        this.setState({
            defaultSelectedKeys: expandedKeys,
            expandedKeys: expandedKeys,
            currentShowName: row.title,
            departmentId: row.key,
            childrenData: row.children,
            currentPage: 1,
        });

        this.getList();
    };
    // 取消新增部门回调
    private handleCancelAdd = () => {
        this.setState({
            showAddDepartment: false,
        });
    };
    // 新增部门回调
    private handleOkEditAdd = async () => {
        this.state.addInfoForm.props.form.validateFields(async (err: any, data: any) => {
            if (err) {
                return;
            }
            this.props.dispatch(switch_loading({ show: true }));
            let res = await createDepartment({ parentId: data.parentId, name: data.name });
            if (res.code !== 200) {
                message.error(res.message);
                return;
            }
            this.props.dispatch(switch_loading({ show: false }));
            message.success('新增成功！');
            this.setState(
                {
                    showAddDepartment: false,
                },
                () => {
                    this.getTreeData();
                }
            );
        });
    };
    // 添加子部门
    private addSubDepartment = () => {
        let addInfoNew = { ...this.state.addInfo };
        if (!this.state.addInfo.parentId) {
            addInfoNew = { ...this.state.addInfo, parentId: this.state.departmentId };
        }
        this.setState({
            addInfo: addInfoNew,
            showAddDepartment: true,
        });
    };
    // 取消编辑部门回调
    private handleCancelEdit = () => {
        this.setState({
            showEditDepartment: false,
        });
    };
    // 确定编辑部门回调
    private handleOkEditEdit = (departmentId: any) => {
        this.state.editInfoForm.props.form.validateFields(async (err: any, data: any) => {
            if (err) {
                return;
            }
            this.props.dispatch(switch_loading({ show: true }));
            let res = await updateRowDepartment({ ...data, departmentId: departmentId });
            if (res.code !== 200) {
                message.error(res.message);
                return;
            }
            this.props.dispatch(switch_loading({ show: false }));
            message.success('编辑成功！');
            this.setState(
                {
                    showEditDepartment: false,
                },
                () => {
                    this.getTreeData();
                }
            );
        });
    };
    // 编辑成员
    private async editUser(item: any) {
        let roleList = [];
        if (item.roleList) {
            roleList = item.roleList.map((item: { id: any }) => {
                return item.id;
            });
        }
        const addMemberInfo = {
            ...this.state.addMemberInfo,
            name: item.name,
            status: item.status,
            departmentIds: item.departmentIds,
            roleIds: roleList,
            unionId: item.unionId,
        };
        this.setState({
            addMemberInfo,
            showAddMember: true,
        });
    }
    // 编辑部门
    private editThisDepartment = () => {
        let editInfoNew = { ...this.state.editInfo };
        if (!this.state.editInfo.departmentId) {
            editInfoNew = {
                ...this.state.editInfo,
                departmentId: this.state.departmentId,
            };
        }
        this.getDepartmentDetail(editInfoNew);
    };
    // 编辑部门取部门详情
    private getDepartmentDetail = async (editInfo: any) => {
        let res = await getRowDepartmentDetail(editInfo.departmentId);
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        const adminUnionIds = res.data.adminList.map((item: { unionId: any }) => {
            return item.unionId;
        });
        const editInfoNew = { ...editInfo, adminUnionIds: adminUnionIds, name: this.state.currentShowName };
        this.setState({
            editInfo: editInfoNew,
            showEditDepartment: true,
        });
    };
    // 确认删除部门
    private onSureDelDepartment = async (departmentId: any) => {
        let res = await deleteRowDepartment(departmentId);
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        this.setState(
            {
                showEditDepartment: false,
            },
            () => {
                this.getTreeData();
            }
        );
    };
    // 添加成员
    private addMember = () => {
        let addInfoNew = { ...this.state.addMemberInfo };
        if (!this.state.addMemberInfo.departmentIds.length) {
            addInfoNew = { ...this.state.addMemberInfo, departmentIds: [this.state.departmentId] };
        }
        this.setState({
            addMemberInfo: addInfoNew,
            showAddMember: true,
        });
    };
    // 点击面包屑切换部门
    changeOrganization = (item: any) => {
        const selcetDom = [item.key];
        this.onSelect(selcetDom);
    };
    // 编辑成员
    private handleOkEditMember = () => {
        this.state.addMemberInfoForm.props.form.validateFields(async (err: any, data: any) => {
            if (err) {
                return;
            }
            // 新增成员
            if (!this.state.addMemberInfo.unionId) {
                this.goAddMember(data);
                return;
            }
            const { addMemberInfo, departmentId } = this.state;
            this.props.dispatch(switch_loading({ show: true }));
            const { platformType } = this.state;
            let res =
                platformType == 10
                    ? await editMember({
                          ...data,
                          unionId: addMemberInfo.unionId,
                      })
                    : await editMemberStatusAndRole({ ...data, unionId: addMemberInfo.unionId });
            if (res.code !== 200) {
                message.error(res.message);
                return;
            }
            this.props.dispatch(switch_loading({ show: false }));
            message.success('操作成功！');
            //如果编辑的成员是自己重新获取权限
            let unionId = localStorage.getItem('unionId');

            if (unionId == addMemberInfo.unionId) {
                this.getUserInfo();
                return;
            }
            this.setState(
                {
                    showAddMember: false,
                },
                () => {
                    this.initAddMemberInfo();
                    this.getList();
                }
            );
        });
    };
    private getUserInfo = async () => {
        let res = await getInfo();
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        let resourceList = res.data.resourceList
            ? res.data.resourceList.map((item: { id: any }) => {
                  return item.id + '';
              })
            : [];
        this.props.dispatch(authority(resourceList));
        this.setState(
            {
                showAddMember: false,
            },
            () => {
                this.initAddMemberInfo();
                this.getList();
            }
        );
    };
    // 新增成员
    private goAddMember = async (data: any) => {
        const { addMemberInfo } = this.state;
        this.props.dispatch(switch_loading({ show: true }));
        let res = await addMember({ ...data, unionId: null, status: addMemberInfo.status, roleId: data.roleIds });
        if (res.code !== 200) {
            message.error(res.message);
            return;
        }
        this.props.dispatch(switch_loading({ show: false }));
        message.success('操作成功！');
        this.setState(
            {
                showAddMember: false,
            },
            () => {
                this.initAddMemberInfo();
                this.getList();
            }
        );
    };
    // 初始化新增成员信息
    private initAddMemberInfo = () => {
        const { departmentId } = this.state;
        const initData = {
            unionId: '',
            status: 1,
            name: '',
            departmentIds: [departmentId],
            roleIds: [],
            mobile: '',
        };
        this.setState({
            addMemberInfo: initData,
        });
    };
    // 取消编辑成员
    private handleCancelMember = () => {
        this.setState(
            {
                showAddMember: false,
            },
            () => {
                this.initAddMemberInfo();
            }
        );
    };

    render() {
        const {
            list,
            currentPage,
            total,
            pageSize,
            expandedKeys,
            autoExpandParent,
            organizationStructureData,
            childrenData,
            showAddDepartment,
            addInfo,
            showEditDepartment,
            editInfo,
            currentShowName,
            breadcrumb,
            defaultSelectedKeys,
            showAddMember,
            addMemberInfo,
            platformType,
        } = this.state;
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '角色名称',
                dataIndex: 'roleName',
                key: 'roleName',
            },
            {
                title: '部门',
                dataIndex: 'departmentNames',
                key: 'departmentNames',
            },
            {
                title: '手机',
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text: any, item: any) => (
                    <div>
                        <Button type="link" onClick={this.editUser.bind(this, item)}>
                            编辑
                        </Button>
                    </div>
                ),
            },
        ];

        return (
            <div className={organization.organization_page}>
                <div className={organization.organization_box}>
                    <div className={organization.tree}>
                        <h2>组织架构</h2>
                        <div>
                            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onTreeChange} />
                            <Tree
                                onExpand={this.onExpand}
                                onSelect={this.onSelect}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                treeData={this.loop(organizationStructureData)}
                                selectedKeys={defaultSelectedKeys}
                            ></Tree>
                        </div>
                    </div>
                    <div className={organization.list}>
                        <h2>
                            {currentShowName}
                            <Button
                                type="primary"
                                style={{ marginLeft: 10 }}
                                onClick={this.editThisDepartment}
                                disabled={platformType !== 10}
                                title={platformType !== 10 ? '不允许修改来自第三方平台的组织架构信息' : '编辑部门'}
                            >
                                编辑
                            </Button>
                        </h2>
                        <Breadcrumb separator=">">
                            {breadcrumb.map((item: any) => {
                                return (
                                    <Breadcrumb.Item key={item.key} onClick={() => this.changeOrganization(item)}>
                                        <a>{item.title}</a>
                                    </Breadcrumb.Item>
                                );
                            })}
                        </Breadcrumb>
                        <h2>
                            <Icon type="apartment" style={{ marginRight: 10, marginTop: 30 }} />
                            下级部门
                            <Button
                                onClick={this.addSubDepartment}
                                type="default"
                                size="small"
                                style={{ marginLeft: 10 }}
                                disabled={platformType !== 10}
                                title={platformType !== 10 ? '不允许修改来自第三方平台的组织架构信息' : '添加子部门'}
                            >
                                添加子部门
                            </Button>
                            <div>
                                <div>
                                    <div className="ant-list ant-list-sm ant-list-split">
                                        <div className="ant-spin-nested-loading">
                                            <div className="ant-spin-container">
                                                <ul className="ant-list-items">
                                                    {!childrenData.length ? (
                                                        <p style={{ marginTop: 10 }}>
                                                            当前部门不包含下级部门
                                                            <Button
                                                                type="link"
                                                                onClick={this.addSubDepartment}
                                                                disabled={platformType !== 10}
                                                                title={
                                                                    platformType !== 10
                                                                        ? '不允许修改来自第三方平台的组织架构信息'
                                                                        : '添加子部门'
                                                                }
                                                            >
                                                                添加子部门
                                                            </Button>
                                                        </p>
                                                    ) : (
                                                        childrenData.map((item: any) => {
                                                            return (
                                                                <li
                                                                    className={organization.children_dataItem}
                                                                    key={item.key}
                                                                    onClick={() => this.chooseRowChildren(item)}
                                                                >
                                                                    <div className="ant-list-item-meta">
                                                                        <div className="ant-list-item-meta-content">
                                                                            <div className="ant-list-item-meta-description">
                                                                                {item.title}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Icon type="right" />
                                                                    </div>
                                                                </li>
                                                            );
                                                        })
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </h2>
                        <h2>
                            <Icon type="usergroup-add" style={{ marginRight: 10, marginTop: 30 }} />
                            部门成员
                            <Button
                                onClick={this.addMember}
                                type="default"
                                size="small"
                                style={{ marginLeft: 10 }}
                                disabled={platformType !== 10}
                                title={platformType !== 10 ? '不允许修改来自第三方平台的组织架构信息' : '添加成员'}
                            >
                                添加成员
                            </Button>
                        </h2>
                        <Table
                            rowKey="id"
                            className="table"
                            columns={columns}
                            dataSource={list}
                            size="small"
                            pagination={false}
                        />
                        <Pagination
                            style={{ marginTop: 10 }}
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
                    </div>
                </div>
                {/* 新增子部门 */}
                {showAddDepartment && (
                    <AddDepartment
                        organizationStructureData={organizationStructureData}
                        addInfo={addInfo}
                        onClose={this.handleCancelAdd.bind(this)}
                        onSave={this.handleOkEditAdd.bind(this)}
                        wrappedComponentRef={(form: any) => this.setState({ addInfoForm: form })}
                    ></AddDepartment>
                )}
                {/* 编辑部门 */}
                {showEditDepartment && (
                    <EditDepartment
                        editInfo={editInfo}
                        onClose={this.handleCancelEdit.bind(this)}
                        onSave={this.handleOkEditEdit.bind(this)}
                        onSureDelDepartment={this.onSureDelDepartment.bind(this)}
                        wrappedComponentRef={(form: any) => this.setState({ editInfoForm: form })}
                    ></EditDepartment>
                )}
                {showAddMember && (
                    <AddMember
                        organizationStructureData={organizationStructureData}
                        addMemberInfo={addMemberInfo}
                        platformType={platformType}
                        onClose={this.handleCancelMember.bind(this)}
                        onSave={this.handleOkEditMember.bind(this)}
                        wrappedComponentRef={(form: any) => this.setState({ addMemberInfoForm: form })}
                    ></AddMember>
                )}
            </div>
        );
    }
}

interface stateType {
    user: userProps;
    isShowLoading: Boolean;
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_group_user_list' })(index);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
