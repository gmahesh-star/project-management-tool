import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, Shield, User, Edit2, Save, X } from 'lucide-react';
import { format } from 'date-fns';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    role: '',
  });

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const response = await usersAPI.getById(id);
      setUser(response.data);
      setFormData({
        full_name: response.data.full_name,
        email: response.data.email,
        username: response.data.username,
        role: response.data.role,
      });
    } catch (error) {
      console.error('Failed to load user:', error);
      alert('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await usersAPI.update(id, formData);
      setEditing(false);
      loadUser();
      alert('User updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await usersAPI.delete(id);
      alert('User deleted successfully');
      navigate('/users');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-vintage-maroon text-vintage-cream';
      case 'Manager':
        return 'bg-vintage-navy text-vintage-cream';
      default:
        return 'bg-vintage-mustard text-vintage-darkbrown';
    }
  };

  const canEdit = currentUser?.role === 'Admin' || currentUser?.id === parseInt(id);
  const canDelete = currentUser?.role === 'Admin' && currentUser?.id !== parseInt(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-vintage-brown font-serif text-xl">Loading user...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-vintage-brown font-serif text-xl">User not found</p>
        <Link to="/users" className="text-vintage-navy hover:underline mt-4 inline-block">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/users"
            className="p-2 hover:bg-vintage-cream rounded transition-colors"
          >
            <ArrowLeft className="text-vintage-brown" size={24} />
          </Link>
          <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown">
            User Details
          </h1>
        </div>
        <div className="flex space-x-2">
          {canEdit && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-vintage-navy text-vintage-cream rounded hover:bg-vintage-darkbrown transition-colors shadow-vintage"
            >
              <Edit2 size={18} />
              <span className="font-serif">Edit</span>
            </button>
          )}
          {canDelete && !editing && (
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-vintage-maroon text-vintage-cream rounded hover:bg-red-800 transition-colors shadow-vintage"
            >
              <X size={18} />
              <span className="font-serif">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* User Card */}
      <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-8">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-vintage-navy rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-vintage-cream font-serif font-bold text-4xl">
              {user.full_name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-6">
            {editing ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  />
                </div>

                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  />
                </div>

                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  />
                </div>

                {currentUser?.role === 'Admin' && (
                  <div>
                    <label className="block text-vintage-brown font-serif font-bold mb-2">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Developer">Developer</option>
                    </select>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleUpdate}
                    className="flex items-center space-x-2 px-6 py-2 bg-vintage-navy text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        full_name: user.full_name,
                        email: user.email,
                        username: user.username,
                        role: user.role,
                      });
                    }}
                    className="px-6 py-2 bg-vintage-brown text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-vintage-darkbrown">
                    {user.full_name}
                  </h2>
                  <p className="text-lg font-typewriter text-vintage-brown">@{user.username}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="text-vintage-mustard" size={20} />
                    <span className="font-typewriter text-vintage-brown">{user.email}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="text-vintage-navy" size={20} />
                    <span
                      className={`px-3 py-1 rounded font-typewriter ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <User className="text-vintage-brown" size={20} />
                    <span className="font-typewriter text-vintage-brown">
                      Member since {format(new Date(user.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>

                {currentUser?.id === user.id && (
                  <div className="mt-6 p-4 bg-vintage-cream border-2 border-vintage-mustard rounded">
                    <p className="text-sm font-typewriter text-vintage-navy font-bold">
                      👤 This is your account
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
