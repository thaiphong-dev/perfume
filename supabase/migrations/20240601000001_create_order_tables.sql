-- Create orders table
CREATE TABLE IF NOT EXISTS "orders" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "order_number" TEXT NOT NULL UNIQUE,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "subtotal" DECIMAL(10, 2) NOT NULL,
  "shipping_fee" DECIMAL(10, 2) DEFAULT 0,
  "tax" DECIMAL(10, 2) DEFAULT 0,
  "discount" DECIMAL(10, 2) DEFAULT 0,
  "total" DECIMAL(10, 2) NOT NULL,
  "coupon_code" TEXT,
  "shipping_address" JSONB,
  "billing_address" JSONB,
  "payment_method" TEXT,
  "payment_status" TEXT DEFAULT 'pending',
  "notes" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS "order_items" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "order_id" UUID NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
  "variant_id" UUID REFERENCES "product_variants"("id") ON DELETE RESTRICT,
  "name" TEXT NOT NULL,
  "sku" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "subtotal" DECIMAL(10, 2) NOT NULL,
  "options" JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shipping methods table
CREATE TABLE IF NOT EXISTS "shipping_methods" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10, 2) NOT NULL,
  "is_active" BOOLEAN DEFAULT TRUE,
  "estimated_delivery_time" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payment methods table
CREATE TABLE IF NOT EXISTS "payment_methods" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "is_active" BOOLEAN DEFAULT TRUE,
  "instructions" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS "coupons" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "code" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "discount_type" TEXT NOT NULL, -- percentage, fixed_amount
  "discount_value" DECIMAL(10, 2) NOT NULL,
  "minimum_order_amount" DECIMAL(10, 2) DEFAULT 0,
  "maximum_discount" DECIMAL(10, 2),
  "is_active" BOOLEAN DEFAULT TRUE,
  "starts_at" TIMESTAMP WITH TIME ZONE,
  "expires_at" TIMESTAMP WITH TIME ZONE,
  "usage_limit" INTEGER,
  "usage_count" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shipping_methods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment_methods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "coupons" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders (users can only see their own orders)
CREATE POLICY "Users can read their own orders" ON "orders"
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON "orders"
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON "orders"
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all orders" ON "orders"
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can modify all orders" ON "orders"
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create RLS policies for order items
CREATE POLICY "Users can read their own order items" ON "order_items"
FOR SELECT USING (auth.uid() = (SELECT user_id FROM orders WHERE id = order_id));

CREATE POLICY "Users can insert their own order items" ON "order_items"
FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM orders WHERE id = order_id));

CREATE POLICY "Admins can read all order items" ON "order_items"
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can modify all order items" ON "order_items"
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create RLS policies for shipping methods (anyone can read, only admins can modify)
CREATE POLICY "Anyone can read shipping methods" ON "shipping_methods" FOR SELECT USING (true);
CREATE POLICY "Admins can modify shipping methods" ON "shipping_methods"
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create RLS policies for payment methods (anyone can read, only admins can modify)
CREATE POLICY "Anyone can read payment methods" ON "payment_methods" FOR SELECT USING (true);
CREATE POLICY "Admins can modify payment methods" ON "payment_methods"
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create RLS policies for coupons (anyone can read, only admins can modify)
CREATE POLICY "Anyone can read coupons" ON "coupons" FOR SELECT USING (true);
CREATE POLICY "Admins can modify coupons" ON "coupons"
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create triggers to update updated_at on row update
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "orders" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON "order_items" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_shipping_methods_updated_at BEFORE UPDATE ON "shipping_methods" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON "payment_methods" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON "coupons" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_coupons_code ON coupons(code); 