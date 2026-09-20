import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { BudgetEngine } from '../services/budgetEngine';
import { StatCard } from '../components/StatCard';
import { Expense } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { DollarSign, Plus, TrendingUp, AlertCircle, Trash2, Calendar, Receipt } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Accommodation: '#10b981',
  Transportation: '#00b4d8',
  Activities: '#8b5cf6',
  Food: '#f59e0b',
  'Local Travel': '#38bdf8',
  Other: '#64748b',
};

export const BudgetPage: React.FC = () => {
  const { activeTrip, updateTrip } = useTrip();
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(500);
  const [expenseCategory, setExpenseCategory] = useState<Expense['category']>('Food');
  const [expenseDate, setExpenseDate] = useState('2026-10-10');

  const budgetSummary = BudgetEngine.calculateBudget(activeTrip);

  const pieData = Object.entries(budgetSummary.breakdown_by_category)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));

  const barData = budgetSummary.daily_spend.map((d) => ({
    name: `Day ${d.day_number}`,
    amount: d.amount,
  }));

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      trip_id: activeTrip.id,
      category: expenseCategory,
      description: expenseDesc,
      amount: Number(expenseAmount),
      date: expenseDate,
      created_at: new Date().toISOString(),
    };

    const updated = {
      ...activeTrip,
      expenses: [...(activeTrip.expenses || []), newExpense],
    };
    updateTrip(updated);
    setShowAddExpenseModal(false);
    setExpenseDesc('');
  };

  const handleRemoveExpense = (id: string) => {
    const updated = {
      ...activeTrip,
      expenses: (activeTrip.expenses || []).filter((e) => e.id !== id),
    };
    updateTrip(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Deterministic Finance Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Smart Budget Manager
          </h1>
        </div>

        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Log Custom Expense
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Budget"
          value={BudgetEngine.formatCurrency(budgetSummary.total_budget, activeTrip.currency)}
          subtitle="Allocated for trip"
          icon={DollarSign}
          color="cyan"
        />
        <StatCard
          title="Estimated & Logged Spend"
          value={BudgetEngine.formatCurrency(budgetSummary.total_spent, activeTrip.currency)}
          subtitle={`${budgetSummary.utilization_percentage}% utilized`}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Remaining Balance"
          value={BudgetEngine.formatCurrency(budgetSummary.remaining_budget, activeTrip.currency)}
          subtitle={budgetSummary.is_over_budget ? 'Budget Exceeded!' : 'Available buffer'}
          icon={Receipt}
          color={budgetSummary.is_over_budget ? 'rose' : 'emerald'}
        />
        <StatCard
          title="Utilization Rate"
          value={`${budgetSummary.utilization_percentage}%`}
          subtitle="Real-time balance"
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Donut) */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Expenditure by Category</h3>
            <span className="text-xs text-slate-400">Proportional allocation</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name] || '#64748b'}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#0b132b', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Spend Breakdown (Bar) */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Daily Itinerary Expenditure</h3>
            <span className="text-xs text-slate-400">Day-by-day estimate</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#0b132b', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="amount" fill="#00b4d8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Logged Expenses Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Logged Expenses & Confirmed Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(activeTrip.expenses || []).map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{exp.description}</td>
                  <td className="p-3">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[exp.category]}20`,
                        color: CATEGORY_COLORS[exp.category],
                      }}
                    >
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{exp.date}</td>
                  <td className="p-3 text-right font-bold text-white">₹{exp.amount.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRemoveExpense(exp.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Expense */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-white mb-4">Log New Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  required
                  placeholder="e.g. Scuba gear rental or Dinner"
                  className="glass-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="glass-input w-full"
                  >
                    <option value="Food" className="bg-navy-900">Food</option>
                    <option value="Accommodation" className="bg-navy-900">Accommodation</option>
                    <option value="Transportation" className="bg-navy-900">Transportation</option>
                    <option value="Activities" className="bg-navy-900">Activities</option>
                    <option value="Local Travel" className="bg-navy-900">Local Travel</option>
                    <option value="Other" className="bg-navy-900">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    required
                    min="1"
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                  className="glass-input w-full"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
