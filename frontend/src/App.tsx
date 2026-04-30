import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import PublicPortal from './pages/public/PublicPortal';
import EmbedPage from './pages/public/EmbedPage';
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import FederationAdminDashboard from './pages/federation-admin/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Styles
import './styles/global.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicPortal />} />
              <Route path="/embed/:federationSlug" element={<EmbedPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Super Admin routes */}
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <Layout>
                      <SuperAdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Federation Admin routes */}
              <Route
                path="/federation-admin"
                element={
                  <ProtectedRoute allowedRoles={['federation_admin', 'super_admin']}>
                    <Layout>
                      <FederationAdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
