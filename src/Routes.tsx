import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import ChatPage from './Pages/Chat';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import ProfilePage from './Pages/Profile';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;