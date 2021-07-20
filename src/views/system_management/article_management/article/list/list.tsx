import React from 'react'
import './list.module.scss'
import { connect } from 'react-redux';
import { Input, Button, Pagination, Table, Form, Select } from 'antd';
import ArticleDetail from '../detail/detail'
import { FormComponentProps } from 'antd/es/form';

import { PAGE_SIZE, INPUT_MAXLENGTH } from '../../../../../config/config'
import { queryDictList, getArticleList } from '../../../../../server/api'

const { Option } = Select;
const { Search } = Input;
interface IProps {
  dispatch: Function,
  history:any,
}

interface IState {
  title: string,
  articleCategoriesList: any,
  categories: string,
  type: any,
  currentPage: number,
  pageSize: number,
  articleList: any,
  totalCount:number,
  showArticleDetail: boolean,
  selectContentNo: string,
  contentNo: string,
  articleTypeList:any,
}


class ArticleList extends React.PureComponent<IProps, IState> {
  constructor(props:any) {
    super(props)
    this.queryCategories = this.queryCategories.bind(this)
    this.queryTypes = this.queryTypes.bind(this)
    this.getArticleList = this.getArticleList.bind(this)
    this.categoriesChange = this.categoriesChange.bind(this)
    this.typeChange = this.typeChange.bind(this)
    this.createArticle = this.createArticle.bind(this)
    this.hideArticleDetail = this.hideArticleDetail.bind(this)
    // this.editArticleDetail = this.editArticleDetail.bind(this)
  }
  state:any = {
    title: "", // 文章标题
    articleCategoriesList: [], // 文章分类列表
    articleTypeList: [], // 文章类型列表
    categories: "",
    currentPage:1,
    pageSize: PAGE_SIZE,
    articleList: [],
    totalCount:0,
    showArticleDetail: false,
    contentNo: 0,
    type: "",
  }

  componentDidMount () {
    this.queryCategories()
    this.queryTypes()
    this.getArticleList()
  }
  
  private hideArticleDetail(isFresh:boolean) {
    this.setState({
      showArticleDetail: false
    })
    if(isFresh) {
      this.getArticleList()
    }
  }

  private async getArticleList() {
    let params = {
      categories: this.state.categories,
      title: this.state.title,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      type: this.state.type,
    }
    let response:any = await getArticleList(params)
    if(response.code !== 200) {
      return false
    }
    response.data.dataList.forEach((item: any, index: number) => {
      item.index = (this.state.currentPage - 1) * this.state.pageSize + index + 1
    })
    this.setState({
      articleList:response.data.dataList,
      totalCount:response.data.page.totalCount
    })
  }

  private handleSubmit() {

  }
  private categoriesChange(val:any) {
    this.setState({
      currentPage: 1,
      categories: val
    }, () => {
      this.getArticleList()
    })
  }
  private typeChange(val:any) {
    this.setState({
      currentPage: 1,
      type: val
    },() => {
      this.getArticleList()
    })
  }
  // contents_type
  // contents_categories
  private async queryCategories() {
    let params = {
      pageSize: 99999,
      codeTypeNo: 'contents_categories',
    }
    let response = await queryDictList(params);
    if (response.code !== 200) {
      return false
    }
    this.setState({
      articleCategoriesList: response.data.dataList
    })
  }
  private async queryTypes() {
    let params = {
      pageSize: 99999,
      codeTypeNo: 'contents_type',
    }
    let response = await queryDictList(params);
    if (response.code !== 200) {
      return false
    }
    this.setState({
      articleTypeList: response.data.dataList
    })
  }

  private onSearch(title:any) {
    this.setState({
      currentPage: 1,
      title: title
    },() => {
      this.getArticleList()
    })
  }

  private pageSizeChange(current:number, size:number) {
    this.setState({
      pageSize: size
    }, () => {
      this.getArticleList();
    })
  }

  private currentPageChange(page:any, pageSize:any) {
    this.setState({
      currentPage: page
    }, () => {
      this.getArticleList();
    })
  }
  private editArticleDetail(val:any) {
    this.setState({
      contentNo: val.contentNo
    },() =>{
      this.setState({
        showArticleDetail: true,
      })
    })
  }
  private createArticle() {
    this.setState({
      contentNo: ''
    },() =>{
      this.setState({
        showArticleDetail: true,
      })
    })
  }
  render () {
    const { articleCategoriesList, articleTypeList } = this.state
    const columns:any = [
      {
        
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 100,
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '文章编号',
        dataIndex: 'contentNo',
        key: 'contentNo'
      },
      {
        title: '排序值',
        dataIndex: 'orderNumber',
        key: 'orderNumber',
         width: 100,
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text:any, record:any) => (
          <div>{['已下架','已上架'][text]}</div>
        )
      },
      {
        title: '文章分类',
        dataIndex: 'categories',
        key: 'categories',
        width: 200,
        render:(text:any,record:any) => {
          if(this.state.articleCategoriesList.length > 0) {
            let ele:any = <div>-</div>;
            this.state.articleCategoriesList.forEach((item:any) => {
              if(+item.serialNo === +text) {
                ele =(<div>{item.name}</div>)
              }
            })
            return ele;
          } else {
            return <div>-</div>
          }
        }
      },
      {
        title: '文章类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render:(text:any,record:any) => {
          if(this.state.articleTypeList.length > 0) {
            let ele:any = <div>-</div>;
            this.state.articleTypeList.forEach((item:any) => {
              if(+item.serialNo === +text) {
                ele =(<div>{item.name}</div>)
              }
            })
            return ele;
          } else {
            return <div>-</div>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'op',
        key: 'op',
        width: 100,
        fixed: "right",
        render: (text:any, record:any) => (
          <div>
            <Button type="link" onClick={this.editArticleDetail.bind(this,record)}>编辑</Button>
          </div>
        )
      },
    ]
    return (
      <div className='page'>
        <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} className='search'>
          <div className='flex-between'>
            <div>
              <Form.Item label='标题'>
                <Search
                  placeholder=""
                  maxLength={INPUT_MAXLENGTH}
                  onSearch={this.onSearch.bind(this)}
                />
              </Form.Item>
              <Form.Item label='分类'>
                {
                  articleCategoriesList.length > 0 &&
                  <Select allowClear style={{ width: 120 }} onChange={this.categoriesChange}>
                    {
                      articleCategoriesList.map((item: any) => {
                        return (
                          <Option value={item.serialNo} key={item.serialNo}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                }
                
              </Form.Item>
              <Form.Item label='类型'>
                {
                  articleTypeList.length > 0 &&
                  <Select allowClear style={{ width: 120 }} onChange={this.typeChange}>
                    {
                      articleTypeList.map((item: any) => {
                        return (
                          <Option value={item.serialNo} key={item.serialNo}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                }
                
              </Form.Item>
            </div>
            <div>
              <Button type="link" onClick={this.createArticle} >新增</Button>
            </div>
          </div>
        </Form>
        <Table
          rowKey="id"
          scroll={{ x: 1000 }}
          columns={columns}
          size="small"
          dataSource={this.state.articleList}
          bordered
          pagination={false}
        />
        <Pagination className="vendor-diver" showQuickJumper showSizeChanger current={this.state.currentPage} pageSize={this.state.pageSize} onChange={this.currentPageChange.bind(this)} onShowSizeChange={this.pageSizeChange.bind(this)} total={this.state.totalCount} />
        {
          this.state.showArticleDetail &&
          <ArticleDetail handleClose={this.hideArticleDetail} contentNo={this.state.contentNo} />
        }
      </div>
    )
  }
}

interface stateType {
}

interface ComponentPropsInterface extends FormComponentProps {
  handleClose: (isRefresh: boolean) => void,
}

export default connect(
  (state: stateType) => ({
  })
)(ArticleList)