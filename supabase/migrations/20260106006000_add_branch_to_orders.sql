-- Add branch_name column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS branch_name text;

-- Add index for branch_name if needed
CREATE INDEX IF NOT EXISTS idx_orders_branch_name ON orders(branch_name);
