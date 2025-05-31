import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/navbar';
import { Footer } from './components/layout/footer';
import { HomePage } from './pages/home-page';
import { LoginPage } from './pages/login-page';
import { RegisterPage } from './pages/register-page';
import { DashboardPage } from './pages/dashboard-page';
import { CreateProjectPage } from './pages/create-project-page';
import { EditProjectPage } from './pages/edit-project-page';
import { ProjectViewPage } from './pages/project-view-page';
import { LibraryPage } from './pages/library-page';
import { SettingsPage } from './pages/settings-page';
import { useAuthStore } from './store/auth-store';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/create" element={
              <ProtectedRoute>
                <CreateProjectPage />
              </ProtectedRoute>
            } />
            
            <Route path="/edit/:projectId" element={
              <ProtectedRoute>
                <EditProjectPage />
              </ProtectedRoute>
            } />
            
            <Route path="/project/:projectId" element={
              <ProtectedRoute>
                <ProjectViewPage />
              </ProtectedRoute>
            } />
            
            <Route path="/library" element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;