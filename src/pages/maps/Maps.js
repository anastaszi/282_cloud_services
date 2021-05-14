import React, { useState, useRef } from "react";
import "./Maps.css";
import { withGoogleMap, GoogleMap } from "react-google-maps";

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
      <h1> Google Maps Here</h1>
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: `500px`, width: "500px" }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />

        <iframe src="https://www.atlistmaps.com/map/4bc972b7-76f6-4050-9293-f34c170475ee?share=true" allow="geolocation" width="100%" height="400px" frameborder="0" scrolling="no" allowfullscreen></iframe>
      </div>
    </>
  );
};

export default Maps;
