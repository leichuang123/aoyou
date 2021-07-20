import React from 'react'
import tdStyle from './type_dialog.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Modal, Breadcrumb, message, Form, Icon, Card, } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { getProductTypeList } from '../../../../server/api'


interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
  onClose: (isRefresh: boolean) => void,
  onOk: (id: number, name: string) => void
}

interface IState {
  breadcrumbList: any,
  list: any,
  currentList: any,
  id: number,
}

class TypeDialog extends React.PureComponent<IProps, IState> {

  state: any = {
    breadcrumbList: [],
    list: [],
    currentList: [],
    id: 0,
  }

  componentDidMount() {
    this.getList()
  }

  private async getList () {
    let res = await getProductTypeList({pageSize: 9999})
    if (res.code !== 200) {
      message.error(res.message)
      return
    }
    this.setState({
      list: res.data.dataList
    }, () => {
      this.getCurrentList()
    })
  }

  private getCurrentList () {
    let currentList = this.state.list.filter((item: any) => {
      let b = item.parentId === this.state.id
      if (b) {
        item.hasChild = this.state.list.filter((obj: any) => {
          return obj.parentId === item.id
        }).length > 0
      }
      return b
    })
    this.setState({
      currentList
    })
  }


  private handleCancel() {
    this.props.form.resetFields()
    this.props.onClose(false)
  }

  private handleOk () {
    let currentItem: any = null
    this.state.list.forEach((item: any) => {
      if (item.id === this.state.id) {
        currentItem = item
      }
    })
    if (this.state.id === 0 || currentItem.hasChild) {
      message.error('请选择商品类型')
      return
    }
    this.props.onOk(this.state.id, this.state.breadcrumbList.map((item: any) => {
      return item.name
    }).join('/'))
  }

  private all () {
    this.setState({
      id: 0
    }, () => {
      this.getCurrentList()
    })
  }

  private chooseItem (info: any) {
    if (this.state.id === info.id) {
      return
    }
    let currentItem: any = null
    let breadcrumbList = JSON.parse(JSON.stringify(this.state.breadcrumbList))
    this.state.list.forEach((item: any) => {
      if (item.id === this.state.id) {
        currentItem = item
      }
    })
    let newItem = {
      id: info.id,
      name: info.name
    }
    if (currentItem !== null && info.parentId === currentItem.parentId && breadcrumbList.length > 0) {
      breadcrumbList[breadcrumbList.length - 1] = newItem
    } else {
      breadcrumbList.push(newItem)
    }
    this.setState({
      id: info.id,
      breadcrumbList,
    }, () => {
      if (!info.hasChild) {
        return
      }
      this.getCurrentList()
    })
  }

  private chooseBread (index: number, info: any) {
    let breadcrumbList = this.state.breadcrumbList.splice(0, index + 1)
    this.setState({
      id: info.id,
      breadcrumbList
    }, () => {
      this.getCurrentList()
    })
  }

  render() {
    const { breadcrumbList, currentList, id } = this.state
    return (
      <Modal
        title='新建商品'
        visible={true}
        maskClosable={false}
        width='800px'
        okText="下一步"
        onOk={this.handleOk.bind(this)}
        onCancel={this.handleCancel.bind(this)}
      >
        <h2>选择商品类别</h2>
        <Card>
          <Breadcrumb className={tdStyle.bread}>
            <Breadcrumb.Item onClick={this.all.bind(this)}>全部</Breadcrumb.Item>
            {
              breadcrumbList.map((item: any, index: number) => {
                return <Breadcrumb.Item key={index} onClick={this.chooseBread.bind(this, index, item)}>{item.name}</Breadcrumb.Item>
              })
            }
          </Breadcrumb>
          <div>
            {
              currentList.map((item: any, index: number) => {
                return <p key={index} className={`${tdStyle.item} ${item.id === id ? tdStyle.active : ''}`} onClick={this.chooseItem.bind(this, item)}>
                  <span>{item.name}</span>
                  {
                    item.hasChild && <Icon type="right" />
                  }
                </p>
              })
            }
          </div>
        </Card>
        
      </Modal>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

interface ComponentPropsInterface extends FormComponentProps {
  onClose: (isRefresh: boolean) => void,
  onOk: (id: number, name: string) => void,
}

const WrappedHorizontalLoginForm = Form.create<ComponentPropsInterface>({ name: 'horizontal_active_edit' })(TypeDialog)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)