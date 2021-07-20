import React from 'react'
import { Input, Form, Switch } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { INPUT_MAXLENGTH } from '../../../../config/config'

interface IProps {
  dispatch: Function,
  form: any,
  dictTypeModalInitValue: any,
}

interface IState {
  
}

interface ComponentPropsInterface extends FormComponentProps{
  dictTypeModalInitValue: null
}



class dictTypeForm extends React.PureComponent<IProps, IState> {
  
  render() {
    let dictTypeModalInitValue = this.props.dictTypeModalInitValue;
    const { getFieldDecorator } = this.props.form;
    const isCreate = !!dictTypeModalInitValue
    let dictTypeState;
    if(dictTypeModalInitValue) {
      dictTypeState = dictTypeModalInitValue.state === 1 ? true : false
    }
   
    return (
      <Form layout="inline" > 
        <Form.Item label="字典类型">
          {
            getFieldDecorator("name", {
              rules: [{required: true, message: '请输入字典类型'}],
              initialValue: dictTypeModalInitValue ? dictTypeModalInitValue.name : ""
            })(
              <Input maxLength={INPUT_MAXLENGTH} disabled={isCreate} style={{ width: 150 }} allowClear placeholder="请输入字典类型"  />
            )
          }
        </Form.Item>
        <Form.Item label="字典编号">
          {
            getFieldDecorator("codeTypeNo", {
              rules: [{required: true, message: '请输入字典编号'}],
              initialValue: dictTypeModalInitValue ? dictTypeModalInitValue.codeTypeNo : ""
            })(
              <Input maxLength={INPUT_MAXLENGTH} disabled={isCreate} style={{ width: 150 }} allowClear placeholder="请输入字典编号"  />
            )
          }
        </Form.Item>
        <Form.Item label="是否可用">
          {
            getFieldDecorator("state", {
              valuePropName: 'checked',
              initialValue: dictTypeModalInitValue ? dictTypeState : false
            })(
              <Switch checkedChildren="是" unCheckedChildren="否" />
            )
          }
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create<ComponentPropsInterface>()(dictTypeForm);
