-- Fix for: Foreign key constraint cannot be implemented due to type mismatch (text vs uuid)

DO $$
BEGIN
  -- 1. Convert item_id to UUID type from TEXT
  -- This requires that all values in item_id are valid UUID strings. 
  -- If there is bad data, this migration will intentionally fail to avoid data corruption.
  
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'order_items' 
    AND column_name = 'item_id' 
    AND data_type = 'text'
  ) THEN
    ALTER TABLE order_items
    ALTER COLUMN item_id TYPE uuid USING item_id::uuid;
  END IF;

  -- 2. Add foreign key constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'order_items_item_id_fkey'
  ) THEN
    ALTER TABLE order_items 
    ADD CONSTRAINT order_items_item_id_fkey 
    FOREIGN KEY (item_id) REFERENCES menu_items(id)
    ON DELETE NO ACTION; -- Using NO ACTION to prevent deleting menu items that are part of orders
  END IF;
END $$;
