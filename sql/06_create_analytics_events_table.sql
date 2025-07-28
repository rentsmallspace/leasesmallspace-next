-- Create analytics_events table for tracking user behavior
CREATE TABLE IF NOT EXISTS lss_analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES lss_users(id) ON DELETE SET NULL,
    session_id TEXT,
    event_name TEXT NOT NULL,
    event_properties JSONB,
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lss_analytics_events_user_id ON lss_analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_lss_analytics_events_session_id ON lss_analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_lss_analytics_events_event_name ON lss_analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_lss_analytics_events_created_at ON lss_analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_lss_analytics_events_page_url ON lss_analytics_events(page_url);

-- Create GIN index for JSONB event_properties field
CREATE INDEX IF NOT EXISTS idx_lss_analytics_events_properties_gin ON lss_analytics_events USING GIN (event_properties);

-- Create composite index for user session analysis
CREATE INDEX IF NOT EXISTS idx_lss_analytics_events_user_session ON lss_analytics_events(user_id, session_id, created_at); 