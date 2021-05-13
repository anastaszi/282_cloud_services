import React, {useState, useEffect} from 'react';
import { Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { UserInterestSingleComponent } from '../user-interest-single'
import { ReactComponent as PuzzleIcon } from '../../assets/puzzle.svg';
import './UserInterests.css';

const UserInterests = (props) => {
  const [allInterests, setAllInterests] = useState(null);
  const [interests, setInterests] = useState([]);
  const [edit, setEdit] = useState(false);
  const [tempInterests, setTempInterests] = useState([]);

  useEffect(() => {
    setAllInterests(Cache.getItem('interests'));
    setInterests(props.interests);
  }, [props]);


  const currentInterests = () => {
    return (
      interests?.lenth === 0
    ? "You haven't set any interest yet"
    : interests?.map((interest, index) => <UserInterestSingleComponent interest={interest} index={index} key={index + 'interest'} edit={false}/>)
    )
  }

  const createTempInterest = (elem) => {
    return {interest: elem, active: interests?.includes(elem)}
  }

  const editInterests = () => {
    setEdit(true);
    let temp = allInterests.map(createTempInterest);
    setTempInterests(temp);
  }

  const setInterestStatus = event => {
    let index = event.target.name;
    tempInterests[index].active = !tempInterests[index].active;
    setTempInterests(tempInterests)
  }


  const tempInterestsArray = () => {
    return (
      tempInterests.map((elem, index) =>
        <UserInterestSingleComponent
          interest={elem.interest}
          index={index}
          key={index + 'interest'}
          edit={true}
          active={elem.active}
          setStatus={setInterestStatus}/>)
    )
  }


    const save = () => {
      let interestsToSave = tempInterests.filter(elem => elem.active).map(elem => elem.interest);
      props.update(interestsToSave);
      setEdit(false);
      setTempInterests([]);
    }

  const editButtons = () => {
    return (
      <>
      <Button variant="grey" className="px-4 mr-2" onClick={() => setEdit(false)}>Cancel</Button>
      <Button variant="mustard" className="px-4" onClick={save}>Save</Button>
      </>
    )
  }

  return (
    <div className="w-100 h-100 section-content">
      <div className="section-header user-interests"><PuzzleIcon /><h3>Interests</h3></div>
      <div className="section-body"> {
        edit
        ? tempInterestsArray()   : currentInterests()
      }
      </div>
      <div className="section-footer">
        <Row className="mx-0 mb-3">
          <Col sm="auto" className="ml-auto">
          {
            !edit
            ?   <Button variant="blue" className="px-4" onClick={editInterests}>Manage</Button>
            : editButtons()
          }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default UserInterests;
