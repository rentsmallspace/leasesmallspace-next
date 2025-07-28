# Database Schema Setup for LeaseSmallSpace.com

This directory contains SQL files to set up the complete database schema for the LeaseSmallSpace.com application.

## Files Overview

### Core Tables
- **01_create_leads_table.sql** - Lead capture tracking (`lss_leads`) - links to users
- **02_create_users_table.sql** - Primary customer profiles (`lss_users`) - main customer table
- **03_create_properties_table.sql** - Property listings with full details (`lss_properties`)
- **04_create_inquiries_table.sql** - Property inquiries and contact forms (`lss_inquiries`)
- **05_create_questionnaire_responses_table.sql** - Questionnaire wizard responses (`lss_questionnaire_responses`)
- **06_create_analytics_events_table.sql** - User behavior and event tracking (`lss_analytics_events`)

### Data & Management
- **07_insert_sample_properties.sql** - Sample property data to get started
- **08_create_admin_tables.sql** - Documentation (using existing Supabase auth)
- **09_create_views_and_functions.sql** - Useful views and helper functions

## Execution Order

Run these files in the following order:

1. `01_create_leads_table.sql`
2. `02_create_users_table.sql`
3. `03_create_properties_table.sql`
4. `04_create_inquiries_table.sql`
5. `05_create_questionnaire_responses_table.sql`
6. `06_create_analytics_events_table.sql`
7. `07_insert_sample_properties.sql` (after all tables are created)

**Note:** Skip `08_create_admin_tables.sql` - it's just documentation explaining that we use the existing Supabase auth system.

**Optional (for later):** `09_create_views_and_functions.sql` - Useful views and helper functions (add these once the app is working and you know what you need)

## Key Features

### Tables Include:
- **UUID primary keys** for security
- **Proper foreign key relationships** between tables
- **Comprehensive indexing** for performance
- **Automatic timestamp management** (created_at, updated_at)
- **JSONB fields** for flexible data storage (features, images, responses)
- **LSS prefix** to avoid conflicts with existing app tables
- **Consolidated user management** - `lss_users` as primary customer table
- **Flexible lead tracking** - `lss_leads` links to users for activity tracking
- **Shared admin authentication** - Uses existing Supabase auth system

### Sample Data:
- 6 sample properties across Colorado
- Various property types (Warehouse, Retail, Flex Space, Industrial)
- Realistic pricing and features
- Proper deal scores and availability dates

### Views & Functions:
- **Dashboard statistics** function (`lss_get_dashboard_stats()`)
- **Recent activity** tracking (`lss_get_recent_activity()`)
- **Property inquiry** summaries (`lss_property_inquiries_view`)
- **Questionnaire response** analysis (`lss_questionnaire_responses_view`)
- **Customer activity** overview (`lss_customer_activity_view`)
- **User/Lead creation** helper (`lss_create_or_update_user_lead()`)
- **Questionnaire search** function (`lss_search_questionnaire_responses()`)

## Environment Variables Needed

After running these SQL files, you'll need to set up these environment variables in your Next.js app:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Admin Authentication

This application uses the **existing Supabase auth system** (`auth.users` table) instead of creating separate admin tables. This allows:

- **Shared admin portal** between both applications
- **Leverage existing admin users** from your other app
- **Use Supabase's built-in auth features** (password reset, MFA, etc.)
- **Avoid duplicate user management**

## Notes

- All tables use `IF NOT EXISTS` to prevent errors on re-runs
- Indexes are optimized for common query patterns
- Sample data includes realistic Colorado properties
- All timestamps use timezone-aware fields
- **All tables prefixed with `lss_`** to avoid conflicts with existing app tables
- **Admin authentication** uses existing Supabase auth system 