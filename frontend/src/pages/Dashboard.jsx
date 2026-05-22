import React, { useState, useEffect } from 'react';
import { getDashboard } from '../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    fetchDashboard();
  }, [month, year]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await getDashboard(month, year);
      setData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-slate-400 font-medium">Loading analytics...</div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center gap-4">
      <AlertTriangle className="w-8 h-8" />
      <div>
        <h3 className="font-bold text-lg">Oops! Something went wrong</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  const statusColors = {
    'OK': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'CAUTION': 'bg-amber-50 text-amber-600 border-amber-100',
    'WARNING': 'bg-orange-50 text-orange-600 border-orange-100',
    'EXCEEDED': 'bg-red-50 text-red-600 border-red-100',
    'NO_BUDGET_SET': 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Financial Overview</h2>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Tracking period: {data.period}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${statusColors[data.status]}`}>
          {data.status === 'OK' && <CheckCircle2 className="w-4 h-4" />}
          {data.status === 'EXCEEDED' && <AlertTriangle className="w-4 h-4" />}
          Budget Status: {data.status}
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Spent</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">₹{data.total_spent.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Monthly Limit</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">₹{data.monthly_limit.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Remaining</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">₹{data.remaining_budget.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Category Breakdown</h3>
          <div className="h-64 w-full">
            {data.category_breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.category_breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="total_amount"
                    nameKey="category__name"
                  >
                    {data.category_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Spent']}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic">
                No data available for this period.
              </div>
            )}
          </div>
        </div>

        {/* Budget Progress Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Budget Utilization</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">Overall Progress</span>
                <span className="text-2xl font-black text-primary-600">{data.utilization_percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    data.utilization_percentage > 90 ? 'bg-red-500' : 
                    data.utilization_percentage > 75 ? 'bg-orange-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${Math.min(data.utilization_percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase">Quick Insights</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-slate-600">
                  <div className={`w-2 h-2 rounded-full ${data.remaining_budget > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                  {data.remaining_budget > 0 ? 
                    `You have ₹${data.remaining_budget.toLocaleString()} left to spend.` : 
                    'You have exceeded your monthly budget limit!'}
                </li>
                {data.category_breakdown.length > 0 && (
                  <li className="flex items-center gap-2 text-slate-600">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    Your highest spending is in <span className="font-bold">{data.category_breakdown[0].category__name}</span>.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
