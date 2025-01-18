import React, { useState } from 'react';
import axios from 'axios';
import ThemeToggle from '../components/ThemeToggle';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/users/login', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText">
      <ThemeToggle />
      <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700 dark:text-gray-200">Welcome Back</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Enter your credentials to login</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          <a href="#" className="text-blue-500 hover:underline">
            Forgot password?
          </a>
        </p>
        <p className="text-center mt-2 text-gray-500 dark:text-gray-400">
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