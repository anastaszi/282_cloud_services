import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { ReactComponent as ProfileIcon } from '../../assets/person-badge.svg';
import './UserInfo.css';

const UserInfo = ({user}) => {

  useEffect(() => {
    console.log(user)
  }, [user]);

  return (
    <div className="w-100 h-100 section-content">
      <div className="section-header"><ProfileIcon /><h3>Profile</h3></div>
      <div className="section-body user-info">
        <Row>Name: <span className="user-info">{user?.firstName} {user?.lastName}</span></Row>
        <Row>Department: <span className="user-info">{user?.department}</span></Row>
        <Row>Role: <span className="user-info">{user?.position}</span></Row>
        <Row>Permission Level: <span className="user-info">{user?.permit}</span></Row>
        <Row className="big-row">Chat Guest Limit: <span className="user-info">{user?.limit}</span> <Button variant="blue" className="ml-2">Update</Button></Row>
      </div>
    </div>
  );
}

export default UserInfo;
