import React from 'react';
import ReactDOM from 'react-dom';
import Amplify, { API } from 'aws-amplify';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';


Amplify.configure({
    API: {
        endpoints: [
            {
                name: "messageapi",
                endpoint: process.env.REACT_APP_API_ENDPOINT,
                region: "us-east-1"
            }
        ]
    }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
