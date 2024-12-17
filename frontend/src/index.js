// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/main.scss'; // Ensure styles are applied

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
