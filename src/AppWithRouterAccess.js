import React from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { useOktaAuth } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { DashboardPage } from './pages/dashboard';
import { UIPage } from './pages/ui';
import { ProfilePage } from './pages/profile';
import { AdminPage } from './pages/admin';
import { ChatsPage } from './pages/chats';
import { MessagesPage } from './pages/messages';
import { TopNavComponent } from './components/top-navigation';
import { LoginPage } from './pages/login';
import { Maps, MapsPage } from './pages/maps';
import './App.css';
import { oktaAuthConfig, oktaSignInConfig } from './config';

const oktaAuth = new OktaAuth(oktaAuthConfig);

const AppWithRouterAccess = () => {
  const history = useHistory();

  const customAuthHandler = () => {
    history.push('/login');
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };

  return (
    <Security
    oktaAuth={oktaAuth}
    onAuthRequired={customAuthHandler}
    restoreOriginalUri={restoreOriginalUri}
  >
      <div className="page-container">
        <TopNavComponent />
        <Container fluid="true" className="d-flex h-100 flex-column" >
                {/* A <Switch> looks through its children <Route>s and
                  renders the first one that matches the current URL. */}
              <Switch>
              <Route path="/ui">
                <UIPage />
              </Route>
                < SecureRoute path="/admin">
                  <AdminPage />
                </SecureRoute>
                < SecureRoute path="/profile">
                  <ProfilePage />
                </SecureRoute>
                <SecureRoute path="/chats">
                  <ChatsPage />
                </SecureRoute>
                <SecureRoute path="/messages">
                  <MessagesPage />
                </SecureRoute>
                <SecureRoute path="/maps">
                  <MapsPage />
                </SecureRoute>
                <SecureRoute path="/" exact={true}>
                  <DashboardPage />
                </SecureRoute>
                <Route path="/login" render={() => <LoginPage config={oktaSignInConfig} />} />
                <Route path='/login/callback' component={LoginCallback} />
              </Switch>
        </Container>
      </div>
    </Security>
  );
}

export default AppWithRouterAccess;
