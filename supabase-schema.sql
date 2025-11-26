-- Custom Brackets Table
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS custom_brackets (
  id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mode INTEGER NOT NULL CHECK (mode IN (8, 10, 12)),
  options TEXT[] NOT NULL,
  must_start TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  PRIMARY KEY (id, user_id)
);

-- Enable Row Level Security
ALTER TABLE custom_brackets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own brackets
CREATE POLICY "Users can view own brackets"
  ON custom_brackets
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own brackets
CREATE POLICY "Users can insert own brackets"
  ON custom_brackets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own brackets
CREATE POLICY "Users can update own brackets"
  ON custom_brackets
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own brackets
CREATE POLICY "Users can delete own brackets"
  ON custom_brackets
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS custom_brackets_user_id_idx ON custom_brackets(user_id);



