import React, {useState, useEffect} from 'react';
import { ReactComponent as ChatIcon } from '../../assets/chat-text.svg';
import './UserMessages.css';

const UserMessages = props => {
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    // Check if user logged In and set users initials
    setUser({name: "Leya", lastName: "Zoya"});
    setUserInitials("LZ")
  }, []);

  return (
    <div className="w-100 h-100">
      <div className="section-header"><ChatIcon /><h3>My Messages</h3></div>
      <div className="section-body">Here will be messages body</div>
    </div>
  );
}

export default UserMessages;
