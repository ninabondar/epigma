import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/container/App';
// styles:
import "./styles/layout.scss";
import "./styles/field.scss";


const root = document.querySelector("#app");

let Name = 'EPIGMA';

ReactDOM.render(
    <App name={Name}/>,
    root
);
