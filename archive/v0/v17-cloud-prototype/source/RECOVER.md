# Recover V17 source and validation archive

**Status:** historical migration/reference artifact  
**Version:** V17  
**Source commit:** `5fb4accc5a72423f45f3cfd5ac990aefa7f912b4`  
**Receiving state:** published for HQ migration review; not accepted into canonical `main`

## Contents

The six ordered `.b64.part-00` through `.b64.part-05` files encode one gzip archive. The recovered archive contains the validated static prototype (`dist/`), Vite/package files, QA harness, deterministic suites, and hosting configuration. Dependencies are intentionally excluded and are reproduced from `package-lock.json`.

## Verify and extract

From this directory:

```sh
for part in v17-source-validation.tar.gz.b64.part-*; do
  base64 --decode "$part"
done > v17-source-validation.tar.gz

sha256sum v17-source-validation.tar.gz
# expected: 0d96fd751a8d000716c8a00e46408e1d4881e3438cd07d5cd121aa51e24196d3

tar -xzf v17-source-validation.tar.gz
npm ci
node tests/model.test.js
node tests/content.test.js
npm run test:secondary-pathways
```

The manifest one directory above lists SHA-256 values for the individual archived source and test files. This archive is a recoverable reference only; it does not establish a parallel active implementation line or authorize deployment.
