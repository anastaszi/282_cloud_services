import React, {useState, useEffect} from 'react';
import {
  Link
} from "react-router-dom";
import { ReactComponent as MegaPhoneIcon } from '../../assets/megaphone.svg';
import './UserChats.css';

const UserChats = props => {
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    // Check if user logged In and set users initials
    setUser({name: "Leya", lastName: "Zoya"});
    setUserInitials("LZ")
  }, []);

  return (
    <div className="w-100 h-100">
      <div className="section-header"><MegaPhoneIcon /><h3>My Chats</h3></div>
      <div className="section-body">Here will be chats body</div>
    </div>
  );
}

export default UserChats;
