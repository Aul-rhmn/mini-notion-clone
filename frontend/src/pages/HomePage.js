import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to Notion Clone</h1>
      <p className="text-xl mb-8">Your minimalist, real-time note-taking app.</p>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
          Login
        </Link>
        <Link to="/register" className="px-6 py-2 bg-gray-700 rounded-md hover:bg-gray-600">
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;