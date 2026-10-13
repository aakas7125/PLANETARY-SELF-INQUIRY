# Render Free Docker contract for the accepted public profile.
# Build context is the app/ directory. Render root directory: app.
# Dockerfile path, if Render asks: ./Dockerfile.
#
# This image defines build and start behavior only. It does not create a
# Render service, database, secret, domain, or payment authorization.

FROM node:22.14.0-bookworm-slim AS build

RUN npm install -g npm@11.19.0 \
  && node -e "const {execFileSync}=require('node:child_process'); const npmVersion=execFileSync('npm',['-v'],{encoding:'utf8'}).trim(); if (process.version!=='v22.14.0' || npmVersion!=='11.19.0') { console.error(process.version, npmVersion); process.exit(1); }"

WORKDIR /src

COPY . .

# Do not set NODE_ENV before install. Production mode would omit the
# devDependencies required by the existing npm run build contract.
RUN cp package-lock.json /tmp/package-lock.json \
  && npm ci --ignore-scripts \
  && node -e "const fs=require('node:fs'); if (!fs.readFileSync('package-lock.json').equals(fs.readFileSync('/tmp/package-lock.json'))) { console.error('npm ci rewrote package-lock.json'); process.exit(1); }" \
  && npm run build \
  && node -e "const fs=require('node:fs'); const entry='.output/server/index.mjs'; if (!fs.existsSync(entry) || fs.statSync(entry).size===0) { console.error('missing Nitro server entry'); process.exit(1); } if (fs.existsSync('.output/public/__grok')) { console.error('published __grok assets'); process.exit(1); }"

FROM node:22.14.0-bookworm-slim AS runtime

RUN mkdir -p /app && chown node:node /app

WORKDIR /app

COPY --from=build --chown=node:node /src/.output ./.output

# Nitro reads NITRO_HOST, then HOST. Leave PORT and NITRO_PORT unset so the
# injected platform port, including Render's PORT, remains the listener port.
ENV NITRO_HOST=0.0.0.0

USER node

CMD ["node", ".output/server/index.mjs"]
