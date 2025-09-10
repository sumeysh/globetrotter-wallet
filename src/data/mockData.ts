export interface Currency {
  code: string;
  name: string;
  symbol: string;
  balance: number;
  rate: number;
  flag: string;
}

export interface Transaction {
  id: string;
  type: 'exchange' | 'send' | 'receive' | 'spend' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  category?: string;
}

export interface TravelBudget {
  id: string;
  destination: string;
  totalBudget: number;
  spent: number;
  currency: string;
  startDate: string;
  endDate: string;
  categories: {
    accommodation: { budget: number; spent: number };
    food: { budget: number; spent: number };
    transport: { budget: number; spent: number };
    activities: { budget: number; spent: number };
    shopping: { budget: number; spent: number };
  };
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  lastTransactionDate?: string;
}

export interface Card {
  id: string;
  type: 'physical' | 'virtual';
  number: string;
  expiryDate: string;
  status: 'active' | 'frozen' | 'blocked';
  spendingLimit: number;
  currentSpending: number;
}

export const mockCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', balance: 2450.75, rate: 1.0, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', balance: 890.30, rate: 0.85, flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', balance: 320.50, rate: 0.73, flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', balance: 45000, rate: 110.0, flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', balance: 1200.00, rate: 1.25, flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', balance: 750.25, rate: 1.35, flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', balance: 500.00, rate: 0.92, flag: '🇨🇭' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', balance: 800.00, rate: 1.35, flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', balance: 2500.00, rate: 7.8, flag: '🇭🇰' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', balance: 1500.00, rate: 8.5, flag: '🇸🇪' },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'spend',
    amount: -45.50,
    currency: 'EUR',
    description: 'Café de Flore',
    date: '2024-01-15',
    time: '2 hours ago',
    location: 'Paris, FR',
    status: 'completed',
    category: 'food'
  },
  {
    id: '2',
    type: 'exchange',
    amount: 500,
    currency: 'EUR',
    description: 'USD → EUR Exchange',
    date: '2024-01-14',
    time: 'Yesterday',
    status: 'completed'
  },
  {
    id: '3',
    type: 'spend',
    amount: -120.00,
    currency: 'USD',
    description: 'Hotel Le Marais',
    date: '2024-01-13',
    time: '2 days ago',
    location: 'Paris, FR',
    status: 'completed',
    category: 'accommodation'
  },
  {
    id: '4',
    type: 'receive',
    amount: 1000,
    currency: 'USD',
    description: 'Salary Deposit',
    date: '2024-01-12',
    time: '3 days ago',
    status: 'completed'
  },
  {
    id: '5',
    type: 'send',
    amount: -250.00,
    currency: 'USD',
    description: 'Transfer to Sarah',
    date: '2024-01-11',
    time: '4 days ago',
    status: 'completed',
    recipient: 'Sarah Johnson'
  },
  {
    id: '6',
    type: 'spend',
    amount: -85.30,
    currency: 'EUR',
    description: 'Metro Pass & Taxi',
    date: '2024-01-10',
    time: '5 days ago',
    location: 'Paris, FR',
    status: 'completed',
    category: 'transport'
  },
  {
    id: '7',
    type: 'spend',
    amount: -200.00,
    currency: 'EUR',
    description: 'Louvre Museum & Souvenirs',
    date: '2024-01-09',
    time: '6 days ago',
    location: 'Paris, FR',
    status: 'completed',
    category: 'activities'
  },
  {
    id: '8',
    type: 'transfer',
    amount: -75.00,
    currency: 'GBP',
    description: 'ATM Withdrawal',
    date: '2024-01-08',
    time: '1 week ago',
    location: 'London, UK',
    status: 'completed'
  }
];

export const mockTravelBudgets: TravelBudget[] = [
  {
    id: '1',
    destination: 'Paris, France',
    totalBudget: 1500,
    spent: 650.80,
    currency: 'EUR',
    startDate: '2024-01-10',
    endDate: '2024-01-20',
    categories: {
      accommodation: { budget: 500, spent: 240 },
      food: { budget: 400, spent: 180.50 },
      transport: { budget: 200, spent: 85.30 },
      activities: { budget: 300, spent: 120 },
      shopping: { budget: 100, spent: 25 }
    }
  },
  {
    id: '2',
    destination: 'Tokyo, Japan',
    totalBudget: 2000,
    spent: 0,
    currency: 'JPY',
    startDate: '2024-02-15',
    endDate: '2024-02-25',
    categories: {
      accommodation: { budget: 600, spent: 0 },
      food: { budget: 500, spent: 0 },
      transport: { budget: 300, spent: 0 },
      activities: { budget: 400, spent: 0 },
      shopping: { budget: 200, spent: 0 }
    }
  }
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    avatar: 'SJ',
    lastTransactionDate: '2024-01-11'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    avatar: 'MC',
    lastTransactionDate: '2023-12-20'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    avatar: 'EW'
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david.r@email.com',
    avatar: 'DR'
  }
];

export const mockCards: Card[] = [
  {
    id: '1',
    type: 'physical',
    number: '**** **** **** 4521',
    expiryDate: '12/27',
    status: 'active',
    spendingLimit: 5000,
    currentSpending: 1250.75
  },
  {
    id: '2',
    type: 'virtual',
    number: '**** **** **** 8934',
    expiryDate: '08/26',
    status: 'active',
    spendingLimit: 2000,
    currentSpending: 450.30
  }
];

export const exchangeRates = {
  'USD-EUR': 0.85,
  'USD-GBP': 0.73,
  'USD-JPY': 110.0,
  'USD-CAD': 1.25,
  'EUR-USD': 1.18,
  'EUR-GBP': 0.86,
  'EUR-JPY': 129.4,
  'GBP-USD': 1.37,
  'GBP-EUR': 1.16,
  'JPY-USD': 0.0091
};