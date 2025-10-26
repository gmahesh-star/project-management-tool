import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, FolderKanban, Users as UsersIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    start_date: '',
    end_date: '',
    team_member_ids: [],
  });
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        projectsAPI.getAll(),
        user.role !== 'Developer' ? usersAPI.getAll() : Promise.resolve({ data: [] }),
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create(formData);
      setShowModal(false);
      setFormData({ name: '', description: '', status: 'Active', start_date: '', end_date: '', team_member_ids: [] });
      loadData();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    }
  };

  const handleTeamMemberToggle = (userId) => {
    setFormData((prev) => ({
      ...prev,
      team_member_ids: prev.team_member_ids.includes(userId)
        ? prev.team_member_ids.filter((id) => id !== userId)
        : [...prev.team_member_ids, userId],
    }));
  };

  const canCreateProject = user?.role === 'Admin' || user?.role === 'Manager';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-vintage-brown font-serif text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown">Projects</h1>
        {canCreateProject && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-vintage-navy text-vintage-cream rounded hover:bg-vintage-darkbrown transition-colors shadow-vintage"
          >
            <Plus size={20} />
            <span className="font-serif">New Project</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-vintage-navy p-2 rounded">
                  <FolderKanban className="text-vintage-cream" size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-vintage-darkbrown">
                    {project.name}
                  </h3>
                  <span className="text-xs font-typewriter text-vintage-mustard">
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm font-serif text-vintage-brown mb-4 line-clamp-2">
              {project.description || 'No description'}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-vintage-brown">
                <UsersIcon size={16} />
                <span className="font-typewriter">{project.team_members?.length || 0} members</span>
              </div>
              <div className="flex items-center space-x-2 text-vintage-brown">
                <Calendar size={16} />
                <span className="font-typewriter">{project.task_count || 0} tasks</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-vintage-mustard">
              <p className="text-xs font-typewriter text-vintage-brown">
                Created {format(new Date(project.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-vintage-paper border-2 border-vintage-brown rounded-lg">
          <FolderKanban className="mx-auto text-vintage-mustard mb-4" size={48} />
          <p className="text-vintage-brown font-serif text-lg">No projects yet</p>
          {canCreateProject && (
            <p className="text-vintage-brown font-typewriter text-sm mt-2">
              Create your first project to get started
            </p>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-vintage-paper border-4 border-vintage-brown rounded-lg shadow-vintage p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif font-bold text-vintage-darkbrown mb-4">
              Create New Project
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-vintage-brown font-serif font-bold mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  required
                />
              </div>

              <div>
                <label className="block text-vintage-brown font-serif font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-vintage-brown font-serif font-bold mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                >
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  />
                </div>

                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  />
                </div>
              </div>

              <div>
                <label className="block text-vintage-brown font-serif font-bold mb-2">
                  Team Members
                </label>
                <div className="max-h-48 overflow-y-auto border-2 border-vintage-brown rounded bg-vintage-cream p-3 space-y-2">
                  {users.map((u) => (
                    <label key={u.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.team_member_ids.includes(u.id)}
                        onChange={() => handleTeamMemberToggle(u.id)}
                        className="form-checkbox text-vintage-navy"
                      />
                      <span className="font-typewriter text-vintage-brown">
                        {u.full_name} ({u.role})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-vintage-navy text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-vintage-maroon text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
