import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check pro status from user object and localStorage
  const isPro = user?.isPro || localStorage.getItem('user_isPro') === 'true';
  const subscriptionEndDate = user?.subscriptionEndDate || localStorage.getItem('user_subscriptionEndDate');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.dashboard.getStats();
        setStats(response.data);
      } catch {
        setStats({
          user: { isPro: false },
          stats: { totalCreations: 0, todayCreations: 0 },
          recentCreations: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  if (loading) return <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mt-20"></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Welcome, {user?.firstName || 'User'}!</h2>
            <p className="text-gray-600">Email: {user?.primaryEmailAddress?.emailAddress || 'Loading...'}</p>
          </div>
          {user?.publicMetadata?.isAdmin && (
            <button onClick={() => navigate('/admin')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
              Admin Dashboard
            </button>
          )}
        </div>

        {/* Subscription Status Card */}
        <div className={`rounded-xl p-6 mb-6 ${isPro
          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
          : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isPro ? (
                <>
                  <span className="text-2xl mr-3">👑</span>
                  <div>
                    <h3 className="font-bold text-purple-800 text-lg">Pro Member</h3>
                    <p className="text-purple-600 text-sm">Unlimited access to all AI tools</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl mr-3">🎁</span>
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">Free User</h3>
                    <p className="text-green-600 text-sm">Access to Article & Blog tools</p>
                  </div>
                </>
              )}
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold mb-1 ${isPro ? 'text-purple-700' : 'text-green-700'}`}>
                {isPro ? 'Pro' : 'Free'}
              </p>
              {isPro && subscriptionEndDate && (
                <p className="text-xs text-purple-500">
                  Expires: {new Date(subscriptionEndDate).toLocaleDateString()}
                </p>
              )}
              {!isPro && (
                <button
                  onClick={() => navigate('/')}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700">Total Generations</h3>
            <p className="text-2xl font-bold">{stats.stats?.totalCreations || 0}</p>
            <p className="text-sm text-purple-600 mt-1">All time creations</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-700">Today's Usage</h3>
            <p className="text-2xl font-bold">{stats.stats?.todayCreations || 0}</p>
            <p className="text-sm text-green-600 mt-1">Created today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
