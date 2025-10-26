import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  ListTodo,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [projectStats, setProjectStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, projectStatsRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getProjectStats(),
      ]);
      setStats(statsRes.data);
      setProjectStats(projectStatsRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-vintage-brown font-serif text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.total_projects || 0,
      icon: FolderKanban,
      color: 'bg-vintage-navy',
    },
    {
      title: 'Total Tasks',
      value: stats?.total_tasks || 0,
      icon: CheckSquare,
      color: 'bg-vintage-green',
    },
    {
      title: 'My Tasks',
      value: stats?.my_tasks || 0,
      icon: ListTodo,
      color: 'bg-vintage-mustard',
    },
    {
      title: 'Overdue Tasks',
      value: stats?.overdue_tasks || 0,
      icon: AlertCircle,
      color: 'bg-vintage-maroon',
    },
  ];

  const taskStatusData = stats?.tasks_by_status
    ? Object.entries(stats.tasks_by_status).map(([status, count]) => ({
        status,
        count,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-serif text-vintage-brown mb-1">{card.title}</p>
                  <p className="text-3xl font-bold font-typewriter text-vintage-darkbrown">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-vintage-cream" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6">
          <h2 className="text-xl font-serif font-bold text-vintage-darkbrown mb-4">
            Tasks by Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4A574" />
              <XAxis dataKey="status" stroke="#6B4423" style={{ fontFamily: 'serif' }} />
              <YAxis stroke="#6B4423" style={{ fontFamily: 'serif' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FBF8F1',
                  border: '2px solid #6B4423',
                  fontFamily: 'serif',
                }}
              />
              <Bar dataKey="count" fill="#1E3A5F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Projects */}
        <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6">
          <h2 className="text-xl font-serif font-bold text-vintage-darkbrown mb-4">
            Project Progress
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {projectStats.slice(0, 5).map((project) => (
              <Link
                key={project.project_id}
                to={`/projects/${project.project_id}`}
                className="block p-3 bg-vintage-cream rounded hover:bg-vintage-mustard transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-vintage-darkbrown">
                    {project.project_name}
                  </span>
                  <span className="text-sm font-typewriter text-vintage-brown">
                    {project.completion_percentage}%
                  </span>
                </div>
                <div className="w-full bg-vintage-brown rounded-full h-2">
                  <div
                    className="bg-vintage-green h-2 rounded-full transition-all"
                    style={{ width: `${project.completion_percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs font-typewriter text-vintage-brown">
                  <span>{project.completed_tasks}/{project.total_tasks} tasks</span>
                  {project.overdue_tasks > 0 && (
                    <span className="text-vintage-maroon">
                      {project.overdue_tasks} overdue
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* All Projects Table */}
      <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6">
        <h2 className="text-xl font-serif font-bold text-vintage-darkbrown mb-4">
          All Projects Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-vintage-brown">
                <th className="text-left py-3 px-4 font-serif text-vintage-darkbrown">Project</th>
                <th className="text-center py-3 px-4 font-serif text-vintage-darkbrown">Total</th>
                <th className="text-center py-3 px-4 font-serif text-vintage-darkbrown">To Do</th>
                <th className="text-center py-3 px-4 font-serif text-vintage-darkbrown">In Progress</th>
                <th className="text-center py-3 px-4 font-serif text-vintage-darkbrown">Done</th>
                <th className="text-center py-3 px-4 font-serif text-vintage-darkbrown">Overdue</th>
                <th className="text-center py-3 px-4 font-serif text-vintage-darkbrown">Progress</th>
              </tr>
            </thead>
            <tbody>
              {projectStats.map((project) => (
                <tr key={project.project_id} className="border-b border-vintage-mustard hover:bg-vintage-cream">
                  <td className="py-3 px-4">
                    <Link
                      to={`/projects/${project.project_id}`}
                      className="font-serif text-vintage-navy hover:underline"
                    >
                      {project.project_name}
                    </Link>
                  </td>
                  <td className="text-center py-3 px-4 font-typewriter">{project.total_tasks}</td>
                  <td className="text-center py-3 px-4 font-typewriter">{project.todo_tasks}</td>
                  <td className="text-center py-3 px-4 font-typewriter">{project.in_progress_tasks}</td>
                  <td className="text-center py-3 px-4 font-typewriter">{project.completed_tasks}</td>
                  <td className="text-center py-3 px-4 font-typewriter text-vintage-maroon">
                    {project.overdue_tasks}
                  </td>
                  <td className="text-center py-3 px-4 font-typewriter">
                    {project.completion_percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
