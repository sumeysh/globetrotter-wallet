import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
  balance?: number;
}

export interface Transaction {
  id: string;
  type: 'exchange' | 'send' | 'receive' | 'spend' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  location?: string;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  category?: string;
  created_at: string;
}

export interface TravelBudget {
  id: string;
  destination: string;
  totalBudget: number;
  spent: number;
  currency: string;
  startDate: string;
  endDate: string;
  categories?: {
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
  avatar: string | null;
  last_transaction_date?: string;
}

export interface Card {
  id: string;
  type: 'physical' | 'virtual';
  lastFour: string;
  expiryDate: string;
  status: 'active' | 'frozen' | 'blocked';
  spendingLimit: number;
  currentSpending: number;
}

export function useData() {
  const { user } = useAuth();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<TravelBudget[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load currencies with user balances
      const { data: currencyData } = await supabase
        .from('currencies')
        .select('*')
        .eq('is_active', true);

      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id);

      // Combine currencies with wallet balances
      const currenciesWithBalances = currencyData?.map(currency => ({
        ...currency,
        balance: walletData?.find(w => w.currency_code === currency.code)?.balance || 0,
      })) || [];

      setCurrencies(currenciesWithBalances);

      // Load transactions
      const { data: transactionData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setTransactions(transactionData || []);

      // Load travel budgets with categories
      const { data: budgetData } = await supabase
        .from('travel_budgets')
        .select(`
          *,
          budget_categories (*)
        `)
        .eq('user_id', user.id);

      const budgetsWithCategories = budgetData?.map(budget => ({
        id: budget.id,
        destination: budget.destination,
        totalBudget: Number(budget.total_budget) || 0,
        spent: Number(budget.spent) || 0,
        currency: budget.currency,
        startDate: budget.start_date,
        endDate: budget.end_date,
        categories: budget.budget_categories?.reduce((acc: any, cat: any) => {
          acc[cat.category] = { budget: cat.budget, spent: cat.spent };
          return acc;
        }, {}) || {},
      })) || [];

      setBudgets(budgetsWithCategories);

      // Load contacts
      const { data: contactData } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id);

      setContacts(contactData || []);

      // Load cards
      const { data: cardData } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id);

      const cardsWithMaskedNumbers = cardData?.map(card => ({
        id: card.id,
        type: card.type,
        lastFour: card.last_four,
        expiryDate: card.expiry_date,
        status: card.status,
        spendingLimit: Number(card.spending_limit) || 0,
        currentSpending: Number(card.current_spending) || 0,
        number: `**** **** **** ${card.last_four}`,
      })) || [];

      setCards(cardsWithMaskedNumbers as Card[]);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        user_id: user.id,
      })
      .select()
      .single();

    if (data && !error) {
      setTransactions(prev => [data, ...prev]);
      
      // Update wallet balance
      const { error: walletError } = await supabase
        .rpc('update_wallet_balance', {
          p_user_id: user.id,
          p_currency_code: transaction.currency,
          p_amount: transaction.amount
        });

      if (!walletError) {
        // Reload currencies to get updated balances
        loadData();
      }
    }

    return { data, error };
  };

  const updateCardStatus = async (cardId: string, status: 'active' | 'frozen' | 'blocked') => {
    if (!user) return;

    const { error } = await supabase
      .from('cards')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', cardId)
      .eq('user_id', user.id);

    if (!error) {
      setCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, status } : card
      ));
    }

    return { error };
  };

  const addContact = async (contact: Omit<Contact, 'id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        ...contact,
        user_id: user.id,
      })
      .select()
      .single();

    if (data && !error) {
      setContacts(prev => [...prev, data]);
    }

    return { data, error };
  };

  const createBudget = async (budgetData: any) => {
    if (!user) return;

    console.log('Creating budget with data:', budgetData);

    const { data: budget, error: budgetError } = await supabase
      .from('travel_budgets')
      .insert({
        destination: budgetData.destination,
        total_budget: parseFloat(budgetData.totalBudget) || 0,
        currency: budgetData.currency,
        start_date: budgetData.startDate,
        end_date: budgetData.endDate,
        user_id: user.id,
      })
      .select()
      .single();

    console.log('Budget creation result:', { budget, budgetError });

    if (budget && !budgetError) {
      // Create budget categories
      const categories = Object.entries(budgetData.categories || {})
        .filter(([_, budgetAmount]) => budgetAmount && parseFloat(budgetAmount as string) > 0)
        .map(([category, budgetAmount]) => ({
          budget_id: budget.id,
          category,
          budget: parseFloat(budgetAmount as string) || 0,
        }));

      console.log('Creating categories:', categories);

      if (categories.length > 0) {
        const { error: categoriesError } = await supabase
          .from('budget_categories')
          .insert(categories);

        console.log('Categories creation error:', categoriesError);

        if (!categoriesError) {
          await loadData();
        }
      } else {
        await loadData();
      }
    }

    return { data: budget, error: budgetError };
  };

  return {
    currencies,
    transactions,
    budgets,
    contacts,
    cards,
    loading,
    addTransaction,
    updateCardStatus,
    addContact,
    createBudget,
    refreshData: loadData,
  };
}