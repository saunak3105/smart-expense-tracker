import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../api';
import { Plus, Pencil, Trash2, Tags, AlertCircle, CheckCircle2 } from 'lucide-react';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null); // ID of the category being edited
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCategory(isEditing, formData);
        setMessage({ type: 'success', text: 'Category updated successfully!' });
      } else {
        await addCategory(formData);
        setMessage({ type: 'success', text: 'Category added successfully!' });
      }
      setFormData({ name: '', description: '' });
      setIsEditing(null);
      fetchCategories();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Operation failed. Category name might already exist.' });
    }
  };

  const handleEdit = (cat) => {
    setIsEditing(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This might fail if expenses are linked to this category.')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        alert('Cannot delete category. It is likely protected because expenses are linked to it.');
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-slate-400">Loading categories...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Categories</h2>
          <p className="text-slate-500 mt-1">Manage your expense classifications</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600 flex items-center gap-2">
          <Tags className="w-4 h-4 text-primary-500" />
          Total: {categories.length}
        </div>
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
          {isEditing ? 'Edit Category' : 'Create New Category'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Category Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Groceries, Entertainment"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Description (Optional)</label>
            <input 
              type="text" 
              placeholder="Brief description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-slate-800 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-slate-900 transition-all">
              {isEditing ? 'Update Category' : 'Save Category'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { setIsEditing(null); setFormData({name: '', description: ''}); }}
                className="bg-slate-100 text-slate-600 px-8 py-2.5 rounded-lg font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-primary-100 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-50 p-3 rounded-xl text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                <Tags className="w-6 h-6" />
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleEdit(cat)}
                  className="p-2 text-slate-300 hover:text-indigo-500 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1">{cat.name}</h4>
            <p className="text-slate-500 text-sm line-clamp-2">{cat.description || 'No description provided.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
