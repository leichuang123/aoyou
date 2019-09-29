import React from 'react';
import logo from './logo.svg';
import './App.css';
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
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <p className='login' onClick={this.login.bind(this)} >登录</p>
        </header>
    </div>
    )
  }
}

export default App;
