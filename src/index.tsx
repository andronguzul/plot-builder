import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Routes,
  Route,
  BrowserRouter,
  useSearchParams,
} from 'react-router-dom';
import './styles/index.scss';
import { ChatPage } from './pages/Chat';
import { AudioData } from './pages/AudioData';

export const App = () => {
  const [searchParams] = useSearchParams();
  if (searchParams.get('page') === '2') return <AudioData />;
  return <ChatPage />;
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter basename='/plot-builder'>
      <Routes>
        <Route path='/' element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
