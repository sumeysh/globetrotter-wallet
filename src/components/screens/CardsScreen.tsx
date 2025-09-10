import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Eye, EyeOff, Lock, Unlock, Plus, Settings, Smartphone } from 'lucide-react';
import { Card } from '../../data/mockData';

interface CardsScreenProps {
  cards: Card[];
  onNavigate: (screen: string) => void;
}

export default function CardsScreen({ cards, onNavigate }: CardsScreenProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(cards[0] || null);
  const [showCardNumber, setShowCardNumber] = useState(false);

  // Show fallback UI if no cards available
  if (!selectedCard || cards.length === 0) {
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
            <h2 className="text-2xl font-bold text-gray-800">My Cards</h2>
          </div>
        </div>

        {/* No Cards Message */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={24} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Cards Yet</h3>
          <p className="text-gray-500 mb-6">Request your first card to start managing your finances</p>
          <button className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
            Request New Card
          </button>
        </div>
      </div>
    );
  }

  const toggleCardStatus = (cardId: string) => {
    // In a real app, this would make an API call
    console.log(`Toggling card status for card ${cardId}`);
  };

  const getCardGradient = (type: string) => {
    return type === 'physical' 
      ? 'from-slate-600 to-slate-800' 
      : 'from-blue-600 to-blue-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'frozen': return 'text-blue-600 bg-blue-100';
      case 'blocked': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
          <h2 className="text-2xl font-bold text-gray-800">My Cards</h2>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Plus size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Card Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => setSelectedCard(card)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCard.id === card.id
                ? 'bg-slate-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {card.type === 'physical' ? '💳' : '📱'} {card.type.charAt(0).toUpperCase() + card.type.slice(1)} Card
          </button>
        ))}
      </div>

      {/* Card Display */}
      <div className={`bg-gradient-to-br ${getCardGradient(selectedCard.type)} rounded-2xl p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCard.status)}`}>
            {selectedCard.status.charAt(0).toUpperCase() + selectedCard.status.slice(1)}
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={24} />
            <span className="text-sm opacity-80">
              {selectedCard.type === 'physical' ? 'Physical Card' : 'Virtual Card'}
            </span>
          </div>
          <h3 className="text-xl font-semibold">Globetrotter's Card</h3>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {showCardNumber ? (
              <p className="text-2xl font-mono tracking-wider">{selectedCard.number.replace(/\*/g, '4')}</p>
            ) : (
              <p className="text-2xl font-mono tracking-wider">{selectedCard.number}</p>
            )}
            <button 
              onClick={() => setShowCardNumber(!showCardNumber)}
              className="text-white/80 hover:text-white transition-colors"
            >
              {showCardNumber ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-white/80 text-sm">Expires {selectedCard.expiryDate}</p>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-white/80 text-sm">Monthly Spending</p>
            <p className="text-lg font-semibold">
              ${selectedCard.currentSpending.toLocaleString()} / ${selectedCard.spendingLimit.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <Smartphone size={24} className="text-white/60" />
          </div>
        </div>

        {/* Spending Progress */}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(selectedCard.currentSpending / selectedCard.spendingLimit) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Card Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Card Controls</h3>
        
        <div className="space-y-4">
          {/* Freeze/Unfreeze Card */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              {selectedCard.status === 'frozen' ? (
                <Unlock size={20} className="text-blue-600" />
              ) : (
                <Lock size={20} className="text-gray-600" />
              )}
              <div>
                <p className="font-medium text-gray-800">
                  {selectedCard.status === 'frozen' ? 'Unfreeze Card' : 'Freeze Card'}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedCard.status === 'frozen' 
                    ? 'Reactivate your card for transactions' 
                    : 'Temporarily disable all transactions'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleCardStatus(selectedCard.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCard.status === 'frozen'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {selectedCard.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
            </button>
          </div>

          {/* Spending Limit */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Spending Limit</p>
                <p className="text-sm text-gray-500">
                  Current limit: ${selectedCard.spendingLimit.toLocaleString()}/month
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors">
              Adjust
            </button>
          </div>

          {/* PIN & Security */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">PIN & Security</p>
                <p className="text-sm text-gray-500">Change PIN or security settings</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors">
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Recent Card Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Card Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <CreditCard size={14} className="text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Café de Flore</p>
                <p className="text-sm text-gray-500">Today, 2:30 PM • Paris, FR</p>
              </div>
            </div>
            <p className="font-semibold text-gray-800">-€45.50</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <CreditCard size={14} className="text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Metro Pass</p>
                <p className="text-sm text-gray-500">Yesterday, 9:15 AM • Paris, FR</p>
              </div>
            </div>
            <p className="font-semibold text-gray-800">-€15.30</p>
          </div>
        </div>
      </div>

      {/* Add New Card */}
      <button className="w-full bg-white hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-2xl p-6 text-center transition-colors">
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
          <Plus size={20} />
          <span className="font-medium">Request New Card</span>
        </div>
        <p className="text-sm text-gray-500">Physical or virtual cards available</p>
      </button>
    </div>
  );
}