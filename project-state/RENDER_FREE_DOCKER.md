# Render Free Docker deployment

This is repository preparation for a manual Render Free Docker Web Service.
It does not create a Render service, attach a database, add a secret, configure
a domain, authorize a card or payment, promote production, or authorize public
release.

The image builds the accepted public profile. Auth stays disabled by
`.grok/app-env.json`. The build does not migrate a database. The runtime image
contains the built Nitro `node-server` output and runs as the image's non-root
`node` user.

## Image contract

Build context: `app/`

```sh
docker build -t psi-public-profile app
```

| Item | Contract |
| --- | --- |
| Node | `22.14.0`, image `node:22.14.0-bookworm-slim` |
| npm | `11.19.0`, used for `npm ci --ignore-scripts` and `npm run build` |
| Lockfile | `npm ci` must leave `package-lock.json` unchanged |
| Build | `npm run build` |
| Runtime entry | `.output/server/index.mjs` |
| Host | `NITRO_HOST=0.0.0.0` |
| Port | unset in the image. Nitro uses `NITRO_PORT`, otherwise `PORT`, otherwise `3000` |

Render injects `PORT`. The image does not set or override `PORT`, `NITRO_PORT`,
or `HOST`. `NITRO_HOST` is what binds the listener to all interfaces.

Local listener check:

```sh
docker run --rm -e PORT=10000 -p 10000:10000 psi-public-profile
```

Then request `/`, `/journey`, and `/smartphone` directly on port `10000`.

## Manual Render flow

Create the service only after this contract is on `main`. This file does not
perform that creation.

1. New Web Service, connected to GitHub repository `aakas7125/PLANETARY-SELF-INQUIRY`.
2. Branch: `main`.
3. Language/runtime: Docker.
4. Root directory: `app`.
5. Dockerfile path, if Render asks: `./Dockerfile`.
6. Region: Frankfurt.
7. Compute: Free.
8. Do not add a database.
9. Do not add environment variables or secrets. Leave Render's injected `PORT` untouched.
10. Do not enter a build command or a start command. Docker supplies both.
11. Do not add a custom domain or change DNS.
12. Do not authorize a card, a temporary charge, a paid plan, production promotion, or public release.

## First deploy

After an owner-controlled service exists:

- confirm the service is the Docker service above, still on Free compute, with no database and no secret;
- open `/`, `/journey`, and `/smartphone` directly, including a fresh browser request to each path;
- confirm the responses are the public profile and that the service did not ask for authentication.

## Account-specific card blocker

If Render asks for a credit or debit card, or for a temporary authorization, before the service can be created:

- stop;
- do not enter payment information;
- do not accept an authorization hold;
- record the blocker on Issue #130, including Render's exact message, that no card was added, that no authorization hold was accepted, and that no service was created.

This guide does not choose an option on that owner decision.
