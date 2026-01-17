import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd) => ({
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /\d/.test(pwd),
    special: /[!@#$%^&*]/.test(pwd),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const pwValid = validatePassword(password);
    if (!Object.values(pwValid).every(Boolean)) {
      setError('Password does not meet requirements');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms');
      return;
    }

    setLoading(true);
    try {
      const result = await signup(name, email, password);
      if (result.success) navigate('/dashboard');
      else setError('Signup failed');
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const pwRequirements = validatePassword(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">AI</span>
            </div>
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="opacity-90 mt-2">Start your AI journey today</p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <Input
                icon={<User className="h-5 w-5 text-gray-400" />}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              {/* Email */}
              <Input
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Password */}
              <Input
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggle={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                required
              />

              {/* Confirm Password */}
              <Input
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                toggle={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                required
              />

              {/* Terms */}
              <div className="flex items-center">
                <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded"/>
                <label className="ml-2 text-gray-700 text-sm">
                  I agree to the <Link to="/terms" className="text-blue-600">Terms</Link> and <Link to="/privacy" className="text-blue-600">Privacy Policy</Link>
                </label>
              </div>

              <Button type="submit" loading={loading} className="w-full py-3">Create Account</Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-600 text-sm">
              Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
