import React from 'react';
import logo from './logo.svg';
import Button from 'antd/es/button'
import './App.scss';
import { RouteComponentProps  } from 'react-router-dom'

interface Props {
}

class App extends React.Component<RouteComponentProps & Props> {
  private login = () => {
    this.props.history.push('/login')
  }
  
  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <Button type='primary' className='login' onClick={this.login.bind(this)} >测试路由</Button>
        </header>
    </div>
    )
  }
}

export default App;
