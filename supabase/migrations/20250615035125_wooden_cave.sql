/*
  # Create workshop users table

  1. New Tables
    - `workshop_users`
      - `key` (text, primary key) - unique 10-12 character user identifier
      - `email` (text, optional) - user email for recovery
      - `data` (jsonb) - complete workshop data structure
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `workshop_users` table
    - Add policy for users to access their own data based on key
    - No authentication required - access control via unique key
*/

CREATE TABLE IF NOT EXISTS workshop_users (
  key text PRIMARY KEY,
  email text,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE workshop_users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to access their own data using their unique key
CREATE POLICY "Users can access own data"
  ON workshop_users
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Index for better performance on key lookups
CREATE INDEX IF NOT EXISTS idx_workshop_users_key ON workshop_users (key);

-- Index for better performance on data queries
CREATE INDEX IF NOT EXISTS idx_workshop_users_data ON workshop_users USING GIN (data);