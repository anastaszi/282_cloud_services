import React, { useState, useEffect } from 'react';
import Jitsi from 'react-jitsi';
import { Jutsu } from 'react-jutsu' // Component
import { useJitsi } from 'react-jutsu' // Custom hook
import {Container} from 'react-bootstrap'
import './VideoChat.css';

const roomName = 'ShashwatMeetup';
const userFullName = 'john';
const password = "shashwat";

const VideoChat = props => {
    const [userLogin, setUserLogin] = useState(true);
    const jitsiConfig = {
        roomName: 'shashwat',
        displayName: 'mona',
        password: 'abc123',
        subject: 'fan',
        parentNode: 'jitsi-container',
    };
    const { loading, error, jitsi } = useJitsi(jitsiConfig);
    return (
        <>
            <h1>Video Conference</h1>
            {/* <Jitsi roomName={roomName} displayName={userFullName} password={password}/> */}
            <Container id="container">
                {error && <p>{error}</p>}
                <div height="500px"  id={jitsiConfig.parentNode} containerStyles={{ width: '1200px', height: '1200px' }}/>
            </Container>
            {/* <iframe allow="camera; microphone; fullscreen; display-capture; autoplay" src="https://meet.jit.si/Newmeetup" style="height: 100%; width: 100%; border: 0px;"></iframe> */}
        </>
    );
}

export default VideoChat;
