import React from 'react';
import ReactDOM from 'react-dom/client';
import { Inspector } from 'react-dev-inspector';
import './index.css';
import App from './App';

const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <InspectorWrapper>
      <App />
    </InspectorWrapper>
  </React.StrictMode>
);