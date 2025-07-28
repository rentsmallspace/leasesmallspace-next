-- Create users table for customer profiles
-- This is the primary table for all customer/tenant information
CREATE TABLE IF NOT EXISTS lss_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'inactive', 'converted', 'lost'
    lead_source TEXT, -- First source where we captured this user
    first_contact_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_lss_users_email ON lss_users(email);

-- Create index on created_at for recent users queries
CREATE INDEX IF NOT EXISTS idx_lss_users_created_at ON lss_users(created_at);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_lss_users_status ON lss_users(status);

-- Create index on lead_source for analytics
CREATE INDEX IF NOT EXISTS idx_lss_users_lead_source ON lss_users(lead_source);

-- Add updated_at trigger
CREATE TRIGGER update_lss_users_updated_at 
    BEFORE UPDATE ON lss_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();