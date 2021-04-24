import React, {useState, useEffect} from 'react';
import {API} from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { ReactComponent as ChatIcon } from '../../assets/chat-text.svg';
import { UserConversationComponent } from '../user-conversation'
import './UserMessages.css';

const UserMessages = props => {
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    console.log(props)
    
    setUser({name: "Leya", lastName: "Zoya"});
    setUserInitials("LZ")
  }, []);

  return (
    <div className="w-100 h-100">
      <div className="section-header"><ChatIcon /><h3>My Messages</h3></div>
      <div className="section-body">{
        props?.conversations.map((conversation) => <UserConversationComponent {...conversation} />)
      }</div>
      <div className="section-footer">
        <Row className="mx-0 mb-3">
          <Col sm="auto" className="ml-auto">
          <Button variant="blue" className="px-4" onClick={props.getMessages}>New Message</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default UserMessages;
