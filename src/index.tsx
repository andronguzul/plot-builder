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
    <BrowserRouter>
      <Routes>
        <Route path='/plot-builder' element={<ChatPage />} />
        <Route path='/plot-builder/audio' element={<AudioData />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
