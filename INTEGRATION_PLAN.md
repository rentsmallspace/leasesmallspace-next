# Frontend-Backend Integration Plan

## Overview
This document outlines the steps to integrate the LeaseSmallSpace frontend with the Supabase backend.

## Current State Analysis

### What We Have:
- ✅ **Database Schema** - All `lss_*` tables created
- ✅ **Sample Data** - 6 Colorado properties loaded
- ✅ **API Routes** - Basic structure exists but needs updating
- ✅ **Frontend Components** - Using mock data currently

### What Needs Work:
- ❌ **Property Display** - Currently using `mock-data.ts`
- ❌ **Form Submissions** - API routes need updating for new schema
- ❌ **Database Types** - Outdated `Database` type in `supabase.ts`
- ❌ **Email Integration** - Resend setup needed

## Integration Steps

### Phase 1: Database Connection & Types (Priority: HIGH)

#### 1.1 Simplify `lib/supabase.ts`
**Current Issues:**
- Complex `Database` type export (outdated)
- Unnecessary `supabaseAdmin` export (we're using client-side)
- Overly complex error handling

**Solution:**
```typescript
// Simplified version - just what we need
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 1.2 Update Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

### Phase 2: Property Display (Priority: HIGH)

#### 2.1 Create Property Fetching Hook
**File:** `hooks/use-properties.ts`
```typescript
export const useProperties = () => {
  // Fetch from lss_properties table
  // Replace mock data in components
}
```

#### 2.2 Update Components Using Mock Data
**Files to Update:**
- `components/home/hero.tsx` - Property carousel
- `components/home/property-showcase.tsx` - Featured properties
- `components/property/property-details.tsx` - Individual property pages

**Current Data Source:** `lib/mock-data.ts`
**New Data Source:** `lss_properties` table

### Phase 3: Form Submissions (Priority: HIGH)

#### 3.1 Lead Capture Forms
**Current:** `app/api/lead-capture/route.ts`
**Needs:** Update to use new `lss_users` + `lss_leads` structure

**Flow:**
1. User submits form → Create/update `lss_users` record
2. Create `lss_leads` record linked to user
3. Send email notifications

#### 3.2 Questionnaire Submission
**Current:** `app/api/questionnaire-submit/route.ts`
**Needs:** Update for new schema (JSONB responses only)

**Flow:**
1. User completes questionnaire → Create/update `lss_users`
2. Create `lss_inquiries` record
3. Create `lss_questionnaire_responses` (JSONB only)
4. Send confirmation emails

#### 3.3 Property Inquiries
**Current:** Property inquiry forms in components
**Needs:** API route for property-specific inquiries

**Flow:**
1. User inquires about property → Create/update `lss_users`
2. Create `lss_inquiries` with `property_id`
3. Send notification emails

### Phase 4: Email Integration (Priority: MEDIUM)

#### 4.1 Resend Setup
**File:** `lib/email.ts`
**Features:**
- Welcome emails for new leads
- Property inquiry notifications
- Questionnaire completion confirmations
- Admin notifications

#### 4.2 Email Templates
- Lead capture confirmation
- Property inquiry details
- Questionnaire summary
- Admin dashboard notifications

### Phase 5: Analytics & Tracking (Priority: LOW)

#### 5.1 Event Tracking
**Current:** `app/api/track-event/route.ts`
**Needs:** Update for `lss_analytics_events` table

#### 5.2 User Journey Tracking
- Page views
- Form submissions
- Property views
- Questionnaire progress

## Client vs Server Side Decisions

### Client-Side (Preferred):
- ✅ **Property fetching** - No sensitive data, better UX
- ✅ **Lead capture forms** - Simple form submission
- ✅ **Property inquiries** - Basic contact forms
- ✅ **Analytics events** - User behavior tracking

### Server-Side (When Needed):
- ❌ **Admin operations** - Not needed (using existing admin portal)
- ❌ **Email sending** - Can be client-side with proper API keys
- ❌ **Complex data processing** - Not needed for this app

### Why Client-Side is Better Here:
- **Simpler architecture** - No server-side complexity
- **Better performance** - Direct database access
- **Easier deployment** - No server-side API routes to maintain
- **Real-time updates** - Direct Supabase subscriptions possible

## Implementation Order

### Day 1: Core Functionality
1. **Simplify `supabase.ts`** - Remove complexity
2. **Create property fetching hook** - Replace mock data
3. **Update property display components** - Test with real data
4. **Test database connection** - Verify everything works

### Day 2: Form Submissions
1. **Update lead capture API** - New user/lead structure
2. **Update questionnaire API** - JSONB responses
3. **Create property inquiry API** - Property-specific inquiries
4. **Test all form submissions** - Verify database records

### Day 3: Email Integration
1. **Set up Resend** - API key and configuration
2. **Create email templates** - Welcome, notifications, confirmations
3. **Integrate with forms** - Send emails on submissions
4. **Test email flow** - Verify all emails work

### Day 4: Polish & Testing
1. **Add error handling** - Graceful failures
2. **Add loading states** - Better UX
3. **Test edge cases** - Duplicate emails, invalid data
4. **Performance optimization** - Caching, pagination

## Files to Create/Update

### New Files:
- `hooks/use-properties.ts` - Property fetching hook
- `hooks/use-lead-submission.ts` - Lead form submission
- `hooks/use-questionnaire.ts` - Questionnaire submission
- `lib/email-templates.ts` - Email template functions

### Files to Update:
- `lib/supabase.ts` - Simplify and remove Database type
- `lib/email.ts` - Add Resend integration
- `app/api/lead-capture/route.ts` - New user/lead structure
- `app/api/questionnaire-submit/route.ts` - JSONB responses
- `app/api/track-event/route.ts` - Analytics events
- All property display components - Use real data

### Files to Remove:
- `lib/mock-data.ts` - No longer needed
- Complex Database type from `supabase.ts`

## Success Criteria

### Functional:
- ✅ Properties display from database
- ✅ Lead forms create proper user/lead records
- ✅ Questionnaire creates all required records
- ✅ Property inquiries work correctly
- ✅ Email notifications sent successfully

### Performance:
- ✅ Page load times < 2 seconds
- ✅ Form submissions < 1 second
- ✅ No database connection errors
- ✅ Proper error handling

### User Experience:
- ✅ Loading states for all async operations
- ✅ Success/error messages for form submissions
- ✅ Responsive design maintained
- ✅ No broken links or missing data

## Next Steps

1. **Start with Phase 1** - Simplify supabase.ts and test connection
2. **Move to Phase 2** - Replace mock data with real properties
3. **Continue through phases** - One at a time, testing each step
4. **Document any issues** - Update this plan as we discover problems

This plan focuses on **functionality first** - get the core features working, then add polish and optimization. 