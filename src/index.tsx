import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';

setWasmPaths('/wasm/');
tf.setBackend('wasm');
tf.ready()
  .then(() => console.log('TensorFlow backend initialized:', tf.getBackend()))
  .catch((e) => console.error(e));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
