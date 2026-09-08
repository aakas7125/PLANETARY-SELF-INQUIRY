# Owner Control

## Owner

- Owner: Akash S
- Repository owner: `aakas7125`

## Authority model

The owner retains genuine owner-level decisions. Project HQ governs bounded work: it may authorize tasks, independently review their results, accept qualifying work, and promote qualifying pull requests to canonical `main`.

Cursor, Local Codex, Research & Evidence, AP Framework & Corpus, and other executors may act only within repository-authorized scope. They do not receive independent acceptance or self-merge authority.

## Routine HQ-reviewed merge authority

**Standing owner authorization effective 2026-09-08:** Project HQ may merge a pull request into canonical `main` without separate per-PR owner approval only when every condition below is satisfied:

1. The work was executed under a valid HQ-authorized task or another repository-authorized workflow.
2. At execution time, `Owner approval still required: NO`, and all required specialist or cross-domain approvals were satisfied.
3. The implementation stays within its previously authorized scope.
4. HQ independently reviews the actual pull-request diff and confirms that it satisfies the task acceptance criteria.
5. Required validation passes. If hosted CI is absent, HQ explicitly records that fact and confirms adequate repository-backed validation evidence.
6. The pull request introduces none of the following:
   - new scientific claims or evidence semantics;
   - new AP or philosophical claims or interpretation rules;
   - new project or product semantics beyond accepted direction;
   - scope expansion;
   - weakening, deletion, or skipping of required tests;
   - fabricated numerical authority;
   - unknown-to-zero or other unauthorized default coercion;
   - changes to immutable provenance or source packages unless separately authorized.
7. The pull request does not constitute an owner-controlled action listed below.
8. The executor has not self-merged; HQ remains the independent acceptance and merge authority.

When all conditions are satisfied, HQ should accept the work, merge the reviewed head into `main`, mark and close the corresponding task, and publish the next smallest owner-independent task when appropriate. No additional owner “go ahead” is required.

`Owner approval still required` denotes a substantive owner decision. It must not be changed to `YES` merely because a qualifying reviewed pull request is ready for routine promotion to `main`. An ordinary qualifying merge is not owner-level solely because it writes to the default branch.

## Owner-controlled actions

Explicit owner approval remains required for:

- changes to this file or to the definition of owner authority;
- public deployment or public release where owner consent is required;
- expenditure, purchase, subscription, or another financial commitment;
- credentials, account ownership, or sensitive-access decisions requiring owner action;
- legal, licensing, copyright, or substantial AP-reproduction decisions;
- irreversible or destructive repository actions outside normal reviewed merging;
- major product-direction or scope changes;
- adoption of new scientific, AP, or project semantics when accepted material does not already determine the answer;
- any action another governing repository document explicitly reserves to the owner for a substantive reason.

## Executor publication authority

Local Codex may push directly to `main` only after explicit HQ authorization for that direct-main behavior and only when all of the following are true:

- no force-push or history rewrite is used;
- no scientific, AP, V17, owner-level, product, or semantic behavior changes occur;
- required checks pass; and
- HQ reviews the resulting diff and commits.

Otherwise, Local Codex must use a branch and pull request. Cursor and other coding executors must likewise follow the exact branch/PR/direct-main instructions in their authorized task and may not self-merge.

## Change control

Changes to this file or the definition of owner authority require explicit owner approval. This revision was explicitly authorized by the owner directive dated 2026-09-08.

## Current status

This owner-control policy is owner-approved, published, and active. Routine qualifying HQ-reviewed merges are owner-independent under the standing conditions above; substantive owner-controlled actions remain reserved.
