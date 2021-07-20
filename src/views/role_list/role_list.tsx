import React from 'react';
// import tqStyle from './time_quantum.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../interface/user';
import { Form, Button, Table, Pagination, message, Input } from 'antd';
import { roleList, getInfo } from '../../server/api';
import { PAGE_SIZE } from '../../config/config';
import EditRole from './edit_role/edit_role';
import Permission from './permission/permission';
import { authority } from '../../actions/index';
const { Search } = Input;

interface IProps {
    user: userProps;
    isShowLoading: Boolean;
    dispatch: Function;
    form: any;
    location: any;
}

interface IState {
    currentPage: number;
    pageSize: number;
    total: number;
    name: string;
    list: any;
    exportParam: any;
    visible: boolean;
    editInfo: any;
    isShowPermission: boolean;
    editRoleInfo: any;
    roleId: number;
}

class RoleList extends React.PureComponent<IProps, IState> {
    state: any = {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        name: '',
        total: 0,
        list: [],
        exportParam: {},
        visible: false,
        editInfo: null,
        isShowPermission: false,
        editRoleInfo: false,
        roleId: -1,
    };

    componentDidMount() {
        this.getList();
    }
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
    };
    // 获取角色列表
    private async getList() {
        let params = {
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
            name: this.state.name,
        };

        if (params.currentPage === 1) {
            this.setState({
                exportParam: params,
            });
        }
        let res = await roleList(params);
        if (res.code === 200) {
            res.data.dataList.forEach((item: any, index: number) => {
                item.index = (this.state.currentPage - 1) * this.state.pageSize + index + 1;
            });
            this.setState({
                total: res.data.page.totalCount,
                list: res.data.dataList,
            });
        } else {
            message.error(res.message);
        }
    }
    private handleSubmit() {
        // this.setState({
        //   currentPage: 1,
        //   list: []
        // }, () => {
        //   this.getList()
        // })
    }

    private async addRole() {
        this.setState({
            visible: true,
            editInfo: null,
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

    private handleOk() {
        this.props.form.validateFields(async (err: any, data: any) => {
            if (err) {
                return;
            }
            // let params = {
            //   state: 1
            // }
            // Object.assign(params, data)
            // let res = null
            // if (this.state.editInfo === null) {
            //   res = await addRole(params)
            // } else {
            //   Object.assign(params, { id: this.state.editInfo.id })
            //   res = await editRole(params)
            // }
            // if (res.code === 200) {
            //   message.success('保存成功！')
            //   this.props.form.resetFields()

            // } else {
            //   message.error(res.message)
            // }
        });
    }

    private search(name = '') {
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

    private editRoleList(item: any) {
        // let isPermission = await checkOperatePermission({
        //     resourceId: PERMISSION.edit_group_user.id,
        // });
        // if (isPermission.code !== 200) {
        //     message.error(isPermission.message);
        //     return;
        // }
        this.setState({
            visible: true,
            editInfo: item,
        });
    }

    private onClose(isRefresh = false) {
        if (isRefresh) {
            this.getList();
        }
        this.setState({
            visible: false,
        });
    }

    private onClosePermission(isRefresh = false) {
        if (isRefresh) {
            this.getList();
            this.getUserInfo();
        }
        this.setState({
            isShowPermission: false,
        });
    }

    private async showPermission(info: any) {
        // let isPermission = await checkOperatePermission({
        //     resourceId: PERMISSION.permission_setting.id,
        // });
        // if (isPermission.code !== 200) {
        //     message.error(isPermission.message);
        //     return;
        // }
        this.setState({
            roleId: info.id,
            isShowPermission: true,
        });
    }

    render() {
        const { list, currentPage, total, pageSize, roleId, editInfo, visible, isShowPermission, editRoleInfo } =
            this.state;
        // const columns: any = [
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                width: 150,
            },
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
                width: 150,
            },
            {
                title: '角色说明',
                dataIndex: 'description',
                key: 'description',
                width: 500,
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 150,
                render: (text: any, item: any) => <span>{['不可用', '可用'][item.status]}</span>,
            },
            {
                title: '操作',
                key: 'action',
                width: 150,
                render: (text: any, item: any) => (
                    <div>
                        {item.type !== 0 && (
                            <Button type="link" onClick={this.editRoleList.bind(this, item)}>
                                编辑
                            </Button>
                        )}
                        {item.type !== 0 && (
                            <Button type="link" onClick={this.showPermission.bind(this, item)}>
                                权限配置
                            </Button>
                        )}
                    </div>
                ),
            },
        ];
        return (
            <div className="new-user page">
                <div className="sk-pulse"></div>
                <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className="search">
                    <Form.Item label="名称">
                        <Search placeholder="" onSearch={this.search.bind(this)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={this.addRole.bind(this)}>
                            新建角色
                        </Button>
                    </Form.Item>
                </Form>
                <Table rowKey="index" className="table" columns={columns} dataSource={list} pagination={false} />
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
                {visible && <EditRole editInfo={editInfo} onClose={this.onClose.bind(this)}></EditRole>}
                {isShowPermission && (
                    <Permission
                        editInfo={editRoleInfo}
                        roleId={roleId}
                        onClose={this.onClosePermission.bind(this)}
                    ></Permission>
                )}
            </div>
        );
    }
}

interface stateType {
    user: userProps;
    isShowLoading: Boolean;
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_role_list' })(RoleList);

export default connect((state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading,
}))(WrappedHorizontalLoginForm);
