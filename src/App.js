import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage        from './pages/HomePage';
import EventsPage      from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import SchedulePage    from './pages/SchedulePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import StudentDashboard   from './pages/StudentDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard     from './pages/AdminDashboard';
import GalleryPage from './pages/GalleryPage';
import AboutPage   from './pages/AboutPage';

// Simple 404 / Unauthorized pages
const NotFound = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center text-center px-4">
    <div>
      <div className="text-8xl mb-4">404</div>
      <h1 className="text-white font-display font-bold text-3xl mb-2">Page Not Found</h1>
      <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary inline-block">Go Home</a>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center text-center px-4">
    <div>
      <div className="text-8xl mb-4">🚫</div>
      <h1 className="text-white font-display font-bold text-3xl mb-2">Access Denied</h1>
      <p className="text-gray-400 mb-6">You don't have permission to view this page.</p>
      <a href="/" className="btn-primary inline-block">Go Home</a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-surface flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public routes */}
              <Route path="/"          element={<HomePage />} />
              <Route path="/events"    element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/schedule"  element={<SchedulePage />} />
              <Route path="/gallery"   element={<GalleryPage />} />
              <Route path="/about"     element={<AboutPage />} />

              {/* Auth routes (redirect if already logged in) */}
              <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

              {/* Student routes */}
              <Route path="/register-event" element={
                <ProtectedRoute roles={['student', 'organizer', 'admin']}>
                  <RegistrationPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute roles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />

              {/* Organizer routes */}
              <Route path="/organizer" element={
                <ProtectedRoute roles={['organizer', 'admin']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Misc */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*"            element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#16162a',
              color: '#fff',
              border: '1px solid #2a2a4a',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#f18b0a', secondary: '#fff' } },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
