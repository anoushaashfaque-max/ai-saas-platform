import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Shield,
  BarChart3
} from 'lucide-react';



/* ---------------- API HELPER ---------------- */
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add JWT token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------------- COMPONENT ---------------- */
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [creations, setCreations] = useState([]);
  const [loadingTab, setLoadingTab] = useState(null);

  /* -------- INIT -------- */
  useEffect(() => {
    initAdmin();
  }, []);

  const initAdmin = async () => {
    const allowed = await checkAdmin();
    if (allowed) fetchStats();
  };

  /* -------- AUTH CHECK -------- */
  const checkAdmin = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (!data.data.user.isAdmin) {
        navigate('/dashboard');
        return false;
      }
      setUser(data.data.user);
      return true;
    } catch {
      navigate('/dashboard');
      return false;
    }
  };

  /* -------- API CALLS -------- */
  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingTab('users');
      const { data } = await api.get('/admin/users');
      setUsers(data.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoadingTab(null);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoadingTab('payments');
      const { data } = await api.get('/admin/payments');
      setPayments(data.data.payments || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      setPayments([]);
    } finally {
      setLoadingTab(null);
    }
  };

  const fetchCreations = async () => {
    try {
      setLoadingTab('creations');
      const { data } = await api.get('/admin/creations');
      setCreations(data.data.creations || []);
    } catch (error) {
      console.error('Failed to fetch creations:', error);
      setCreations([]);
    } finally {
      setLoadingTab(null);
    }
  };

  /* -------- UI PARTS -------- */
  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl border">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white border-b p-4 flex justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" />
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, {user?.name}
          </span>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            User Dashboard
          </button>
        </div>
      </header>

      {/* TABS */}
      <div className="p-6">
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', icon: BarChart3 },
            { id: 'users', icon: Users },
            { id: 'payments', icon: DollarSign },
            { id: 'creations', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'users') fetchUsers();
                if (tab.id === 'payments') fetchPayments();
                if (tab.id === 'creations') fetchCreations();
              }}
              className={`px-4 py-2 rounded ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white'
              }`}
            >
              <tab.icon className="inline w-4 h-4 mr-1" />
              {tab.id}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total Users" value={stats.overview.totalUsers} icon={Users} />
            <StatCard title="Pro Users" value={stats.overview.proUsers} icon={Shield} />
            <StatCard title="Revenue" value={`$${stats.overview.totalRevenue / 100}`} icon={DollarSign} />
            <StatCard title="Today's Creations" value={stats.overview.todayCreations} icon={TrendingUp} />
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-bold mb-4">Users Management</h3>
            {loadingTab === 'users' ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-4">
                {users.map(user => (
                  <div key={user._id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.isPro && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">PRO</span>}
                      {user.isAdmin && <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">ADMIN</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-bold mb-4">Payments History</h3>
            {loadingTab === 'payments' ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map(payment => (
                  <div key={payment._id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium">${(payment.amount / 100).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{payment.description || 'Payment'}</p>
                      <p className="text-xs text-gray-400">Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status || 'unknown'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No payments found</p>
            )}
          </div>
        )}

        {/* CREATIONS */}
        {activeTab === 'creations' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-bold mb-4">Content Creations</h3>
            {loadingTab === 'creations' ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : creations.length > 0 ? (
              <div className="space-y-4">
                {creations.map(creation => (
                  <div key={creation._id} className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{creation.toolType.replace('-', ' ')}</span>
                      <span className="text-sm text-gray-500">{new Date(creation.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{creation.title || 'Untitled'}</p>
                    <div className="text-xs text-gray-400">
                      User: {creation.clerkId || creation.userId?.email || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No creations found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
