import './App.css';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import { Route, Routes } from 'react-router-dom';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
