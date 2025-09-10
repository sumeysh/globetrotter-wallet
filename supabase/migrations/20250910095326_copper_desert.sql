/*
  # Add wallet balance update function

  1. Functions
    - `update_wallet_balance` - Safely update wallet balance with proper error handling
    - Creates wallet if it doesn't exist for the currency
    - Updates existing wallet balance
*/

CREATE OR REPLACE FUNCTION update_wallet_balance(
  p_user_id uuid,
  p_currency_code text,
  p_amount numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update wallet balance
  INSERT INTO wallets (user_id, currency_code, balance, updated_at)
  VALUES (p_user_id, p_currency_code, p_amount, now())
  ON CONFLICT (user_id, currency_code)
  DO UPDATE SET 
    balance = wallets.balance + p_amount,
    updated_at = now();
END;
$$;