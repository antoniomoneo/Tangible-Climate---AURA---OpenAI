import React, { useState, useEffect } from 'react';

const AdminLogin: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Tangible' && password === 'T4NG1BL3') {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-cyan-400 font-title">Admin Access</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  
  const handleClearThread = () => {
    localStorage.removeItem('openai_thread_id');
    alert('The user\'s conversation thread has been cleared. The next chat will start a new conversation.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-cyan-400 font-title">Admin Panel</h1>
            <button 
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none"
            >
                Logout
            </button>
        </div>
        <div className="space-y-4 pt-4 border-t border-gray-600">
          <h2 className="text-lg font-semibold text-gray-300">Chat Management</h2>
          <p className="text-sm text-gray-400">
            If a user's conversation with AURA becomes stuck or corrupted, you can clear their current session. This will force a new conversation thread to be created the next time they open the chat.
          </p>
           <button
            onClick={handleClearThread}
            className="px-6 py-2 font-bold text-white bg-amber-600 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Clear User Chat Thread
          </button>
        </div>
      </div>
    </div>
  );
};


const AdminScreen: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const sessionAuth = sessionStorage.getItem('isAdminAuthenticated');
        if (sessionAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        setIsAuthenticated(false);
        window.location.href = '#/';
    };

    if (!isAuthenticated) {
        return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
    }

    return <AdminPanel onLogout={handleLogout} />;
};

export default AdminScreen;