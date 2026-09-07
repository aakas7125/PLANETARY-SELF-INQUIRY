# Local Codex Task Publication Protocol

**Status:** HQ-approved and active  
**Effective date:** 2026-09-05  
**Canonical task channel:** GitHub Issues in this repository

## Executable-task rule

A GitHub Issue is executable by Local Codex only when all of the following are true:

1. Its title begins with `[HQ-AUTHORIZED][LOCAL-CODEX]`.
2. Its body contains `HQ-authorized for Local Codex execution: YES`.
3. It contains a unique `Task ID`.
4. Its `Current status` is `READY_FOR_LOCAL_CODEX`.
5. Its scope, relevant contracts/files, dependencies/blockers, acceptance criteria, and required branch/PR/direct-main behavior are explicit.
6. `Owner approval still required` and `Specialist approval still required` are explicit.
7. All listed dependencies are clear and no required approval is outstanding.

Ordinary chat messages, comments that merely suggest next steps, unlabeled Issues, pull requests, and issues without the exact authorization marker are not executable authority.

## Required task fields

Every executable task must include:

- Task ID
- HQ-authorized for Local Codex execution
- Scope
- Relevant contracts/files
- Dependencies/blockers
- Acceptance criteria
- Required branch/PR/direct-main behavior
- Current status
- Owner approval still required
- Specialist approval still required

The task may also include priority, target workstream, requested output, and supersession information.

## Status values

Use these status values in the issue body:

- `DRAFT`
- `BLOCKED`
- `READY_FOR_LOCAL_CODEX`
- `IN_PROGRESS`
- `VERIFIED_FOR_HQ_REVIEW`
- `ACCEPTED`
- `REJECTED`
- `SUPERSEDED`
- `CANCELLED`

Only `READY_FOR_LOCAL_CODEX` authorizes execution.

## Intake and execution

At each intake run Local Codex must:

1. Search this repository's open GitHub Issues.
2. Select only issues satisfying every executable-task rule above.
3. Read relevant repository-backed handoffs and unresolved dependencies before beginning meaningful work.
4. Execute only the stated scope and acceptance criteria.
5. Follow the task's branch/PR/direct-main instruction exactly.
6. Record progress, blockers, and the final result on the same Issue.
7. Escalate any scope expansion, semantic change, owner-level matter, or missing approval to HQ.

A task becoming `IN_PROGRESS` does not authorize scope expansion. A task is not accepted merely because Local Codex completed it; HQ retains acceptance authority.

## Governance boundaries

Local Codex must not treat GitHub Issues as permission to change scientific semantics, AP attribution, product scope, accepted defaults, contracts, or canonical behavior unless the task explicitly authorizes that change and the required HQ/owner approvals are present.

When an issue is `BLOCKED`, `VERIFIED_FOR_HQ_REVIEW`, `ACCEPTED`, `REJECTED`, `SUPERSEDED`, or `CANCELLED`, it must not be executed again unless HQ publishes a new task or explicitly changes its status with the required authority.

## HQ operating rule

After each meaningful HQ response or work chunk, HQ must end in exactly one of these states:

1. Authorize or publish a bounded coding task through GitHub to Cursor as the primary coding executor, or to Local Codex when the task is specifically better suited there.
2. Issue or publish a bounded instruction or handoff through GitHub to Research & Evidence or AP Framework & Corpus when specialist work is the correct next step.
3. Declare that neither route is currently possible, state the exact blocker, identify whether owner intervention is genuinely required, and ask the owner only for that intervention.

Routine HQ-owned closure actions—receiving-state updates, governance documentation, task publication, acceptance or rejection records, and push authorization within standing rules—should be completed in the same work chunk where possible before selecting the ending state.

HQ must not stop at a prose recommendation when it already has enough authority and information to publish the next bounded GitHub action. HQ must not create artificial work merely to satisfy this rule.

## Coding-executor selection

From 2026-09-07, Cursor is the primary coding executor unless HQ records that a bounded task is specifically better suited to Local Codex.

A Cursor task is executable only when its title begins with `[HQ-AUTHORIZED][CURSOR]`, its body contains `HQ-authorized for Cursor execution: YES`, its current status is `READY_FOR_CURSOR`, both approval fields are `NO`, and the same scope, dependency, acceptance, and branch/PR/direct-main fields required for Local Codex tasks are complete. Cursor records progress and final results on the same Issue and does not self-merge.

This does not convert a Cursor task into Local Codex authority. Local Codex continues to require its exact existing marker and `READY_FOR_LOCAL_CODEX` state.

## Standing progression rule

When HQ closes or accepts a task and no executable coding-executor Issue remains, an empty executor queue is not itself a stopping condition. HQ must inspect the active product path and determine which condition applies:

1. The next dependency is an HQ review, acceptance, or merge decision: complete that bounded HQ action.
2. A blocked Issue can now be unblocked: update it or publish the next executable task.
3. A genuine blocker remains: record its exact cause and evidence, identify the actor required, and publish the smallest legitimate resolving task when possible.
4. A genuine owner-level decision is required: ask the owner explicitly for only that decision.

Every blocked Issue or intentionally unmerged PR on the active product path must state why it is blocked or unmerged and the exact event or action that clears it.

Progress should follow this order unless new evidence creates a real safety, provenance, or semantic ambiguity:

`governed app baseline → executable contract/AP tests → canonical smartphone UX → reusable activity/evidence schema → broader V0 activities → public-beta readiness → public hosting`

HQ must not create another broad governance or validation loop merely because no executor task is ready.
