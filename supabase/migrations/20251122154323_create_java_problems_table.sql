/*
  # Create Java Problems Table

  1. New Tables
    - `java_problems`
      - `id` (uuid, primary key)
      - `number` (integer, unique)
      - `title` (text)
      - `difficulty` (text) - basic, intermediate, advanced, expert
      - `input` (text)
      - `solution` (text)
      - `output` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `java_problems` table
    - Add policy for public read access (anyone can view problems)
*/

CREATE TABLE IF NOT EXISTS java_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer UNIQUE NOT NULL,
  title text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced', 'expert')),
  input text NOT NULL DEFAULT '',
  solution text NOT NULL,
  output text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE java_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read java problems"
  ON java_problems
  FOR SELECT
  TO public
  USING (true);