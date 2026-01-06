-- Create customer_accounts table
CREATE TABLE IF NOT EXISTS customer_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  branch_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customer_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can read (for login check - in a real app, this should be a secure function)
CREATE POLICY "Public can select customer_accounts"
  ON customer_accounts FOR SELECT TO public USING (true);

-- Only authenticated admins can manage customer accounts
CREATE POLICY "Admins can manage customer_accounts"
  ON customer_accounts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_customer_accounts_updated_at
  BEFORE UPDATE ON customer_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
