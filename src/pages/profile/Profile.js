import React, {useState, useEffect, useReducer} from 'react';
import { Cache } from 'aws-amplify';
import Button from 'react-bootstrap/Button';
import UserService from '../../services/UserService';
import { UserInfoComponent } from '../../components/user-info';
import { UserInterestsComponent } from '../../components/user-interests';
import { UserRequestsComponent } from '../../components/user-requests';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Profile.css';

const initialState = {user: null}

function reducer(state, action) {
  const { user, interests } = state;

  switch(action.type) {
    case 'setUser':
      return { ...state, ...action.payload}
    case 'setInterests':
        return { ...state, interests: action.payload}
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
        console.log(data)
        let userData = {
          department: data.department,
          position: data.postion,
          limit: data.participantsLimit
        }
        dispatch({type: 'setUser', payload: userData});
        dispatch({type: 'setInterests', payload: data.interests})
      }
    }).catch(e => console.log(e))
  }

  const updateInterests = (data) => {
    UserService.updateInterests(data).then((res) => {
      dispatch({type: 'setInterests', payload: res.data.data.Attributes.interests})
    }
    ).catch(e => console.log(e))
  }

  return (
    <>
    <Row className="flex-fill d-flex mb-3">
      <Col className="section mx-3 col"><UserInfoComponent user={user}/></Col>
      <Col className="section mx-3 col"><UserInterestsComponent interests={user?.interests} update={updateInterests}/></Col>
    </Row>
    <Row className="flex-fill d-flex mb-3">
      <Col className="section mx-3"><UserRequestsComponent /></Col>
    </Row>

    </>
  );
}

export default Profile;
