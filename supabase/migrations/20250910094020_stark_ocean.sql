/*
  # Seed Initial Data for Globetrotter's Wallet

  1. Currencies
    - Insert major world currencies with current rates
  
  2. Sample Data
    - This will be populated per user when they sign up
*/

-- Insert major currencies
INSERT INTO currencies (code, name, symbol, flag, rate) VALUES
  ('USD', 'US Dollar', '$', '🇺🇸', 1.0),
  ('EUR', 'Euro', '€', '🇪🇺', 0.85),
  ('GBP', 'British Pound', '£', '🇬🇧', 0.73),
  ('JPY', 'Japanese Yen', '¥', '🇯🇵', 110.0),
  ('CAD', 'Canadian Dollar', 'C$', '🇨🇦', 1.25),
  ('AUD', 'Australian Dollar', 'A$', '🇦🇺', 1.35),
  ('CHF', 'Swiss Franc', 'CHF', '🇨🇭', 0.92),
  ('SGD', 'Singapore Dollar', 'S$', '🇸🇬', 1.35),
  ('HKD', 'Hong Kong Dollar', 'HK$', '🇭🇰', 7.8),
  ('SEK', 'Swedish Krona', 'kr', '🇸🇪', 8.5)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  symbol = EXCLUDED.symbol,
  flag = EXCLUDED.flag,
  rate = EXCLUDED.rate,
  updated_at = now();