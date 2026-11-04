# Karnataka Gym Fitness Centre — Member Retention & Turnstile System
**Location:** Devi Nagar, Hubli - 580031  
**Operating Hours:** 6:00 AM – 9:00 PM  
**Reputation:** ★ 4.9-Star Rating (640+ Hubli Reviews) | Safe & Spacious Environment for Women  
**Official Developer Tag:** Website Developed by Ayesha Tech Studio | Contact: +91 96633 96058

---

## 🏋️ Overview

A mobile-first Gym Retention & Turnstile Management Prototype built specifically for **Karnataka Gym Fitness Centre** (located in Devi Nagar, Hubli - 580031). 

### Primary Business Goals:
1. **Detect Silent Churn Early:** Identify absent members (10–20 days) before they drop out.
2. **Make Attendance Visible:** Turnstile QR check-in with a rotating 15-second session token.
3. **Fair Streak Philosophy:** Scheduled rest days and approved medical pauses never break streaks unfairly.
4. **Timely Renewals:** Automated reminders at 14, 7, 3, and 0-day windows with transparent pricing.
5. **Transparent Add-Ons:** Zero pre-selection marketplace for Personal Training (Coach Kavita & Coach Anand), diet plans, and authentic supplements.
6. **Strict Payment Idempotency:** Membership is never extended until payment provider confirmation is cryptographically verified.

---

## 👥 User Roles

- **Member App:** Mobile lookup, attendance log, fair streak tracker, turnstile QR scanner, renewal center, add-on store, and marketing opt-out controls.
- **Owner Cockpit:** 8 core KPI cards, configurable no-show threshold (slider), red-list CRM (Call, WhatsApp, Mark Outcome), financial collection tracking, PT session punching, and daily EOD summary generator.
- **Front-Desk Reception (`Sunita Byahatti`):** Turnstile entrance rotating QR display, assisted check-in with mandatory reason selection and audit logging.
- **Autonomous Retentions Engine:** 6 automated background jobs with idempotency rules.
- **11-Point Verification Test Suite:** Live assertion runner for all edge-case scenarios.
- **Database Explorer:** Live browser for all 14 relational data tables with JSON export.

---

## 🗄️ Relational Data Models (14 Tables)

1. `Members`
2. `Plans`
3. `Memberships`
4. `Attendance`
5. `Streaks`
6. `NoShowCases`
7. `FollowUps`
8. `Payments`
9. `RenewalOrders`
10. `AddOns`
11. `AddOnOrders`
12. `Notifications`
13. `Settings`
14. `AuditLogs`

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🌐 Deployment to Vercel

This repository is pre-configured with [`vercel.json`](./vercel.json) for smooth single-page application routing.

1. Connect your repository to **Vercel**.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Connect your cloud PostgreSQL database (e.g. **Supabase** or **Neon / Vercel Postgres** in the Mumbai region).

---

## 📞 Credits & Development

**Website Developed by Ayesha Tech Studio**  
Contact: [+91 96633 96058](tel:+919663396058)  
Devi Nagar, Hubli - 580031
