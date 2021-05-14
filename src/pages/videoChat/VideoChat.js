import React, { useState, useEffect } from "react";
import { Cache } from "aws-amplify";
import Jitsi from "react-jitsi";
import { Jutsu } from "react-jutsu"; // Component
import { useJitsi } from "react-jutsu"; // Custom hook
import { Container, Form, Button } from "react-bootstrap";
import { UserInfoComponent } from "../../components/user-info";
import "./VideoChat.css";

const VideoChat = (props) => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [call, setCall] = useState(false);
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  if (room && name) setCall(true);
  useEffect(() => {
    console.log(props);
    let userObj = {};
    userObj.lastName = Cache.getItem("userLastName");
    setLname(userObj.lastName);
    userObj.firstName = Cache.getItem("userFirstName");
    setFname(userObj.firstName);
    console.log("fname" + userObj.lastName + "lname" + userObj.firstName);
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    if (name === "") {
      setName(fname + " " + lname);
    }
    if (room && name) setCall(true);
  };

  

  return call ? (
    <>
      <h1>Video Conference</h1>
     
      <Container fluid>
        <Jutsu
          roomName={room}
          displayName={name}
          password={password}
          onMeetingEnd={() => console.log("Meeting has ended")}
          loadingComponent={<p>loading ...</p>}
          errorComponent={<p>Oops, something went wrong</p>}
          containerStyles={{
            margin: "0.5in 1in 0.2in 1in",
            width: "1250px",
            height: "600px",
          }}
        />
      </Container>
   
    </>
  ) : (
    <>
      <Container>
        <Form>
          <Form.Group controlId="formBasicRoomName">
            <Form.Label>Room Name</Form.Label>
            <Form.Control
              id="room"
              type="text"
              placeholder="Room Name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicDisplayName">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              id="name"
              type="text"
              placeholder={fname + " " + lname}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Set Password</Form.Label>
            <Form.Control
              id="name"
              type="text"
              placeholder="Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button className="navbtn" onClick={handleClick} type="submit">
            Start | Join
          </Button>
        </Form>
      </Container>
     
    </>
  );
};

export default VideoChat;
