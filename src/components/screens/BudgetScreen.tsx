import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, TrendingUp, MapPin, Calendar, PieChart } from 'lucide-react';
import { TravelBudget } from '../../data/mockData';

interface BudgetScreenProps {
  budgets: TravelBudget[];
  onNavigate: (screen: string) => void;
  onCreateBudget?: (budget: any) => Promise<any>;
}

export default function BudgetScreen({ budgets, onNavigate, onCreateBudget }: BudgetScreenProps) {
  const [selectedBudget, setSelectedBudget] = useState<TravelBudget | null>(budgets[0] || null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    destination: '',
    totalBudget: '',
    currency: 'USD',
    startDate: '',
    endDate: '',
    categories: {
      accommodation: '',
      food: '',
      transport: '',
      activities: '',
      shopping: ''
    }
  });
  const [isCreating, setIsCreating] = useState(false);

  // Keep selected budget in sync when new budgets arrive or when the list changes
  useEffect(() => {
    if (!selectedBudget && budgets.length > 0) {
      setSelectedBudget(budgets[0]);
    }
    // If the currently selected budget id no longer exists, select the first
    if (selectedBudget && budgets.length > 0 && !budgets.find(b => b.id === selectedBudget.id)) {
      setSelectedBudget(budgets[0]);
    }
  }, [budgets]);

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateBudget || !newBudget.destination || !newBudget.totalBudget) return;
    
    setIsCreating(true);
    try {
      const result = await onCreateBudget({
        destination: newBudget.destination,
        totalBudget: parseFloat(newBudget.totalBudget),
        currency: newBudget.currency,
        startDate: newBudget.startDate,
        endDate: newBudget.endDate,
        categories: newBudget.categories
      });
      
      console.log('Budget creation result:', result);
      
      setShowCreateForm(false);
      // After creation, rely on budgets prop update to select the newly added item
      setNewBudget({
        destination: '',
        totalBudget: '',
        currency: 'USD',
        startDate: '',
        endDate: '',
        categories: {
          accommodation: '',
          food: '',
          transport: '',
          activities: '',
          shopping: ''
        }
      });
    } catch (error) {
      console.error('Failed to create budget:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!selectedBudget) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Travel Budgets</h2>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg">
            <img 
              src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=400" 
              alt="Travel planning"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Travel Budgets Yet</h3>
          <p className="text-gray-600 mb-6">Create your first travel budget to track spending on your trips</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus size={18} />
            <span>Create Budget</span>
          </button>
        </div>
        
        {/* Create Budget Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Travel Budget</h3>
            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  value={newBudget.destination}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g., Paris, France"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget</label>
                  <input
                    type="number"
                    value={newBudget.totalBudget}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, totalBudget: e.target.value }))}
                    placeholder="1500"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={newBudget.currency}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newBudget.startDate}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newBudget.endDate}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Category Budgets</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(newBudget.categories).map(([category, value]) => (
                    <div key={category}>
                      <label className="block text-xs text-gray-600 mb-1 capitalize">{category}</label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setNewBudget(prev => ({
                          ...prev,
                          categories: { ...prev.categories, [category]: e.target.value }
                        }))}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Create Budget</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  const budgetPercentage = (selectedBudget.spent / selectedBudget.totalBudget) * 100;
  const remaining = selectedBudget.totalBudget - selectedBudget.spent;

  const categoryData = Object.entries(selectedBudget.categories).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    budget: value.budget,
    spent: value.spent,
    percentage: (value.spent / value.budget) * 100
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Travel Budgets</h2>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Budget Selector */}
      {budgets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {budgets.map(budget => (
            <button
              key={budget.id}
              onClick={() => setSelectedBudget(budget)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedBudget.id === budget.id
                  ? 'bg-slate-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {budget.destination}
            </button>
          ))}
        </div>
      )}

      {/* Main Budget Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="absolute top-4 right-4 w-16 h-16 rounded-xl overflow-hidden opacity-25">
         <img 
           src="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=400" 
           alt="Travel"
           className="w-full h-full object-cover"
         />
       </div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} className="text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-800">{selectedBudget.destination}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>{selectedBudget.startDate} - {selectedBudget.endDate}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              {selectedBudget.spent.toLocaleString()} / {selectedBudget.totalBudget.toLocaleString()} {selectedBudget.currency}
            </p>
            <p className="text-sm text-gray-500">{Math.round(budgetPercentage)}% used</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-300 ${
                budgetPercentage < 50 ? 'bg-green-500' :
                budgetPercentage < 75 ? 'bg-yellow-500' :
                budgetPercentage < 90 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Budget Alert */}
        {budgetPercentage >= 75 && (
          <div className={`p-4 rounded-xl mb-6 ${
            budgetPercentage >= 90 ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
          }`}>
            <p className={`text-sm font-medium ${
              budgetPercentage >= 90 ? 'text-red-800' : 'text-orange-800'
            }`}>
              {budgetPercentage >= 90 ? 
                '⚠️ You\'ve used 90% of your budget!' : 
                '💡 You\'ve used 75% of your budget. Consider tracking your spending more closely.'
              }
            </p>
          </div>
        )}

        {/* Remaining Amount */}
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Remaining</span>
            <span className="text-xl font-bold text-green-600">
              {remaining.toLocaleString()} {selectedBudget.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {categoryData.map(category => (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{category.name}</span>
                <span className="text-sm text-gray-600">
                  {category.spent} / {category.budget} {selectedBudget.currency}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    category.percentage < 50 ? 'bg-green-500' :
                    category.percentage < 75 ? 'bg-yellow-500' :
                    category.percentage < 90 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{Math.round(category.percentage)}% used</span>
                <span>{(category.budget - category.spent).toLocaleString()} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-left transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-slate-600" />
            <span className="font-medium text-gray-800">Adjust Budget</span>
          </div>
          <p className="text-sm text-gray-500">Modify your spending limits</p>
        </button>
        <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 text-left transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Plus size={20} className="text-slate-600" />
            <span className="font-medium text-gray-800">Add Expense</span>
          </div>
          <p className="text-sm text-gray-500">Log a new transaction</p>
        </button>
      </div>
    </div>
  );
}