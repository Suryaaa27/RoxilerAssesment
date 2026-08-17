import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Import Pages (We will create these next)
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import UserDashboard from './pages/user/UserDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-200 text-gray-900">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const RoleBasedRedirect = () => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-200 text-gray-900">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'ADMIN': return <Navigate to="/admin" replace />;
    case 'OWNER': return <Navigate to="/owner" replace />;
    default: return <Navigate to="/user" replace />;
  }
};

const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-200 flex flex-col text-gray-900">
    <Navbar />
    <main className="flex-grow p-6 flex flex-col">{children}</main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RoleBasedRedirect />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/owner/*" element={
            <ProtectedRoute roles={['OWNER']}>
              <Layout>
                <OwnerDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/user/*" element={
            <ProtectedRoute roles={['USER']}>
              <Layout>
                <UserDashboard />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
