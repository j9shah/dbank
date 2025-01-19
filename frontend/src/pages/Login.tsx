import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import ThemeToggle from '../components/ThemeToggle';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/api/users/login', formData);

      // save token to localStorage
      localStorage.setItem('authToken', response.data.token);

      // navigate to the dashboard
      navigate('/dashboard');
    } catch (error: any) {
      // handle any errors
      if (error.response?.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText">
      <ThemeToggle />
      <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700 dark:text-gray-200">Welcome Back</h1>
        <form className="space-y-4">
          <div>
            <input
              type="text"
              name="identifier"
              placeholder="Username or Email"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-lightBackground dark:bg-darkBackground text-black dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-lightBackground dark:bg-darkBackground text-black dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-500 dark:text-gray-400">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;