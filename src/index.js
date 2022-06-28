import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './styles/index.scss';
// import Auth from './pages/Auth';
// import Dashboard from './pages/Dashboard';
import Constructor from './pages/Constructor';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/plot-builder' element={<Constructor />} />
        {/* <Route path='auth' element={<Auth />} />
        <Route path='/:id' element={<Constructor />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
