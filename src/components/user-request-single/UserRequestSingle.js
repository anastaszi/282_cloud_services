import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import { ReactComponent as DotIcon } from '../../assets/dot.svg';
import './UserRequestSingle.css';

const UpdatingPopover = React.forwardRef(
  ({ popper, children, show: _, ...props }, ref) => {
    useEffect(() => {
      popper.scheduleUpdate();
    }, [children, popper]);

    return (
      <Popover ref={ref} content {...props}>
        {children}
      </Popover>
    );
  },
);

const UserRequestSingle = props => {
  const [dateTimeString, setDateTimeString] = useState("");
  var options = {
    year: '2-digit', month: 'short', day: 'numeric'
  }


  useEffect(() => {

    setDateTimeString(new Intl.DateTimeFormat('en-US', options).format(new Date(props?.dateCreated)));
  }, []);

  const getType = (type) => {
    if (type === "limit")
      return "GuestLimit"
    if (type != null)
      return "Custom"
  }

  const getStatus = (active, granted) => {
    if (active)
      return "In Progress"
    if (!active && granted)
      return "Approved"
    if (!active && !granted)
        return "Declined"
    return ""
  }

  const getDetails = (type) => {

    if (type === 'limit')
      return <Col sm="1" className="px-0">{props.details}</Col>
    if (type === 'custom')
      return (
        <OverlayTrigger
          trigger="click"
          overlay={
            <UpdatingPopover id="popover-contained">{props.details}</UpdatingPopover>
          }>
          <Col sm="2" className="px-0 text-truncate">{props.details}</Col>
          </OverlayTrigger>
      )
    return ""
  }

  return (
    <div className="mx-0">
      <Row className="mb-1 request-info">
        <Col sm="auto" className="px-0">{getType(props?.requestType)}</Col>
        <Col sm="auto" className="request-dot"><DotIcon /></Col>
        { getDetails(props?.requestType)}
        <Col sm="auto" className="request-dot"><DotIcon /></Col>
        <Col sm="auto" className="px-0">{dateTimeString}</Col>
        <Col sm="auto" className="request-dot"><DotIcon /></Col>
        <Col sm="auto" className="px-0 mr-auto">{getStatus(props?.active, props?.granted)}</Col>
      </Row>
    </div>
  );
}

export default UserRequestSingle;
