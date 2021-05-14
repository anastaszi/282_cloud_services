import React, {useState, useEffect} from 'react';
import {
  Link
} from "react-router-dom";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import UserService from '../../services/UserService';
import UtilService from '../../services/UtilService';
import { Hub, Cache } from 'aws-amplify';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { ReactComponent as ExitIcon } from '../../assets/door-open.svg';
import { ReactComponent as MegaPhoneIcon } from '../../assets/megaphone.svg';
import { ReactComponent as ChatIcon } from '../../assets/chat-text.svg';
import { ReactComponent as AdminIcon } from '../../assets/cpu.svg';
import { ReactComponent as ProfileIcon } from '../../assets/person-badge.svg';

import './TopNavigation.css';

const TopNavigation = props => {
  const history = useHistory();
  const { oktaAuth, authState } = useOktaAuth();
  const [admin, setAdmin] = useState(false);

  const logout = async () => {
    oktaAuth.signOut();
    Hub.dispatch('oktaAuth',{event: 'userDataDeleted'});
    Cache.clear();
  }

  useEffect(() => {
    if (authState.isPending) return null;

    if (authState.isAuthenticated) {
      oktaAuth.token.getUserInfo().then((data) => {
        setAdmin(data.employeeGroup == 'admin');
        Cache.setItem('userLastName', data.family_name);
        Cache.setItem('userFirstName', data.given_name);
        Cache.setItem('userEmployeeGroup',data.employeeGroup);
        Cache.setItem('userId',data.employeeNum);
        Cache.setItem('token', authState.idToken.value);
        Cache.setItem('nonce', authState.idToken.claims.nonce);
        Cache.setItem('email', data.email);
        Hub.dispatch('oktaAuth',{event: 'userDataFetched'});
        getInterests();
        getPositions();
        getDepartments();
      })}
  }, [authState, oktaAuth]);

  const getInterests = () => {
    const expirationDay = new Date();
    expirationDay.setDate(expirationDay.getDate() + 1);
    if (!Cache.getItem('interests')) {
      UtilService.getInterests().then((res) => {
      if (res && res.data.length > 0)
        Cache.setItem('interests', res.data, { expires: expirationDay.getTime() })
      }).catch(e => console.log(e))
    }
  }

  const getDepartments = () => {
    const expirationDay = new Date();
    expirationDay.setDate(expirationDay.getDate() + 1);
    if (!Cache.getItem('departments')) {
      UtilService.getDepartments().then((res) => {
      if (res && res.data.length > 0)
        Cache.setItem('departments', res.data, { expires: expirationDay.getTime() })
      }).catch(e => console.log(e))
    }
  }

  const getPositions = () => {
    const expirationDay = new Date();
    expirationDay.setDate(expirationDay.getDate() + 1);
    if (!Cache.getItem('roles')) {
      UtilService.getPositions().then((res) => {
        if (res && res.data.length > 0)
          Cache.setItem('roles', res.data[0].details, { expires: expirationDay.getTime() })
      }).catch(e => console.log(e))
    }
  }

  const navLinks = authState.isAuthenticated ?
  <Nav className="ml-auto">
    <Nav.Link href="/admin" className="navbtn"><AdminIcon />Admin</Nav.Link>
    <Nav.Link href="/chats" className="navbtn"><MegaPhoneIcon />Lifechats</Nav.Link>
    <Nav.Link href="/messages" className="navbtn"><ChatIcon />Messages</Nav.Link>
    <Nav.Link href="/profile" className="navbtn"><ProfileIcon />Profile</Nav.Link>
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
