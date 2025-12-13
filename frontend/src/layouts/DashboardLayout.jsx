import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Home, BarChart3, PieChart, Settings, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { apiRequest } from '../api';
import toast from 'react-hot-toast';

const DashboardLayout = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiRequest('GET', 'users/auth/user');
        setUser(response.data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = async () => {
    try {
      console.log('=== FRONTEND LOGOUT DEBUG ===');
      console.log('Cookies before logout:', document.cookie);
      
      await apiRequest('GET', 'users/auth/logout');
      toast.success('Logged out successfully');
      
      // Clear client-side cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/");
      });
      
      console.log('Cookies after logout:', document.cookie);
      console.log('==============================');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    } finally {
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BarChart3 size={20} />, label: 'Transactions', path: '/dashboard/transactions' },
    { icon: <PieChart size={20} />, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
    ...(isAdmin ? [{ icon: <User size={20} />, label: 'Admin', path: '/admin' }] : []),
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="flex h-16 items-center px-6 border-b border-slate-200">
              <h1 className="text-xl font-bold text-slate-800">{isAdmin ? 'Admin Panel' : 'My Dashboard'}</h1>
              <button className="ml-auto p-2" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                <X className="h-6 w-6 text-slate-500" />
              </button>
            </div>
            <nav className="mt-6 px-3 flex-1 overflow-y-auto">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <h1 className="text-xl font-bold text-slate-800">
            {isAdmin ? 'Admin Panel' : 'My Dashboard'}
          </h1>
        </div>
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex w-0 flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <div className="flex h-16 flex-shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-center md:hidden px-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-slate-800">
                {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="ml-2 flex items-center md:ml-6">
              <div className="relative">
                <div className="flex items-center space-x-2 md:space-x-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-700">
                      {user?.name || user?.username || 'User'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.role === 'admin' ? 'Administrator' : 'User'}
                    </p>
                  </div>
                  <div className="relative">
                    <div 
                      className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    >
                      {user?.avatar && user.avatar.trim() !== "" && user.avatar.startsWith('http') ? (
                        <img 
                          src={user.avatar} 
                          alt="avatar" 
                          className="h-8 w-8 rounded-full object-cover"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-sm font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    
                    {/* Profile Dropdown */}
                    {profileDropdownOpen && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            {user?.avatar && user.avatar.trim() !== "" && user.avatar.startsWith('http') ? (
                              <img 
                                src={user.avatar} 
                                alt="avatar" 
                                className="h-10 w-10 rounded-full object-cover"
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user?.name || user?.username || 'User'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user?.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <User size={16} />
                            <span>Profile Settings</span>
                          </div>
                        </Link>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                          >
                            <LogOut size={16} />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 rounded-md bg-white px-2 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-300 hover:bg-slate-50 flex items-center"
                  >
                    <LogOut size={12} className="mr-1 sm:mr-1" />
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
