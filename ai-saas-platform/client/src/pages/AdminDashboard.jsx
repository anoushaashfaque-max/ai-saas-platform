import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, DollarSign, FileText, TrendingUp, Shield, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [creations, setCreations] = useState([]);

  useEffect(() => {
    checkAdminAccess();
    fetchAdminStats();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!data.data.user.isAdmin) navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    }
  };

  const fetchAdminStats = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const token = await getToken();
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(data.data.users);
  };

  const fetchPayments = async () => {
    const token = await getToken();
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/payments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPayments(data.data.payments);
  };

  const fetchCreations = async () => {
    const token = await getToken();
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/creations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCreations(data.data.creations);
  };

  const updateUserStatus = async (userId, updates) => {
    try {
      const token = await getToken();
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
      alert('User updated successfully');
    } catch {
      alert('Failed to update user');
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-white rounded-xl p-6 border ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mt-20"></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage users, payments, and analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.firstName}</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              Back to User Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl p-1 mb-8 border flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'payments', label: 'Payments', icon: DollarSign },
            { id: 'creations', label: 'Creations', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'users') fetchUsers();
                if (tab.id === 'payments') fetchPayments();
                if (tab.id === 'creations') fetchCreations();
              }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={stats.overview.totalUsers} icon={Users} color="border-l-4 border-blue-500" />
              <StatCard title="Pro Users" value={stats.overview.proUsers} icon={Shield} color="border-l-4 border-purple-500" />
              <StatCard title="Total Revenue" value={`$${(stats.overview.totalRevenue / 100).toFixed(2)}`} icon={DollarSign} color="border-l-4 border-green-500" />
              <StatCard title="Today's Creations" value={stats.overview.todayCreations} icon={TrendingUp} color="border-l-4 border-orange-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
