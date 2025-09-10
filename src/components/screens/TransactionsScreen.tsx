import React, { useState } from 'react';
import { ArrowLeft, Filter, Search, Calendar, Plus, Minus, Globe, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '../../data/mockData';

interface TransactionsScreenProps {
  transactions: Transaction[];
  onNavigate: (screen: string) => void;
}

export default function TransactionsScreen({ transactions, onNavigate }: TransactionsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'spend' | 'receive' | 'exchange' | 'send'>('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'spend': return <Minus size={16} className="text-red-600" />;
      case 'receive': return <Plus size={16} className="text-green-600" />;
      case 'exchange': return <Globe size={16} className="text-blue-600" />;
      case 'send': return <ArrowUpRight size={16} className="text-orange-600" />;
      case 'transfer': return <ArrowDownLeft size={16} className="text-purple-600" />;
      default: return <Globe size={16} className="text-gray-600" />;
    }
  };

  const getTransactionBgColor = (type: string) => {
    switch (type) {
      case 'spend': return 'bg-red-100';
      case 'receive': return 'bg-green-100';
      case 'exchange': return 'bg-blue-100';
      case 'send': return 'bg-orange-100';
      case 'transfer': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || transaction.type === selectedFilter;
    const matchesMonth = selectedMonth === 'all' || transaction.date.includes(selectedMonth);
    
    return matchesSearch && matchesFilter && matchesMonth;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const totalSpent = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalReceived = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => onNavigate('home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Minus size={14} className="text-red-600" />
            </div>
            <span className="text-sm text-gray-600">Total Spent</span>
          </div>
          <p className="text-xl font-bold text-gray-800">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Plus size={14} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Total Received</span>
          </div>
          <p className="text-xl font-bold text-gray-800">${totalReceived.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All', icon: Filter },
            { key: 'spend', label: 'Spending', icon: Minus },
            { key: 'receive', label: 'Income', icon: Plus },
            { key: 'exchange', label: 'Exchange', icon: Globe },
            { key: 'send', label: 'Transfers', icon: ArrowUpRight }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedFilter === filter.key
                  ? 'bg-slate-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <filter.icon size={14} />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
          >
            <option value="all">All months</option>
            <option value="2024-01">January 2024</option>
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <div key={date} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className="space-y-3">
              {dayTransactions.map(transaction => (
                <div key={transaction.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionBgColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{transaction.time}</span>
                      {transaction.location && (
                        <>
                          <span>•</span>
                          <span>{transaction.location}</span>
                        </>
                      )}
                      {transaction.recipient && (
                        <>
                          <span>•</span>
                          <span>to {transaction.recipient}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} {transaction.currency}
                    </p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No transactions found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}