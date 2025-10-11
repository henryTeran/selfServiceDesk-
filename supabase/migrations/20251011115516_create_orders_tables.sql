/*
  # Cr\u00e9ation du sch\u00e9ma pour les commandes de la borne restaurant

  1. Nouvelles Tables
    - `orders` : Commandes principales
      - `id` (uuid, cl\u00e9 primaire)
      - `order_number` (integer, num\u00e9ro de commande unique)
      - `order_type` (text, type : "emporter" ou "surplace")
      - `status` (text, statut : "pending", "preparing", "ready", "completed")
      - `total_price` (decimal, prix total)
      - `paid` (boolean, pay\u00e9 ou non)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `order_items` : Articles de chaque commande
      - `id` (uuid, cl\u00e9 primaire)
      - `order_id` (uuid, r\u00e9f\u00e9rence \u00e0 orders)
      - `item_uuid` (text, UUID du produit)
      - `title` (text, nom du produit)
      - `description` (text, description)
      - `price` (decimal, prix unitaire)
      - `quantity` (integer, quantit\u00e9)
      - `created_at` (timestamp)

  2. S\u00e9curit\u00e9
    - Activation RLS sur les deux tables
    - Politique permettant les insertions publiques (borne publique)
    - Politique permettant la lecture des commandes du jour
*/

-- Cr\u00e9ation de la table orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number integer UNIQUE NOT NULL DEFAULT (floor(random() * 9000 + 1000)::integer),
  order_type text NOT NULL DEFAULT 'surplace',
  status text NOT NULL DEFAULT 'pending',
  total_price decimal(10, 2) NOT NULL DEFAULT 0,
  paid boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_order_type CHECK (order_type IN ('emporter', 'surplace')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled'))
);

-- Cr\u00e9ation de la table order_items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_uuid text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  price decimal(10, 2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_price CHECK (price >= 0)
);

-- Index pour am\u00e9liorer les performances
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Fonction pour mettre \u00e0 jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Activer RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut ins\u00e9rer des commandes (borne publique)
CREATE POLICY "Permettre insertion publique des commandes"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique : Tout le monde peut lire les commandes du jour
CREATE POLICY "Permettre lecture des commandes du jour"
  ON orders
  FOR SELECT
  TO anon, authenticated
  USING (created_at >= CURRENT_DATE);

-- Politique : Tout le monde peut ins\u00e9rer des articles
CREATE POLICY "Permettre insertion publique des articles"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique : Tout le monde peut lire les articles des commandes du jour
CREATE POLICY "Permettre lecture des articles"
  ON order_items
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.created_at >= CURRENT_DATE
    )
  );