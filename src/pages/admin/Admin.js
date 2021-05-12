import React, {useState} from 'react';
import { Cache } from 'aws-amplify';
import Button from 'react-bootstrap/Button';
import UserService from '../../services/UserService';
import AdminService from '../../services/AdminService';
import './Admin.css';

const Admin = props => {
  const [userLogin, setUserLogin] = useState(true);

  const getUsers = () => {
    UserService.getUsers().then(res => console.log(res)).catch(e => console.log(e))
  }

  const getUserInfo = () => {
    AdminService.getUserInfo('15947').then(res => console.log(res)).catch(e => console.log(e))
  }

  return (
    <>
      <h1>Here will be ProfilePage</h1>
      <Button variant="blue" className="px-4" onClick={getUsers}>All Users</Button>
      <Button variant="blue" className="px-4" onClick={getUserInfo}>Specific user</Button>
    </>
  );
}

export default Admin;
