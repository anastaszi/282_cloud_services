import React, {useState, useEffect} from 'react';
import {
  Link
} from "react-router-dom";
import './Dashboard.css';
import Row from 'react-bootstrap/Row'

const Dashboard = props => {
  const [user, setUser] = useState(null);
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    // Check if user logged In and set users initials
    setUser({name: "Leya", lastName: "Zoya"});
    setUserInitials("LZ");
  }, []);
  return (
    <Row className="mx-0">
      <h2>Hello {user?.name} {user?.lastName}</h2>
    </Row>
  );
}

export default Dashboard;
