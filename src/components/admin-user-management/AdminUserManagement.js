import React, {useState, useEffect} from 'react';
import { Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { AdminRequestSingleComponent } from '../admin-request-single'
import { ReactComponent as PeopleIcon } from '../../assets/people.svg';
import { UserSearchIdComponent } from '../user-search-id';
import { UserSearchDepComponent } from '../user-search-dep';
import './AdminUserManagement.css';

const AdminUserManagement = (props) => {
  const [departments, setDepartments] = useState([])
  const [users, setUsers] = useState([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    setDepartments(Cache.getItem('departments'));
  }, [props]);

  const searchByDep = (department) => {
    console.log(department)
  }

  const searchById = (id) => {
    props.getUserDetails(id).then((res) => console.log(res)).catch(e => console.log(e))
  }

  return (
    <div className="w-100 h-100 section-content">
      <div className="section-header user-management"><PeopleIcon /><h3>User Management</h3></div>
      <div className="mx-3">
      <Row>
        <Col><UserSearchIdComponent search={searchById}/></Col>
        <Col sm="auto" className="or-column">OR</Col>
        <Col><UserSearchDepComponent options={departments} search={searchByDep}/></Col>
      </Row>
      <Row></Row>
      <div></div>
      </div>
    </div>
  );
}

export default AdminUserManagement;
