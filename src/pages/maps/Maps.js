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
      </div>
    </>
  );
};

export default Maps;
