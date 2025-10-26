import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI, aiAPI, dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    status: '',
    start_date: '',
    end_date: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      const [projectRes, tasksRes, statsRes] = await Promise.all([
        projectsAPI.getById(id),
        tasksAPI.getAll({ project_id: id }),
        dashboardAPI.getSingleProjectStats(id),
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
      
      // Load user stories
      try {
        const storiesRes = await aiAPI.getUserStories(id);
        setUserStories(storiesRes.data);
      } catch (error) {
        console.log('No user stories yet');
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStories = async () => {
    setAiLoading(true);
    try {
      await aiAPI.generateAndSave(id, aiDescription);
      setShowAIModal(false);
      setAiDescription('');
      loadProjectData();
    } catch (error) {
      console.error('Failed to generate stories:', error);
      alert('Failed to generate user stories. Make sure GROQ API key is configured.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleEditProject = () => {
    setEditFormData({
      name: project.name,
      description: project.description || '',
      status: project.status,
      start_date: project.start_date || '',
      end_date: project.end_date || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateProject = async () => {
    try {
      await projectsAPI.update(id, editFormData);
      setShowEditModal(false);
      loadProjectData();
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks and cannot be undone.')) {
      return;
    }

    try {
      await projectsAPI.delete(id);
      alert('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-vintage-brown font-serif text-xl">Loading project...</div>
      </div>
    );
  }

  const canManage = user?.role === 'Admin' || user?.role === 'Manager';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/projects"
            className="p-2 bg-vintage-paper border-2 border-vintage-brown rounded hover:bg-vintage-cream transition-colors"
          >
            <ArrowLeft className="text-vintage-brown" size={20} />
          </Link>
          <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown">
            {project?.name}
          </h1>
        </div>
        <div className="flex space-x-2">
          {canManage && (
            <>
              <button
                onClick={handleEditProject}
                className="flex items-center space-x-2 px-4 py-2 bg-vintage-navy text-vintage-cream rounded hover:bg-vintage-darkbrown transition-colors shadow-vintage"
              >
                <Edit2 size={18} />
                <span className="font-serif">Edit</span>
              </button>
              <button
                onClick={handleDeleteProject}
                className="flex items-center space-x-2 px-4 py-2 bg-vintage-maroon text-vintage-cream rounded hover:bg-red-800 transition-colors shadow-vintage"
              >
                <Trash2 size={18} />
                <span className="font-serif">Delete</span>
              </button>
              <button
                onClick={() => setShowAIModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-vintage-gold text-vintage-cream rounded hover:bg-vintage-mustard transition-colors shadow-vintage"
              >
                <Sparkles size={20} />
                <span className="font-serif">AI Stories</span>
              </button>
            </>
          )}
          <Link
            to={`/tasks?project=${id}`}
            className="flex items-center space-x-2 px-4 py-2 bg-vintage-navy text-vintage-cream rounded hover:bg-vintage-darkbrown transition-colors shadow-vintage"
          >
            <Plus size={20} />
            <span className="font-serif">New Task</span>
          </Link>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6">
        <p className="text-vintage-brown font-serif mb-4">{project?.description}</p>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="text-vintage-mustard" size={18} />
            <span className="font-typewriter text-vintage-brown">
              {project?.team_members?.length} team members
            </span>
          </div>
          <span className="font-typewriter text-vintage-brown">
            Status: <span className="font-bold">{project?.status}</span>
          </span>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-serif text-vintage-brown">Total Tasks</p>
                <p className="text-2xl font-bold font-typewriter text-vintage-darkbrown">
                  {stats.total_tasks}
                </p>
              </div>
              <CheckCircle className="text-vintage-navy" size={32} />
            </div>
          </div>
          <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-serif text-vintage-brown">Completed</p>
                <p className="text-2xl font-bold font-typewriter text-vintage-green">
                  {stats.completed_tasks}
                </p>
              </div>
              <div className="text-vintage-green font-typewriter text-sm">
                {stats.completion_percentage}%
              </div>
            </div>
          </div>
          <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-serif text-vintage-brown">In Progress</p>
                <p className="text-2xl font-bold font-typewriter text-vintage-mustard">
                  {stats.in_progress_tasks}
                </p>
              </div>
              <Clock className="text-vintage-mustard" size={32} />
            </div>
          </div>
          <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-serif text-vintage-brown">Overdue</p>
                <p className="text-2xl font-bold font-typewriter text-vintage-maroon">
                  {stats.overdue_tasks}
                </p>
              </div>
              <AlertCircle className="text-vintage-maroon" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* User Stories */}
      {userStories.length > 0 && (
        <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6">
          <h2 className="text-xl font-serif font-bold text-vintage-darkbrown mb-4">
            AI-Generated User Stories
          </h2>
          <div className="space-y-2">
            {userStories.map((story) => (
              <div
                key={story.id}
                className="p-3 bg-vintage-cream border-l-4 border-vintage-gold rounded"
              >
                <p className="font-typewriter text-vintage-brown">{story.story}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6">
        <h2 className="text-xl font-serif font-bold text-vintage-darkbrown mb-4">Tasks</h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="block p-4 bg-vintage-cream border-2 border-vintage-brown rounded hover:shadow-card transition-shadow"
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
                  <p className="text-sm font-serif text-vintage-brown line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs font-typewriter text-vintage-brown">
                    {task.assignee && <span>Assigned to: {task.assignee.full_name}</span>}
                    {task.deadline && (
                      <span>Due: {format(new Date(task.deadline), 'MMM dd, yyyy')}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-vintage-brown font-serif py-8">No tasks yet</p>
          )}
        </div>
      </div>

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-vintage-paper border-4 border-vintage-brown rounded-lg shadow-vintage p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-serif font-bold text-vintage-darkbrown mb-4">
              Edit Project
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-vintage-brown font-serif font-bold mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                />
              </div>
              <div>
                <label className="block text-vintage-brown font-serif font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-vintage-brown font-serif font-bold mb-2">
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
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
                    value={editFormData.start_date}
                    onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  />
                </div>
                <div>
                  <label className="block text-vintage-brown font-serif font-bold mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.end_date}
                    onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleUpdateProject}
                className="flex-1 px-6 py-3 bg-vintage-navy text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-6 py-3 bg-vintage-brown text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-vintage-paper border-4 border-vintage-brown rounded-lg shadow-vintage p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-serif font-bold text-vintage-darkbrown mb-4">
              Generate User Stories with AI
            </h2>
            <p className="text-vintage-brown font-serif mb-4">
              Describe your project requirements and let AI generate user stories for you.
            </p>
            <textarea
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              placeholder="E.g., An ecommerce website where customers can browse products, add to cart, and make payments online. Admin should manage products and view orders."
              className="w-full px-4 py-3 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
              rows="6"
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleGenerateStories}
                disabled={aiLoading || !aiDescription}
                className="flex-1 px-6 py-3 bg-vintage-gold text-vintage-cream rounded font-serif font-bold hover:bg-vintage-mustard transition-colors shadow-vintage disabled:opacity-50"
              >
                {aiLoading ? 'Generating...' : 'Generate Stories'}
              </button>
              <button
                onClick={() => setShowAIModal(false)}
                className="flex-1 px-6 py-3 bg-vintage-maroon text-vintage-cream rounded font-serif font-bold hover:bg-vintage-darkbrown transition-colors shadow-vintage"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
