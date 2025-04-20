/*
  # Initial Schema Setup

  1. New Tables
    - `formations`
      - Stores all formation data from CSV
      - Contains establishment, department, city, program, path, places, and notes
    - `user_tokens`
      - Tracks user token balances
      - Links to Supabase auth users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create formations table
CREATE TABLE IF NOT EXISTS formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  etablissement text NOT NULL,
  departement text NOT NULL,
  ville text NOT NULL,
  filiere text NOT NULL,
  voie text NOT NULL,
  places integer NOT NULL,
  notes text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_tokens table
CREATE TABLE IF NOT EXISTS user_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  tokens integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

-- Formations policies
CREATE POLICY "Anyone can view formation basic info"
  ON formations
  FOR SELECT
  USING (true);

-- User tokens policies
CREATE POLICY "Users can view own tokens"
  ON user_tokens
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can update user tokens"
  ON user_tokens
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);