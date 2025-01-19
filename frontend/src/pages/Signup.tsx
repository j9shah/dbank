import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import ThemeToggle from '../components/ThemeToggle';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // save token to localStorage if provided
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }

      navigate('/dashboard'); // redirect to dashboard
    } catch (error: any) {
      setError(error.response?.data?.message || 'Unable to register. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText">
      <ThemeToggle />
      <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700 dark:text-gray-200">Sign Up</h1>
        <form className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-lightBackground dark:bg-darkBackground text-black dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
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
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;