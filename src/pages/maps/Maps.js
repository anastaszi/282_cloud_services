import React, { useState, useRef } from "react";
import "./Maps.css";
import { withGoogleMap, GoogleMap } from "react-google-maps";
import { Row, Col, Container, Jumbotron } from 'react-bootstrap'

const Maps = (props) => {
	// const [userLogin, setUserLogin] = useState(true);

	const GoogleMapExample = withGoogleMap((props) => (
		<GoogleMap
			defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
			defaultZoom={13}
		></GoogleMap>
	));
	return (
		<>
			<Container fluid>
				<h1> Google Maps Here</h1>
			</Container>

			<Container fluid>
				<Row>
					<Col lg={8}>
						<iframe src="https://www.atlistmaps.com/map/4bc972b7-76f6-4050-9293-f34c170475ee?share=true" height="400px" width="100%" allow="geolocation" frameborder="0" scrolling="no" allowfullscreen></iframe>
					</Col>
					<GoogleMapExample
						containerElement={<Col lg={4}></Col>}
						mapElement={<div style={{ height: `400px` }} />}
					/>

				</Row>
			</Container>
		</>
	);
};

export default Maps;
