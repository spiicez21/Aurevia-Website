import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import page components
import ChatPage from './Pages/Chat';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;