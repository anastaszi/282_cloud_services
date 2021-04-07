import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { ReactComponent as DotsIcon } from '../../assets/dots.svg';
import './UserConversation.css';

const UserConversation = props => {
  return (
    <div key={"conversation" + props.id} className="mx-0 conversation mb-3">
      <Row className="mx-0">
        <Col sm="auto" className="conversation-header">{props.user}</Col>
        <Col sm="auto" className="ml-auto"><Button variant="clear"><DotsIcon /></Button></Col>
      </Row>
      <Row className="mx-0 pb-2">
        <Col sm="auto" className="ml-auto">{props.lastMessage}</Col>
      </Row>
    </div>
  );
}

export default UserConversation;
