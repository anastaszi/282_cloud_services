import React, {useState, useReducer, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import { Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import UserService from '../../services/UserService';
import AdminService from '../../services/AdminService';
import { AdminRequestsComponent } from '../../components/admin-requests';
import { AdminUserManagementComponent } from '../../components/admin-user-management';
import './Admin.css';

const initialState = {limitOpened: [], limitClosed: [], customClosed: [], customOpened: []}

function reducer(state, action) {
  const { limitOpened, limitClosed, customClosed, customOpened } = state;

  switch(action.type) {
    case 'setLimitOpened':
      return { ...state, limitOpened: action.payload.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)}
    case 'setLimitClosed':
        return { ...state, limitClosed: action.payload.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)}
    case 'setCustomOpened':
        return { ...state, customOpened: action.payload.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)}
    case 'setCustomClosed':
        return { ...state, customClosed: action.payload.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1)}
    default:
     return state
  }
}

const Admin = props => {

  const [requests, dispatch] = useReducer(reducer, initialState);
const history = useHistory();
  useEffect(() => {
    if (Cache.getItem('userEmployeeGroup') != "admin")
      history.push('/')
    getOpenRequestsByType('limit')
    getOpenRequestsByType('custom')
    getClosedRequestsByType('limit')
    getClosedRequestsByType('custom')
}, []);

  const getUsers = () => {
    UserService.getUsers().then(res => console.log(res)).catch(e => console.log(e))
  }

  const getUserInfo = (id) => {
    AdminService.getUserInfo(id).then((res) =>
    {console.log(res)}).catch(e => console.log(e))
  }

  const getOpenRequestsByType = (type) => {
    AdminService.getRequestsByTypeAndStatus(type, 'open').then((res) => {
      let requestType = "";
      if (type === 'limit')
        requestType = 'setLimitOpened';
      if (type === 'custom')
        requestType = 'setCustomOpened';
      dispatch({type: requestType, payload: res.data});
    }).catch(e => console.log(e));
  }

  const getClosedRequestsByType = (type) => {
    AdminService.getRequestsByTypeAndStatus(type, 'close').then((res) => {
      let requestType = "";
      if (type === 'limit')
          requestType = 'setLimitClosed';
      if (type === 'custom')
          requestType = 'setCustomClosed';
      dispatch({type: requestType, payload: res.data});
    }).catch(e => console.log(e));
  }

  const updateStatus = (type, status, uuid, details, employeeId) => {
    AdminService.updateRequestStatus(type, status, uuid, details, employeeId).then((res) => {
      getClosedRequestsByType(type);
      getOpenRequestsByType(type);
    }).catch(e => console.log(e))
  }

  const getUserDetails = (employeeId) => {
    return AdminService.getUserInfo(employeeId);
  }

  return (
    <>
      <Row className="flex-fill d-flex mb-3">
        <Col className="section mx-3">
          <AdminRequestsComponent requests={requests} updateStatus={updateStatus} getUserDetails={getUserDetails}/>
        </Col>
      </Row>
      <Row className="flex-fill d-flex mb-3">
        <Col className="section mx-3">
          <AdminUserManagementComponent getUserDetails={getUserDetails}/>
        </Col>
      </Row>
    </>
  );
}

export default Admin;
