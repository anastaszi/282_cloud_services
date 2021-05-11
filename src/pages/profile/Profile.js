import React, {useState} from 'react';
import { Cache } from 'aws-amplify';
import Button from 'react-bootstrap/Button';
import UserService from '../../services/UserService';
import './Profile.css';

const Profile = props => {
  const [userLogin, setUserLogin] = useState(true);

  const getUsers = () => {
    UserService.getUsers().then(res => console.log(res)).catch(e => console.log(e))
  }

  return (
    <>
      <h1>Here will be ProfilePage</h1>
                <Button variant="blue" className="px-4" onClick={getUsers}>New Message</Button>
    </>
  );
}

export default Profile;
