import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth, isStaff } from './context/AuthContext.jsx';
import Splash from './pages/Splash.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { PageLoader } from './components/layout/PageLoader.jsx';

const Landing = lazy(() => import('./pages/Landing.jsx'));
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword.jsx'));

const Dashboard = lazy(() => import('./pages/app/Dashboard.jsx'));
const Discovery = lazy(() => import('./pages/app/Discovery.jsx'));
const Marketplace = lazy(() => import('./pages/app/Marketplace.jsx'));
const ProductDetail = lazy(() => import('./pages/app/ProductDetail.jsx'));
const Businesses = lazy(() => import('./pages/app/Businesses.jsx'));
const BusinessDetail = lazy(() => import('./pages/app/BusinessDetail.jsx'));
const Spaces = lazy(() => import('./pages/app/Spaces.jsx'));
const SpaceDetail = lazy(() => import('./pages/app/SpaceDetail.jsx'));
const SearchPage = lazy(() => import('./pages/app/Search.jsx'));
const Notifications = lazy(() => import('./pages/app/Notifications.jsx'));
const Tickets = lazy(() => import('./pages/app/Tickets.jsx'));
const Analytics = lazy(() => import('./pages/app/Analytics.jsx'));
const Settings = lazy(() => import('./pages/app/Settings.jsx'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminModeration = lazy(() => import('./pages/admin/AdminModeration.jsx'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports.jsx'));
const AdminAudit = lazy(() => import('./pages/admin/AdminAudit.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function Protected({ children, staffOnly }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (staffOnly && !isStaff(user.role)) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('avaana.splashSeen'));

  useEffect(() => {
    if (!showSplash) return undefined;
    const t = setTimeout(() => {
      sessionStorage.setItem('avaana.splashSeen', '1');
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(t);
  }, [showSplash]);

  return (
    <>
      <AnimatePresence>{showSplash && <Splash key="splash" />}</AnimatePresence>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/app"
            element={
              <Protected>
                <AppShell />
              </Protected>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="marketplace/:slug" element={<ProductDetail />} />
            <Route path="businesses" element={<Businesses />} />
            <Route path="businesses/:slug" element={<BusinessDetail />} />
            <Route path="spaces" element={<Spaces />} />
            <Route path="spaces/:slug" element={<SpaceDetail />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />

            <Route path="admin" element={<Protected staffOnly><AdminDashboard /></Protected>} />
            <Route path="admin/users" element={<Protected staffOnly><AdminUsers /></Protected>} />
            <Route path="admin/moderation" element={<Protected staffOnly><AdminModeration /></Protected>} />
            <Route path="admin/reports" element={<Protected staffOnly><AdminReports /></Protected>} />
            <Route path="admin/audit" element={<Protected staffOnly><AdminAudit /></Protected>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
