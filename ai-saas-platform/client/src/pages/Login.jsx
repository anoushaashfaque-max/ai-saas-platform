import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail, signupWithEmail, loginWithClerk, getAuthOptions } = useAuth();
  const navigate = useNavigate();

  const authOptions = getAuthOptions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) await loginWithEmail(email, password);
      else await signupWithEmail(name, email, password);
    } catch (err) {
      alert(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClerkLogin = async () => {
    setLoading(true);
    try { await loginWithClerk(); }
    catch { alert('Clerk login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <button onClick={() => navigate('/')} className="text-gray-600 hover:text-blue-600 mb-6 flex items-center">
          <ArrowLeft size={20} className="mr-2"/>Back to Home
        </button>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        <div className="space-y-4">
          {authOptions.map(opt => (
            opt.id === 'clerk' ? (
              <button
                key={opt.id}
                onClick={handleClerkLogin}
                disabled={loading}
                className="w-full flex items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition disabled:opacity-50"
              >
                {opt.name}
              </button>
            ) : (
              <form key={opt.id} onSubmit={handleSubmit} className="p-4 border-2 border-gray-200 rounded-xl space-y-4">
                {!isLogin && <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded-lg"/>}
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded-lg"/>
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-2 border rounded-lg"/>
                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 text-sm">
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                  </button>
                </div>
              </form>
            )
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center">By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
};

export default Login;
