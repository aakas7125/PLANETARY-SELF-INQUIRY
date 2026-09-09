# Universal GitHub Issue Control Plane

**Effective date:** 2026-09-05  
**Repository:** `aakas7125/PLANETARY-SELF-INQUIRY`  
**Authority:** Project HQ under `OWNER_CONTROL.md`

## Purpose

GitHub Issues are the durable task and communication control plane for Project HQ, Research & Evidence, AP Framework & Corpus, Cursor, and Local Codex.

Chats remain reasoning and execution surfaces. Once a formal Issue exists, chat prose is not executable authority and is not required for inter-workstream communication.

The durable loop is:

`HQ → GitHub Issue → target workstream → GitHub result/status → HQ or next workstream`

## Issue classes

### Executable task

An executable task authorizes bounded work for a named workstream. It must contain a unique task ID, target workstream, explicit authorization, scope, relevant files/contracts, dependencies, acceptance criteria, required branch/PR/direct-main behavior, current status, and approval fields.

Executable titles use:

- `[HQ-AUTHORIZED][CURSOR] ...`
- `[HQ-AUTHORIZED][LOCAL-CODEX] ...`
- `[HQ-AUTHORIZED][RESEARCH] ...`
- `[HQ-AUTHORIZED][AP] ...`

Executable states include:

`READY_FOR_CURSOR`, `READY_FOR_LOCAL_CODEX`, `READY_FOR_RESEARCH`, `READY_FOR_AP`, `READY_FOR_HQ_REVIEW`, `IN_PROGRESS`, `BLOCKED`, `VERIFIED_FOR_HQ_REVIEW`, `RESOLVED`, and `SUPERSEDED`.

A workstream seeing a valid `READY_FOR_*` task must begin the bounded work, record execution state under the applicable return-channel rule below, and not expand scope.

Minimum execution gates:

- the target workstream is explicit;
- `Owner approval still required: NO`;
- required specialist or cross-domain approval is satisfied;
- dependencies and blockers are clear;
- relevant repository-backed handoffs have been inspected;
- the task’s required branch/PR/direct-main behavior is explicit.

### Cross-workstream handoff

A handoff transfers domain knowledge, evidence, provenance, constraints, dependencies, requested review, or implementation-relevant clarification. It does not authorize new execution.

Handoff titles use:

- `[CROSS-HANDOFF][RESEARCH→AP] ...`
- `[CROSS-HANDOFF][AP→RESEARCH] ...`
- `[CROSS-HANDOFF][RESEARCH→HQ] ...`
- `[CROSS-HANDOFF][AP→HQ] ...`
- `[CROSS-HANDOFF][CURSOR→HQ] ...`
- `[CROSS-HANDOFF][LOCAL-CODEX→HQ] ...`
- `[CROSS-HANDOFF][HQ→RESEARCH] ...`
- `[CROSS-HANDOFF][HQ→AP] ...`

A handoff may use receiving states such as:

`ROUTED`, `RECEIVED`, `CONSUMED`, `PARTIALLY_CONSUMED`, `BLOCKED`, and `SUPERSEDED`.

Receiving a handoff does not authorize additional research, AP scope expansion, semantic changes, implementation, or canonical integration. If more work is needed, HQ must publish a separate executable task in the appropriate `READY_FOR_*` state.

**Handoff does not equal execution authority.**

## Common intake

Each active workstream must inspect GitHub Issues addressed to it during its intake:

1. inspect valid executable tasks targeted to that workstream;
2. inspect cross-workstream handoffs addressed to that workstream;
3. ignore unrelated, resolved, superseded, ordinary-discussion, and non-authoritative Issues/comments.

For a valid executable task, verify the gates, record progress through the applicable return channel, execute only the bounded scope, record work/checks/discrepancies, and finish as `VERIFIED_FOR_HQ_REVIEW`, `BLOCKED`, `RESOLVED`, or `SUPERSEDED` as applicable.

For a handoff, inspect the referenced information, acknowledge or consume it, update its receiving state, and route any newly needed work to HQ. Do not infer execution authority from receipt.

## HQ reaction

When HQ finds a meaningful `VERIFIED_FOR_HQ_REVIEW` or `BLOCKED` result, prerequisite completion, cross-domain discrepancy, or handoff requiring routing, HQ must inspect the repository-backed evidence and complete the appropriate governance action in the same work chunk where possible:

1. publish/authorize the next bounded Cursor or Local Codex task, using Cursor as the primary coding executor unless the task is specifically better suited to Local Codex;
2. publish an executable Research/AP task or appropriate handoff; or
3. record the exact genuine blocker and request only the necessary owner intervention.

Routine receiving-state updates, governance records, task publication, acceptance/rejection, push authorization, and qualifying HQ-reviewed merges should be completed in the same work chunk when their conditions are already satisfied. A routine qualifying merge does not require another owner prompt. No artificial work should be created.

## Cursor event-driven dispatch

A native Cursor Automation may listen for GitHub Issue comments containing the exact marker `[CURSOR-DISPATCH]`. The comment is a transport and wake signal only. It never creates, expands, or substitutes for execution authority; the Issue remains the sole authoritative task record.

When HQ publishes a new Cursor task or deliberately returns a previously blocked task to `READY_FOR_CURSOR`, HQ must first verify all repository execution gates, including title and authorization markers, both approval fields set to `NO`, satisfied dependencies, explicit scope, relevant files/contracts, acceptance criteria, branch/PR/direct-main behavior, and permitted concurrency. Only then, as the final publication step, HQ posts this exact comment on the same Issue:

```text
[CURSOR-DISPATCH]

This Issue is ready for Cursor intake.

The dispatch comment is a wake signal only. Inspect the Issue itself and execute only if every repository-defined `[HQ-AUTHORIZED][CURSOR]` execution gate currently passes.
```

HQ must not post a duplicate dispatch for the same uninterrupted `READY_FOR_CURSOR` transition. It must not dispatch a task currently marked `IN_PROGRESS`, `VERIFIED_FOR_HQ_REVIEW`, `BLOCKED`, `ACCEPTED`, `RESOLVED`, or `SUPERSEDED`. If HQ legitimately returns a task to `READY_FOR_CURSOR` after a blocked or review state, that new transition requires a new dispatch comment.

When awakened, Cursor independently fetches and verifies the Issue itself. If every gate still passes, Cursor begins the bounded work using the PR return-channel and idempotency rules below; HQ reconciles Issue state; it must not ask the owner for another go-ahead. If any gate no longer passes, the comment authorizes nothing and Cursor must not execute. Cursor remains prohibited from self-merging.

The durable event-driven sequence is:

`HQ defines bounded task → complete READY_FOR_CURSOR Issue → [CURSOR-DISPATCH] → Cursor re-verifies gates → IN_PROGRESS → implementation/validation/PR → VERIFIED_FOR_HQ_REVIEW → HQ review/acceptance/merge when permitted → next task and dispatch`

## Routine promotion to `main`

Under the standing authorization in `OWNER_CONTROL.md`, HQ may accept and merge a pull request without separate per-PR owner approval only when all of these gates hold:

- the work came from a valid HQ-authorized task or other repository-authorized workflow;
- `Owner approval still required: NO` applied at execution time and every required specialist or cross-domain approval was satisfied;
- the diff stays inside the authorized scope and meets its acceptance criteria;
- HQ independently reviews the actual pull-request diff and reviewed head;
- required validation passes, or absent hosted CI is explicitly recorded with adequate repository-backed validation evidence;
- the pull request adds no unapproved scientific, AP, project, or product semantics; scope expansion; test weakening/deletion/skipping; fabricated numerical authority; unknown-to-zero/default coercion; or unauthorized immutable provenance/source-package change;
- the action is not substantively reserved to the owner; and
- the executor has not self-merged.

When every gate holds, HQ accepts the result, merges the reviewed head into `main`, closes the task, and continues the standing progression rule without requesting another owner “go ahead.” The task’s owner-approval field describes a substantive owner decision, not the mechanical promotion step.

If any gate fails, HQ must not merge. It must record the exact failed gate, evidence, responsible actor, and clearing action. Owner intervention is requested only when the unresolved decision is genuinely owner-controlled under `OWNER_CONTROL.md`.

## Automation

During active migration/integration, the highest supported safe polling cadence is hourly for HQ, Research, AP, and Local Codex intake. Cursor may temporarily retain an hourly intake poll as a recovery mechanism while event-driven dispatch is proven. Successful `[CURSOR-DISPATCH]` handling must not depend on that poll. If no relevant Issue state has changed, do nothing and generate no notification.

A scheduled task attached to HQ is not equivalent to an executor-side schedule or event automation attached to the actual Research, AP, Cursor, or Local Codex environment. Each executor must attach its intake to the environment that can perform its authorized work. HQ publication/monitoring must remain separate from executor intake.

Cadence may later be reduced or made event/session-driven once migration stabilizes. Unsupported sub-hour polling must not be simulated.

## Authority boundaries

- GitHub Issue publication is durable routing, not automatic acceptance.
- `main` remains accepted/integrated project state.
- Research and AP may publish bounded domain packages, proposals, tests, and handoffs but may not independently promote integrated contracts.
- Cursor may execute only explicit `[HQ-AUTHORIZED][CURSOR]` tasks containing `HQ-authorized for Cursor execution: YES` and `Current status: READY_FOR_CURSOR`, and must follow their branch/PR/direct-main constraints.
- Local Codex may execute only explicit `[HQ-AUTHORIZED][LOCAL-CODEX]` tasks and must follow their branch/PR/direct-main constraints.
- Cursor is the primary coding executor from 2026-09-07 onward unless HQ records why a bounded task is specifically better suited to Local Codex.
- HQ must not accept or promote scientific, AP, product, or semantic changes without the required review.
- Owner-level matters remain subject to `OWNER_CONTROL.md`.

## Current implementation

- The HQ return intake watches formal Cursor and Local Codex task results and meaningful state transitions.
- Cursor coding tasks use `[HQ-AUTHORIZED][CURSOR]`, `HQ-authorized for Cursor execution: YES`, and `READY_FOR_CURSOR`; HQ posts the exact `[CURSOR-DISPATCH]` wake comment only after every gate passes. The native Cursor Automation remains executor-side and independently re-verifies the Issue.
- Research correction task `HQ-RE-2026-09-05-002` is separately published when the current terminal-byte handoff is converted from input to executable work.
- The existing Local Codex task-publication protocol remains in force for Local Codex tasks.

## Cursor PR return channel — owner direction 2026-09-09

The owner verified automation PSI Cursor GitHub Dispatch (`ad9d4325-ab35-11f1-b532-320a589b8025`) in the Issue #61 run: event intake, shell, authenticated gh and repository reads work; GH_TOKEN is present; native actions expose PR creation (`open_git_pr`) but no Issue comment/update action. Higher-priority runtime instructions restrict gh to reads and prohibit gh/REST write fallback. This is a runtime capability constraint, not missing credentials, repository permissions or executor refusal. Never bypass that policy.

While native Issue-write actions are unavailable:
- Issues remain the sole task authority. HQ owns READY, IN_PROGRESS (when evidenced), BLOCKED, VERIFIED_FOR_HQ_REVIEW and ACCEPTED Issue-state reconciliation.
- Cursor re-verifies READY_FOR_CURSOR, authorization YES, both approvals NO, dependencies and scope after the wake-only [CURSOR-DISPATCH].
- Cursor returns work through the task's deterministic branch and linked PR, placing Task ID, Issue URL, starting SHA, amended exact head, changed files, validation commands/results and blockers in the PR/automation result. HQ inspects these formal results even if the Issue status is stale, links the evidence and reconciles it without inventing historical transitions.
- Missing native Issue mutation alone does not block bounded implementation with a working PR return channel. Cursor must never claim an Issue transition it could not perform.
- Before execution, search by Task ID, deterministic branch and linked PR. Reuse the existing task branch/PR; do not create duplicate work. A result awaiting HQ review or an active run prevents repeat execution. A correction requires an explicit new HQ readiness transition identifying the existing PR and reviewed head. If concurrent ownership cannot be established safely, return the conflict without editing.
- HQ publishes one dispatch per readiness transition and does not start overlapping implementation. Stale READY alone never authorizes replay of a completed run.
- If native Issue-write actions become available, verify their permitted use and record capability before switching return mode. Local Codex's existing Issue-write protocol is unchanged.
- Cursor remains prohibited from self-merging; HQ independently reviews, accepts and merges only under existing owner-control gates. No scientific, AP or product scope is expanded.

Sequence: HQ READY issue → dispatch → Cursor gate/idempotency checks → existing or deterministic task branch/PR → full execution result → HQ Issue reconciliation/review/acceptance → next bounded action.
