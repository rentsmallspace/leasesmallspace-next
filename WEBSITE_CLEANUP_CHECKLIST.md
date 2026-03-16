# Website Cleanup Checklist

Track and resolve each item below. Check off when fixed and verified.

---

## HIGH PRIORITY

### 1. Hero Section — "Available" Details Card Is Way Too Big
- [x] **Issue:** On the featured hero property, the info overlay covered ~60% of the photo.
- [x] **Fix:** Compact white card at bottom, removed features line, added bottom padding for carousel dots.
- [x] **Tested:** _____

### 2. NNN Missing from All Pricing
- [x] **Issue:** Every price showed only the base rate; tenants need to see NNN vs gross.
- [x] **Fix:** All listing prices now show lease type — e.g. "$4,100/mo NNN" (hero, property list, showcase, property detail sidebar, similar properties, deal-score examples).
- [x] **Tested:** _____

---

## MEDIUM PRIORITY

### 3. Questionnaire — "Most Popular" Badge Should Be Blue
- [x] **Issue:** "Most Popular" badge on the Lease option should match site primary (blue).
- [x] **Fix:** Badge is blue (`bg-blue-600`). Lease card has light blue background (`bg-blue-50/70`) so it reads as the recommended option.
- [x] **Tested:** _____

### 4. "Speak to an Expert" Popup Is Too Aggressive
- [x] **Issue:** Inactivity popup fired too frequently (~20–30s).
- [x] **Fix:** Delay set to 60 seconds. Once dismissed (X, backdrop, or Escape), sessionStorage is set so it does not show again for the rest of the session.
- [x] **Tested:** _____

### 5. "Perfect Spaces for Startups, Contractors..." Section — Missing Image
- [x] **Issue:** On the Why Use Lease Small Space page, the section had a placeholder image.
- [x] **Fix:** Using `/images/1531-W-Bayaud-Ave_bay-door_01.jpg` (professional handshake in industrial space).
- [x] **Tested:** _____

### 6. Stock Photos of People Are Low Quality
- [x] **Issue:** Hero image on `/why-rent-small-space` looked staged and generic.
- [x] **Fix:** Replaced with `public/images/guys-small-industrial-space.jpg` (team in small industrial space).
- [x] **Tested:** _____

---

## ADDITIONAL — Photos Not Showing on Website

### 7. Updated Property Photos Not Appearing on Site
- [x] **Issue:** Photos updated in the admin were not in Supabase; paths didn’t match.
- [x] **Fix:** Admin upload now uses `leasesmallspace/properties/` folder; storage URL appends `.jpg` when needed; edit form persists image deletions (submit uses currentImages, server always sends image fields).
- [x] **Tested:** _____

---

## ADDITIONAL — Property Details & Admin

### 8. Clear Height Not Adjusting with Property Details
- [x] **Issue:** Clear height was hardcoded as 16 ft on the property details page; it did not reflect the value from the database.
- [x] **Fix:** Summary card and specs now use `propertyData.specifications.clearHeight` (from `property.clear_height`). Format as "X ft" when present; "Not specified" otherwise.
- [ ] **Tested:** _____

### 9. Monthly NNN Expenses as Separate Line Item
- [x] **Issue:** Listed price is base rent; user wanted to show monthly Triple Net (NNN) expenses as a separate line item on the property page.
- [x] **Fix:** Added `nnn_monthly` (numeric) to DB (migration `sql/13_add_nnn_monthly.sql`), property types, admin create/edit forms ("Monthly NNN ($)"), and property detail page. Sidebar and lease section show "Monthly NNN: $X" when set. No total calculated; display only.
- [ ] **Tested:** _____

### 10. Remove Admin Portal from rentsmallspace-next
- [x] **Issue:** Admin is now in leasesmallspace-next (leasesmallspace.com/admin); rentsmallspace.com is no longer deployed. Remove admin from rentsmallspace-next to avoid confusion.
- [x] **Fix:** Admin app routes, login, and related code removed from rentsmallspace-next.
- [ ] **Tested:** _____

---

## Notes
- Screenshots available from user if needed for any item.
- After each fix, verify in the right environment (local/staging/production) and check off **Tested**.

---

## What’s next (suggested order)
- **#5** Why Use Lease Small Space → add missing startups/contractors section image (you provide photo)
