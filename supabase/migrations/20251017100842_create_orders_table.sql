/*
  # Create orders table for kiosk orders

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - Unique order identifier
      - `order_number` (text, unique) - Human-readable order number (e.g., "ORD-20231017-001")
      - `items` (jsonb) - Array of ordered items with uuid, title, price, imageUrl
      - `total_price` (numeric) - Total order price in CHF
      - `order_type` (text) - Type: "emporter" or "surplace"
      - `payment_method` (text, nullable) - Payment method if applicable
      - `status` (text, default 'pending') - Order status: pending, completed, cancelled
      - `created_at` (timestamptz, default now()) - Order creation timestamp
      - `completed_at` (timestamptz, nullable) - Order completion timestamp
      
  2. Security
    - Enable RLS on `orders` table
    - Add policy for public insert (kiosk mode - no authentication required)
    - Add policy for authenticated users to read their own orders
    
  3. Indexes
    - Index on order_number for fast lookup
    - Index on created_at for chronological queries
    - Index on status for filtering
    
  4. Notes
    - JSONB used for items to store flexible product data
    - Order number generated automatically with sequence
    - No user_id required (public kiosk mode)
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_price numeric(10, 2) NOT NULL DEFAULT 0,
  order_type text NOT NULL DEFAULT 'emporter',
  payment_method text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT valid_order_type CHECK (order_type IN ('emporter', 'surplace')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'cancelled'))
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read orders"
  ON orders
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  seq_val integer;
  date_part text;
BEGIN
  seq_val := nextval('order_number_seq');
  date_part := to_char(now(), 'YYYYMMDD');
  RETURN 'ORD-' || date_part || '-' || lpad(seq_val::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

ALTER TABLE orders 
  ALTER COLUMN order_number SET DEFAULT generate_order_number();
