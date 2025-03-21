-- Check if role column exists, if not, add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'role') THEN
        ALTER TABLE "users" ADD COLUMN "role" TEXT DEFAULT 'customer';
    END IF;
END $$;

-- Add new fields to users table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'first_name') THEN
        ALTER TABLE "users" ADD COLUMN "first_name" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'last_name') THEN
        ALTER TABLE "users" ADD COLUMN "last_name" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'phone') THEN
        ALTER TABLE "users" ADD COLUMN "phone" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'billing_address') THEN
        ALTER TABLE "users" ADD COLUMN "billing_address" JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'shipping_address') THEN
        ALTER TABLE "users" ADD COLUMN "shipping_address" JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'last_login') THEN
        ALTER TABLE "users" ADD COLUMN "last_login" TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'is_active') THEN
        ALTER TABLE "users" ADD COLUMN "is_active" BOOLEAN DEFAULT TRUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'users' 
                  AND column_name = 'preferences') THEN
        ALTER TABLE "users" ADD COLUMN "preferences" JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Create wishlists table
CREATE TABLE IF NOT EXISTS "wishlists" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE("user_id", "product_id")
);

-- Enable Row Level Security on wishlists
ALTER TABLE "wishlists" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wishlists
CREATE POLICY "Users can manage their own wishlists" ON "wishlists"
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can see all wishlists" ON "wishlists"
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create addresses table (for multiple addresses per user)
CREATE TABLE IF NOT EXISTS "addresses" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "address_line1" TEXT NOT NULL,
  "address_line2" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "postal_code" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "phone" TEXT,
  "is_default_shipping" BOOLEAN DEFAULT FALSE,
  "is_default_billing" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on addresses
ALTER TABLE "addresses" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for addresses
CREATE POLICY "Users can manage their own addresses" ON "addresses"
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can see all addresses" ON "addresses"
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create function to ensure only one default address per type
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default_shipping = TRUE THEN
        UPDATE addresses SET is_default_shipping = FALSE 
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;

    IF NEW.is_default_billing = TRUE THEN
        UPDATE addresses SET is_default_billing = FALSE 
        WHERE user_id = NEW.user_id AND id != NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for addresses
CREATE TRIGGER ensure_single_default_address_trigger
BEFORE INSERT OR UPDATE ON addresses
FOR EACH ROW EXECUTE FUNCTION ensure_single_default_address();

-- Create trigger to update updated_at on row update
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON "addresses" FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id); 