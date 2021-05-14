import React, {useState, useEffect} from 'react';
import { Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { UserRequestSingleComponent } from '../user-request-single'
import { ReactComponent as StopLightsIcon } from '../../assets/stoplights.svg';
import './UserRequests.css';

const UserRequests = (props) => {
  const [requests, setRequests] = useState([]);
  const [customRequest, setCustomRequest] = useState("");

  useEffect(() => {
    setRequests(props.requests);
  }, [props]);


  const getRequestText = (event) => {
    setCustomRequest(event.target.value)
  }

  const submitRequest = (e) => {
    e.preventDefault();
    props.createRequest(e.target.form.elements.requestForm.value)
    e.target.form.elements.requestForm.value = ""
    setCustomRequest("")
  }

  const clearForm = (e) => {
    e.preventDefault();
    e.target.form.elements.requestForm.value = ""
    setCustomRequest("")
  }

  return (
    <div className="w-100 h-100 section-content">
      <div className="section-header user-requests"><StopLightsIcon /><h3>Requests</h3></div>


        <Row className="mx-0">
          <Col sm={7} className="section-body user-requests ml-3">{
            props?.request?.length === 0 ?
            "You don't have any request yet"
            :
            props?.requests?.map((elem, index) => <UserRequestSingleComponent key={'request' + index} {...elem}/>)
          }

          </Col>
          <Col>
          <Form onReset={clearForm}>
            <Form.Text id="requestHelpBlock">
              Do you have any custom request? Please, submit one but be mindful of words:)
            </Form.Text>
            <Form.Control
              type="text"
              name="requestForm"
              aria-describedby="requestHelpBlock"
              onChange={getRequestText}
              className="mb-2"
            />
            <div className="text-right">
            {customRequest !== "" && <Button variant="grey" type="submit" className="mx-2 ml-auto" onClick={clearForm}>Clear</Button>}
            <Button variant="blue" onClick={submitRequest}>Submin</Button>
            </div>
            </Form>
          </Col>
        </Row>
    </div>
  );
}

export default UserRequests;
