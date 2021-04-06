import React, {useState, useEffect} from 'react';
import {
  Link
} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { ReactComponent as ExitIcon } from '../../assets/door-open.svg';
import { ReactComponent as MegaPhoneIcon } from '../../assets/megaphone.svg';
import { ReactComponent as ChatIcon } from '../../assets/chat-text.svg';
import './TopNavigation.css';

const TopNavigation = props => {
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    // Check if user logged In and set users initials
    setUser({name: "Leya", lastName: "Zoya"});
    setUserInitials("LZ")
  }, []);

  return (
    <>
    <Navbar className="top-navigation">
      <Navbar.Brand href="/">
        <div className="d-inline-block logo-name">
          <h1>Modular Chatter</h1>
        </div>
      </Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link href="/chats" className="navbtn"><MegaPhoneIcon />Lifechats</Nav.Link>
        <Nav.Link href="/messages" className="navbtn"><ChatIcon />Messages</Nav.Link>
        <Nav.Link href="/profile" className="navbtn">{userInitials} Profile</Nav.Link>
        <Nav.Link className="navbtn"><ExitIcon /></Nav.Link>
      </Nav>

    </Navbar>
    </>
  );
}

export default TopNavigation;
