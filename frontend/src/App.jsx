import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Categories from './pages/Categories';
import { logout } from './api';
import { LogOut, LayoutDashboard, ReceiptText, Wallet, PiggyBank, Tags } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {isLoggedIn && (
          <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                SmartExpense
              </h1>
              <div className="hidden lg:flex space-x-6">
                <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/expenses" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-2">
                  <ReceiptText className="w-4 h-4" /> Expenses
                </Link>
                <Link to="/budgets" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-2">
                  <PiggyBank className="w-4 h-4" /> Budgets
                </Link>
                <Link to="/categories" className="text-slate-600 hover:text-primary-600 font-medium flex items-center gap-2">
                  <Tags className="w-4 h-4" /> Categories
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-500 text-sm hidden sm:inline">Welcome, <span className="font-semibold text-slate-700">{username}</span></span>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </nav>
        )}

        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/login" element={!isLoggedIn ? <Login onLogin={() => setIsLoggedIn(true)} /> : <Navigate to="/" />} />
            <Route path="/register" element={!isLoggedIn ? <Register onLogin={() => setIsLoggedIn(true)} /> : <Navigate to="/" />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
            <Route path="/budgets" element={<PrivateRoute><Budgets /></PrivateRoute>} />
            <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
          </Routes>
        </main>
        
        <footer className="py-6 text-center text-slate-400 text-xs border-t border-slate-100 bg-white">
          &copy; {new Date().getFullYear()} SmartExpense Tracker • Production Ready Backend
        </footer>
      </div>
    </Router>
  );
}

export default App;
