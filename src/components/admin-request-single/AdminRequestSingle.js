import React, {useState, useEffect} from 'react';
import { Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { UserDetailsComponent } from '../user-details'

import { ReactComponent as DotIcon } from '../../assets/dot.svg';
import './AdminRequestSingle.css';


const AdminRequestSingle = props => {
  const [dateTimeString, setDateTimeString] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  var options = {
    year: '2-digit', month: 'short', day: 'numeric'
  }

  useEffect(() => {
    if (props.dateCreated) {
    setDateTimeString(new Intl.DateTimeFormat('en-US', options).format(new Date(props?.dateCreated)));
  }
}, [props]);

  const getStatus = (granted) => {
    return granted ? "Approved" : "Rejected"
  }

  const getDetails = (type) => {

    if (type === 'limit')
      return <Col sm="auto" className="px-0">{props.details}</Col>
    if (type === 'custom')
      return <Col sm="auto" className="px-0 text-truncate">{props.details}</Col>
    return ""
  }

  const updateStatus = (e) => {
    let type = props.requestType;
    props.updateStatus(type, e.target.name, props.uuid, props.details, props.employeeId)
  }

  const details = () => {
    if (!showDetails && !userDetails) {
      setShowDetails(!showDetails);
      if (Cache.getItem('employeeId') && Cache.getItem('employeeId')[props.employeeId]) {
        setUserDetails(Cache.getItem('employeeId')[props.employeeId]);
      } else {
        const expirationDay = new Date();
        expirationDay.setDate(expirationDay.getDate() + 1);
        props.getUserDetails(props.employeeId).then((result) => {
          let data = Cache.getItem('employeeId');
          if (!data)
            data = {};
          data[props.employeeId] = result.data[0];
          Cache.setItem('employeeId', data,  { expires: expirationDay.getTime() });
          setUserDetails(result.data[0]);
        }).catch(e => console.log(e));
      }
    }
    setShowDetails(!showDetails);
  }

  return (
      <Row className="mb-1 admin-request-info">
        <Col sm="auto" className="px-0">
          <div className="employee-overall" onClick={details}>EmployeeId : {props.employeeId}
          <div className={showDetails ? "employee-details" : "d-none"}><UserDetailsComponent user={userDetails} show={showDetails}/></div>
          </div>
        </Col>
        <Col sm="auto" className="request-dot"><DotIcon /></Col>
        { getDetails(props?.requestType)}
        <Col sm="auto" className="ml-auto">[{dateTimeString}]</Col>
        {props.active ?
          <>
            <Col sm="auto" className="px-0"><Button variant="request" name="approve" onClick={updateStatus}>Approve</Button></Col>
            <Col sm="auto" className="px-0"><Button variant="request" name="reject" onClick={updateStatus}>Reject</Button></Col>
            </>
            :
            <Col sm="auto" className="pr-3 mr-2">{getStatus(props.granted)}</Col>
      }
      </Row>
  );
}

export default AdminRequestSingle;
