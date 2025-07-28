-- Create inquiries table for property inquiries
CREATE TABLE IF NOT EXISTS lss_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES lss_users(id) ON DELETE SET NULL,
    property_id UUID REFERENCES lss_properties(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    message TEXT,
    inquiry_type TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lss_inquiries_user_id ON lss_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_lss_inquiries_property_id ON lss_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_lss_inquiries_email ON lss_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_lss_inquiries_status ON lss_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_lss_inquiries_inquiry_type ON lss_inquiries(inquiry_type);
CREATE INDEX IF NOT EXISTS idx_lss_inquiries_created_at ON lss_inquiries(created_at);

-- Add updated_at trigger
CREATE TRIGGER update_lss_inquiries_updated_at 
    BEFORE UPDATE ON lss_inquiries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 