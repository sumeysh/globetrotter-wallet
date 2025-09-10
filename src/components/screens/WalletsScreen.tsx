import React, { useState } from 'react';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { Currency } from '../../data/mockData';

interface WalletsScreenProps {
  currencies: Currency[];
  onNavigate: (screen: string) => void;
}

export default function WalletsScreen({ currencies, onNavigate }: WalletsScreenProps) {
  const [showBalances, setShowBalances] = useState(true);
  const [sortBy, setSortBy] = useState<'balance' | 'name' | 'change'>('balance');

  const totalBalanceUSD = currencies.reduce((total, currency) => {
    return total + (currency.balance / currency.rate);
  }, 0);

  const sortedCurrencies = [...currencies].sort((a, b) => {
    switch (sortBy) {
      case 'balance':
        return (b.balance / b.rate) - (a.balance / a.rate);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'change':
        // Mock change data - in real app this would come from API
        return Math.random() - 0.5;
      default:
        return 0;
    }
  });

  const getRandomChange = () => {
    const change = (Math.random() - 0.5) * 10;
    return change;
  };

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
          <h2 className="text-2xl font-bold text-gray-800">My Wallets</h2>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Plus size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-20 h-20 opacity-25">
          <img 
            src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Global finance"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-slate-300 text-sm">Total Portfolio Value</p>
            <div className="flex items-center gap-3">
              {showBalances ? (
                <h2 className="text-3xl font-bold">${totalBalanceUSD.toLocaleString()}</h2>
              ) : (
                <h2 className="text-3xl font-bold">••••••</h2>
              )}
              <button 
                onClick={() => setShowBalances(!showBalances)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {showBalances ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Across {currencies.length} currencies
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-green-300">
              <TrendingUp size={16} />
              <span className="text-sm">+2.4%</span>
            </div>
            <p className="text-slate-300 text-xs">24h change</p>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex gap-2">
            {[
              { key: 'balance', label: 'Balance' },
              { key: 'name', label: 'Name' },
              { key: 'change', label: 'Change' }
            ].map(option => (
              <button
                key={option.key}
                onClick={() => setSortBy(option.key as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === option.key
                    ? 'bg-slate-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Currency List */}
      <div className="space-y-3">
        {sortedCurrencies.map(currency => {
          const change = getRandomChange();
          const usdValue = currency.balance / currency.rate;
          
          return (
            <div key={currency.code} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{currency.flag}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{currency.name}</h3>
                    <p className="text-sm text-gray-500">{currency.code}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-3 mb-1">
                    {showBalances ? (
                      <p className="text-xl font-bold text-gray-800">
                        {currency.symbol}{currency.balance.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-xl font-bold text-gray-800">••••••</p>
                    )}
                    <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span className="text-sm font-medium">{Math.abs(change).toFixed(2)}%</span>
                    </div>
                  </div>
                  {showBalances && (
                    <p className="text-sm text-gray-500">
                      ≈ ${usdValue.toLocaleString()} USD
                    </p>
                  )}
                </div>
              </div>
              
              {/* Exchange Rate */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Exchange Rate</span>
                  <span className="font-medium text-gray-800">
                    1 USD = {currency.rate} {currency.code}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Currency Button */}
      <button className="w-full bg-white hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-2xl p-6 text-center transition-colors">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Plus size={20} />
          <span className="font-medium">Add New Currency</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Support for 150+ currencies worldwide</p>
      </button>
    </div>
  );
}