# Security Status

Audit date: 2026-08-25

## Overall Status

**Needs action before production use.** HTTPS is configured and the code/build checks are clean, but the live appointments table currently exposes patient records to anonymous REST reads.

## Checks

| Area | Status | Result |
| --- | --- | --- |
| HTTPS endpoint | Pass | Supabase certificate validation succeeded over TLS 1.2. |
| TLS 1.3 | Inconclusive | The Windows Schannel client could not negotiate TLS 1.3; this is a local client limitation, not proof of a server problem. |
| Browser headers | Improved | HSTS, CSP, frame protection, MIME sniffing protection, referrer policy, and permissions policy are configured in `vercel.json`. |
| Dependency audit | Pass | `npm audit` reported 0 vulnerabilities. |
| Lint/build | Pass | `npm run lint` and `npm run build` pass. |
| Tracked secrets | Pass | No private keys, `service_role`, or server-secret patterns were found in tracked source. `.env.local` is ignored. |
| React injection patterns | Pass | No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or `new Function` usage was found. |
| Database reads | **Fail** | Anonymous REST requests returned one row from `appointments`. Patient data is currently readable. |

## Immediate Actions

1. Run the updated `supabase-appointments.sql` migration in the Supabase SQL Editor. It revokes `SELECT`, `UPDATE`, and `DELETE` from `anon` and `authenticated` while retaining public appointment submission.
2. Re-test anonymous `GET /rest/v1/appointments?select=*` after migration. It must return `401` or an empty result, and must not return patient rows.
3. Add CAPTCHA and server-side rate limiting. The current public insert policy allows automated appointment spam even after reads are blocked.
4. Verify RLS and grants for every public content table. Public pages should have read-only access; appointment and other patient tables must not be readable by `anon`.
5. Keep staff appointment viewing behind a trusted server-side endpoint using the service role key. Never put that key in Vite environment variables or browser code.

## Configuration Notes

The Supabase anon key and EmailJS public key are browser-facing values and are not equivalent to secrets. Rotate them if any private key was ever stored in the frontend or committed to the repository. Deploy through Vercel so HTTP is redirected to HTTPS, and verify the response headers on the final custom domain after deployment.

The CSP intentionally permits Supabase, EmailJS, Cloudinary, and Google Maps. `style-src 'unsafe-inline'` remains because of the current frontend styling/runtime; remove it later if the application no longer needs inline styles.