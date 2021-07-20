import React from 'react'
import { connect } from 'react-redux';
import { userProps } from '../../../../../interface/user'
import { RouteComponentProps  } from 'react-router-dom'
import { FormComponentProps } from 'antd/es/form';
import { Form, Input, Button, Drawer, Row, Col, Select, Upload, message, Checkbox, Divider, InputNumber } from 'antd'
// import { createUser } from '../../../../server/api'
import articleStyle from './detail.module.scss'
import { UPLOAD_IMAGE_TYPE, IMAGE_PREFIX, INPUT_MAXVALUE, } from '../../../../../config/config'
import { queryDictList, insertArticle, getArticleDetail, updateArticle } from '../../../../../server/api'
import { BASE_URL, } from '../../../../../config/request_config'
import { getUploadHeader } from '../../../../../tools/tools'


const { Option } = Select
interface Props {
  user: userProps,
  dispatch: Function,
  form:any,
  handleClose: Function,
  contentNo: string,
  // form: {
  //   validateFields: Function,
  //   getFieldDecorator: Function
  //   resetFields: Function
  // }
}

class ArticleDetail extends React.Component<RouteComponentProps & Props> {
  state:any = {
    typeList:[],
    stateList:[{id:0,name:'下架',serialNo:0},{id:1,name:'上架',serialNo:1}],
    categoriesList:[],
    platformListList:[],
    type: '',
    categories: '',
    state:'',
    articleList: [],
    platform_type:[],
    orderNumber: 9999,
  }
  constructor(props:any) {
    super(props);
    this.init = this.init.bind(this)
    this.getDictList = this.getDictList.bind(this)
    this.typeChange = this.typeChange.bind(this);
    this.addP = this.addP.bind(this)
    this.addImg = this.addImg.bind(this)
    this.imgOnchange = this.imgOnchange.bind(this)
    this.confirm = this.confirm.bind(this)
    this.titleChange = this.titleChange.bind(this)
    this.dwClose = this.dwClose.bind(this)
    this.getArticleInfo = this.getArticleInfo.bind(this)
    this.orderNumChangeChange = this.orderNumChangeChange.bind(this)
  }

  componentDidMount() {
    this.init()
    
  }

  private handleOk(){
    this.props.form.validateFields(async (err: any, data: any) => {
      
    });
  }
  private async init() {
    this.getArticleInfo()
    let typeList:any = await this.getDictList('contents_type')
    let categoriesList:any = await this.getDictList('contents_categories')
    let platformListList:any = await this.getDictList('platform_type')
    this.setState({
      typeList:typeList,
      categoriesList: categoriesList,
      platformListList: platformListList,
    })
  }
  private async getArticleInfo() {
    if(this.props.contentNo) {
      let params = {
        contentNo: this.props.contentNo
      }
      let response = await getArticleDetail(params)
      if(response.code !== 200) {
        return false
      }
      if(!response.data) {
        message.warn('后台返回数据为空，请联系管理员')
        return false
      }
      let platform:any = []
      response.data.platformList.forEach((item:any) => {
        platform.push(item.platform)
      })
      this.setState({
        articleList: JSON.parse(response.data.content),
        type:response.data.type,
        categories: response.data.categories,
        title: response.data.title,
        platform_type: platform,
        state:response.data.state,
        orderNumber: response.data.orderNumber
      })
    }
  }
  private async getDictList(name:string) {
    let params = {
      pageSize: 99999,
      codeTypeNo: name,
    }
    let response = await queryDictList(params);
    if (response.code !== 200) {
      return []
    }
    return !this.props.contentNo ? response.data.dataList.filter((item: any) => {
      return item.state === 1
    }) : response.data.dataList
  }

  private typeChange(val:any,e:any) {
    console.log(val,e.target)
    // this.setState({
    //   type: e.target
    // })
  }

  private categoriesChange() {

  }

  private platformListChange() {

  }
  
  private articleListRemove(val:any) {
    let list = this.state.articleList
    list.splice(val,1)
    this.setState({
      articleList: [...list]
    })
  }

  private addP() {
    let child:any = {
      type: "text",
      value: ""
    }
    this.setState({
      articleList: [...this.state.articleList, child]
    })
  }
  private addImg(url: string) {
    let child:any = {
      type: 'image',
      value: `${IMAGE_PREFIX}${url}`
    }
    this.setState({
      articleList: [...this.state.articleList, child]
    })
  }
  private imgOnchange(info:any) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      const url = info.file.response.data.url
      this.addImg(url)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  private textInput(val:any, e:any) {
    let list = this.state.articleList;
    list[val].value = e.target.value;
    this.setState({
      articleList: [...list]
    })
  }
  private orderNumChangeChange () {

  }
  private async confirm() {
    this.props.form.validateFields(async (err: any, data: any) => {
      if (err) {
        return
      }
      let contentList =  this.state.articleList;
      // 段落可能为空，循环剔除空段落
      let contentFilter = contentList.filter((element:any) => {
        return element.type !== 'text' || (element.type === 'text' && element.value !== "")
      });
      if(contentFilter.length === 0) {
        message.warn("文章内容不能为空")
        return
      }
      let params:any ={
        content: JSON.stringify(contentFilter),
      }
      Object.assign(params, data)
      params.platformList = data.platform
      if(this.props.contentNo) {
        params.contentNo = this.props.contentNo
        // params.title = '无法连接云主机'
        // params.contentNo = 'AYWZBH202007080003'
        let response:any = await updateArticle(params)
        if(response.code !== 200) {
          message.error(response.message)
          return
        }
        message.success('保存成功')
        this.props.handleClose(true)
      } else {
        let response:any = await insertArticle(params)
        if(response.code !== 200) {
          message.error(response.message)
          return
        }
        message.success('保存成功')
        this.props.handleClose(true)
      }
    })
  }
  private titleChange(e:any){
    console.log(e.target.value)
  }
  dwClose() {
    this.props.handleClose()
  }
  render () {
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    
    const { typeList, stateList, categoriesList, platformListList } = this.state
    const { getFieldDecorator } = this.props.form;
    const headers: any = getUploadHeader()
    const upConfig:any = {
      name: 'file',
      action: BASE_URL + '/oss/upload',
      data: {
        type: UPLOAD_IMAGE_TYPE
      },
      headers,
      multiple: false,
      showUploadList: false,
    }
    return (
      <Drawer
        visible={true}
        title={`${this.props.contentNo ? '编辑' : '创建'}文章`}
        width="800px"
        maskClosable={false}
        onClose={this.dwClose}
      >
        <div className={`drawer-operation-btn`}>
          <Button className='sure-btn' type="primary" onClick={this.confirm}>保存</Button>
          <Button className='cancel-btn' onClick={this.dwClose}>取消</Button>
        </div>
        <Form {...formItemLayout} onSubmit={this.confirm}>
          <Row>
            <Col span={8}>
              <Form.Item label='文章类型' key="type">
                {
                  getFieldDecorator("type", {
                    rules: [{required: true, message: '请选择文章类型'}],
                    initialValue: this.state.type
                  })(
                    <Select style={{ width: 120 }} disabled={!!this.props.contentNo}>
                      {
                        typeList.map((item:any) => {
                        return <Option key={item.id} value={item.serialNo}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label='文章分类' key="categories" >
                {
                  getFieldDecorator("categories", {
                    rules: [{required: true, message: '请选择文章分类'}],
                    initialValue: this.state.categories
                  })(
                    <Select style={{ width: 120 }}>
                      {
                        categoriesList.map((item:any) => {
                          return <Option disabled={item.state === 0} key={item.serialNo} value={item.serialNo}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item key="state" label='文章状态' >
                {
                  getFieldDecorator("state", {
                    rules: [{required: true, message: '请输选择状态'}],
                    initialValue: this.state.state
                  })(
                    <Select style={{ width: 120 }}>
                      {
                        stateList.map((item:any) => {
                        return <Option value={item.serialNo} key={item.serialNo}>{item.name}</Option>
                        })
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label='绑定的端' labelCol={{span: 3}} >
                {
                  getFieldDecorator("platform", {
                    rules: [{ required: true, message: '请输选择绑定的端' }],
                    initialValue: this.state.platform_type
                  })(
                    // <Select style={{ width: 120 }} onChange={this.platformListChange}>
                    //   {
                    //     platformListList.map((item:any) => {
                    //     return <Option value={item.key} key={item.key}>{item.name}</Option>
                    //     })
                    //   }
                    // </Select>
                    <Checkbox.Group>
                      {
                        platformListList.map(((item: any, index: number) => {
                          return <Checkbox key={index} value={item.serialNo}>{item.name}</Checkbox>
                        }))
                      }
                    </Checkbox.Group>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
          <Row>
            
            <Col span={19}  >
              <Form.Item label='标题' labelCol={{ span: 3 }}  >
              {
                getFieldDecorator("title", {
                  rules: [{required: true, message: '请输填写标题'}],
                  initialValue: this.state.title
                })(
                  <Input onChange={this.titleChange} />
                )
              }
            </Form.Item>
            </Col>
            {/* <Col span={5}>
              <Button type="primary" onClick={this.confirm}>保存</Button>
            </Col> */}
          </Row>
          <Row>

            <Col span={24}  >
              <Form.Item label='排序值' labelCol={{ span: 3 }}  >
                {
                  getFieldDecorator("orderNumber", {
                    rules: [{ required: false, message: '' }],
                    initialValue: this.state.orderNumber
                  })(
                    <InputNumber style={{ width: '200px' }} placeholder="" max={INPUT_MAXVALUE} />
                  )
                }
                <span className={`${articleStyle.orderNumTip}`}>(数值越小展示越靠前)</span>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        
        
        <Divider />
        <Button type="link" onClick={this.addP}>添加文字</Button>
        <Upload {...upConfig} onChange={this.imgOnchange}>
          <Button type="link">添加图片</Button>
        </Upload>
        <div className={articleStyle.inputarea}>
          {
            this.state.articleList.map((item:any, index:number) => {
              if(item.type === 'image') {
                return(
                  <div key={index} className={`${articleStyle.inline} ${articleStyle.imgItem} flex img-content`}>
                    <img src={item.value} alt="1"/>
                    <Button onClick={this.articleListRemove.bind(this, index)} className={`${articleStyle.delBtn}`}>删除</Button>
                  </div>
                )
              } else {
                return (
                  <div key={index} className={`${articleStyle.inline} ${articleStyle.textItem}`}>
                    <textarea className={articleStyle.p} onChange={this.textInput.bind(this, index)} value={item.value}></textarea>
                    <Button onClick={this.articleListRemove.bind(this, index)} className={`${articleStyle.delBtn}`} >删除</Button>
                  </div>
                )
              }
            })
          }
        </div>
        <div className={articleStyle.footerPlaceholder}></div>
      </Drawer>
    )
  }
}

interface stateType {
  user: userProps,
  articleList: any,
}

interface ComponentPropsInterface extends FormComponentProps {
  handleClose: (isRefresh: boolean) => void,
  contentNo: string,
}

const WrappedNormalLoginForm = Form.create<ComponentPropsInterface>({ name: 'article_detail' })(ArticleDetail)

export default connect(
  (state: stateType) => ({
    user: state.user
  })
)(WrappedNormalLoginForm)