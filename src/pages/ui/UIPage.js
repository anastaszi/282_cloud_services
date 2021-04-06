import React, {useState} from 'react';
import './UIPage.css';

const UIPage = props => {
  const [userLogin, setUserLogin] = useState(true);
  return (
    <>
      <div>h1 (font-size 32px, font-weight 700): <h1 className="d-inline-block">Hello World!</h1></div>
      <div>h2 (font-size 32px, font-weight 400): <h2 className="d-inline-block">Hello World!</h2></div>
      <div>h3 (font-size 24px, font-weight 700): <h3 className="d-inline-block">Hello World!</h3></div>
      <div>h4 (font-size 24px, font-weight 600): <h4 className="d-inline-block">Hello World!</h4></div>
    </>
  );
}

export default UIPage;
