# Public beta profile — Option A

This is the repository contract for the owner-approved minimal privacy-first
public profile. It prepares a deployable Node artifact and local release
checks. It does not select a provider, create an account or credential, deploy,
configure DNS, or authorize public release.

## Public surface

The public application is the Protect Four homepage, Journey, and the complete
smartphone inquiry, plus the static repository canon and ordinary outbound
source links.

The profile is anonymous. It has no account, login, session, persistent user
data, analytics, tracking, or non-essential cookies. It does not call xAI,
OpenAlex, or Crossref at runtime. It does not expose auth, connector, RTC,
database, migration, Grok install, or preview-host endpoints. It does not load
Google Fonts. It does not install a service worker or a new PWA.

Inherited auth, database, connector, RTC, and Grok modules may remain in the
repository only where the production graph does not import them. The dev
authoring server is not this public profile.

## Build and start

From `app/`, with no secret environment variables:

```sh
npm ci --ignore-scripts
npm run build
npm run start
```

`npm run build` runs `node scripts/with-app-env.mjs vite build`. It does not run
database migrations.

`npm run start` runs `node scripts/start-public-profile.mjs`, which executes
the built entry:

```text
app/.output/server/index.mjs
```

Static files are written to `app/.output/public/`. Grok assets under
`public/__grok/` are excluded from that output.

The validated runtime is Node.js 22. No secret is required. Optional listener
variables, when set:

| Variable | Role |
| --- | --- |
| `NITRO_HOST`, otherwise `HOST` | Listener address. Unset leaves the Node default. Local verification sets `HOST=127.0.0.1`. |
| `NITRO_PORT`, otherwise `PORT` | Listener port. Unset uses Nitro's default `3000`. Local verification sets `PORT=8081`. |

`NITRO_HOST` wins over `HOST`. `NITRO_PORT` wins over `PORT`.

## Local verification

```sh
cd app
npm ci --ignore-scripts
npm test
npm run typecheck
npm run lint
npm run build
node scripts/public-beta-profile-graph.mjs
HOST=127.0.0.1 PORT=8081 npm run start
```

With that server running:

```sh
cd app
PREVIEW_URL=http://127.0.0.1:8081 node scripts/e2e-local-preview-smoke.mjs
```

The smoke walks `/`, `/journey`, and `/smartphone`, including direct refresh,
at 390×844 and 1280×800. It checks the static canon, prohibited network
surfaces, cookies, and browser storage.

## Exclusions

This profile does not add a provider adapter, container, workflow, deployment
file, domain, credential, or cloud configuration. Staging and public release
remain separately owner-controlled.
