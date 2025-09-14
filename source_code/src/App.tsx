import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { HomePage } from './pages/HomePage';
import { QAPage } from './pages/QAPage';
import { HowToPage } from './pages/HowToPage';
import { ShowcasePage } from './pages/ShowcasePage';
import { ProfilePage } from './pages/ProfilePage';
import { useAuthStore } from './store/authStore';
import './App.css';

function App() {
  const { fetchUserInfo } = useAuthStore();

  useEffect(() => {
    // Initialize authentication when app loads
    fetchUserInfo();
  }, [fetchUserInfo]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qa" element={<QAPage />} />
          <Route path="/howto" element={<HowToPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;