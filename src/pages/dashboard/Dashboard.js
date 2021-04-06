import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Dashboard.css';
import { UserChatsComponent } from '../../components/user-chats';
import { UserMessagesComponent } from '../../components/user-messages';

const Dashboard = props => {
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    // Check if user logged In and set users initials
    setUser({name: "Leya", lastName: "Zoya"});
    setUserInitials("LZ");
  }, []);
  return (
    <>
      <Row className="mx-0">
        <h2>Hello {user?.name} {user?.lastName}!</h2>
      </Row>
      <Row className="flex-fill d-flex mb-3">
        <Col sm={7} className="section mx-3"><UserChatsComponent /></Col>
        <Col className="section mx-3"><UserMessagesComponent /></Col>
      </Row>
    </>
  );
}

export default Dashboard;
