import React from 'react';
import organizations from './SelectUser.module.scss';
import { connect } from 'react-redux';
import { userProps } from '../../interface/user';
import { Icon, Form, Table, Pagination, message, Tree, Input, Breadcrumb, Modal } from 'antd';
import { getCompanyTree, getRowDepartmentList } from '../../server/api';
import { PAGE_SIZE } from '../../config/config';
import { FormComponentProps } from 'antd/es/form';
const { Search } = Input;
interface IProps {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    location: any;
    form: any;
    selectedKeys: any;
    selectedList: any;
    onClose: (isRefresh: boolean) => void;
    onSave: (selectedRowKeysL: any, selectedRow: any) => void;
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
    checkboxList: any;
    groupId: number;
    expandedKeys: any;
    searchValue: string;
    autoExpandParent: Boolean;
    childrenData: any[];
    organizationStructureData: any[];
    currentShowName: any;
    departmentId: any;
    childDepts: any[];
    breadcrumb: any[];
    defaultSelectedKeys: any[];
    selectedRowKeys: any[];
    selectedRow: any[];
}

class SelectUser extends React.PureComponent<IProps, IState> {
    state: any = {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        total: 0,
        list: [],
        exportParam: {},
        visible: false,
        inputError: false,
        name: '',
        groupId: -1,
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        organizationStructureData: [],
        currentShowName: '',
        departmentId: 0,
        childDepts: [],
        breadcrumb: [],
        defaultSelectedKeys: [],
        selectedRowKeys: [],
        selectedRow: [],
    };

    componentDidMount() {
        const { selectedKeys, selectedList } = this.props;
        // 默认赋值
        if (selectedKeys.length) {
            this.setState({
                defaultSelectedKeys: selectedKeys,
                selectedRowKeys: selectedKeys,
                selectedRow: selectedList,
            });
        }

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
        this.setState(
            {
                currentShowName: res.data.title,
                departmentId: departmentId ? departmentId : res.data.key,
                organizationStructureData: organizationStructureData,
                breadcrumb: [{ key: res.data.key, title: res.data.title }],
                defaultSelectedKeys: [],
                childrenData: [],
            },
            () => {
                this.getList();
            }
        );
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
                        <span className={organizations.site_tree_search_value}>{searchValue}</span>
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
        const defaultSelectedKeys = [];
        defaultSelectedKeys.push(selectedKeys[0]);
        this.setState(
            {
                breadcrumb: breadcrumb,
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
    // 点击面包屑切换部门
    changeOrganization = (item: any) => {
        const selcetDom = [item.key];
        this.onSelect(selcetDom);
    };
    // 取消选择
    private handleCancel() {
        this.props.onClose(false);
    }
    // 确认选择
    private async save() {
        const { selectedRowKeys, selectedRow } = this.state;
        this.props.onSave(selectedRowKeys, selectedRow);
    }
    // 对象数组去重
    private deWeight = (arr: any[]) => {
        let map = new Map();
        for (let item of arr) {
            if (!map.has(item.name)) {
                map.set(item.name, item);
            }
        }
        return [...map.values()];
    };
    // 列表选择
    private radioUserChange(selectedRowKeys: any, selectedRows: any) {
        const { selectedRow } = this.state;
        let selectedRowNew = this.deWeight(selectedRows.concat(selectedRow));
        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRow: selectedRowNew,
        });
    }
    render() {
        const {
            list,
            currentPage,
            total,
            pageSize,
            expandedKeys,
            autoExpandParent,
            organizationStructureData,
            breadcrumb,
            defaultSelectedKeys,
            selectedRowKeys,
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
        ];

        return (
            <Modal
                title="选择人员"
                visible={true}
                maskClosable={false}
                width="1000px"
                onCancel={this.handleCancel.bind(this)}
                onOk={this.save.bind(this)}
            >
                <div className={organizations.organization_page}>
                    <div className={organizations.organization_box}>
                        <div className={organizations.tree}>
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
                        <div className={organizations.list}>
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
                                <Icon type="usergroup-add" style={{ marginRight: 10, marginTop: 30 }} />
                                部门成员
                            </h2>
                            <Table
                                rowKey="userId"
                                scroll={{ y: 400 }}
                                columns={columns}
                                dataSource={list}
                                size="small"
                                pagination={false}
                                rowSelection={{
                                    type: 'checkbox',
                                    selectedRowKeys: selectedRowKeys,
                                    getCheckboxProps: (user: any) => {
                                        return {
                                            props: {
                                                defaultChecked: selectedRowKeys.includes(user.userId),
                                            },
                                        };
                                    },
                                    onChange: (selectedRowKeys, selectedRows) =>
                                        this.radioUserChange(selectedRowKeys, selectedRows),
                                }}
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
                </div>
            </Modal>
        );
    }
}

interface stateType {
    user: userProps;
    isShowLoading: Boolean;
    onClose: (isRefresh: boolean) => void;
    onSave: (selectedRowKeysL: any, selectedRow: any) => void;
    selectedKeys: any;
    selectedList: any;
}
interface ComponentPropsInterface extends FormComponentProps {
    selectedKeys: any;
    selectedList: any;
    onClose: (isRefresh: boolean) => void;
    onSave: (selectedRowKeys: any, selectedRow: any) => void;
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_group_user_list' })(
    SelectUser
);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
