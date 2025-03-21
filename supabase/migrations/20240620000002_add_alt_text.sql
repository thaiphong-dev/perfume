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