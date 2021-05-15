import React, {useState, useEffect} from 'react';
import { Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { AdminRequestSingleComponent } from '../admin-request-single'
import { ReactComponent as StopLightsIcon } from '../../assets/stoplights.svg';
import './UserSearchId.css';

const UserSearchId = (props) => {
  const [id, setId] = useState(null)
  const getInput = (e) => {
    setId(e.target.value)
  }

  const submitRequest = () => {
    props.search(id);
  }

  return (
    <>
    <h3>Search by EmployeeId</h3>
    <Form>
      <Form.Control
        type="number"
        name="requestForm"
        aria-describedby="requestHelpBlock"
        onChange={getInput}
        className="mb-2"
      />
      <div className="text-right">
        <Button variant="blue" onClick={submitRequest}>Search</Button>
      </div>
      </Form></>
  );
}

export default UserSearchId;
