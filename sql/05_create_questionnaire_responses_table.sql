-- Create questionnaire_responses table for storing questionnaire data
CREATE TABLE IF NOT EXISTS lss_questionnaire_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES lss_users(id) ON DELETE SET NULL,
    inquiry_id UUID REFERENCES lss_inquiries(id) ON DELETE SET NULL,
    responses JSONB NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_user_id ON lss_questionnaire_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_inquiry_id ON lss_questionnaire_responses(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_completed_at ON lss_questionnaire_responses(completed_at);
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_created_at ON lss_questionnaire_responses(created_at);

-- Create GIN index for JSONB responses field
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_responses_gin ON lss_questionnaire_responses USING GIN (responses);

-- Create functional indexes for common JSONB queries (using BTREE for text fields)
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_space_type ON lss_questionnaire_responses ((responses->>'spaceType'));
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_location ON lss_questionnaire_responses ((responses->>'location'));
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_size ON lss_questionnaire_responses ((responses->>'size'));
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_budget ON lss_questionnaire_responses ((responses->>'budget'));
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_timeline ON lss_questionnaire_responses ((responses->>'timeline'));
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_lease_or_buy ON lss_questionnaire_responses ((responses->>'leaseOrBuy'));

-- Create composite index for matching queries using JSONB paths (using BTREE)
CREATE INDEX IF NOT EXISTS idx_lss_questionnaire_responses_matching ON lss_questionnaire_responses 
((responses->>'spaceType'), (responses->>'location'), (responses->>'size'), (responses->>'budget')); 