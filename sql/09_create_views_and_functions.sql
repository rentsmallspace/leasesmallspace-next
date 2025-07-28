-- Create useful views for common queries

-- View for recent leads with user info
CREATE OR REPLACE VIEW lss_recent_leads_view AS
SELECT 
    l.id,
    l.name,
    l.email,
    l.phone,
    l.source,
    l.page_captured,
    l.status,
    l.created_at,
    u.full_name as user_full_name,
    u.company_name as user_company,
    u.status as user_status,
    u.lead_source as user_lead_source
FROM lss_leads l
LEFT JOIN lss_users u ON l.user_id = u.id
ORDER BY l.created_at DESC;

-- View for property inquiries with details
CREATE OR REPLACE VIEW lss_property_inquiries_view AS
SELECT 
    i.id,
    i.full_name,
    i.email,
    i.phone,
    i.company_name,
    i.message,
    i.inquiry_type,
    i.status,
    i.created_at,
    p.title as property_title,
    p.city as property_city,
    p.property_type,
    p.price_monthly,
    u.full_name as user_full_name
FROM lss_inquiries i
LEFT JOIN lss_properties p ON i.property_id = p.id
LEFT JOIN lss_users u ON i.user_id = u.id
ORDER BY i.created_at DESC;

-- View for questionnaire responses with user info
CREATE OR REPLACE VIEW lss_questionnaire_responses_view AS
SELECT 
    qr.id,
    qr.responses->>'spaceType' as space_type,
    qr.responses->>'location' as location_preference,
    (qr.responses->>'size')::INTEGER as size,
    qr.responses->>'budget' as budget,
    qr.responses->>'timeline' as timeline,
    qr.responses->>'leaseOrBuy' as lease_or_buy,
    qr.completed_at,
    qr.created_at,
    u.full_name,
    u.email,
    u.phone,
    u.company_name,
    i.status as inquiry_status,
    qr.responses -- Full responses object for flexibility
FROM lss_questionnaire_responses qr
LEFT JOIN lss_users u ON qr.user_id = u.id
LEFT JOIN lss_inquiries i ON qr.inquiry_id = i.id
ORDER BY qr.created_at DESC;

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION lss_get_dashboard_stats()
RETURNS TABLE (
    total_leads BIGINT,
    total_users BIGINT,
    recent_leads BIGINT,
    total_inquiries BIGINT,
    total_properties BIGINT,
    active_properties BIGINT,
    new_users_24h BIGINT,
    converted_users BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM lss_leads) as total_leads,
        (SELECT COUNT(*) FROM lss_users) as total_users,
        (SELECT COUNT(*) FROM lss_leads WHERE created_at >= NOW() - INTERVAL '24 hours') as recent_leads,
        (SELECT COUNT(*) FROM lss_inquiries) as total_inquiries,
        (SELECT COUNT(*) FROM lss_properties) as total_properties,
        (SELECT COUNT(*) FROM lss_properties WHERE is_active = true) as active_properties,
        (SELECT COUNT(*) FROM lss_users WHERE created_at >= NOW() - INTERVAL '24 hours') as new_users_24h,
        (SELECT COUNT(*) FROM lss_users WHERE status = 'converted') as converted_users;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent activity
CREATE OR REPLACE FUNCTION lss_get_recent_activity(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    activity_type TEXT,
    activity_id UUID,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'lead'::TEXT as activity_type,
        l.id::UUID as activity_id,
        l.name as title,
        'New lead captured from ' || COALESCE(l.source, 'unknown source') as description,
        l.created_at
    FROM lss_leads l
    WHERE l.created_at >= NOW() - INTERVAL '7 days'
    
    UNION ALL
    
    SELECT 
        'inquiry'::TEXT as activity_type,
        i.id::UUID as activity_id,
        i.full_name as title,
        'New inquiry for ' || COALESCE(p.title, 'property') as description,
        i.created_at
    FROM lss_inquiries i
    LEFT JOIN lss_properties p ON i.property_id = p.id
    WHERE i.created_at >= NOW() - INTERVAL '7 days'
    
    UNION ALL
    
    SELECT 
        'questionnaire'::TEXT as activity_type,
        qr.id::UUID as activity_id,
        u.full_name as title,
        'Completed questionnaire for ' || COALESCE(qr.responses->>'spaceType', 'space') || ' space' as description,
        qr.created_at
    FROM lss_questionnaire_responses qr
    LEFT JOIN lss_users u ON qr.user_id = u.id
    WHERE qr.created_at >= NOW() - INTERVAL '7 days'
    
    ORDER BY created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Helper function to create or update user and lead records
-- This consolidates the logic for handling new customer contacts
CREATE OR REPLACE FUNCTION lss_create_or_update_user_lead(
    p_email TEXT,
    p_full_name TEXT,
    p_phone TEXT DEFAULT NULL,
    p_company_name TEXT DEFAULT NULL,
    p_source TEXT DEFAULT NULL,
    p_page_captured TEXT DEFAULT NULL,
    p_form_data JSONB DEFAULT NULL
)
RETURNS TABLE (
    user_id UUID,
    lead_id UUID,
    is_new_user BOOLEAN,
    is_new_lead BOOLEAN
) AS $$
DECLARE
    v_user_id UUID;
    v_lead_id UUID;
    v_is_new_user BOOLEAN := FALSE;
    v_is_new_lead BOOLEAN := FALSE;
BEGIN
    -- First, try to find existing user by email
    SELECT id INTO v_user_id FROM lss_users WHERE email = p_email;
    
    -- If user doesn't exist, create new user
    IF v_user_id IS NULL THEN
        INSERT INTO lss_users (email, full_name, phone, company_name, lead_source, first_contact_date, last_contact_date)
        VALUES (p_email, p_full_name, p_phone, p_company_name, p_source, NOW(), NOW())
        RETURNING id INTO v_user_id;
        v_is_new_user := TRUE;
    ELSE
        -- Update existing user's last contact date and any new info
        UPDATE lss_users 
        SET 
            last_contact_date = NOW(),
            full_name = COALESCE(p_full_name, full_name),
            phone = COALESCE(p_phone, phone),
            company_name = COALESCE(p_company_name, company_name)
        WHERE id = v_user_id;
    END IF;
    
    -- Always create a new lead record for tracking
    INSERT INTO lss_leads (user_id, name, email, phone, source, page_captured, form_data)
    VALUES (v_user_id, p_full_name, p_email, p_phone, p_source, p_page_captured, p_form_data)
    RETURNING id INTO v_lead_id;
    v_is_new_lead := TRUE;
    
    RETURN QUERY SELECT v_user_id, v_lead_id, v_is_new_user, v_is_new_lead;
END;
$$ LANGUAGE plpgsql;

-- Helper function to search questionnaire responses by criteria
CREATE OR REPLACE FUNCTION lss_search_questionnaire_responses(
    p_space_type TEXT DEFAULT NULL,
    p_location TEXT DEFAULT NULL,
    p_min_size INTEGER DEFAULT NULL,
    p_max_size INTEGER DEFAULT NULL,
    p_budget_range TEXT DEFAULT NULL,
    p_timeline TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    space_type TEXT,
    location TEXT,
    size INTEGER,
    budget TEXT,
    timeline TEXT,
    lease_or_buy TEXT,
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        qr.id,
        qr.user_id,
        qr.responses->>'spaceType' as space_type,
        qr.responses->>'location' as location,
        (qr.responses->>'size')::INTEGER as size,
        qr.responses->>'budget' as budget,
        qr.responses->>'timeline' as timeline,
        qr.responses->>'leaseOrBuy' as lease_or_buy,
        u.full_name,
        u.email,
        qr.created_at
    FROM lss_questionnaire_responses qr
    LEFT JOIN lss_users u ON qr.user_id = u.id
    WHERE 
        (p_space_type IS NULL OR qr.responses->>'spaceType' = p_space_type)
        AND (p_location IS NULL OR qr.responses->>'location' ILIKE '%' || p_location || '%')
        AND (p_min_size IS NULL OR (qr.responses->>'size')::INTEGER >= p_min_size)
        AND (p_max_size IS NULL OR (qr.responses->>'size')::INTEGER <= p_max_size)
        AND (p_budget_range IS NULL OR qr.responses->>'budget' = p_budget_range)
        AND (p_timeline IS NULL OR qr.responses->>'timeline' = p_timeline)
    ORDER BY qr.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Comprehensive customer activity view
CREATE OR REPLACE VIEW lss_customer_activity_view AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    u.phone,
    u.company_name,
    u.status as user_status,
    u.lead_source,
    u.first_contact_date,
    u.last_contact_date,
    u.created_at as user_created_at,
    -- Lead activity
    COUNT(DISTINCT l.id) as total_leads,
    MAX(l.created_at) as last_lead_date,
    -- Inquiry activity
    COUNT(DISTINCT i.id) as total_inquiries,
    MAX(i.created_at) as last_inquiry_date,
    -- Questionnaire activity
    COUNT(DISTINCT qr.id) as total_questionnaires,
    MAX(qr.created_at) as last_questionnaire_date,
    -- Analytics activity
    COUNT(DISTINCT ae.id) as total_analytics_events,
    MAX(ae.created_at) as last_analytics_date
FROM lss_users u
LEFT JOIN lss_leads l ON u.id = l.user_id
LEFT JOIN lss_inquiries i ON u.id = i.user_id
LEFT JOIN lss_questionnaire_responses qr ON u.id = qr.user_id
LEFT JOIN lss_analytics_events ae ON u.id = ae.user_id
GROUP BY u.id, u.email, u.full_name, u.phone, u.company_name, u.status, u.lead_source, u.first_contact_date, u.last_contact_date, u.created_at
ORDER BY u.last_contact_date DESC; 