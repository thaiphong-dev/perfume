-- Create product categories table
CREATE TABLE IF NOT EXISTS "categories" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "image_url" TEXT,
  "parent_id" UUID REFERENCES "categories"("id") ON DELETE SET NULL,
  "is_active" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS "products" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "compare_at_price" DECIMAL(10, 2),
  "cost_price" DECIMAL(10, 2),
  "sku" TEXT UNIQUE,
  "barcode" TEXT,
  "inventory_quantity" INTEGER DEFAULT 0,
  "allow_backorder" BOOLEAN DEFAULT FALSE,
  "is_active" BOOLEAN DEFAULT TRUE,
  "is_featured" BOOLEAN DEFAULT FALSE,
  "is_new" BOOLEAN DEFAULT FALSE,
  "is_on_sale" BOOLEAN DEFAULT FALSE,
  "weight" DECIMAL(10, 2),
  "weight_unit" TEXT DEFAULT 'g',
  "dimensions" JSONB,
  "metadata" JSONB,
  "category_id" UUID REFERENCES "categories"("id") ON DELETE SET NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product images table
CREATE TABLE IF NOT EXISTS "product_images" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "alt_text" TEXT,
  "is_primary" BOOLEAN DEFAULT FALSE,
  "sort_order" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product variants table
CREATE TABLE IF NOT EXISTS "product_variants" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "sku" TEXT UNIQUE,
  "barcode" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "compare_at_price" DECIMAL(10, 2),
  "cost_price" DECIMAL(10, 2),
  "inventory_quantity" INTEGER DEFAULT 0,
  "is_active" BOOLEAN DEFAULT TRUE,
  "attributes" JSONB NOT NULL,
  "image_url" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create option types
CREATE TABLE IF NOT EXISTS "option_types" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL UNIQUE,
  "display_name" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create option values
CREATE TABLE IF NOT EXISTS "option_values" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "option_type_id" UUID NOT NULL REFERENCES "option_types"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "display_name" TEXT NOT NULL,
  "sort_order" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE("option_type_id", "name")
);

-- Create product options
CREATE TABLE IF NOT EXISTS "product_options" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "option_type_id" UUID NOT NULL REFERENCES "option_types"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE("product_id", "option_type_id")
);

-- Enable Row Level Security
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_variants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "option_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "option_values" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_options" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reading (anyone can read)
CREATE POLICY "Anyone can read categories" ON "categories" FOR SELECT USING (true);
CREATE POLICY "Anyone can read products" ON "products" FOR SELECT USING (true);
CREATE POLICY "Anyone can read product_images" ON "product_images" FOR SELECT USING (true);
CREATE POLICY "Anyone can read product_variants" ON "product_variants" FOR SELECT USING (true);
CREATE POLICY "Anyone can read option_types" ON "option_types" FOR SELECT USING (true);
CREATE POLICY "Anyone can read option_values" ON "option_values" FOR SELECT USING (true);
CREATE POLICY "Anyone can read product_options" ON "product_options" FOR SELECT USING (true);

-- Create RLS policies for writing (only authenticated users can modify)
CREATE POLICY "Authenticated users can modify categories" ON "categories" 
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Authenticated users can modify products" ON "products" 
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Authenticated users can modify product_images" ON "product_images" 
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Authenticated users can modify product_variants" ON "product_variants" 
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Authenticated users can modify option_types" ON "option_types" 
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Authenticated users can modify option_values" ON "option_values" 
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Authenticated users can modify product_options" ON "product_options" 
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create functions for automatically updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at on row update
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON "products" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_product_images_updated_at BEFORE UPDATE ON "product_images" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON "product_variants" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_option_types_updated_at BEFORE UPDATE ON "option_types" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_option_values_updated_at BEFORE UPDATE ON "option_values" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_product_options_updated_at BEFORE UPDATE ON "product_options" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_option_values_option_type_id ON option_values(option_type_id);
CREATE INDEX idx_product_options_product_id ON product_options(product_id);
CREATE INDEX idx_product_options_option_type_id ON product_options(option_type_id); 