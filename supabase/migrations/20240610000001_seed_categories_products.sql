-- Create categories: Skincare, Perfume, Gift Set
INSERT INTO categories (name, slug, description, is_active)
VALUES 
  ('Skincare', 'skincare', 'Luxury skincare products for all skin types', true),
  ('Perfume', 'perfume', 'Signature scents and fragrances for every occasion', true),
  ('Gift Set', 'gift-set', 'Curated collections perfect for gifting', true)
ON CONFLICT (slug) DO NOTHING;

-- Add stock_quantity column to products table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'stock_quantity'
    ) THEN
        ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
    END IF;
END $$;


-- Add alt_text column to product_images table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'product_images' AND column_name = 'alt_text'
    ) THEN
        ALTER TABLE product_images ADD COLUMN alt_text TEXT;
    END IF;
END $$;


-- Get category IDs for reference
DO $$
DECLARE 
  skincare_id UUID;
  perfume_id UUID;
  giftset_id UUID;
BEGIN
  SELECT id INTO skincare_id FROM categories WHERE slug = 'skincare';
  SELECT id INTO perfume_id FROM categories WHERE slug = 'perfume';
  SELECT id INTO giftset_id FROM categories WHERE slug = 'gift-set';

  -- Skincare Products
  INSERT INTO products (name, slug, description, price, compare_at_price, category_id, is_active, is_featured, is_new, sku, stock_quantity)
  VALUES
    ('Hydrating Facial Cleanser', 'hydrating-facial-cleanser', 'Gentle cleanser that removes impurities without stripping the skin''s natural moisture.', 24.99, 29.99, skincare_id, true, true, true, 'SK-CL-001', 100),
    ('Vitamin C Brightening Serum', 'vitamin-c-brightening-serum', 'Powerful antioxidant serum that brightens skin tone and reduces dark spots.', 54.99, 64.99, skincare_id, true, true, false, 'SK-SR-001', 85),
    ('Retinol Night Cream', 'retinol-night-cream', 'Advanced formula that reduces fine lines and improves skin texture while you sleep.', 59.99, 69.99, skincare_id, true, false, true, 'SK-CR-001', 75),
    ('Hyaluronic Acid Moisturizer', 'hyaluronic-acid-moisturizer', 'Intense hydration for all skin types, locking in moisture for up to 72 hours.', 39.99, 44.99, skincare_id, true, false, false, 'SK-MO-001', 120),
    ('Exfoliating Facial Scrub', 'exfoliating-facial-scrub', 'Gentle yet effective scrub that removes dead skin cells for a brighter complexion.', 28.99, 34.99, skincare_id, true, false, false, 'SK-EX-001', 90),
    ('Eye Contour Cream', 'eye-contour-cream', 'Targeted treatment for dark circles and puffiness around the delicate eye area.', 44.99, 54.99, skincare_id, true, true, false, 'SK-EC-001', 65),
    ('Detoxifying Clay Mask', 'detoxifying-clay-mask', 'Deep cleansing mask that draws out impurities and excess oil.', 29.99, 34.99, skincare_id, true, false, true, 'SK-MK-001', 80),
    ('Anti-Aging Face Oil', 'anti-aging-face-oil', 'Nourishing blend of botanical oils that restore elasticity and radiance.', 64.99, 74.99, skincare_id, true, true, false, 'SK-OL-001', 60),
    ('Soothing Face Toner', 'soothing-face-toner', 'Alcohol-free formula that balances pH levels and prepares skin for treatments.', 22.99, 26.99, skincare_id, true, false, false, 'SK-TN-001', 110),
    ('Intensive Repair Cream', 'intensive-repair-cream', 'Rich, deeply hydrating cream for very dry or damaged skin.', 49.99, 59.99, skincare_id, true, false, true, 'SK-CR-002', 70);

  -- Perfume Products
  INSERT INTO products (name, slug, description, price, compare_at_price, category_id, is_active, is_featured, is_new, sku, stock_quantity)
  VALUES
    ('Midnight Orchid', 'midnight-orchid', 'Seductive blend of exotic orchid, vanilla, and amber notes for evening wear.', 89.99, 99.99, perfume_id, true, true, true, 'PF-WM-001', 50),
    ('Citrus Breeze', 'citrus-breeze', 'Refreshing combination of lemon, bergamot, and sea notes for a daytime scent.', 59.99, 69.99, perfume_id, true, false, false, 'PF-WM-002', 65),
    ('Cedar & Spice', 'cedar-spice', 'Masculine fragrance with warm cedar, cardamom, and leather undertones.', 74.99, 84.99, perfume_id, true, true, false, 'PF-MN-001', 55),
    ('Rose Elixir', 'rose-elixir', 'Romantic blend of Bulgarian rose, peony, and subtle musk.', 79.99, 89.99, perfume_id, true, false, true, 'PF-WM-003', 45),
    ('Mountain Pine', 'mountain-pine', 'Invigorating scent with pine, fir, and hints of wintergreen.', 69.99, 79.99, perfume_id, true, false, false, 'PF-MN-002', 60),
    ('Vanilla Dreams', 'vanilla-dreams', 'Sweet and comforting aroma with Madagascar vanilla and caramel notes.', 64.99, 74.99, perfume_id, true, true, false, 'PF-UX-001', 70),
    ('Ocean Memories', 'ocean-memories', 'Fresh aquatic scent with notes of sea salt, driftwood, and white musk.', 59.99, 69.99, perfume_id, true, false, true, 'PF-UX-002', 75),
    ('Jasmine Nights', 'jasmine-nights', 'Intoxicating floral fragrance dominated by jasmine, tuberose, and ylang-ylang.', 84.99, 94.99, perfume_id, true, true, false, 'PF-WM-004', 40),
    ('Amber Oud', 'amber-oud', 'Rich, exotic blend with oud, amber, and precious woods.', 119.99, 139.99, perfume_id, true, false, true, 'PF-UX-003', 30),
    ('Citron & Vetiver', 'citron-vetiver', 'Sophisticated composition of citrus top notes with earthy vetiver base.', 79.99, 89.99, perfume_id, true, false, false, 'PF-MN-003', 50);

  -- Gift Set Products
  INSERT INTO products (name, slug, description, price, compare_at_price, category_id, is_active, is_featured, is_new, sku, stock_quantity)
  VALUES
    ('Ultimate Skincare Collection', 'ultimate-skincare-collection', 'Complete set with cleanser, toner, serum, and moisturizer for a perfect routine.', 129.99, 159.99, giftset_id, true, true, true, 'GS-SK-001', 40),
    ('Fragrance Discovery Set', 'fragrance-discovery-set', 'Collection of 5 mini perfumes to find your signature scent.', 49.99, 59.99, giftset_id, true, false, false, 'GS-PF-001', 55),
    ('Bath & Body Essentials', 'bath-body-essentials', 'Luxurious set with shower gel, body scrub, lotion, and hand cream.', 69.99, 84.99, giftset_id, true, true, false, 'GS-BB-001', 45),
    ('Anti-Aging Ritual', 'anti-aging-ritual', 'Specialized collection targeting fine lines and wrinkles with proven ingredients.', 149.99, 179.99, giftset_id, true, false, true, 'GS-SK-002', 35),
    ('Men''s Grooming Kit', 'mens-grooming-kit', 'Complete set with face wash, shaving cream, aftershave, and moisturizer.', 79.99, 94.99, giftset_id, true, false, false, 'GS-MN-001', 50),
    ('Home Spa Experience', 'home-spa-experience', 'Create a spa at home with bath salts, candle, face mask, and body oil.', 89.99, 109.99, giftset_id, true, true, false, 'GS-SP-001', 40),
    ('Travel Essentials', 'travel-essentials', 'Compact set of skincare and body care products perfect for travelers.', 59.99, 69.99, giftset_id, true, false, true, 'GS-TR-001', 60),
    ('Seasonal Limited Edition', 'seasonal-limited-edition', 'Special holiday collection with exclusive scents and packaging.', 99.99, 119.99, giftset_id, true, true, false, 'GS-LE-001', 30),
    ('Relaxation Gift Box', 'relaxation-gift-box', 'Curated set to enhance relaxation with lavender products and accessories.', 74.99, 89.99, giftset_id, true, false, false, 'GS-RX-001', 45),
    ('Luxury Sampler', 'luxury-sampler', 'Collection of bestselling luxury products in travel sizes.', 119.99, 139.99, giftset_id, true, false, true, 'GS-LX-001', 25);

  -- Add product images
  -- For simplicity, we'll add one primary image for each product using placeholder URLs
  -- In a real scenario, you'd use actual image URLs

  -- Skincare product images
  FOR i IN 1..10 LOOP
    INSERT INTO product_images (product_id, url, alt_text, is_primary)
    SELECT id, 'https://via.placeholder.com/500x500?text=Skincare+Product+' || i, name, true
    FROM products
    WHERE category_id = skincare_id
    ORDER BY name
    LIMIT 1 OFFSET i-1;
  END LOOP;

  -- Perfume product images
  FOR i IN 1..10 LOOP
    INSERT INTO product_images (product_id, url, alt_text, is_primary)
    SELECT id, 'https://via.placeholder.com/500x500?text=Perfume+Product+' || i, name, true
    FROM products
    WHERE category_id = perfume_id
    ORDER BY name
    LIMIT 1 OFFSET i-1;
  END LOOP;

  -- Gift Set product images
  FOR i IN 1..10 LOOP
    INSERT INTO product_images (product_id, url, alt_text, is_primary)
    SELECT id, 'https://via.placeholder.com/500x500?text=Gift+Set+Product+' || i, name, true
    FROM products
    WHERE category_id = giftset_id
    ORDER BY name
    LIMIT 1 OFFSET i-1;
  END LOOP;

END $$;