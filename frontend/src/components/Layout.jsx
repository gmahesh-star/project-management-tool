import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  LogOut,
  ListTodo
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: FolderKanban },
    { path: '/tasks', label: 'All Tasks', icon: CheckSquare },
    { path: '/my-tasks', label: 'My Tasks', icon: ListTodo },
  ];

  if (user?.role === 'Admin' || user?.role === 'Manager') {
    navItems.push({ path: '/users', label: 'Users', icon: Users });
  }

  return (
    <div className="min-h-screen bg-vintage-cream bg-paper-texture">
      {/* Header */}
      <header className="bg-vintage-paper border-b-4 border-vintage-brown shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown">
                Project Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-serif text-vintage-brown">{user?.full_name}</p>
                <p className="text-xs font-typewriter text-vintage-mustard">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-vintage-maroon text-vintage-cream rounded hover:bg-vintage-darkbrown transition-colors shadow-vintage"
              >
                <LogOut size={18} />
                <span className="font-serif">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded transition-colors font-serif ${
                          active
                            ? 'bg-vintage-mustard text-vintage-darkbrown shadow-card'
                            : 'text-vintage-brown hover:bg-vintage-cream'
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
