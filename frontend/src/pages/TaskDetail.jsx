import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTaskData();
  }, [id]);

  const loadTaskData = async () => {
    try {
      const [taskRes, commentsRes] = await Promise.all([
        tasksAPI.getById(id),
        tasksAPI.getComments(id),
      ]);
      setTask(taskRes.data);
      setComments(commentsRes.data);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await tasksAPI.update(id, { status: newStatus });
      setTask({ ...task, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await tasksAPI.addComment(id, newComment);
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment');
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
        <div className="text-vintage-brown font-serif text-xl">Loading task...</div>
      </div>
    );
  }

  const canEdit = user?.role === 'Admin' || user?.role === 'Manager' || task?.assignee_id === user?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-vintage-paper border-2 border-vintage-brown rounded hover:bg-vintage-cream transition-colors"
        >
          <ArrowLeft className="text-vintage-brown" size={20} />
        </button>
        <h1 className="text-3xl font-serif font-bold text-vintage-darkbrown">{task?.title}</h1>
      </div>

      {/* Task Details */}
      <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded font-typewriter ${getStatusColor(task?.status)}`}>
              {task?.status}
            </span>
            <span className={`font-typewriter font-bold ${getPriorityColor(task?.priority)}`}>
              {task?.priority} Priority
            </span>
          </div>
          {canEdit && (
            <div className="flex space-x-2">
              {task?.status !== 'To Do' && (
                <button
                  onClick={() => handleStatusChange('To Do')}
                  disabled={updating}
                  className="px-3 py-1 bg-vintage-brown text-vintage-cream rounded text-sm font-serif hover:bg-vintage-darkbrown transition-colors disabled:opacity-50"
                >
                  To Do
                </button>
              )}
              {task?.status !== 'In Progress' && (
                <button
                  onClick={() => handleStatusChange('In Progress')}
                  disabled={updating}
                  className="px-3 py-1 bg-vintage-mustard text-vintage-darkbrown rounded text-sm font-serif hover:bg-vintage-gold transition-colors disabled:opacity-50"
                >
                  In Progress
                </button>
              )}
              {task?.status !== 'Done' && (
                <button
                  onClick={() => handleStatusChange('Done')}
                  disabled={updating}
                  className="px-3 py-1 bg-vintage-green text-vintage-cream rounded text-sm font-serif hover:bg-vintage-darkbrown transition-colors disabled:opacity-50"
                >
                  Done
                </button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-serif font-bold text-vintage-darkbrown mb-2">Description</h3>
            <p className="font-serif text-vintage-brown whitespace-pre-wrap">
              {task?.description || 'No description provided'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-vintage-mustard">
            <div>
              <p className="text-sm font-serif text-vintage-brown">Assigned to</p>
              <p className="font-typewriter text-vintage-darkbrown">
                {task?.assignee?.full_name || 'Unassigned'}
              </p>
            </div>
            {task?.deadline && (
              <div>
                <p className="text-sm font-serif text-vintage-brown">Deadline</p>
                <p className="font-typewriter text-vintage-darkbrown">
                  {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-serif text-vintage-brown">Created</p>
              <p className="font-typewriter text-vintage-darkbrown">
                {format(new Date(task?.created_at), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
            {task?.updated_at && (
              <div>
                <p className="text-sm font-serif text-vintage-brown">Last Updated</p>
                <p className="font-typewriter text-vintage-darkbrown">
                  {format(new Date(task.updated_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-vintage-paper border-2 border-vintage-brown rounded-lg shadow-vintage p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="text-vintage-brown" size={24} />
          <h2 className="text-xl font-serif font-bold text-vintage-darkbrown">
            Comments ({comments.length})
          </h2>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border-2 border-vintage-brown rounded bg-vintage-cream font-typewriter focus:outline-none focus:ring-2 focus:ring-vintage-mustard"
            />
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 bg-vintage-navy text-vintage-cream rounded hover:bg-vintage-darkbrown transition-colors shadow-vintage"
            >
              <Send size={18} />
              <span className="font-serif">Send</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-vintage-cream border-l-4 border-vintage-mustard rounded"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-vintage-darkbrown">
                    {comment.author.full_name}
                  </span>
                  <span className="text-xs font-typewriter text-vintage-brown">
                    {comment.author.role}
                  </span>
                </div>
                <span className="text-xs font-typewriter text-vintage-brown">
                  {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              <p className="font-serif text-vintage-brown">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-vintage-brown font-serif py-4">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
