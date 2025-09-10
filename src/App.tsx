import React, { useState } from 'react';
import { Globe, Settings, CreditCard, ArrowUpRight, TrendingUp, History, Wallet } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';
import LoginPage from './components/LoginPage';
import HomeScreen from './components/screens/HomeScreen';
import ExchangeScreen from './components/screens/ExchangeScreen';
import SendMoneyScreen from './components/screens/SendMoneyScreen';
import BudgetScreen from './components/screens/BudgetScreen';
import TransactionsScreen from './components/screens/TransactionsScreen';
import WalletsScreen from './components/screens/WalletsScreen';
import CardsScreen from './components/screens/CardsScreen';

type Screen = 'home' | 'exchange' | 'send' | 'budget' | 'transactions' | 'wallets' | 'cards' | 'settings';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { currencies, transactions, budgets, contacts, cards, loading: dataLoading, addTransaction, updateCardStatus, addContact, createBudget } = useData();
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showBalance, setShowBalance] = useState(true);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Globe size={28} className="text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not logged in
  if (!user) {
    return <LoginPage onLogin={() => {}} />;
  }

  // Show loading while fetching data
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Globe size={28} className="text-white" />
          </div>
          <p className="text-gray-600">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return (
          <HomeScreen
            currencies={currencies}
            transactions={transactions}
            selectedCurrency={selectedCurrency}
            showBalance={showBalance}
            onCurrencyChange={setSelectedCurrency}
            onToggleBalance={() => setShowBalance(!showBalance)}
            onNavigate={setActiveScreen}
          />
        );
      case 'exchange':
        return (
          <ExchangeScreen
            currencies={currencies}
            onNavigate={setActiveScreen}
            onExchange={addTransaction}
          />
        );
      case 'send':
        return (
          <SendMoneyScreen
            currencies={currencies}
            contacts={contacts}
            onNavigate={setActiveScreen}
            onSend={addTransaction}
            onAddContact={addContact}
          />
        );
      case 'budget':
        return (
          <BudgetScreen
            budgets={budgets}
            onNavigate={setActiveScreen}
            onCreateBudget={createBudget}
            onCreateBudget={createBudget}
          />
        );
      case 'transactions':
        return (
          <TransactionsScreen
            transactions={transactions}
            onNavigate={setActiveScreen}
          />
        );
      case 'wallets':
        return (
          <WalletsScreen
            currencies={currencies}
            onNavigate={setActiveScreen}
          />
        );
      case 'cards':
        return (
          <CardsScreen
            cards={cards}
            onNavigate={setActiveScreen}
            onUpdateCardStatus={updateCardStatus}
          />
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveScreen('home')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe size={20} className="text-gray-600" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">Account</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon</h2>
            <p className="text-gray-600">This feature is under development</p>
            <button
              onClick={() => setActiveScreen('home')}
              className="mt-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
            >
              Back to Home
            </button>
          </div>
        );
    }
  };

  const getNavItemClass = (screen: Screen) => {
    return `flex flex-col items-center gap-1 transition-colors ${
      activeScreen === screen ? 'text-slate-600' : 'text-gray-400 hover:text-gray-600'
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Globetrotter's Wallet</h1>
          </div>
          <button 
            onClick={() => setActiveScreen('settings')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 max-w-md mx-auto pb-24">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 z-10">
        <div className="flex justify-between max-w-md mx-auto">
          <button 
            onClick={() => setActiveScreen('home')}
            className={getNavItemClass('home')}
          >
            <CreditCard size={20} />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => setActiveScreen('wallets')}
            className={getNavItemClass('wallets')}
          >
            <Wallet size={20} />
            <span className="text-xs font-medium">Wallets</span>
          </button>
          <button 
            onClick={() => setActiveScreen('exchange')}
            className={getNavItemClass('exchange')}
          >
            <Globe size={20} />
            <span className="text-xs font-medium">Exchange</span>
          </button>
          <button 
            onClick={() => setActiveScreen('cards')}
            className={getNavItemClass('cards')}
          >
            <CreditCard size={20} />
            <span className="text-xs font-medium">Cards</span>
          </button>
          <button 
            onClick={() => setActiveScreen('transactions')}
            className={getNavItemClass('transactions')}
          >
            <History size={20} />
            <span className="text-xs font-medium">Activity</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;