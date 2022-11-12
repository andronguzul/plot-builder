import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './styles/index.scss';
import { ChatPage } from './pages/Chat';
import { AudioData } from './pages/AudioData';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter basename='/plot-builder'>
      <Routes>
        <Route path='/' element={<ChatPage />} />
        <Route path='/audio' element={<AudioData />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
