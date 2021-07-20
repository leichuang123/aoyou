import React from 'react'
import rStyle from './resources.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, message, Input, Row, Col, Button, Select, Tree, Icon } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { getResourcesList, updateResources, addResources } from '../../../../server/api'
import { formatProduct } from '../../../../tools/tools'
import { INPUT_MAXLENGTH } from '../../../../config/config'

const { Option } = Select
const { TreeNode } = Tree
const { Search } = Input

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  editInfo: null,
  treeList: any,
  originList: any,
  selectId: number,
  selectedKeys: any,
  searchText: string,
  expandedKeys: any,
}

class resourcesType extends React.PureComponent<IProps, IState> {

  state: any = {
    editInfo: null,
    treeList: [],
    originList: [],
    selectId: 0,
    selectedKeys: [],
    expandedKeys: [],
    searchText: ''
  }

  componentDidMount() {
    this.getList()
  }

  private async getList() {
    let params = {
      pageSize: 9999,
    }
    let expandedKeys: any = []
    let res = await getResourcesList(params)
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    res.data.dataList.forEach((item: any) => {
      if (item.parentId !== 0) {
        expandedKeys.push(item.id + '')
      }
    })
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    let treeList = [{
      label: '全部',
      value: '0',
      id: 0,
      isLeaf: false,
      children: formatProduct(res.data.dataList),
    }]
    this.setState({
      originList: res.data.dataList,
      treeList,
      expandedKeys
    })
  }


  private handleOk() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let res = null
      let params = {
        name: data.name,
        state: data.state,
        url: data.url
      }
      if (this.state.editInfo === null) {
        let isExist = false
        this.state.originList.forEach((item: any) => {
          if (item.name === data.name) {
            isExist = true
          }
        })
        if (isExist) {
          message.error('名称已存在')
          return
        }
        Object.assign(params, { parentId: this.state.selectId })
        res = await addResources(params)
      } else {
        Object.assign(params, { id: this.state.editInfo.id })
        // if (data.state === 0) {
        //   // 禁用之前需要先禁用所有子组件
        //   let isAllow = true
        //   this.state.originList.forEach((item: any) => {
        //     if (this.state.editInfo.id === item.parentId && item.state !== 0) {
        //       isAllow = false
        //     }
        //   })
        //   if (!isAllow) {
        //     message.error('请先禁用所有子选项')
        //     return
        //   }
        // }
        res = await updateResources(params)
      }
      if (res.code === 200) {
        message.success('保存成功')
        if (this.state.editInfo === null) {
          this.props.form.resetFields()
        }
        this.setState({
          // editInfo: null,
          treeList: [],
        }, () => {
          this.getList()
        })
      } else {
        message.error(res.message)
      }
    })
  }

  private async onTreeSelect(selectedKeys: any) {
    if (selectedKeys.length === 0) {
      return
    }
    let editInfo: any = null
    let id = +selectedKeys[0]
    this.state.originList.forEach((item: any) => {
      if (id === item.id) {
        editInfo = item
      }
    })
    this.setState({
      editInfo,
      selectedKeys: selectedKeys,
      selectId: id,
    })
    this.props.form.setFieldsValue({
      name: editInfo === null ? '' : editInfo.name,
      state: editInfo === null ? '' : editInfo.state,
      url: editInfo === null ? '' : editInfo.url,
    })
  }

  private selectParent(info: any) {
    this.onTreeSelect([info.id + ''])
  }

  private addChild(info: any) {
    this.props.form.setFieldsValue({
      name: '',
      url: '',
      state: ''
    })
    this.setState({
      selectId: info.id,
      editInfo: null,
      selectedKeys: [info.id + '']
    })
  }

  private search(name: string) {
    if (name.trim() === '') {
      return
    }
    let info: any = null
    this.state.originList.forEach((item: any) => {
      if (item.name === name.trim()) {
        info = item
      }
    })
    if (info !== null) {
      this.onTreeSelect([info.id + ''])
      let expandedKeys: any = this.getParentKey(info, [])
      expandedKeys.push('0') // 拼上最顶层‘全部’
      this.setState({
        expandedKeys
      })
    }
  }

  private getParentKey(info: any, list: any): any {
    if (info.parentId === 0) {
      return list
    }
    let parent = null
    this.state.originList.forEach((item: any) => {
      if (info.parentId === item.id) {
        parent = item
        list.push(item.id + '')
      }
    })
    return this.getParentKey(parent, list)
  }

  private onTreeExpand(expandedKeys: any) {
    this.setState({
      expandedKeys
    })
  }

  render() {
    const { editInfo, treeList, selectedKeys, expandedKeys, } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const _this = this
    function getTreeNode(info: any) {
      const TreeItem = <div key={info.value} className={rStyle.treeTitle}>
        <span className={`${rStyle.name} ${info.state === 0 ? rStyle.gray : ''}`} onClick={_this.selectParent.bind(_this, info)} >{info.label}</span>
        <Icon type='plus-circle' onClick={_this.addChild.bind(_this, info)}></Icon>
      </div>

      if (info.isLeaf) {
        return <TreeNode icon={<Icon type="carry-out" />} title={TreeItem} key={info.value}></TreeNode>
      } else {
        return <TreeNode selectable={false} icon={<Icon type="carry-out" />} title={TreeItem} key={info.value}>
          {
            info.children && info.children.map((item: any) => {
              return getTreeNode(item)
            })
          }
        </TreeNode>
      }
    }
    return (
      <div className={`${rStyle.resourcesType}`}>
        <Search placeholder='' maxLength={INPUT_MAXLENGTH} className={rStyle.search} onSearch={this.search.bind(this)} />
        <div className={`flex-center ${rStyle.content}`}>
          {
            treeList.length > 0 && <Tree
              showIcon={false}
              selectedKeys={selectedKeys}
              onSelect={this.onTreeSelect.bind(this)}
              expandedKeys={expandedKeys}
              // defaultExpandAll={true}
              // defaultExpandParent={true}
              onExpand={this.onTreeExpand.bind(this)}
            >
              {
                treeList.map((info: any) => {
                  return getTreeNode(info)
                })
              }
            </Tree>
          }

          <Form className={rStyle.form} {...formItemLayout} onSubmit={this.handleOk.bind(this)}>
            <Row>
              <Col span={24}>
                <Form.Item label='资源名称'>
                  {getFieldDecorator('name', {
                    initialValue: editInfo !== null ? editInfo.name : '',
                    rules: [{ required: true, message: '请输入名称' }],
                  })(
                    <Input
                      maxLength={INPUT_MAXLENGTH}
                      placeholder=""
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label='URL'>
                  {getFieldDecorator('url', {
                    initialValue: editInfo !== null ? editInfo.url : '',
                    rules: [{ required: true, message: '请输入名称' }],
                  })(
                    <Input
                      maxLength={INPUT_MAXLENGTH}
                      placeholder=""
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label='可用状态'>
                  {getFieldDecorator('state', {
                    initialValue: editInfo !== null ? editInfo.state : '',
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
            <Row className={rStyle.btnRow}>
              <Button type='primary' onClick={this.handleOk.bind(this)}>保存</Button>
            </Row>
          </Form>
        </div>

      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: () => void,
  onSave: () => void,
  editInfo: null,
  activityId: any,
  chinaPrizeType: any
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_product_type' })(resourcesType)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)