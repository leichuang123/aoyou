import React from 'react'
import permissionStyle from './role_permission.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import {
  Form,
  message,
  Drawer,
  Tree,
  Button,
} from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { rolePermissionList, updateRolePermission } from '../../../../../server/api'

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: (isRefresh: boolean) => void,
  id: any,

}

interface IState {
  treeList: any,
  selectKeys: any,
  defaultExpandedKeys: any,
}

class Permission extends React.PureComponent<IProps, IState> {

  state = {
    treeList: [],
    selectKeys: [],
    defaultExpandedKeys: [],
  }

  componentDidMount() {
    this.getPermission()
  }

  private async handleOk() {
    let params = {
      roleId: this.props.id,
      resourceIdList: this.state.selectKeys
    }

    let res = await updateRolePermission(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    message.success('权限更新成功')
    this.props.onClose(false)
  }

  private getChild(list: any, result: any): any {
    // list.forEach((item: any) => {
    //   if (item.children.length > 0) {
    //     result.push(...this.getChild(item.children, []))
    //   } else {
    //     item.key = item.id
    //     item.title = item.name
    //     result.push(item)
    //   }
    // })
    // return result
    
  }

  private async getPermission() {
    let params = {
      roleId: this.props.id
    }

    let res = await rolePermissionList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }

    // let list: any = this.getChild(res.data, [])
    // console.log(list)
    let list: any = []
    let selectKeys: any = []
    let defaultExpandedKeys: any = []
    var getChild = (arr: any) => { //遍历树  获取id数组
      arr.forEach((item: any) => {
        item.key = item.id
        item.title = item.name
        if (item.children.length === 0) {
          if (item.ifHave) {
            selectKeys.push(item.id + '')
          }
          list.push(item)
        } else {
          let newItem = JSON.parse(JSON.stringify(item))
          defaultExpandedKeys.push(item.id + '')
          delete newItem.children
          list.push(newItem)
          getChild(item.children)
        }
      })
    }
    getChild(res.data)
    this.setState({
      selectKeys,
      defaultExpandedKeys,
      treeList: res.data
    })
  }

  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose(false)
  }

  private eidtSave() {

  }

  private onCheck(selectKeys: any, info: any) {
    this.setState({
      selectKeys: [
        ...selectKeys,
        ...info.halfCheckedKeys,
      ]
    })
  };

  render() {
    const { treeList, selectKeys, defaultExpandedKeys } = this.state
    return (
      <Drawer
        title='权限配置'
        visible={true}
        maskClosable={false}
        // onOk={this.handleOk.bind(this)}
        // onCancel={this.handleCancel.bind(this)}
        onClose={this.handleCancel.bind(this)}
        width='800px'
      >
        {
          treeList && treeList.length > 0 && <Tree
            checkable
            defaultExpandedKeys={defaultExpandedKeys}
            defaultSelectedKeys={selectKeys}
            defaultCheckedKeys={selectKeys}
            onCheck={this.onCheck.bind(this)}
            treeData={treeList}
          />
        }
        <div className={permissionStyle.bottomPlaceholder}></div>
        {
        <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
              zIndex: 999,
            }}
          >
            <Button key="back" style={{ marginRight: '16px' }} onClick={this.handleCancel.bind(this)}>
              取消
            </Button>
            <Button key="save" type="primary"  onClick={this.handleOk.bind(this)}>
              保存
            </Button>
          </div>
        }
      </Drawer>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: (isRefresh: boolean) => void,
  id: any,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_permission_edit' })(Permission)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)