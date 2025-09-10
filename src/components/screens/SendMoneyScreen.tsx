import React, { useState } from 'react';
import { ArrowLeft, Send, User, Search, Clock, CheckCircle, QrCode } from 'lucide-react';
import { Currency, Contact } from '../../data/mockData';
import QRScanner from '../QRScanner';

interface SendMoneyScreenProps {
  currencies: Currency[];
  contacts: Contact[];
  onNavigate: (screen: string) => void;
  onSend: (transaction: any) => Promise<any>;
  onAddContact: (contact: any) => Promise<any>;
}

export default function SendMoneyScreen({ currencies, contacts, onNavigate, onSend, onAddContact }: SendMoneyScreenProps) {
  const [step, setStep] = useState<'recipient' | 'amount' | 'confirm' | 'success'>('recipient');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [customRecipient, setCustomRecipient] = useState({ name: '', email: '' });
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const selectedCurrency = currencies.find(c => c.code === currency);
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMoney = async () => {
    setIsLoading(true);
    
    try {
      await onSend({
        type: 'send',
        amount: -parseFloat(amount),
        currency: currency,
        description: `Transfer to ${selectedContact?.name || customRecipient.name}`,
        recipient: selectedContact?.name || customRecipient.name,
        status: 'completed'
      });
      
      // Add contact if it's a new one
      if (!selectedContact && customRecipient.name && customRecipient.email) {
        await onAddContact({
          name: customRecipient.name,
          email: customRecipient.email,
          avatar: customRecipient.name.split(' ').map(n => n[0]).join('').toUpperCase()
        });
      }
      
      setStep('success');
    } catch (error) {
      console.error('Send money failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('recipient');
    setSelectedContact(null);
    setCustomRecipient({ name: '', email: '' });
    setAmount('');
    setMessage('');
    setSearchQuery('');
  };

  const handleQRScan = (result: string) => {
    try {
      // Try to parse QR code data (could be JSON with payment info)
      const qrData = JSON.parse(result);
      if (qrData.email && qrData.name) {
        setCustomRecipient({ name: qrData.name, email: qrData.email });
        if (qrData.amount) setAmount(qrData.amount.toString());
        if (qrData.currency) setCurrency(qrData.currency);
        setStep('amount');
      }
    } catch {
      // If not JSON, treat as email address
      if (result.includes('@')) {
        setCustomRecipient(prev => ({ ...prev, email: result }));
      }
    }
    setShowQRScanner(false);
  };

  if (step === 'success') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Money Sent</h2>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Transfer Successful!</h3>
          <p className="text-gray-600 mb-6">
            Your money has been sent to {selectedContact?.name || customRecipient.name}
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount Sent</span>
              <span className="font-bold text-gray-800">
                {selectedCurrency?.symbol}{amount} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Recipient</span>
              <span className="font-medium text-gray-800">
                {selectedContact?.name || customRecipient.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm text-gray-600">#TXN-{Date.now()}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Send Again
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
          onClick={() => step === 'recipient' ? onNavigate('home') : setStep('recipient')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Send Money</h2>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {['recipient', 'amount', 'confirm'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === stepName ? 'bg-slate-600 text-white' :
              ['recipient', 'amount', 'confirm'].indexOf(step) > index ? 'bg-green-500 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            {index < 2 && (
              <div className={`w-12 h-1 mx-2 ${
                ['recipient', 'amount', 'confirm'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 'recipient' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Who are you sending to?</h3>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts or enter email"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <button
              onClick={() => setShowQRScanner(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <QrCode size={18} className="text-gray-600" />
            </button>
          </div>

          {/* QR Scanner */}
          <QRScanner
            isOpen={showQRScanner}
            onScan={handleQRScan}
            onClose={() => setShowQRScanner(false)}
          />

          {/* Recent Contacts */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent</h4>
            <div className="space-y-2">
              {filteredContacts.slice(0, 3).map(contact => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setStep('amount');
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-600">{contact.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                  {contact.lastTransactionDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      <span>Recent</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Add New Recipient */}
          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Send to someone new</h4>
            <div className="space-y-3">
              <input
                type="text"
                value={customRecipient.name}
                onChange={(e) => setCustomRecipient(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Recipient name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <input
                type="email"
                value={customRecipient.email}
                onChange={(e) => setCustomRecipient(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Recipient email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <button
                onClick={() => setStep('amount')}
                disabled={!customRecipient.name || !customRecipient.email}
                className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'amount' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How much are you sending?</h3>
          
          {/* Recipient Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-slate-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {selectedContact?.name || customRecipient.name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedContact?.email || customRecipient.email}
                </p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="flex gap-3">
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-32 px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent text-lg"
              />
            </div>
            {selectedCurrency && (
              <p className="text-sm text-gray-500 mt-2">
                Available: {selectedCurrency.symbol}{selectedCurrency.balance.toLocaleString()}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            onClick={() => setStep('confirm')}
            disabled={!amount || parseFloat(amount) > (selectedCurrency?.balance || 0)}
            className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Confirm Transfer</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Recipient</span>
              <span className="font-medium text-gray-800">
                {selectedContact?.name || customRecipient.name}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Amount</span>
              <span className="font-bold text-gray-800">
                {selectedCurrency?.symbol}{amount} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Fee</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            {message && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 block mb-1">Message</span>
                <span className="text-gray-800">{message}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleSendMoney}
            disabled={isLoading}
            className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Send Money</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}