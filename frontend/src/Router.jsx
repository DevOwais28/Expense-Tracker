import { Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/dashboard/UserDashboard';
import Transactions from './pages/dashboard/Transactions';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import PageNotFound from './pages/PageNotFound';

const Router = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public routes with MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage onGetStarted={() => console.log('Get Started clicked')} />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage onNavigateLogin={() => navigate('/login')} onNavigateLanding={() => navigate('/')} />} />
      </Route>

      {/* Standalone auth pages */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Dashboard routes with DashboardLayout */}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin routes with DashboardLayout */}
      <Route path="admin" element={<DashboardLayout isAdmin={true} />}>
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Router;