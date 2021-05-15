import React, {useState, useEffect} from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ReactComponent as DotIcon } from '../../assets/dot.svg';
import './UserDetails.css';


const UserDetails = props => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.show && !props.user)
      setLoading(true);
  }, [props]);
  return (
      <>
      {loading && <Spinner animation="border" variant="info" />}
      {!loading &&
        <>
        <div>{props.user?.firstName} {props.user?.lastName}</div>
        <div>[{props.user?.postion}]</div>
        <div>{props.user?.department}</div>
        <div>Limit: {props.user?.participantsLimit}</div>
        </>
      }
      </>
  );
}

export default UserDetails;
