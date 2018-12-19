import React, {Component} from 'react';
import logo from './assets/logo.svg';
import './styles/App.css';

import SimpleConnect from './components/SimpleConnect';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
        </header>
        <main>
          <SimpleConnect/>
        </main>
      </div>);
  }
}

export default App;
