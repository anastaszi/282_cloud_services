import React, {useState, useEffect} from 'react';
import { Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { AdminRequestSingleComponent } from '../admin-request-single'
import { ReactComponent as StopLightsIcon } from '../../assets/stoplights.svg';
import './AdminRequests.css';

const AdminRequests = (props) => {
  const [requests, setRequests] = useState([]);
  const [showLimitHistory, setShowLimitHistory] = useState(false);
  const [showCustomHistory, setShowCustomHistory] = useState(false);

  useEffect(() => {
    setRequests(props.requests);
  }, [props]);

  const setLimitVisibility = (e) => {
    if (e.target.name === 'limit')
      setShowLimitHistory(!showLimitHistory);
    else
      setShowCustomHistory(!showCustomHistory);
  }


  return (
    <div className="w-100 h-100 section-content">
      <div className="section-header user-requests"><StopLightsIcon /><h3>Requests</h3></div>
      <div className="section-body user-requests">
        <Row>
          <Col sm="auto" className="px-0"><h3 className="mb-0">Limit Requests</h3></Col>
          <Col sm="auto" className="ml-auto"><Button variant="history" className="wide" name="limit" onClick={setLimitVisibility}>{showLimitHistory ? "Hide" : "Show"} Closed Requests</Button></Col>
        </Row>
        <div className="mx-3">
          {(requests && requests.limitOpened?.length > 0) ?
            requests.limitOpened.map((elem, index) => <AdminRequestSingleComponent {...elem} key={"admin-req-lo-" + index} updateStatus={props.updateStatus} getUserDetails={props.getUserDetails}/>) :
            "No active requests"}
        </div>
        <div className={showLimitHistory ? "mx-3 mt-3" : "d-none"}>
          {(requests && requests.limitClosed?.length > 0) ?
            requests.limitClosed.map((elem, index) => <AdminRequestSingleComponent {...elem} key={"admin-req-lc-" + index} updateStatus={props.updateStatus} getUserDetails={props.getUserDetails}/>) :
            "No closed requests"}
        </div>
        <Row>
          <Col sm="auto" className="px-0"><h3 className="mb-0">Custom Requests</h3></Col>
          <Col sm="auto" className="ml-auto"><Button variant="history" className="wide" onClick={setLimitVisibility}>{showCustomHistory ? "Hide" : "Show"} Closed Requests</Button></Col>
        </Row>
        <div className="mx-3">
          {(requests && requests.customOpened?.length > 0) ?
            requests.customOpened.map((elem, index) => <AdminRequestSingleComponent {...elem} key={"admin-req-co-" + index} updateStatus={props.updateStatus} getUserDetails={props.getUserDetails}/>) :
            "No active requests"}
        </div>
        <div className={showCustomHistory ? "mx-3 mt-3" : "d-none"}>
        {(requests && requests.customClosed?.length > 0) ?
            requests.customClosed.map((elem, index) => <AdminRequestSingleComponent {...elem} key={"admin-req-cc-" + index} updateStatus={props.updateStatus} getUserDetails={props.getUserDetails}/>) :
          "No closed requests"}
        </div>
      </div>
    </div>
  );
}

export default AdminRequests;
