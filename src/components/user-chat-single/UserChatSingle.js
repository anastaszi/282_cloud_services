import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { ReactComponent as DotIcon } from '../../assets/dot.svg';
import './UserChatSingle.css';

const UserChatSingle = props => {
  const [dateTimeString, setDateTimeString] = useState("");
  var options = {
     hour: 'numeric', minute: 'numeric',
    year: '2-digit', month: 'short', day: 'numeric'
  }


  useEffect(() => {
    setDateTimeString(new Intl.DateTimeFormat('en-US', options).format(new Date(props.date)));
  }, []);

  return (
    <div key={"chat" + props.id} className="mx-0 mb-3">
      <Row className="my-2">
        <Col sm="auto" className={(props.owner) ? 'status-owner' : 'status-participant'}><DotIcon /></Col>
        <Col sm="auto" className="px-0 chat-description">{props.description}</Col>
        <Col sm="auto" className="pl-1 chat-description mr-auto">[{dateTimeString}]</Col>
        <Col sm="auto" className="ml-auto">
          {props.owner ? <Button variant="mustard">start</Button>: <Button variant="green">Join now</Button>}
        </Col>
        <Col sm="auto" className="ml-auto">
          {props.owner ? <Button variant="dark">manage</Button>: <Button variant="grass">Remove</Button>}
        </Col>
      </Row>
    </div>
  );
}

export default UserChatSingle;
