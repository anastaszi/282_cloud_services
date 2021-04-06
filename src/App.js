import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { DashboardPage } from './pages/dashboard';
import { UIPage } from './pages/ui';
import { ProfilePage } from './pages/profile';
import { ChatsPage } from './pages/chats';
import { MessagesPage } from './pages/messages';
import { TopNavComponent } from './components/top-navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="page-container">
        <TopNavComponent />
        <Container fluid="true" className="d-flex h-100 flex-column" >
                {/* A <Switch> looks through its children <Route>s and
                  renders the first one that matches the current URL. */}
              <Switch>
              <Route path="/ui">
                <UIPage />
              </Route>
                <Route path="/profile">
                  <ProfilePage />
                </Route>
                <Route path="/chats">
                  <ChatsPage />
                </Route>
                <Route path="/messages">
                  <MessagesPage />
                </Route>
                <Route path="/">
                  <DashboardPage />
                </Route>
              </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
