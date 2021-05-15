import React, { useState, useEffect } from 'react';
import { Hub, Cache } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

import './Dashboard.css';
import { UserChatsComponent } from '../../components/user-chats';
import { UserMessagesComponent } from '../../components/user-messages';
import MessageService from '../../services/MessageService';

const Dashboard = props => {
	const [user, setUser] = useState(null);
	const [userInitials, setUserInitials] = useState("");
	const [conversations, setConversations] = useState([]);
	const [chats, setChats] = useState([]);

	useEffect(() => {
		// Check if user logged In and set users initials
		Hub.listen('oktaAuth', (data) => {
			console.log(data)
			setUser({ name: Cache.getItem('userFirstName'), lastName: Cache.getItem('userLastName'), email: Cache.getItem('email') });
			setUserInitials(Cache.getItem('userInitials'));
		})
		setConversations([{ user: "Anna Z.", lastMessage: "How are you?", id: 12346 }, { user: "Mathew F.", lastMessage: "I like it:)", id: 34235 }])
		setChats([{ id: 12434, description: "How to make and impact", owner: false, date: Date.now(), time: Date.now() },
		{ id: 1234, description: "How to make and impact", owner: true, date: Date.now(), time: Date.now() },
		{ id: 12394, description: "How to make and impact", owner: false, date: Date.now(), time: Date.now() },
		])
	}, [user]);

	const getMessages = () => {
		MessageService.getMessages().then(res => console.log(res))
	}

	return (
		<>
			<Row className="mx-0">
				<h2>Hello {user?.name} {user?.lastName}!</h2>
			</Row>
			<Row className="flex-fill d-flex mb-3">
				<Col sm={7} className="section mx-3"><UserChatsComponent chats={chats} /></Col>
				<Col className="section mx-3"><UserMessagesComponent conversations={conversations} getMessages={getMessages} /></Col>
			</Row>
		</>
	);
}

export default Dashboard;
