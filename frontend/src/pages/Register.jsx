import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import GradientWave from '../components/GradientWave';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    role: 'Developer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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
          <div className="text-center mb-4">
            <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown mb-1">
              Create Account
            </h1>
            <p className="text-vintage-brown font-typewriter text-sm">Join our project management system</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded text-red-700 font-serif text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-vintage-brown font-serif font-bold mb-1 text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-vintage-brown font-serif font-bold mb-1 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-vintage-brown font-serif font-bold mb-1 text-sm">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-vintage-brown font-serif font-bold mb-1 text-sm">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard text-sm"
              >
                <option value="Developer">Developer</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-vintage-brown font-serif font-bold mb-1 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-1.5 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-vintage-navy text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage disabled:opacity-50 text-sm"
            >
              <UserPlus size={18} />
              <span>{loading ? 'Creating account...' : 'Register'}</span>
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-vintage-brown font-serif text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-vintage-navy font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
