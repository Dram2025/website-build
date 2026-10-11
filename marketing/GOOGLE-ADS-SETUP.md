# Google Ads — First Campaign Setup for D.RAM Demolition

Goal: **qualified estimate requests and calls** from Orange County homeowners and contractors, without wasting the budget (or the $500 promo credit) on junk clicks.

> **About the $500 credit:** Google's new-advertiser offers usually work as *"spend $X within 60 days and receive $X in credit"*. The credit arrives **after** you spend, and the offer must be claimed through your account's billing/promotions page. Read the exact terms on your offer before you rely on it, and never raise your budget just to "unlock" credit.

---

## Step 1: Use Expert Mode + a **Search** campaign

The screen asking *"Tell us about your business"* is Google's simplified (Smart) setup. It's quick, but you give up control over keywords, locations and where ads show, which is how small budgets get spent on irrelevant clicks.

- Look for **"Switch to Expert Mode"** (usually a link at the bottom of the first screens). If you can't find it, finish the account setup, then go to **Campaigns → + New campaign**.
- Choose objective **Leads** (or *Create a campaign without a goal's guidance*), then campaign type **Search**.
- Avoid *Performance Max* and *Display* for now. They work best after you have lots of conversion data.

If you stay in the simplified wizard anyway: business name **D.RAM Demolition**, website **https://dramdemo.com/estimate/**, and follow the location, keyword and ad-text guidance below wherever it lets you.

## Step 2: Set up conversion tracking FIRST

Without this, Google can't tell a real lead from a random click.

1. **Goals → Conversions → + New conversion action → Website.** Enter `dramdemo.com`.
2. Create **"Estimate request"**: category *Submit lead form*, rule **Page URL contains `/thank-you/`**, value: don't use a value, count **One**.
3. Create **"Calls from ads"** (Phone calls → Calls from ads using call assets), counting calls **60 seconds or longer**.
4. Create **"Website phone clicks"** (Phone calls → Clicks on your number on your website).
5. **Send Claude the Google Ads ID (`AW-…`) and the conversion labels.** The website is already built to report form leads and phone clicks; it just needs those IDs.

## Step 3: Campaign settings

| Setting | Choose |
|---|---|
| **Networks** | ✅ Google Search only. ❌ **Uncheck Search Partners** ❌ **Uncheck Display Network** |
| **Locations** | **Orange County, CA** (add Long Beach/Whittier only if you want them) |
| **Location options** | **Presence: People in or regularly in your included locations** (NOT "presence or interest") |
| **Languages** | English (add Spanish if you take calls in Spanish) |
| **Budget** | **$25/day** to start (~$750/month) |
| **Bidding** | Start with **Maximize clicks** with a **max CPC limit of $8** for the first 2–3 weeks; switch to **Maximize conversions** once you have ~15+ conversions recorded |
| **Ad schedule** | Mon–Sat, **6:30 AM – 7:00 PM** (when someone can answer the phone) |
| **Start/end** | No end date; you'll pause manually if needed |

## Step 4: Ad groups, keywords and landing pages

Use **phrase match** ("in quotes") and **exact match** [in brackets]. Avoid broad match on a small budget.

**Ad group 1: Concrete & Driveway Removal** → landing page `https://dramdemo.com/services/concrete-demolition/`
```
"concrete removal"           [concrete removal near me]
"concrete demolition"        [concrete removal orange county]
"driveway removal"           [driveway removal near me]
"patio removal"              [concrete patio removal]
"concrete slab removal"      "remove concrete driveway"
"sidewalk removal"           "asphalt removal"
```

**Ad group 2: Demolition (house, garage, interior)** → `https://dramdemo.com/services/residential-demolition/`
```
"demolition contractor"      [demolition company near me]
"demolition company"         [demolition contractor orange county]
"house demolition"           "garage demolition"
"interior demolition"        "kitchen demolition"
"block wall removal"         "chimney removal"
"shed demolition"            "adu site prep"
```

**Ad group 3: Hauling & Junk Removal** → `https://dramdemo.com/services/debris-hauling/`
```
"construction debris removal"   "debris hauling"
"concrete hauling"              "dirt removal"
"junk removal"                  [junk removal near me]
```

*(Optional later) Ad group 4: Commercial* → `https://dramdemo.com/commercial/` with "commercial demolition contractor", "demolition subcontractor", "tenant improvement demolition".

## Step 5: Negative keywords (add at campaign level; this saves the most money)

```
jobs, job, hiring, career, careers, salary, pay, training, course, school, license test,
how to, diy, youtube, video, tutorial, definition, meaning,
rental, rent, rentals, jackhammer rental, equipment rental, tool, tools, home depot, lowes,
dumpster rental, bin rental, roll off, buy, sale, for sale, used,
derby, demolition derby, demolition man, movie, song, lyrics, game, minecraft,
free dirt, free concrete, scrap metal prices, recycling center hours,
volunteer, internship
```

Check the **Search terms report twice a week** for the first month and add anything irrelevant as a negative.

## Step 6: Responsive search ads (one per ad group, all 15 headlines)

**Headlines (max 30 characters each)**
```
Demolition in Orange County
Concrete & Driveway Removal
Free Written Estimates
Call D.RAM Demolition Today
Haul-Off Included
Send Photos, Get a Fast Quote
Patio & Slab Removal
Garage & ADU Site Prep
Remodel Demo & Strip-Outs
Debris & Junk Hauling
Serving All of Orange County
Residential & Commercial
Locally Owned in Fullerton
Clean Site, Debris Recycled
Book Your Free Estimate
```
Pin **"Demolition in Orange County"** (or the ad group's service, e.g. "Concrete & Driveway Removal") to **position 1**. Leave the rest unpinned.

**Descriptions (max 90 characters each)**
```
Driveways, patios, slabs, walls and interiors removed and hauled away. Free estimates.
Text us photos of your project and get a clear, written price. Haul-off always included.
Homeowners & contractors across Orange County trust D.RAM for clean, on-time demo work.
We protect what stays, recycle the debris and leave your site clean and ready to build.
```
**Display path:** `dramdemo.com/Demolition/Free-Estimate` (or `/Concrete-Removal/Estimate`).

Google does not allow phone numbers in headlines or descriptions. Your number goes in the **call asset** below.

## Step 7: Assets (they make the ad bigger and get more clicks)

- **Call asset:** 714-872-2034, scheduled for your business hours, with call reporting **on**.
- **Sitelinks (4+):**
  - *Free Estimate* → /estimate/ ("Upload photos for a fast quote")
  - *Driveway Removal* → /services/driveway-removal/
  - *Interior Demolition* → /services/selective-demolition/
  - *Recent Projects* → /projects/
  - *Contractors & Commercial* → /commercial/
- **Callouts:** Free Written Estimates · Haul-Off Included · Debris Recycled · Serving All of OC · Photo Quotes · Residential & Commercial
- **Structured snippet (Services):** Demolition, Concrete Removal, Driveway Removal, Patio Removal, Interior Demo, Debris Hauling, Junk Removal
- **Location asset:** link your **Google Business Profile** once it's verified
- **Lead form asset:** optional; skip at first (website leads are better quality)

## Step 8: After launch (15 minutes, twice a week)

1. **Answer every call and lead fast** (within 5 minutes if you can). This matters more than any setting.
2. **Search terms report:** add negatives for anything irrelevant.
3. **Keywords:** pause keywords that spend $60+ with zero leads.
4. **Ads:** after ~2 weeks, replace the weakest headlines.
5. **Track jobs, not just leads:** keep a simple sheet (date, source, service, quote $, won/lost). That tells you your real cost per job.
6. After ~15–30 conversions: switch bidding to **Maximize conversions**, then later consider a **Target CPA**.

## What to expect (honestly)

No one can promise a number of leads. Search ads for demolition and concrete removal in Orange County typically cost a few dollars to over $10 per click, so expect the first 2–4 weeks to be a learning period. Judge the campaign on **booked jobs and profit** after a month, not on day-to-day clicks.

## Later: Google Local Services Ads

The "Google Screened" ads at the very top of search usually bring the best contractor leads (you pay per lead, not per click), but they require **license and insurance verification** for most contractor categories. Revisit once you're licensed and insured.
