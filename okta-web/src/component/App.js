import React from 'react';
import { Route } from 'react-router-dom';
import Home from '../container/HomeContainer';
import Profile from '../component/Profile';
import LoginCallback from './LoginCallback';
import LogoutCallback from './LogoutCallback';
import ProtectedRoute from './ProtectedRoute';

function App() {

  return (
    <>
      <Route path="/" exact={true} component={Home} />
      <Route path="/authorization-code/callback" render={props => <LoginCallback {...props} />} />
      <Route path="/logout" render={props => <LogoutCallback {...props} />} />
      <ProtectedRoute path="/profile" component={Profile} />
    </>
  );
}

export default App;
