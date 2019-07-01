import React, { Component } from 'react';
import './App.css';

import Header from '../Header/Header';
import Payment from '../Payment/Payment';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Header />
        <Payment />

      </div>
    );
  }

  
}

export default App;
