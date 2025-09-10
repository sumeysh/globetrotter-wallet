import React from 'react';
import { Globe, Eye, EyeOff, Plus, Minus, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import { Currency, Transaction } from '../../data/mockData';

interface HomeScreenProps {
  currencies: Currency[];
  transactions: Transaction[];
  selectedCurrency: string;
  showBalance: boolean;
  onCurrencyChange: (currency: string) => void;
  onToggleBalance: () => void;
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({
  currencies,
  transactions,
  selectedCurrency,
  showBalance,
  onCurrencyChange,
  onToggleBalance,
  onNavigate
}: HomeScreenProps) {
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  const totalBalanceUSD = currencies.reduce((total, currency) => {
    return total + (currency.balance / currency.rate);
  }, 0);

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

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20">
          <img 
            src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="World map pattern"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-slate-300 text-sm">Total Balance</p>
            <div className="flex items-center gap-3">
              {showBalance ? (
                <h2 className="text-3xl font-bold">{currentCurrency.symbol}{currentCurrency.balance.toLocaleString()}</h2>
              ) : (
                <h2 className="text-3xl font-bold">••••••</h2>
              )}
              <button 
                onClick={onToggleBalance}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {showBalance && (
              <p className="text-slate-300 text-sm mt-1">
                ≈ ${totalBalanceUSD.toLocaleString()} USD
              </p>
            )}
          </div>
          <div className="text-right">
            <select 
              value={selectedCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-slate-500/30 border border-slate-400/30 rounded-lg px-3 py-1 text-sm text-white"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code} className="bg-slate-700">
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate('exchange')}
            className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl p-3 flex items-center justify-center gap-2 transition-colors"
          >
            <Globe size={18} />
            <span className="text-sm font-medium">Exchange</span>
          </button>
          <button 
            onClick={() => onNavigate('send')}
            className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl p-3 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowUpRight size={18} />
            <span className="text-sm font-medium">Send</span>
          </button>
          <button 
            onClick={() => onNavigate('budget')}
            className="flex-1 bg-white/10 hover:bg-white/20 rounded-xl p-3 flex items-center justify-center gap-2 transition-colors"
          >
            <TrendingUp size={18} />
            <span className="text-sm font-medium">Budget</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp size={14} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-600">This Month</span>
          </div>
          <p className="text-xl font-bold text-gray-800">+$2,450</p>
          <p className="text-xs text-green-600">+12% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Globe size={14} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Countries</span>
          </div>
          <p className="text-xl font-bold text-gray-800">12</p>
          <p className="text-xs text-gray-500">Currencies available</p>
        </div>
      </div>

      {/* Multi-Currency Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
              <img 
                src="https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Currency"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Your Wallets</h3>
          </div>
          <button 
            onClick={() => onNavigate('wallets')}
            className="text-sm text-slate-600 hover:text-slate-700 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {currencies.slice(0, 4).map(currency => (
            <div key={currency.code} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{currency.flag}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{currency.name}</p>
                  <p className="text-sm text-gray-500">1 USD = {currency.rate} {currency.code}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  {currency.symbol}{currency.balance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  ${(currency.balance / currency.rate).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
              <img 
                src="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Activity"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          </div>
          <button 
            onClick={() => onNavigate('transactions')}
            className="text-sm text-slate-600 hover:text-slate-700 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map(transaction => (
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
    </div>
  );
}