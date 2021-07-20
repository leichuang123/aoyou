import React from 'react'
// import activeStyle from './active_list.module.scss'
import { connect } from 'react-redux';
import { userProps } from '../../../../interface/user'
import { Form, Tabs } from 'antd'
// import { activeCardList, operateActiveCard } from '../../../../server/api'

import ActiveCard from './active_card/active_card'
import CrystalVoucher from './crystal_voucher/crystal_voucher'
import CashVoucher from './cash_voucher/cash_voucher'
import ExperienceVoucher from './experience_voucher/experience_voucher'

const { TabPane } = Tabs;

interface IProps {
  user: userProps,
  isShowLoading: Boolean,
  dispatch: Function,
  form: any,
}

interface IState {
  panes: any,
}

class Coupon extends React.PureComponent<IProps, IState> {

  state = {
    panes: [
      { title: '水晶券', content: 'crystal_voucher', key: '2' },
      { title: '代金券', content: 'voucher', key: '3' },
      { title: '体验券', content: 'experience_coupon', key: '4' },
      { title: '激活卡', content: 'activeCard', key: '1' },
    ]
  }

  componentDidMount() {
  }
  

  render() {
    
    return (
      <div className='coupon page'>
        <Tabs
          type="card"
          animated
        >
          {this.state.panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key} >
              {pane.content === 'activeCard' && <ActiveCard />}
              {pane.content === 'crystal_voucher' && <CrystalVoucher />}
              {pane.content === 'voucher' && <CashVoucher />}
              {pane.content === 'experience_coupon' && <ExperienceVoucher />}
            </TabPane>
          ))}
        </Tabs>
      </div>
    )
  }
}

interface stateType {
  user: userProps,
  isShowLoading: Boolean
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_vm_edit' })(Coupon)

export default connect(
  (state: stateType) => ({
    user: state.user,
    isShowLoading: state.isShowLoading
  })
)(WrappedHorizontalLoginForm)