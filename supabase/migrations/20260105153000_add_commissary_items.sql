-- Insert new categories
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('sauces-condiments', 'Ingredients – Sauces, Condiments & Seasonings', '🧂', 10, true),
  ('powders-spices', 'Ingredients – Powders & Spices', '🌶️', 11, true),
  ('dairy-baking', 'Dairy & Baking', '🥛', 12, true),
  ('jams-sweeteners', 'Jams, Purees & Sweeteners', '🍯', 13, true),
  ('noodles-rice', 'Noodles, Rice & Korean Items', '🍚', 14, true),
  ('meat-frozen', 'Meat, Frozen & Proteins', '🥩', 15, true),
  ('beverages', 'Beverages', '🥤', 16, true),
  ('packaging', 'Packaging & Disposables', '🥡', 17, true),
  ('cleaning-supplies', 'Cleaning & Supplies', '🧹', 18, true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon;

-- Insert menu items for Sauces, Condiments & Seasonings
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
('Honey Pouch', 'Unit: Pcs, Size: 1kg', 195, 'sauces-condiments', false, true, NULL),
('Honey Gallon', 'Unit: Gallon, Size: 6L', 1350, 'sauces-condiments', false, true, NULL),
('Soy Sauce', 'Unit: Gallon, Size: 3785ml', 197, 'sauces-condiments', false, true, NULL),
('Datu Puti Vinegar', 'Unit: Gallon, Size: N/A', 157, 'sauces-condiments', false, true, NULL),
('Mustard', 'Unit: Gallon, Size: 3.4kg', 675, 'sauces-condiments', false, true, NULL),
('Brown Sugar', 'Unit: Pack, Size: 1kg', 90, 'sauces-condiments', false, true, NULL),
('Sugar Syrup', 'Unit: Bottle, Size: 750ml', 165, 'sauces-condiments', false, true, NULL),
('MSG', 'Unit: Pack, Size: 1kg', 79, 'sauces-condiments', false, true, NULL),
('Salt', 'Unit: Pack, Size: 1kg', 49, 'sauces-condiments', false, true, NULL),
('Del Monte Tomato Ketchup', 'Unit: Pack, Size: 3kg', 290, 'sauces-condiments', false, true, NULL),
('Heinz Tomato Ketchup', 'Unit: Pack, Size: 3.2kg', 499, 'sauces-condiments', false, true, NULL),
('Del Monte Sweet Chili', 'Unit: Pack, Size: N/A', 78, 'sauces-condiments', false, true, NULL),
('Hot Sauce', 'Unit: Gallon, Size: N/A', 190, 'sauces-condiments', false, true, NULL),
('Sriracha Sauce', 'Unit: Bottle, Size: 814g', 285, 'sauces-condiments', false, true, NULL),
('Habanero Sauce', 'Unit: Bottle, Size: 250ml', 189, 'sauces-condiments', false, true, NULL),
('Sala Sauce', 'Unit: Bottle, Size: 710ml', 220, 'sauces-condiments', false, true, NULL),
('Gochujang', 'Unit: Gallon, Size: 14kg', 2121, 'sauces-condiments', false, true, NULL),
('Bulgogi Sauce', 'Unit: Gallon, Size: 3.79L', 2360, 'sauces-condiments', false, true, NULL),
('Mama Sitas', 'Unit: Gallon, Size: 3.55L', 788, 'sauces-condiments', false, true, NULL),
('Tteokbokki Powder', 'Unit: Pack, Size: 1kg', 495, 'sauces-condiments', false, true, NULL),
('Odeng Guk / Dashida Powder', 'Unit: Pack, Size: 1kg', 747, 'sauces-condiments', false, true, NULL),
('Mayonnaise', 'Unit: Gallon, Size: 5.5L', 868, 'sauces-condiments', false, true, NULL),
('Sesame Oil', 'Unit: Gallon, Size: 3L', 680, 'sauces-condiments', false, true, NULL);

-- Insert menu items for Powders & Spices
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
('Chili Powder', 'Unit: Pack, Size: 1kg', 220, 'powders-spices', false, true, NULL),
('Chili Powder (N/A)', 'Unit: Pack, Size: N/A', 200, 'powders-spices', false, true, NULL),
('Chili Flakes', 'Unit: Pack, Size: 1kg', 220, 'powders-spices', false, true, NULL),
('Garlic Powder', 'Unit: Pack, Size: 1kg', 170, 'powders-spices', false, true, NULL),
('Onion Powder', 'Unit: Pack, Size: 500g', 115, 'powders-spices', false, true, NULL),
('Ginger Powder', 'Unit: Pack, Size: 1kg', 326, 'powders-spices', false, true, NULL),
('Pepper Powder', 'Unit: Pack, Size: 1kg', 159, 'powders-spices', false, true, NULL),
('Whole Pepper Corn', 'Unit: Pack, Size: 250g', 157, 'powders-spices', false, true, NULL),
('Smoked Paprika', 'Unit: Pack, Size: 250g', 89, 'powders-spices', false, true, NULL),
('Five Spices', 'Unit: Pack, Size: 1kg', 330, 'powders-spices', false, true, NULL),
('Cajun', 'Unit: Pack, Size: 250g', 115, 'powders-spices', false, true, NULL),
('Burning Dust', 'Unit: Pack, Size: 500g', 910, 'powders-spices', false, true, NULL),
('Dried Parsley', 'Unit: Pack, Size: 1kg', 700, 'powders-spices', false, true, NULL),
('Chicken Powder', 'Unit: Can, Size: 1kg', 218, 'powders-spices', false, true, NULL);

-- Insert menu items for Dairy & Baking
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
('Butter', 'Unit: Pcs, Size: 200g', 48, 'dairy-baking', false, true, NULL),
('Fresh Milk', 'Unit: Box, Size: 12L', 1113, 'dairy-baking', false, true, NULL),
('Skim Milk', 'Unit: Pack, Size: 1kg', 100, 'dairy-baking', false, true, NULL),
('Condensed Milk', 'Unit: Can, Size: 1kg', 110, 'dairy-baking', false, true, NULL),
('Icing Sugar', 'Unit: Pack, Size: 5lbs', 220, 'dairy-baking', false, true, NULL);

-- Insert menu items for Jams, Purees & Sweeteners
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
('Strawberry Jam', 'Unit: Gallon, Size: 3kg', 500, 'jams-sweeteners', false, true, NULL),
('Mango Puree', 'Unit: Pack, Size: 20kg', 2739, 'jams-sweeteners', false, true, NULL),
('Hershey Syrup Chocolate', 'Unit: Bottle, Size: 1.36kg', 366, 'jams-sweeteners', false, true, NULL),
('Hershey Syrup Strawberry', 'Unit: Bottle, Size: 623g', 270, 'jams-sweeteners', false, true, NULL);

-- Insert menu items for Noodles, Rice & Korean Items
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
('Japchae', 'Unit: Pack, Size: 300g', 340, 'noodles-rice', false, true, NULL),
('Beef Bulgogi Noodles', 'Unit: Pcs, Size: 103g', 49, 'noodles-rice', false, true, NULL),
('Samyang (Mild)', 'Unit: Pack, Size: 120g', 215, 'noodles-rice', false, true, NULL),
('Buldak Original', 'Unit: Pack, Size: 145g', 320, 'noodles-rice', false, true, NULL),
('Kbonara', 'Unit: Pack, Size: 140g', 375, 'noodles-rice', false, true, NULL),
('Hella Spicy', 'Unit: Pack, Size: 4pcs', 320, 'noodles-rice', false, true, NULL),
('Japanese Rice', 'Unit: Sack, Size: 25kg', 1350, 'noodles-rice', false, true, NULL),
('Bachelor Rice', 'Unit: Sack, Size: 50kg', 2675, 'noodles-rice', false, true, NULL),
('Danmuji (Radish)', 'Unit: Pack, Size: 3kg', 540, 'noodles-rice', false, true, NULL),
('Kimchi', 'Unit: Pack, Size: N/A', 1000, 'noodles-rice', false, true, NULL);

-- Insert menu items for Meat, Frozen & Proteins
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
('Beef', 'Unit: Pcs, Size: 1kg', 410, 'meat-frozen', false, true, NULL),
('Bacon', 'Unit: Pack, Size: 1kg', 300, 'meat-frozen', false, true, NULL),
('Chicken (Marinated)', 'Unit: Pack, Size: N/A', 1, 'meat-frozen', false, true, NULL),
('Chicken Drummets', 'Unit: Pack, Size: N/A', 1, 'meat-frozen', false, true, NULL),
('Chicken Burger', 'Unit: Pack, Size: N/A', 1, 'meat-frozen', false, true, NULL),
('Big Sausage', 'Unit: Pack, Size: N/A', 330, 'meat-frozen', false, true, NULL),
('Small Sausage', 'Unit: Pack, Size: N/A', 520, 'meat-frozen', false, true, NULL),
('Mandu', 'Unit: Pack, Size: N/A', 200, 'meat-frozen', false, true, NULL),
('Crab Sticks', 'Unit: Pack, Size: N/A', 78, 'meat-frozen', false, true, NULL),
('Lobster Ball', 'Unit: Pack, Size: N/A', 1, 'meat-frozen', false, true, NULL),
('Egg', 'Unit: Tray, Size: N/A', 260, 'meat-frozen', false, true, NULL);

-- Insert menu items for Beverages
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
('Soju', 'Unit: Bottle, Size: N/A', 98, 'beverages', false, true, NULL),
('San Mig Light', 'Unit: Can, Size: N/A', 63, 'beverages', false, true, NULL),
('San Mig Apple', 'Unit: Can, Size: N/A', 73, 'beverages', false, true, NULL),
('San Mig Pilsen', 'Unit: Can, Size: N/A', 55, 'beverages', false, true, NULL),
('Coke Mismo', 'Unit: Case, Size: N/A', 195, 'beverages', false, true, NULL),
('Coke 1.5', 'Unit: Case, Size: N/A', 1464, 'beverages', false, true, NULL),
('Mineral Water', 'Unit: Bottle, Size: N/A', 6, 'beverages', false, true, NULL),
('Swiss Miss', 'Unit: Box, Size: 60pcs', 988, 'beverages', false, true, NULL),
('Maxim Instant Coffee', 'Unit: Box, Size: 100pcs', 1180, 'beverages', false, true, NULL),
('Nescafe Stick', 'Unit: Bundle, Size: N/A', 160, 'beverages', false, true, NULL);

-- Insert menu items for Packaging & Disposables
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
('Fries Pouch', 'Unit: Pack, Size: 500pcs', 300, 'packaging', false, true, NULL),
('Solo Box', 'Unit: Pack, Size: 800ml (50pcs)', 320, 'packaging', false, true, NULL),
('Double Box', 'Unit: Pack, Size: 1400ml (50pcs)', 440, 'packaging', false, true, NULL),
('Family Box', 'Unit: Pack, Size: 2000ml (50pcs)', 650, 'packaging', false, true, NULL),
('Gimbap Box', 'Unit: Pack, Size: N/A', 375, 'packaging', false, true, NULL),
('Solo Cups Plastic', 'Unit: Pack, Size: 100pcs', 55, 'packaging', false, true, NULL),
('Double Cups Plastic', 'Unit: Pack, Size: 100pcs', 95, 'packaging', false, true, NULL),
('16oz Cups', 'Unit: Pack, Size: 500pcs', 3140, 'packaging', false, true, NULL),
('22oz Cups', 'Unit: Pack, Size: 50pcs', 200, 'packaging', false, true, NULL),
('Chopsticks', 'Unit: Pack, Size: N/A', 99, 'packaging', false, true, NULL),
('Spork', 'Unit: Pack, Size: 50pcs', 145, 'packaging', false, true, NULL),
('Odeng Sticks', 'Unit: Pack, Size: 200pcs', 148, 'packaging', false, true, NULL),
('Plastic Gloves Transparent', 'Unit: Box, Size: 100pcs', 50, 'packaging', false, true, NULL),
('Rubber Gloves', 'Unit: Box, Size: 100pcs', 145, 'packaging', false, true, NULL);

-- Insert menu items for Cleaning & Supplies
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url) VALUES
('Zonrox Color Safe', 'Unit: Gallon, Size: N/A', 269, 'cleaning-supplies', false, true, NULL),
('Zonrox White', 'Unit: Gallon, Size: N/A', 145, 'cleaning-supplies', false, true, NULL),
('Dishwashing Mixture', 'Unit: Pack, Size: 14L', 205, 'cleaning-supplies', false, true, NULL),
('Alcohol', 'Unit: Gallon, Size: 3785ml', 380, 'cleaning-supplies', false, true, NULL),
('Degreaser', 'Unit: Gallon, Size: 3785ml', 375, 'cleaning-supplies', false, true, NULL),
('Glass Cleaner', 'Unit: Gallon, Size: 3785ml', 192, 'cleaning-supplies', false, true, NULL),
('Table Cleaner', 'Unit: Gallon, Size: 3785ml', 369, 'cleaning-supplies', false, true, NULL),
('Hairnet', 'Unit: Pack, Size: 100pcs', 179, 'cleaning-supplies', false, true, NULL),
('Table Napkin Tissue', 'Unit: Pack, Size: 5 packs', 200, 'cleaning-supplies', false, true, NULL),
('Panda Pack Tissue', 'Unit: Pack, Size: 10 packs', 585, 'cleaning-supplies', false, true, NULL);
