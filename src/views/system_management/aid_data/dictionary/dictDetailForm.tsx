import React from 'react'
import { Input, Form, Switch, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { INPUT_MAXLENGTH } from '../../../../config/config'
interface IProps {
  dispatch: Function,
  form: any,
  detailAboutModalInitValue: any
}

interface IState {
  
}

interface ComponentPropsInterface extends FormComponentProps{
  detailAboutModalInitValue: null
}

class addDictFormCom extends React.PureComponent<IProps, IState> {
  render() {
    const { getFieldDecorator } = this.props.form;
    
    let detailAboutModalInitValue = this.props.detailAboutModalInitValue;
    console.log(detailAboutModalInitValue)
    // let dictDetailState;
    let cNode:any
    if(detailAboutModalInitValue) {
      // dictDetailState = detailAboutModalInitValue.state === 1 ? true : false
      cNode = detailAboutModalInitValue.cNode ? detailAboutModalInitValue.cNode : null;
    }
    return (
      <Form layout="inline" > 
        <Form.Item label="名称">
          {
            getFieldDecorator("name", {
              rules: [ {required: true, message: '请输入名称'}],
              initialValue: cNode ? cNode.name : ""
            })(
              <Input maxLength={INPUT_MAXLENGTH} style={{ width: 150 }} allowClear placeholder="名称"  />
            )
          }
        </Form.Item>
        <Form.Item label="编号">
          {
            getFieldDecorator("serialNo", {
              rules: [ {required: true, message: '请输入编号'}],
              initialValue: cNode ? cNode.serialNo : ""
            })(
              <InputNumber maxLength={INPUT_MAXLENGTH} disabled={!!cNode} min={0} max={127} style={{ width: 150 }}  placeholder="编号"  />
            )
          }
        </Form.Item>
        <Form.Item label="是否可用">
          {
            getFieldDecorator("state", {
              valuePropName: 'checked',
              initialValue: cNode ? cNode.state === 1 : false
            })(
              <Switch checkedChildren="是" unCheckedChildren="否"  />
            )
          }
        </Form.Item>
      </Form>
    )
  }
}


export default Form.create<ComponentPropsInterface>()(addDictFormCom);