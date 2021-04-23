import React, {useState, useEffect} from 'react';
import {
  Link
} from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { Hub } from 'aws-amplify';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { ReactComponent as ExitIcon } from '../../assets/door-open.svg';
import { ReactComponent as MegaPhoneIcon } from '../../assets/megaphone.svg';
import { ReactComponent as ChatIcon } from '../../assets/chat-text.svg';

import './TopNavigation.css';

const TopNavigation = props => {
  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();
  const [userInitials, setUserInitials] = useState('')

  const logout = async () => {
    oktaAuth.signOut();
    Hub.dispatch(
      'oktaAuth',
      {
          event: 'userDataUpdated',
          lastName: '',
          firstName: '',
          email:''
        });
  }

  useEffect(() => {
    if (authState.isPending) return null;

    if (authState.isAuthenticated) {

      oktaAuth.token.getUserInfo().then((data) => {
        setUserInitials(data.given_name[0] + data.family_name[0])
        Hub.dispatch(
          'oktaAuth',
          {
              event: 'userDataUpdated',
              lastName: data.family_name,
              firstName: data.given_name,
              email: data.email
            });
          })}
  }, [authState, oktaAuth]);

  const navLinks = authState.isAuthenticated ?
  <Nav className="ml-auto">
    <Nav.Link href="/chats" className="navbtn"><MegaPhoneIcon />Lifechats</Nav.Link>
    <Nav.Link href="/messages" className="navbtn"><ChatIcon />Messages</Nav.Link>
    <Nav.Link href="/profile" className="navbtn">{userInitials} Profile</Nav.Link>
    <Nav.Link className="navbtn" onClick={logout}><ExitIcon /></Nav.Link>
  </Nav> : null ;

  return (
    <>
    <Navbar className="top-navigation">
      <Navbar.Brand href="/">
        <div className="d-inline-block logo-name">
          <h1>Modular Chatter</h1>
        </div>
      </Navbar.Brand>
      {navLinks}
    </Navbar>
    </>
  );
}

export default TopNavigation;
