import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI, projectsAPI } from '../services/api';
import { CheckCircle, Clock, ListTodo } from 'lucide-react';
import { format } from 'date-fns';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        tasksAPI.getMyTasks(),
        projectsAPI.getAll(),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
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

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const todoCount = tasks.filter((t) => t.status === 'To Do').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const doneCount = tasks.filter((t) => t.status === 'Done').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-vintage-brown font-serif text-xl">Loading your tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown">My Tasks</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-serif text-vintage-brown">To Do</p>
              <p className="text-2xl font-bold font-typewriter text-vintage-darkbrown">
                {todoCount}
              </p>
            </div>
            <ListTodo className="text-vintage-brown" size={32} />
          </div>
        </div>
        <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-serif text-vintage-brown">In Progress</p>
              <p className="text-2xl font-bold font-typewriter text-vintage-mustard">
                {inProgressCount}
              </p>
            </div>
            <Clock className="text-vintage-mustard" size={32} />
          </div>
        </div>
        <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-serif text-vintage-brown">Done</p>
              <p className="text-2xl font-bold font-typewriter text-vintage-green">
                {doneCount}
              </p>
            </div>
            <CheckCircle className="text-vintage-green" size={32} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b-2 border-vintage-brown">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-serif font-bold transition-colors ${
            filter === 'all'
              ? 'text-vintage-darkbrown border-b-4 border-vintage-navy'
              : 'text-vintage-brown hover:text-vintage-darkbrown'
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('To Do')}
          className={`px-4 py-2 font-serif font-bold transition-colors ${
            filter === 'To Do'
              ? 'text-vintage-darkbrown border-b-4 border-vintage-navy'
              : 'text-vintage-brown hover:text-vintage-darkbrown'
          }`}
        >
          To Do ({todoCount})
        </button>
        <button
          onClick={() => setFilter('In Progress')}
          className={`px-4 py-2 font-serif font-bold transition-colors ${
            filter === 'In Progress'
              ? 'text-vintage-darkbrown border-b-4 border-vintage-navy'
              : 'text-vintage-brown hover:text-vintage-darkbrown'
          }`}
        >
          In Progress ({inProgressCount})
        </button>
        <button
          onClick={() => setFilter('Done')}
          className={`px-4 py-2 font-serif font-bold transition-colors ${
            filter === 'Done'
              ? 'text-vintage-darkbrown border-b-4 border-vintage-navy'
              : 'text-vintage-brown hover:text-vintage-darkbrown'
          }`}
        >
          Done ({doneCount})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
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
                  {task.deadline && (
                    <span>Due: {format(new Date(task.deadline), 'MMM dd, yyyy')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-vintage-paper border-2 border-vintage-brown rounded-lg">
            <p className="text-vintage-brown font-serif text-lg">No tasks in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
