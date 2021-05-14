import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { ReactComponent as ProfileIcon } from '../../assets/person-badge.svg';
import './UserInfo.css';

const UserInfo = (props) => {
  const [update, setUpdate] = useState(false);
  const [limit, setLimit] = useState(props.user?.limit)

  useEffect(() => {
console.log(props)
  }, []);

  const getLimit = (event) => {
    setLimit(event.target.value)
  }

  const requestUpdate = () => {
    props.updateLimit(limit);
    setUpdate(false);
  }

  return (
    <div className="w-100 h-100 section-content">
      <div className="section-header"><ProfileIcon /><h3>Profile</h3></div>
      <div className="section-body user-info">
        <Row>Name: <span className="user-info">{props.user?.firstName} {props.user?.lastName}</span></Row>
        <Row>Department: <span className="user-info">{props.user?.department}</span></Row>
        <Row>Role: <span className="user-info">{props.user?.position}</span></Row>
        <Row>Permission Level: <span className="user-info">{props.user?.permit}</span></Row>
        {
          update ?
            <form>
              <Row className="big-row">Choose Number:
              <Col><input type="range" min="0" max="100"  step="1" className="w-100" onChange={getLimit}/></Col>

              </Row>
              <Row className="big-row">
                <Col className="col-auto ml-auto"><span className="user-info">{limit}</span></Col>
                <Col sm="auto">
                <Button variant="grey" className="mx-2" onClick={() => setUpdate(false)}>Cancel</Button>
                <input type="button" value="Request Update" className="btn mustard" onClick={requestUpdate}/></Col>
              </Row>
            </form>
            :
            <Row className="big-row" >Guest Limit: <span className="user-info">{props.user?.limit}</span> <Button variant="blue" className="ml-2" onClick={() => setUpdate(true)}>Request Update</Button></Row>
          }
      </div>
    </div>
  );
}

export default UserInfo;
