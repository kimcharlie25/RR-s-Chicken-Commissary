-- Helper to increment stock quantities in batch (e.g. for cancelled orders)
CREATE OR REPLACE FUNCTION increment_menu_item_stock(items jsonb)
RETURNS void AS $$
DECLARE
  entry jsonb;
  qty integer;
BEGIN
  IF items IS NULL THEN
    RETURN;
  END IF;

  FOR entry IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    qty := GREATEST(COALESCE((entry->>'quantity')::integer, 0), 0);

    IF qty <= 0 THEN
      CONTINUE;
    END IF;

    UPDATE menu_items
    SET stock_quantity = COALESCE(stock_quantity, 0) + qty
    WHERE track_inventory = true
      AND id::text = entry->>'id';
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_menu_item_stock(jsonb) TO anon, authenticated;
