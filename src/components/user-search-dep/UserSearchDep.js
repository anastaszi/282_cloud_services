import React, {useState, useEffect} from 'react';
import { Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import { AdminRequestSingleComponent } from '../admin-request-single'
import { ReactComponent as StopLightsIcon } from '../../assets/stoplights.svg';
import './UserSearchDep.css';

const UserSearchId = (props) => {
  const [option, setOption] = useState(null);
  const [options, setOptions] = useState([])

  useEffect(() => {
    setOptions(props.options)
  }, [props]);

  const updateOption = (e) => {
    setOption(e.target.value)
  }

  const clearForm = (e) => {
    e.preventDefault();
    e.target.form.elements.requestForm.value = ""
    setOption(null)
  }

  const submitRequest = () => {
    props.search(option)
  }

  return (
    <>
    <h3>Search by Department</h3>
    <Form>

    <Form.Control as="select" onChange={updateOption} className="mb-2">
    {props.options.map(elem => <option>{elem}</option>)}
    </Form.Control>
      <div className="text-right">
        <Button variant="blue" onClick={submitRequest}>Search</Button>
      </div>
      </Form></>
  );
}

export default UserSearchId;
