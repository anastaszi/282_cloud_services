import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { ReactComponent as MegaPhoneIcon } from '../../assets/megaphone.svg';
import { UserChatSingleComponent } from '../user-chat-single'
import './UserChats.css';

const UserChats = props => {
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    // Check if user logged In and set users initials
    setUser({name: "Leya", lastName: "Zoya"});
    setUserInitials("LZ");
    console.log(props)
  }, []);

  return (
    <div className="w-100 h-100 section-content">
      <div className="section-header"><MegaPhoneIcon /><h3>My Chats</h3></div>
      <div className="section-body">
      Next:
      {
        props?.chats.map((chat) => <UserChatSingleComponent {...chat}/>)
      }
      </div>
      <div className="section-footer">
        <Row className="mx-0 mb-3">
          <Col sm="auto" className="ml-auto">
          <Button variant="blue" className="px-4">Create New Chat</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default UserChats;
