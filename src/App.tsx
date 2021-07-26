import React, { FC } from 'react';
import './App.css';
import ChatRoom from './bundle/ChatRoom/ChatRoom';
import Login from './bundle/Login/Login';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './instances/i18next.js';

const App: FC = () => {
  return (
    <Router>
      <div className="App">
        <div className="row">
        </div>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/login" exact component={Login} />
          <Route path="/chatRoom" exact component={ChatRoom} />
        </Switch>
      </div>
    </Router>

  );
}

export default App;
