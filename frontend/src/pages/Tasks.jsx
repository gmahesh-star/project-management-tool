import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { tasksAPI, projectsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    project_id: searchParams.get('project') || '',
    status: '',
    assignee_id: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    deadline: '',
    project_id: searchParams.get('project') || '',
    assignee_id: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const params = {};
      if (filters.project_id) params.project_id = filters.project_id;
      if (filters.status) params.status = filters.status;
      if (filters.assignee_id) params.assignee_id = filters.assignee_id;

      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        tasksAPI.getAll(params),
        projectsAPI.getAll(),
        user.role !== 'Developer' ? usersAPI.getAll() : Promise.resolve({ data: [] }),
      ]);
      setTasks(tasksRes.data);
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
      const submitData = {
        ...formData,
        project_id: parseInt(formData.project_id),
        assignee_id: formData.assignee_id ? parseInt(formData.assignee_id) : null,
        deadline: formData.deadline || null,
      };
      await tasksAPI.create(submitData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        deadline: '',
        project_id: '',
        assignee_id: '',
      });
      loadData();
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done':
        return 'bg-vintage-green text-vintage-cream';
      case 'In Progress':
        return 'bg-vintage-mustard text-vintage-darkbrown';
      default:
        return 'bg-vintage-brown text-vintage-cream';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-vintage-maroon';
      case 'Medium':
        return 'text-vintage-mustard';
      default:
        return 'text-vintage-brown';
    }
  };

  const canCreateTask = user?.role === 'Admin' || user?.role === 'Manager';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-vintage-brown font-serif text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown">All Tasks</h1>
        {canCreateTask && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-vintage-navy text-vintage-cream rounded hover:bg-vintage-darkbrown transition-colors shadow-vintage"
          >
            <Plus size={20} />
            <span className="font-serif">New Task</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="text-vintage-brown" size={20} />
          <h2 className="font-serif font-bold text-vintage-darkbrown">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-serif text-vintage-brown mb-1">Project</label>
            <select
              value={filters.project_id}
              onChange={(e) => setFilters({ ...filters, project_id: e.target.value })}
              className="w-full px-3 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter text-sm focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-serif text-vintage-brown mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter text-sm focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-serif text-vintage-brown mb-1">Assignee</label>
            <select
              value={filters.assignee_id}
              onChange={(e) => setFilters({ ...filters, assignee_id: e.target.value })}
              className="w-full px-3 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter text-sm focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
            >
              <option value="">All Assignees</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4 hover:shadow-card transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-serif font-bold text-vintage-darkbrown">{task.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-typewriter ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                  <span className={`text-xs font-typewriter ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                </div>
                <p className="text-sm font-serif text-vintage-brown mb-2 line-clamp-2">
                  {task.description}
                </p>
                <div className="flex items-center space-x-4 text-xs font-typewriter text-vintage-brown">
                  <span>
                    Project:{' '}
                    {projects.find((p) => p.id === task.project_id)?.name || 'Unknown'}
                  </span>
                  {task.assignee && <span>Assigned to: {task.assignee.full_name}</span>}
                  {task.deadline && (
                    <span>Due: {format(new Date(task.deadline), 'MMM dd, yyyy')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 bg-vintage-paper border-2 border-vintage-brown rounded-lg">
            <p className="text-vintage-brown font-serif text-lg">No tasks found</p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-vintage-paper border-4 border-vintage-brown rounded-lg shadow-vintage p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif font-bold text-vintage-darkbrown mb-4">
              Create New Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-vintage-brown font-serif font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    Project
                  </label>
                  <select
                    value={formData.project_id}
                    onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    Assignee
                  </label>
                  <select
                    value={formData.assignee_id}
                    onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-vintage-navy text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage"
                >
                  Create Task
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

export default Tasks;
