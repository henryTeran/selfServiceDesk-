/*
  # Add UPDATE policy for orders table

  1. Security Changes
    - Add policy to allow anyone (public/anon) to update orders
    - This enables admin functionality to mark orders as completed/cancelled
    - In production, this should be restricted to authenticated admin users only

  2. Policy Details
    - Policy name: "Anyone can update orders"
    - Operation: UPDATE
    - Role: anon (public access)
    - Check: true (no restrictions for now)

  3. Notes
    - This is intentionally permissive for demo/kiosk mode
    - For production, replace with proper authentication:
      CREATE POLICY "Admins can update orders"
        ON orders FOR UPDATE
        TO authenticated
        USING (auth.jwt()->>'role' = 'admin')
        WITH CHECK (auth.jwt()->>'role' = 'admin');
*/

CREATE POLICY "Anyone can update orders"
  ON orders
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
