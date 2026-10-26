# Manifest — VXLReeeSkAU visual-audit source leads

Publication date: 2026-10-26.

This manifest records the text files published under `provenance/visual-source-leads/VXLReeeSkAU/`. The seven audit originals were copied byte for byte. SHA-256 below was recomputed after that copy and matches the authorized digests. Observations inside those originals were not rewritten.

`README.md` was written for this publication. Its digest is included. The digest of `MANIFEST.md` is not embedded in this file, because writing it would change the bytes. Recompute it from the committed file with `sha256sum MANIFEST.md`.

## Published files

| Published file | Origin | Bytes | SHA-256 |
|---|---|---:|---|
| `visual-register-v2.csv` | Authoritative v2 register upload, CSV. CRLF line endings preserved. | 39646 | `826b33c06266051538345e73a34b4ab831baebdd80b5a83d95cd2e33cdb75c87` |
| `visual-register-v2.md` | Authoritative v2 register upload, Markdown. | 41229 | `0daa51f5ae398f92bd5d1c8a297c9af1fa5043bc67e32fa349576d1cab3b5580` |
| `coverage-log.md` | Authoritative coverage-log upload from the sampled 720p pass. | 3090 | `761da12df91f064d4747a0d688e9ce20a7fcd22a491b6d6f25d859332b2652a2` |
| `source-leads.md` | Authoritative upload of `research_source_index.md`, published under this filename. Bytes are unchanged; only the filename differs. | 3601 | `2e4abfd5d1719faac1e405cd947ce9f0c12216c783a33747e498f192da9751e7` |
| `unresolved-references.md` | Authoritative unresolved-references upload (720p; header states no 1080p re-read). | 1345 | `9665a1f3bdc5681afc05aca8b13c3148e171c80633b85f20c4dd44bb92c4200d` |
| `CHANGELOG_v2.md` | Authoritative v2 changelog upload. | 3554 | `44a8ccdf2d3174b4c9a73ec8e3e9ba16b9a34e6256845087c4efac9747ead884` |
| `local-screenshot-inventory.md` | Authoritative upload of `LOCAL_SCREENSHOT_INVENTORY.md`, published under this filename. Hashes of local-only screenshots. The image bytes are not in the repository. | 9410 | `03570d3ede741de4c00f08867acac5703a4783de57544c3ca8c3366e296c69f3` |
| `README.md` | Written for this publication. Status, scope, limitations, and links. | 8855 | `6e2629bca4b3ae610aba76688b2585ae7ef2db170675a8b73aad2037b98932f8` |

## Local-only images

Screenshot and contact-sheet files remain outside the public repository. [local-screenshot-inventory.md](local-screenshot-inventory.md) is the pointer: 60 filenames under `shots/` and 16 under `shots_v2/`, each with a SHA-256. The 2026-10-17 owner intake recorded an archive listing of 57 JPEG files in the v1 zip and 16 in the v2 zip. Both counts are preserved. This manifest does not reconcile them.

Register cells that name a screenshot are filenames only.

## Local-only zip archives

These archives are not in the repository. The digests below are the owner-authorized values. The same digests are already recorded in [the visual-delta owner intake](../../owner-inputs/OWNER-2026-10-17-AP-CLIMATE-VISUAL-DELTA.md), under the upload filenames `audit_deliverables(1).zip` and `followup_v2(1).zip`, with the byte sizes in that intake. This publication step did not re-hash the zip bytes, because the zips were not placed in the repository.

| Local archive | SHA-256 | Bytes recorded in the 2026-10-17 owner intake |
|---|---|---:|
| `audit_deliverables.zip` | `1d59765d87ef966f3be6f70c4088dbc8b12a3d5e6c494413048b8c4de79ffa4a` | 6859339 |
| `followup_v2.zip` | `c4d651a52917e71ebb20879254f7a272c3fd5853b330d18da20591c69292994d` | 2292974 |

## Local audit path

The local machine path for the audit work directory was `/workspace/planetary-self-inquiry-visual-audit/`. That path is not publicly accessible. No other machine metadata is recorded here.
