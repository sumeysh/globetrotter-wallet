import React, { useState } from 'react';
import { ArrowLeft, Globe, RefreshCw, TrendingUp, Clock } from 'lucide-react';
import { Currency } from '../../data/mockData';

interface ExchangeScreenProps {
  currencies: Currency[];
  onNavigate: (screen: string) => void;
  onExchange: (transaction: any) => Promise<any>;
}

export default function ExchangeScreen({ currencies, onNavigate, onExchange }: ExchangeScreenProps) {
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [exchangeFrom, setExchangeFrom] = useState('USD');
  const [exchangeTo, setExchangeTo] = useState('EUR');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [exchangeResult, setExchangeResult] = useState<any>(null);

  const fromCurrency = currencies.find(c => c.code === exchangeFrom);
  const toCurrency = currencies.find(c => c.code === exchangeTo);
  
  const exchangeRate = toCurrency && fromCurrency ? 
    (fromCurrency.rate / toCurrency.rate) : 1;
  
  const calculatedExchange = exchangeAmount ? 
    (parseFloat(exchangeAmount) * exchangeRate).toFixed(2) : '';

  const handleExchange = async () => {
    setIsLoading(true);
    
    try {
      await onExchange({
        type: 'exchange',
        amount: parseFloat(calculatedExchange),
        currency: exchangeTo,
        description: `${exchangeFrom} → ${exchangeTo} Exchange`,
        status: 'completed'
      });
      
      await onExchange({
        type: 'exchange',
        amount: -parseFloat(exchangeAmount),
        currency: exchangeFrom,
        description: `${exchangeFrom} → ${exchangeTo} Exchange`,
        status: 'completed'
      });
      
      setExchangeResult({
        fromAmount: exchangeAmount,
        fromCurrency: exchangeFrom,
        toAmount: calculatedExchange,
        toCurrency: exchangeTo,
        rate: exchangeRate
      });
      
      setStep('success');
    } catch (error) {
      console.error('Exchange failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const swapCurrencies = () => {
    setExchangeFrom(exchangeTo);
    setExchangeTo(exchangeFrom);
  };

  const resetForm = () => {
    setStep('form');
    setExchangeAmount('');
    setExchangeResult(null);
  };

  if (step === 'success' && exchangeResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Exchange Complete</h2>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Exchange Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your currency exchange has been completed
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">You Paid</span>
              <span className="font-bold text-gray-800">
                {exchangeResult.fromAmount} {exchangeResult.fromCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">You Received</span>
              <span className="font-bold text-green-600">
                {exchangeResult.toAmount} {exchangeResult.toCurrency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-mono text-sm text-gray-600">
                1 {exchangeResult.fromCurrency} = {exchangeResult.rate.toFixed(4)} {exchangeResult.toCurrency}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Exchange Again
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <h2 className="text-2xl font-bold text-gray-800">Currency Exchange</h2>
      </div>

      {/* Exchange Rate Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 opacity-30">
          <img 
            src="https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=400" 
            alt="Exchange"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Live Rate</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Clock size={14} />
            <span>Updated now</span>
          </div>
        </div>
        <p className="text-lg font-bold text-blue-900 mt-1">
          1 {exchangeFrom} = {exchangeRate.toFixed(4)} {exchangeTo}
        </p>
      </div>

      {/* Exchange Form */}
      {step === 'form' && (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-6">
          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">You Pay</label>
            <div className="flex gap-3">
              <select 
                value={exchangeFrom}
                onChange={(e) => setExchangeFrom(e.target.value)}
                className="w-32 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={exchangeAmount}
                onChange={(e) => setExchangeAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent text-lg"
              />
            </div>
            {fromCurrency && (
              <p className="text-sm text-gray-500 mt-2">
                Available: {fromCurrency.symbol}{fromCurrency.balance.toLocaleString()}
              </p>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center py-2">
            <button
              onClick={swapCurrencies}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">You Get</label>
            <div className="flex gap-3">
              <select 
                value={exchangeTo}
                onChange={(e) => setExchangeTo(e.target.value)}
                className="w-32 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>
              <div className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-lg text-gray-800">
                {calculatedExchange || '0.00'}
              </div>
            </div>
          </div>

          {/* Rate Info */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Mid-market rate</span>
              <span className="font-medium">1 {exchangeFrom} = {exchangeRate.toFixed(4)} {exchangeTo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fee</span>
              <span className="font-medium text-green-600">No hidden fees</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">You'll receive</span>
              <span className="font-medium text-slate-800">{calculatedExchange} {exchangeTo}</span>
            </div>
          </div>

          <button 
            onClick={() => setStep('confirm')}
            disabled={!exchangeAmount || isLoading || parseFloat(exchangeAmount) > (fromCurrency?.balance || 0)}
            className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Globe size={18} />
            <span>Review Exchange</span>
          </button>
        </div>
      </div>
      )}

      {step === 'confirm' && (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Confirm Exchange</h3>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-600">You Pay</span>
            <span className="font-bold text-gray-800">{exchangeAmount} {exchangeFrom}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-600">You Receive</span>
            <span className="font-bold text-green-600">{calculatedExchange || '0.00'} {exchangeTo}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-600">Rate</span>
            <span className="font-mono text-sm text-gray-700">1 {exchangeFrom} = {exchangeRate.toFixed(4)} {exchangeTo}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
            <span className="text-gray-600">Fee</span>
            <span className="font-medium text-green-600">No hidden fees</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setStep('form')}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
          >
            Back
          </button>
          <button 
            onClick={handleExchange}
            disabled={isLoading}
            className="flex-1 bg-slate-600 hover:bg-slate-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Globe size={18} />
                <span>Confirm Exchange</span>
              </>
            )}
          </button>
        </div>
      </div>
      )}

      {/* Recent Exchanges */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
            <img 
              src="https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400" 
              alt="Recent exchanges"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Recent Exchanges</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">USD → EUR</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">500.00 EUR</p>
              <p className="text-sm text-gray-500">from 588.24 USD</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">EUR → GBP</p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">200.00 GBP</p>
              <p className="text-sm text-gray-500">from 232.56 EUR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}