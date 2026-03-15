# Website Cleanup Checklist

Track and resolve each item below. Check off when fixed and verified.

---

## HIGH PRIORITY

### 1. Hero Section — "Available" Details Card Is Way Too Big
- [ ] **Issue:** On the featured hero property, the info overlay (title, location, specs, price, "Available" badge) covers ~60% of the photo. The building is barely visible.
- [ ] **Fix options:** Make the overlay significantly smaller **or** drop it lower so it only covers the bottom 20–25% **or** make it semi-transparent.
- [ ] **Tested:** _____

### 2. NNN Missing from All Pricing
- [ ] **Issue:** Every price on the homepage listings shows only the base rate (e.g. "$4,100/mo"). Commercial tenants need to know immediately if it's NNN or gross.
- [ ] **Fix:** Display Triple Net on all prices — e.g. "$4,100/mo NNN" or "$4,100/month Triple Net".
- [ ] **Tested:** _____

---

## MEDIUM PRIORITY

### 3. Questionnaire — "Most Popular" Badge Should Be Blue
- [ ] **Issue:** On the questionnaire (Step 1, Lease vs. Buy), the "Most Popular" badge on the Lease option is green.
- [ ] **Fix:** Change badge to blue to match the site's primary brand color. Consider giving the whole Lease card a light blue background so it reads as the recommended option.
- [ ] **Tested:** _____

### 4. "Speak to an Expert" Popup Is Too Aggressive
- [ ] **Issue:** Inactivity popup fires roughly every 20 seconds — too frequent.
- [ ] **Fix:** Change to 60 seconds minimum. Once dismissed, don't show again for the rest of the session (or wait 5+ minutes before showing again).
- [ ] **Tested:** _____

### 5. "Perfect Spaces for Startups, Contractors..." Section — Missing Image
- [ ] **Issue:** On the Why Use Lease Small Space page, the section about startups and contractors has a blank/missing image.
- [ ] **Fix:** Add the correct photo (user will provide).
- [ ] **Tested:** _____

### 6. Stock Photos of People Are Low Quality
- [ ] **Issue:** Hero image on `/why-rent-small-space` looks staged and generic.
- [ ] **Fix:** Replace with better stock photos of people in actual small warehouse/industrial spaces — more candid, less corporate. Not urgent; improve when good options are found.
- [ ] **Tested:** _____

---

## ADDITIONAL — Photos Not Showing on Website

### 7. Updated Property Photos Not Appearing on Site
- [ ] **Issue:** Photos updated in the photo editor are visible there but do not show up on the website.
- [ ] **Investigate:** Confirm whether this is a cache/CDN issue, incorrect image URLs, build/deploy not picking up new assets, or data/DB not reflecting updates.
- [ ] **Fix:** _____
- [ ] **Tested:** _____

---

## Notes
- Screenshots available from user if needed for any item.
- After each fix, verify in the right environment (local/staging/production) and check off **Tested**.
