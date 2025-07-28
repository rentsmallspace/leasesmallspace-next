-- Create leads table for capturing basic lead information
-- This is now a simplified table for quick lead capture from popups, forms, etc.
-- For full customer profiles, use lss_users table
CREATE TABLE IF NOT EXISTS lss_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES lss_users(id) ON DELETE CASCADE, -- Link to main user record
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    source TEXT, -- e.g., 'inactivity_popup', 'contact_form', 'property_inquiry'
    page_captured TEXT,
    status TEXT DEFAULT 'new',
    notes TEXT,
    form_data JSONB, -- Flexible form data storage for additional fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_lss_leads_email ON lss_leads(email);

-- Create index on user_id for linking to main user record
CREATE INDEX IF NOT EXISTS idx_lss_leads_user_id ON lss_leads(user_id);

-- Create index on created_at for recent leads queries
CREATE INDEX IF NOT EXISTS idx_lss_leads_created_at ON lss_leads(created_at);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_lss_leads_status ON lss_leads(status);

-- Create index on source for analytics
CREATE INDEX IF NOT EXISTS idx_lss_leads_source ON lss_leads(source);

-- Create GIN index for JSONB form_data field
CREATE INDEX IF NOT EXISTS idx_lss_leads_form_data_gin ON lss_leads USING GIN (form_data);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lss_leads_updated_at 
    BEFORE UPDATE ON lss_leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();