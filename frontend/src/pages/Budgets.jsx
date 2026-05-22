import React, { useState, useEffect } from 'react';
import { getBudgets, addBudget, updateBudget, deleteBudget } from '../api';
import { Plus, Pencil, Trash2, PiggyBank, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const now = new Date();
  const [formData, setFormData] = useState({ 
    month: now.getMonth() + 1, 
    year: now.getFullYear(), 
    monthly_limit: '' 
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await getBudgets();
      setBudgets(res.data);
    } catch (err) {
      console.error('Failed to fetch budgets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateBudget(isEditing, formData);
        setMessage({ type: 'success', text: 'Budget updated successfully!' });
      } else {
        await addBudget(formData);
        setMessage({ type: 'success', text: 'Budget set successfully!' });
      }
      setFormData({ month: now.getMonth() + 1, year: now.getFullYear(), monthly_limit: '' });
      setIsEditing(null);
      fetchBudgets();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Operation failed. You might already have a budget for this month.' });
    }
  };

  const handleEdit = (budget) => {
    setIsEditing(budget.id);
    setFormData({ 
      month: budget.month, 
      year: budget.year, 
      monthly_limit: budget.monthly_limit 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        fetchBudgets();
      } catch (err) {
        alert('Failed to delete budget.');
      }
    }
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  if (loading) return <div className="text-center py-10 text-slate-400">Loading budgets...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-800">Budgets</h2>
        <p className="text-slate-500 mt-1">Plan your monthly spending limits</p>
      </header>

      {message.text && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium text-sm">{message.text}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          {isEditing ? <Pencil className="w-5 h-5 text-indigo-500" /> : <Plus className="w-5 h-5 text-primary-600" />}
          {isEditing ? 'Edit Budget' : 'Set Monthly Budget'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Month</label>
            <select 
              required
              value={formData.month}
              onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{getMonthName(i+1)}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Year</label>
            <input 
              type="number" 
              required
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Limit (₹)</label>
            <input 
              type="number" 
              required
              placeholder="0.00"
              value={formData.monthly_limit}
              onChange={(e) => setFormData({...formData, monthly_limit: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="md:col-span-3 flex gap-3">
            <button type="submit" className="bg-slate-800 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-slate-900 transition-all">
              {isEditing ? 'Update Budget' : 'Set Budget'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { setIsEditing(null); setFormData({month: now.getMonth() + 1, year: now.getFullYear(), monthly_limit: ''}); }}
                className="bg-slate-100 text-slate-600 px-8 py-2.5 rounded-lg font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/30">
            <tr>
              <th className="px-6 py-4">Period</th>
              <th className="px-6 py-4">Monthly Limit</th>
              <th className="px-6 py-4">Spent</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {budgets.map((budget) => (
              <tr key={budget.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {getMonthName(budget.month)} {budget.year}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-black text-slate-800">₹{parseFloat(budget.monthly_limit).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-600">₹{parseFloat(budget.spent_amount).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    budget.status === 'OK' ? 'bg-emerald-50 text-emerald-600' :
                    budget.status === 'EXCEEDED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {budget.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleEdit(budget)} className="p-2 text-slate-300 hover:text-indigo-500"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(budget.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Budgets;
