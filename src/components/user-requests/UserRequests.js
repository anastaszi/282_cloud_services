import React, {useState, useEffect} from 'react';
import { Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { UserInterestSingleComponent } from '../user-interest-single'
import { ReactComponent as PuzzleIcon } from '../../assets/puzzle.svg';
import './UserRequests.css';

const UserRequests = (props) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests(props.requests);
    console.log(props)
  }, [props]);



  return (
    <div className="w-100 h-100 section-content">
      <div className="section-header"><PuzzleIcon /><h3>Interests</h3></div>
      <div className="section-body">
      </div>
    </div>
  );
}

export default UserRequests;
