import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import './UserInterestSingle.css';

const UserInterestSingle = props => {
  let colors = ['mustard','blue', 'grass', 'dark', 'green']
  const [status, setStatus] = useState(false);

  useEffect(() => {
    setStatus(props.active)
  }, [props]);

  const getColor = () => {
    let size = colors.length;
    let index = props.index % size;
    return colors[index];
  }

  const changeStatus = (event) => {
    setStatus(!status);
    props.setStatus(event);
  }

  return (
      props.edit
      ?   <Button
            variant={getColor()}
            className={"mr-2 mb-2 small " + status}
            onClick={changeStatus}
            name={props.index}>
          {props.interest}</Button>
      :   <div className={"interest-block " + getColor()}>{props.interest}</div>
  );
}

export default UserInterestSingle;
