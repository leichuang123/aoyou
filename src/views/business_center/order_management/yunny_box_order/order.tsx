import React from 'react'
import orderStyle from './order.module.scss'
import { connect } from 'react-redux';
import { Tabs, Form } from 'antd';
import PreOrder from './pre_order/pre_order'
import ManualOrder from './manual_order/manual_order'
const { TabPane } = Tabs;

// import { 
  
// } from '../../../../server/api'
// const { Option } = Select;

interface IProps {
  dispatch: Function,
}

interface IState {
}

class Order extends React.PureComponent<IProps, IState> {
  state = {
    tabIndex: 1
  }
  private tabChange(val:any) {
    this.setState({
      tabIndex: +val
    })
  }
  componentDidMount () {
    
  }

  render () {    
    return (
      <div className={orderStyle.body}>
        <div className={orderStyle.nav}>
          <Tabs type="card" style={{ width: "100%" }} onChange={this.tabChange.bind(this)}>
            <TabPane tab="预下单" key="1">
              {
                this.state.tabIndex === 1 &&
                <PreOrder />
              }
            </TabPane>
            <TabPane tab="手工订单" key="2">
              {
                this.state.tabIndex === 2 &&
                <ManualOrder />
              }
            </TabPane>
          </Tabs>
        </div>
        
      </div>
    )
  }
}

interface stateType {
  // user: userProps,
  isShowLoading: Boolean
}

const order = Form.create({ name: 'order' })(Order)


export default connect(
  (state: stateType) => ({
    // user: state.user,
    isShowLoading: state.isShowLoading
  })
)(order)