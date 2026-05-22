import React, { useState, useEffect } from 'react';
import { getExpenses, getCategories, addExpense, updateExpense, deleteExpense } from '../api';
import { Plus, Trash2, Filter, Receipt, Calendar, CreditCard, Wallet, Smartphone, AlertCircle, Search, Pencil, X } from 'lucide-react';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    payment_method: 'CASH',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expRes, catRes] = await Promise.all([getExpenses(), getCategories()]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      payment_method: expense.payment_method,
      date: expense.date
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExpense(editingId, formData);
      } else {
        await addExpense(formData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert('Failed to save expense');
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '',
      amount: '',
      category: '',
      payment_method: 'CASH',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'CASH': return <Wallet className="w-4 h-4" />;
      case 'CARD': return <CreditCard className="w-4 h-4" />;
      case 'UPI': return <Smartphone className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  // Filter logic
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exp.category.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="text-center py-10">Loading transactions...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-extrabold text-slate-800">Transactions</h2>
        <button 
          onClick={() => isAdding ? resetForm() : setIsAdding(true)}
          className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
            isAdding ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 shadow-slate-100' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-100'
          }`}
        >
          {isAdding ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> Add Expense</>}
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl border border-primary-100 shadow-sm animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            {editingId ? <Pencil className="w-5 h-5 text-indigo-500" /> : <Plus className="w-5 h-5 text-primary-600" />}
            {editingId ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Title</label>
              <input 
                type="text" 
                required
                placeholder="What did you spend on?"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Amount (₹)</label>
              <input 
                type="number" 
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Category</label>
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Payment Method</label>
              <select 
                value={formData.payment_method}
                onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Date</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-bold hover:bg-slate-900 transition-all">
                {editingId ? 'Update Transaction' : 'Save Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-grow w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 px-4 py-2 rounded-xl border-transparent focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm font-medium text-slate-600 w-full"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
              <tr>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length > 0 ? filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700">{expense.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-tight">
                      {expense.category_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      {getPaymentIcon(expense.payment_method)}
                      <span className="capitalize">{expense.payment_method.toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar className="w-4 h-4" /> {new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-black text-slate-800">{expense.formatted_amount}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-slate-300 hover:text-indigo-500"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 text-slate-300 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                      <p className="font-medium italic">No transactions match your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Expenses;
