Financial Health Check — Project Status



Last updated: 2025-09-03

Repo: Echo-Financial/financial-health-check-calculator



0\) TL;DR



✅ End-to-end works: form → submit → analysis → GPT summary → report.



✅ Leads saved with consent, UTM, IP, UA; Microsoft Graph emails sent from no-reply@… (CTA to Microsoft Bookings).



✅ Server-side validation on /api/submit (Joi), rate limiting \& CORS allowlist.



✅ Sentry (frontend) wired \& verified.



⚠️ To do next: Backend logging/Sentry, JWT auth for admin, analytics events, PDF export, multi-tenant prep.



1\) Architecture \& Stack



Frontend: React (CRA/CRACO), Formik/Yup, Recharts, Sentry

API: Node/Express, Joi, axios, Microsoft Graph Mail (client credentials)

Data: MongoDB Atlas

Infra:



Frontend: Netlify (static) → https://financialhealthcheck.ai



Backend: Render (Node) → https://financial-health-check-calculator.onrender.com



frontend/

&nbsp; src/

&nbsp;   components/Forms/LeadCaptureForm.jsx

&nbsp;   components/ErrorButton.jsx                # Sentry test button (dev)

&nbsp;   pages/Report.js                           # Results + CTA

&nbsp;   pages/AdminDashboard.js                   # Protected (token-gated)

&nbsp;   utils/utm.js                              # UTM + referrer capture

&nbsp;   index.js                                  # Sentry init + ErrorBoundary



backend/

&nbsp; src/

&nbsp;   app.js                                    # CORS, rate limits, routes

&nbsp;   controllers/submitController.js           # lead upsert + consent trail

&nbsp;   controllers/emailController.js            # MS Graph send

&nbsp;   routes/submit.js                          # POST /api/submit (Joi)

&nbsp;   routes/analysis.js                        # POST /api/financial-analysis

&nbsp;   routes/email.js                           # POST /api/send-marketing-email

&nbsp;   validations/submitSchema.js               # Joi schema

&nbsp;   middleware/validate.js                    # schema wrapper



2\) Environments \& Secrets



Never commit real secrets. Use .env locally; set env vars in Render/Netlify.



Backend (Render) — required



MONGO\_URI



OPENAI\_API\_KEY



CORS\_ORIGINS (comma separated)

e.g. https://financialhealthcheck.ai,https://www.financialhealthcheck.ai,http://localhost:3000



Email (Graph)



EMAIL\_PROVIDER=graph



MS\_TENANT\_ID / MS\_CLIENT\_ID / MS\_CLIENT\_SECRET



EMAIL\_FROM (e.g., no-reply@echo-financial-advisors.co.nz)



EMAIL\_FROM\_NAME (e.g., Echo Financial Advisors)



BOOKING\_URL (MS Bookings link used in email CTA)



Frontend (Netlify) — recommended



REACT\_APP\_API\_URL=https://financial-health-check-calculator.onrender.com



REACT\_APP\_SENTRY\_DSN= (optional; fallback DSN exists for now)



REACT\_APP\_PRIVACY\_URL=https://echo-financial-advisors.co.nz/privacy



.env.example exists in both apps. .env files are not tracked.



3\) Data Model (Mongo)

leads (primary)

{

&nbsp; "email": "user@example.com",

&nbsp; "firstName": "Kevin",

&nbsp; "lastName": "T Morgan",

&nbsp; "fullName": "Kevin T Morgan",

&nbsp; "phone": "021...",

&nbsp; "consentGiven": true,

&nbsp; "consentAt": "2025-09-01T22:48:00.576Z",

&nbsp; "consentText": "User consented to be contacted for financial advice and to receive their report.",

&nbsp; "ip": "203.0.113.10",

&nbsp; "userAgent": "Mozilla/5.0 ...",

&nbsp; "utmSource": "google",

&nbsp; "utmMedium": "cpc",

&nbsp; "utmCampaign": "spring-promo",

&nbsp; "utmTerm": "kiwisaver",

&nbsp; "utmContent": "ad1",

&nbsp; "referrer": "https://www.bing.com/",

&nbsp; "landingPage": "/?utm\_source=google\&utm\_campaign=spring-promo",

&nbsp; "scores": { /\* metrics for UI \*/ },

&nbsp; "calculatedMetrics": { /\* duplicate for reporting/email \*/ },

&nbsp; "payload": { "personalDetails": { ... }, "expensesAssets": { ... }, "retirementPlanning": { ... }, "contactInfo": { ... } },

&nbsp; "createdAt": "...",

&nbsp; "updatedAt": "..."

}



reviews (advisor queue)



Minimal fields: clientEmail, clientName, adviceType, status, clientFinancialData, recommendations, emailSent.



4\) API Contract (stable)

POST /api/submit



Body: { personalDetails, expensesAssets, retirementPlanning, contactInfo }

(Joi validated)



Querystring (optional): utm\_source, utm\_medium, utm\_campaign, utm\_term, utm\_content, gclid, referrer, landingPage, consent



Returns: { scores, ... } (used by UI)



Side effects: upsert lead; store consent/IP/UA/UTM.



POST /api/financial-analysis



Body: { originalData, calculatedMetrics, utm?, referrer?, landingPage?, consent? }



Returns: { analysis: "..." } (narrative for the report)



POST /api/send-marketing-email



Body: { to, name, analysisText, personalDetails, contactInfo, calculatedMetrics }



Effect: Sends via Microsoft Graph from EMAIL\_FROM, CTA to BOOKING\_URL.



5\) Security \& Compliance (current)



CORS allowlist from CORS\_ORIGINS.



Rate limiting: /api/submit (60 / 15 min), /api/gpt (30 / 15 min).



Consent audit trail: consentGiven, consentAt, consentText, IP, UA.



Server-side validation on /api/submit (Joi).



Admin dashboard guard: requires token; unauthenticated users see “Missing Authorization token” and no data.



Next: JWT-based admin auth; backend Sentry/logging; Helmet/CSP.



6\) Email via Microsoft Graph



Azure App Registration: Application permission Mail.Send (+ Admin consent).



Application Access Policy scoped to a group (only allowed mailboxes can send); verified with Test-ApplicationAccessPolicy.



Backend uses client credentials to obtain a token and send from EMAIL\_FROM.



Email CTA currently points to BOOKING\_URL (MS Bookings).



7\) Monitoring \& Telemetry



Sentry (frontend): initialized early in src/index.js and wrapped in Sentry.ErrorBoundary.

Test button: Home → Debug → “Break the world” (dev only).



Next: Sentry (backend) or pino structured logs + transport (redact PII).



8\) UX notes



Form: spinner + disabled controls on submit; aria-live for accessibility.



Report: scores (gauge + bars), narrative, CTA to Bookings.



Formatting/polish backlog: tooltips (“Good ≥ 70”), currency separators, PDF export.



9\) Backlog (prioritized)

P0 — Must do



Backend logging/Sentry (or pino + transport with PII scrubbing).



JWT auth for admin routes (short-lived tokens); hide UI without token.



Security headers (Helmet) + strict CSP (allow Sentry \& app domains).



Confirm all env secrets set in Render/Netlify; remove fallback DSN later.



P1 — Product \& conversion



“Email me this report” on Report (uses /api/send-marketing-email); store email\_report\_sent.



Analytics (GA4 or PostHog): lead\_form\_started/completed, analysis\_started/completed, cta\_book\_clicked, email\_report\_sent (include leadId + UTM).



Score context (tooltips, ranges), currency/units polish.



PDF export (server via Puppeteer or client via html2pdf) + secure share link.



P2 — Scale \& commercialization



Multi-tenant: add tenantId, theme/branding per tenant, per-tenant API keys/quotas, admin roles/audit log; export/delete lead.



Queue/cache GPT work (BullMQ; cache by lead hash).



Uptime checks and alerting (health endpoint, Sentry alerts).



10\) Verification checklist (fast)



&nbsp;Render /api/health returns 200.



&nbsp;CORS\_ORIGINS includes the exact front-end domains.



&nbsp;Form submit ok; lead created in Atlas with consent/UTM.



&nbsp;Email received; Sent Items present for no-reply@….



&nbsp;Sentry (frontend) shows an event in last 15 min.



&nbsp;Admin data only visible with token; otherwise locked.



11\) Recent milestones



Switched email provider to Microsoft Graph; added Application Access Policy.



Added Joi validation on /api/submit.



Added rate limits \& env-driven CORS.



Captured UTM/referrer/landingPage + consent/IP/UA.



Wired Sentry (frontend) with ErrorBoundary \& test button.



Set MS Bookings CTA (Trafft later).



12\) Contacts / Ownership



Product/Business: Echo Financial Advisors



Technical lead: (add GitHub handle / email)



Sentry project: (link in team workspace)



Azure App (mailer): “Echo Financial Mailer” (Application permission Mail.Send)

