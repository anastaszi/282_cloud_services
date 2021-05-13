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
  const { user, interests, limit, requests } = state;

  switch(action.type) {
    case 'setUser':
      return { ...state, ...action.payload}
    case 'setInterests':
        return { ...state, interests: action.payload}
    case 'setLimit':
        return { ...state, limit: action.payload}
    case 'setRequests':
        return { ...state, requests: action.payload.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)}
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
    getRequests();
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
          limit: data.participantsLimit,
          interests: data.interests
        }
        dispatch({type: 'setUser', payload: userData});
      }
    }).catch(e => console.log(e))
  }

  const updateInterests = (data) => {
    UserService.updateInterests(data).then((res) => {
      dispatch({type: 'setInterests', payload: res.data.data.Attributes.interests})
    }
    ).catch(e => console.log(e))
  }

  const createRequestLimit = (data) => {
    console.log(data)
    UserService.updateLimit(data).then((res) => {
      getRequests();
    }
  ).catch(e => console.log(e))
  }

  const createRequestCustom = (data) => {
    console.log(data)
    UserService.createCustom(data).then((res) => {
      getRequests();
    }
  ).catch(e => console.log(e))
  }

  const getRequests = () => {
    UserService.getRequests().then((res) => {
      dispatch({type: 'setRequests', payload: res.data})
    }
  ).catch(e => console.log(e))
  }

  return (
    <>
    <Row className="flex-fill d-flex mb-3">
      <Col className="section mx-3 col"><UserInfoComponent user={user} updateLimit={createRequestLimit}/></Col>
      <Col className="section mx-3 col"><UserInterestsComponent interests={user?.interests} update={updateInterests}/></Col>
    </Row>
    <Row className="flex-fill d-flex mb-3">
      <Col className="section mx-3"><UserRequestsComponent requests={user?.requests} createRequest={createRequestCustom}/></Col>
    </Row>

    </>
  );
}

export default Profile;
