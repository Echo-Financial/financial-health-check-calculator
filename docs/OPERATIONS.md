Operations Runbook



Last updated: 2025-09-03

App: Financial Health Check (frontend React / backend Express)

Prod Frontend: https://financialhealthcheck.ai (Netlify)

Prod Backend: https://financial-health-check-calculator.onrender.com (Render)

DB: MongoDB Atlas

Email: Microsoft Graph (client credentials)

Monitoring: Sentry (frontend); backend logging via console (Sentry planned)



1\) Quick Start (Local Dev)



Windows + WSL: run the backend inside WSL; frontend can run in Windows or WSL.



1.1 Prereqs



Node 18+ (pref. LTS). Verify:



node -v

npm -v





MongoDB Atlas connection string



OpenAI API key (dev)



Azure App Registration (client credentials) for Microsoft Graph Mail



1.2 Clone \& install

\# WSL bash

cd /mnt/d/Git-Hub/Repositories/financial-health-check-calculator

cd backend \&\& npm install

cd ../frontend \&\& npm install



1.3 Env files (local only; never commit real secrets)



backend/.env (example in backend/.env.example)



frontend/.env (example in frontend/.env.example)



Minimal local values:



backend/.env



MONGO\_URI=mongodb://localhost:27017/financial\_health\_check

OPENAI\_API\_KEY=sk-...

PORT=5000

EMAIL\_PROVIDER=graph

MS\_TENANT\_ID=<GUID>

MS\_CLIENT\_ID=<GUID>

MS\_CLIENT\_SECRET=<secret>

EMAIL\_FROM=no-reply@echo-financial-advisors.co.nz

EMAIL\_FROM\_NAME=Echo Financial Advisors

BOOKING\_URL=https://outlook.office.com/book/EchoFinancialAdvisorsLtd1@echo-financial-advisors.co.nz/

CORS\_ORIGINS=http://localhost:3000





frontend/.env



REACT\_APP\_API\_URL=http://localhost:5000

REACT\_APP\_PRIVACY\_URL=https://echo-financial-advisors.co.nz/privacy

\# optional during dev; a fallback DSN exists in code:

REACT\_APP\_SENTRY\_DSN=<dsn>



1.4 Run

\# WSL bash

cd backend

npm run dev  # nodemon; expect "✅ MongoDB connected" and "listening on port 5000"



\# Windows PowerShell (or WSL)

cd frontend

npm start    # http://localhost:3000



2\) Health Checks \& Smoke Tests

2.1 API health

\# From Windows PowerShell:

curl.exe -i http://localhost:5000/api/health

\# Expect: HTTP/1.1 200 OK ... {"success":true,"message":"Health check OK"}



2.2 CORS sanity (from browser)



Open DevTools → Network (Preserve log).



Submit the form on http://localhost:3000/ and confirm:



/api/submit → 200



/api/financial-analysis → 200



/api/send-marketing-email → 200 (or 401 if no credentials)



/api/gpt → 200



2.3 Lead saved



Check MongoDB Atlas leads:



Verify fields: consentGiven, consentAt, consentText, ip, userAgent, utm\*, referrer, landingPage, scores, calculatedMetrics.



3\) Deployments

3.1 Frontend (Netlify)



Build command: npm run build (CRACO)



Publish dir: frontend/build



Env vars (Netlify UI → Site settings → Build \& deploy → Environment):



REACT\_APP\_API\_URL=https://financial-health-check-calculator.onrender.com



REACT\_APP\_PRIVACY\_URL=https://echo-financial-advisors.co.nz/privacy



(Optional) REACT\_APP\_SENTRY\_DSN



Trigger build: open a PR → Netlify creates a preview; merge → builds main.



If build fails with ESLint warnings, Netlify treats warnings as errors because CI=true. Fix warnings (e.g., add missing deps to useEffect) and re-push.



3.2 Backend (Render)



Service: Node Web Service



Start command: node src/index.js



Env vars (Render → Dashboard → Service → Environment):



MONGO\_URI, OPENAI\_API\_KEY



EMAIL\_PROVIDER=graph, MS\_TENANT\_ID, MS\_CLIENT\_ID, MS\_CLIENT\_SECRET



EMAIL\_FROM, EMAIL\_FROM\_NAME, BOOKING\_URL



CORS\_ORIGINS e.g. https://financialhealthcheck.ai,https://www.financialhealthcheck.ai,http://localhost:3000



Deploy: push to main or click “Manual Deploy”.



3.3 Post-deploy verification



GET https://financial-health-check-calculator.onrender.com/api/health → 200



In browser, load https://financialhealthcheck.ai, submit the form:



All network calls 200



Email received in Gmail; “Sent” present in no-reply@…



New document in leads with UTM/consent



4\) Microsoft Graph Mail (Production)

4.1 Azure App Registration (AAD)



App type: Single-tenant (recommended)



Permissions: Microsoft Graph → Application → Mail.Send



Grant admin consent (Azure Portal → App → API permissions → Grant admin consent)



Client secret: create \& store securely



4.2 Restrict who the app can send as (optional but recommended)



Create an M365 mail-enabled security group (e.g., App Mail Senders).



Add allowed mailboxes (e.g., no-reply@...) to the group.



Exchange Online PowerShell:



\# Connect

Connect-ExchangeOnline



\# Create policy (once)

New-ApplicationAccessPolicy `

&nbsp; -AppId <MS\_CLIENT\_ID> `

&nbsp; -PolicyScopeGroupId apps-mailsenders@echo-financial-advisors.co.nz `

&nbsp; -AccessRight RestrictAccess `

&nbsp; -Description "Allow app to send only as members of App Mail Senders"



\# Verify

Test-ApplicationAccessPolicy `

&nbsp; -AppId <MS\_CLIENT\_ID> `

&nbsp; -Identity no-reply@echo-financial-advisors.co.nz -Verbose

\# Expect: AccessCheckResult : Granted



4.3 Backend env

EMAIL\_PROVIDER=graph

MS\_TENANT\_ID=...

MS\_CLIENT\_ID=...

MS\_CLIENT\_SECRET=...

EMAIL\_FROM=no-reply@echo-financial-advisors.co.nz

EMAIL\_FROM\_NAME=Echo Financial Advisors

BOOKING\_URL=https://outlook.office.com/book/EchoFinancialAdvisorsLtd1@echo-financial-advisors.co.nz/



4.4 Send test (prod)



Submit the form with a real email you can check.



Confirm email arrives and appears in Sent Items of no-reply@…



5\) Sentry (Frontend)



Init in frontend/src/index.js as early as possible:



Uses REACT\_APP\_SENTRY\_DSN if present; otherwise a fallback DSN is set in code (OK; DSNs are public).



Error boundary wraps <App />.



Dev test: Home → Debug → Break the world. You should see the event in Sentry.



Backend Sentry: Planned. For now, logs are printed to stdout (Render logs).



6\) Admin Access



Admin pages live under /admin/\*.



The UI hides data unless a token is present (JWT hardening planned).



Negative test: Incognito → /admin/dashboard should redirect/deny; /api/reviews without Authorization should not return data.



7\) Configuration Reference

7.1 Backend required env

Key	Purpose

MONGO\_URI	Atlas connection

OPENAI\_API\_KEY	GPT analysis

PORT	Default 5000 locally

CORS\_ORIGINS	Comma-sep allowlist (exact origins)

EMAIL\_PROVIDER	graph

MS\_TENANT\_ID / MS\_CLIENT\_ID / MS\_CLIENT\_SECRET	Azure app creds

EMAIL\_FROM / EMAIL\_FROM\_NAME	Sender mailbox \& display name

BOOKING\_URL	CTA link in email

7.2 Frontend env

Key	Purpose

REACT\_APP\_API\_URL	Backend base URL

REACT\_APP\_SENTRY\_DSN	(optional) Frontend Sentry

REACT\_APP\_PRIVACY\_URL	Privacy link beside consent

8\) Common Issues \& Fixes

8.1 CORS blocked in prod



Symptom: Console shows No 'Access-Control-Allow-Origin' header.



Fix: Add the exact frontend origins to CORS\_ORIGINS in Render (both with/without www) and redeploy.



CORS\_ORIGINS=https://financialhealthcheck.ai,https://www.financialhealthcheck.ai



8.2 WSL vs Windows localhost



If backend runs in WSL, use http://localhost:5000 in the browser (works), but curl inside WSL to Windows localhost can fail if backend is not in WSL. Prefer: run backend in WSL and test with curl.exe from PowerShell or with the browser.



8.3 SendGrid 401



We no longer use SendGrid in prod. EMAIL\_PROVIDER=graph is required. Ensure Azure app has Mail.Send + admin consent \& policy (above).



8.4 Netlify build fails (ESLint)



Error references a specific file/line (e.g., missing dependency in useEffect). Fix the lint warning and re-push.



8.5 Sentry not receiving events



DSN missing at build time, or ad-blockers. Try incognito; confirm DSN in the built bundle (view page-source → search for sentry).



9\) Security \& Compliance



Secrets: never commit. Use env vars in Render/Netlify; rotate on exposure.



Consent: audit trail stored with timestamp, IP, UA, exact consent text. Keep REACT\_APP\_PRIVACY\_URL visible by the checkbox.



Rate limiting: /api/submit (60/15m), /api/gpt (30/15m).



CORS: env-driven allowlist.



PII: avoid logging PII; if adding backend Sentry, scrub PII.



10\) Observability \& On-call



Frontend Sentry: alert on unhandled exceptions, rising error rate.



Backend (next): add Sentry or pino JSON logs with redaction; ship to a log sink (e.g., Logtail, Loki).



Health endpoint: /api/health (Render should show green).



Alarms (next): uptime monitor on backend URL; email to ops.



11\) Release \& Rollback

11.1 Standard release

\# Create a branch

git checkout -b release/some-feature



\# Commit as you go

git add -A

git commit -m "feat: short description"



\# Push and open PR

git push -u origin release/some-feature





Netlify creates a Deploy Preview for the frontend; test form submit \& email end-to-end.



Merge PR → Netlify builds main; Render redeploys on push (or redeploy manually).



11.2 Rollback



Frontend (Netlify): Deploys → “Rollback” to previous successful deploy.



Backend (Render): Events → “Rollback” to previous deploy. Or push a revert commit.



12\) Data Access \& Backups



Atlas: use built-in backups.



Never export raw PII to unencrypted storage.



For exports, prefer CSVs with minimal fields and redact email/phone unless strictly necessary.



13\) Roadmap \& Owners

Immediate (P0)



Backend logging + optional Sentry with PII scrubbing.



JWT for admin routes (short-lived tokens); hide admin UI without token.



Security headers (Helmet) + CSP tuned for Sentry \& app domains.



Near-term (P1)



“Email me this report” (double opt-in), event instrumentation (GA4/PostHog), tooltips \& currency formatting, PDF export.



Later (P2)



Multi-tenant (tenantId, branding, per-tenant keys/quotas), queue/cache long GPT, uptime/alerting.



Owner: (add GitHub handle / email)

Business: Echo Financial Advisors



14\) Appendix: Useful Commands

\# Health (local)

curl -i http://localhost:5000/api/health



\# Health (prod)

curl -i https://financial-health-check-calculator.onrender.com/api/health



\# Quick CORS probe (preflight)

curl -i -X OPTIONS \\

&nbsp; -H "Origin: https://financialhealthcheck.ai" \\

&nbsp; -H "Access-Control-Request-Method: POST" \\

&nbsp; https://financial-health-check-calculator.onrender.com/api/submit

