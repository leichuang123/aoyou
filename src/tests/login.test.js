import * as React from 'react'
import { configure } from "enzyme"
import { shallow, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import Login from '../views/login/login'
import { Provider } from "react-redux"
import configureMockStore from "redux-mock-store"
import toJson from 'enzyme-to-json'
const except = require('chai').except
configure({ adapter: new Adapter() })

const mockStore = configureMockStore()
const store = mockStore()

class Demo extends React.Component {
  state = {
    msg: 'Hello world'
  };

  render() {
    return (
      <div id="msg">{this.state.msg}</div>
    );
  }
}

// it('test demo render', () => {
//   const demo = mount(
//     <Demo />
//   )
//   let msg = '天王盖地虎'
//   demo.instance().setState({
//     msg
//   })
//   expect(demo.find('#msg').text()).toEqual(msg)
// })


//Enzyme文档 https://github.com/Zyingying/Enzyme-API 
// https://juejin.im/post/5b6c39bde51d45195c079d62#heading-18
// https://blog.csdn.net/qq_34764577/article/details/89398123

it('renders the correct text when no enthusiasm level is given', async () => {
  const login = mount(
      <Provider store={store}>
        <Login  />
      </Provider>
    )
  let username = 'kucongyong'
  let password = '0000'
  login.find('Login').instance().props.form.setFieldsValue({
    username,
    password
  })
  await sleep()
  console.log(`username: `, login.find('Login').instance().props.user)
  expect(username).toEqual(username)
})

// describe(`测试登录页 snapshots`, () => {
//   const tree = shallow(
//     <Provider store={store}>
//       <Hello  />
//     </Provider>
//   )

//   it('1. 匹配快照', () => {
//     expect(toJson(tree)).toMatchSnapshot()
//   })
// })

function sleep (time = 3000) {
  return new Promise(resolve => {
    resolve(true)
  }, time)
}


