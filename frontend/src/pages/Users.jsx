import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users as UsersIcon, Mail, Shield } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-vintage-brown font-serif text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown">Users</h1>
        <div className="flex items-center space-x-2 text-vintage-brown">
          <UsersIcon size={24} />
          <span className="font-typewriter text-lg">{users.length} users</span>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Link
            key={user.id}
            to={`/users/${user.id}`}
            className="block bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6 hover:shadow-card transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-vintage-navy rounded-full flex items-center justify-center">
                  <span className="text-vintage-cream font-serif font-bold text-xl">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-vintage-darkbrown">
                    {user.full_name}
                  </h3>
                  <p className="text-sm font-typewriter text-vintage-brown">@{user.username}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="text-vintage-mustard" size={16} />
                <span className="font-typewriter text-vintage-brown">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="text-vintage-navy" size={16} />
                <span
                  className={`px-2 py-1 rounded text-xs font-typewriter ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            {user.id === currentUser.id && (
              <div className="mt-4 pt-4 border-t border-vintage-mustard">
                <span className="text-xs font-typewriter text-vintage-navy font-bold">
                  This is you
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 bg-vintage-paper border-2 border-vintage-brown rounded-lg">
          <UsersIcon className="mx-auto text-vintage-mustard mb-4" size={48} />
          <p className="text-vintage-brown font-serif text-lg">No users found</p>
        </div>
      )}
    </div>
  );
};

export default Users;
