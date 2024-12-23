// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom';

// Import Bootstrap CSS first
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your custom styles after Bootstrap
import './styles/main.scss'; 

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
