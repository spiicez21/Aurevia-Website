import { query } from '../db.js';

/**
 * Initialize PostgreSQL schema — creates all tables if they don't exist.
 */
export async function initSchema() {
    const schemaSQL = `
    -- Enable UUID generation
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(30) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      avatar TEXT DEFAULT NULL,
      is_active BOOLEAN DEFAULT true,
      last_seen TIMESTAMPTZ DEFAULT NOW(),
      preferences JSONB DEFAULT '{"theme": "dark", "language": "en", "notifications": true}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Chats table
    CREATE TABLE IF NOT EXISTS chats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL,
      is_guest BOOLEAN DEFAULT false,
      guest_id TEXT DEFAULT NULL,
      title VARCHAR(100) NOT NULL,
      description VARCHAR(500) DEFAULT '',
      is_active BOOLEAN DEFAULT true,
      is_pinned BOOLEAN DEFAULT false,
      tags TEXT[] DEFAULT '{}',
      message_count INTEGER DEFAULT 0,
      last_message_at TIMESTAMPTZ DEFAULT NOW(),
      settings JSONB DEFAULT '{"model": "gemma2:2b", "temperature": 0.7, "maxTokens": 1024, "systemPrompt": "You are a helpful AI assistant."}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Messages table
    CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      is_guest BOOLEAN DEFAULT false,
      content TEXT DEFAULT '',
      role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
      type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'code')),
      metadata JSONB DEFAULT '{}'::jsonb,
      status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
      is_edited BOOLEAN DEFAULT false,
      edit_history JSONB DEFAULT '[]'::jsonb,
      reactions JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
    CREATE INDEX IF NOT EXISTS idx_chats_guest_id ON chats(guest_id);
    CREATE INDEX IF NOT EXISTS idx_chats_user_created ON chats(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_chats_user_pinned ON chats(user_id, is_pinned DESC, last_message_at DESC);
    CREATE INDEX IF NOT EXISTS idx_chats_user_active ON chats(user_id, is_active);
    CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON messages(chat_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_messages_chat_role ON messages(chat_id, role);
    CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
  `;

    await query(schemaSQL);
    console.log('✅ PostgreSQL schema initialized successfully');
}

export default initSchema;
