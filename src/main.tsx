import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MemberProvider } from './context/MemberContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <MemberProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MemberProvider>
    </HelmetProvider>
  </React.StrictMode>
);
