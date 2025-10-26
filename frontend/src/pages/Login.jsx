import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import GradientWave from '../components/GradientWave';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream bg-paper-texture relative">
      {/* Gradient Wave Background Animation */}
      <GradientWave />
      
      {/* OPTION 1: Top Banner - Full Width Sticky */}
      {/* <div className="sticky top-0 z-50 bg-vintage-navy border-b-4 border-vintage-darkbrown shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-6 text-vintage-cream">
            <span className="font-serif font-bold text-lg"> Bespoke Internship Assignment</span>
            <span className="text-vintage-mustard">|</span>
            <span className="font-typewriter">G Mahesh</span>
            <span className="text-vintage-mustard">|</span>
            <span className="font-typewriter">MCA, NIST University</span>
            <span className="text-vintage-mustard">|</span>
            <span className="font-typewriter">Roll: 202468075</span>
          </div>
        </div>
      </div> */}

      {/* OPTION 2: Corner Ribbon (Top Right) */}
      {/* <div className="absolute top-0 right-0 z-50">
        <div className="bg-vintage-navy text-vintage-cream px-8 py-2 shadow-lg transform rotate-45 translate-x-8 translate-y-8 origin-top-left">
          <div className="text-center font-serif font-bold text-sm whitespace-nowrap -rotate-45">
            <div>G Mahesh</div>
            <div className="text-xs font-typewriter">MCA • 202468075</div>
          </div>
        </div>
      </div> */}

      {/* OPTION 3: Compact Top Badge */}
      {/* <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-vintage-navy border-3 border-vintage-darkbrown rounded-full px-6 py-2 shadow-vintage">
          <p className="text-vintage-cream font-serif font-bold text-sm text-center">
            📋 G Mahesh • MCA • NIST • 202468075
          </p>
        </div>
      </div> */}

      <div className="h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-md w-full">
          <div className="bg-vintage-paper border-4 border-vintage-brown rounded-lg shadow-vintage p-6">
            {/* OPTION 4: Inside Card Header */}
            <div className="bg-vintage-navy border-2 border-vintage-darkbrown rounded-lg p-3 mb-4 -mt-2 -mx-2">
              <div className="text-center">
                <p className="text-vintage-cream font-serif font-bold text-sm mb-1">
                   Bespoke Internship Assignment
                </p>
                <div className="flex justify-center items-center space-x-2 text-xs text-vintage-mustard font-typewriter">
                  <span>G Mahesh</span>
                  <span>•</span>
                  <span>MCA</span>
                  <span>•</span>
                  <span>NIST University</span>
                  <span>•</span>
                  <span>202468075</span>
                </div>
              </div>
            </div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown mb-1">
              Welcome Back
            </h1>
            <p className="text-vintage-brown font-typewriter text-sm">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded text-red-700 font-serif text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-vintage-brown font-serif font-bold mb-1 text-sm">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-vintage-brown font-serif font-bold mb-1 text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-vintage-navy text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage disabled:opacity-50 text-sm"
            >
              <LogIn size={18} />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-vintage-brown font-serif text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-vintage-navy font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
