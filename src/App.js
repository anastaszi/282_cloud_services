import React from 'react';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { Route, useHistory, Switch } from 'react-router-dom';

import AppWithRouterAccess from './AppWithRouterAccess';
import { Maps } from './pages/maps';


const App = () => (
  
  <Router>
     {/* < Maps /> */}

     {/* <Route path="/maps">
                <Maps />
        </Route> */}
  
    <AppWithRouterAccess/>
  </Router>
);
export default App;
