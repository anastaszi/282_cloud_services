import React, {useState, useEffect, useReducer} from 'react';
import { Cache } from 'aws-amplify';
import Button from 'react-bootstrap/Button';
import UserService from '../../services/UserService';
import { UserInfoComponent } from '../../components/user-info';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Profile.css';

const initialState = {user: null}

function reducer(state, action) {
  const { user} = state;

  console.log(state)
  switch(action.type) {
    case 'setUser':
      return { ...state, ...action.payload}
    default:
     return state
  }
}

const Profile = props => {
  const [user, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let userObj = {};
    userObj.lastName = Cache.getItem('userLastName');
    userObj.firstName = Cache.getItem('userFirstName');
    userObj.email = Cache.getItem('email');
    userObj.permit = Cache.getItem('userEmployeeGroup');
    dispatch({type: 'setUser', payload: userObj});
    getMe();
}, []);

  const getMe = () => {
    UserService.getMe().then((res) =>
    {
      let data = res.data[0];
      if (data)
      {
        let userData = {
          department: data.department,
          position: data.postion,
          limit: data.participantsLimit
        }
        dispatch({type: 'setUser', payload: userData});
      }
    }).catch(e => console.log(e))
  }

  return (
    <>
    <Row className="flex-fill d-flex mb-3">
      <Col className="section mx-3 col-6"><UserInfoComponent user={user}/></Col>
    </Row>
    <Row className="flex-fill d-flex mb-3">
      <Col className="section mx-3"><UserInfoComponent /></Col>
    </Row>

    </>
  );
}

export default Profile;
