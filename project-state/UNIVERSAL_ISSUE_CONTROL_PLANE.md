# Universal GitHub Issue Control Plane

**Effective date:** 2026-09-05  
**Repository:** `aakas7125/PLANETARY-SELF-INQUIRY`  
**Authority:** Project HQ under `OWNER_CONTROL.md`

## Purpose

GitHub Issues are the durable task and communication control plane for Project HQ, Research & Evidence, AP Framework & Corpus, and Local Codex.

Chats remain reasoning and execution surfaces. Once a formal Issue exists, chat prose is not executable authority and is not required for inter-workstream communication.

The durable loop is:

`HQ → GitHub Issue → target workstream → GitHub result/status → HQ or next workstream`

## Issue classes

### Executable task

An executable task authorizes bounded work for a named workstream. It must contain a unique task ID, target workstream, explicit authorization, scope, relevant files/contracts, dependencies, acceptance criteria, required branch/PR/direct-main behavior, current status, and approval fields.

Executable titles use:

- `[HQ-AUTHORIZED][LOCAL-CODEX] ...`
- `[HQ-AUTHORIZED][RESEARCH] ...`
- `[HQ-AUTHORIZED][AP] ...`

Executable states include:

`READY_FOR_LOCAL_CODEX`, `READY_FOR_RESEARCH`, `READY_FOR_AP`, `READY_FOR_HQ_REVIEW`, `IN_PROGRESS`, `BLOCKED`, `VERIFIED_FOR_HQ_REVIEW`, `RESOLVED`, and `SUPERSEDED`.

A workstream seeing a valid `READY_FOR_*` task must begin the bounded work, update the Issue to `IN_PROGRESS`, and not expand scope.

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

For a valid executable task, verify the gates, set `IN_PROGRESS`, execute only the bounded scope, record work/checks/discrepancies, and finish as `VERIFIED_FOR_HQ_REVIEW`, `BLOCKED`, `RESOLVED`, or `SUPERSEDED` as applicable.

For a handoff, inspect the referenced information, acknowledge or consume it, update its receiving state, and route any newly needed work to HQ. Do not infer execution authority from receipt.

## HQ reaction

When HQ finds a meaningful `VERIFIED_FOR_HQ_REVIEW` or `BLOCKED` result, prerequisite completion, cross-domain discrepancy, or handoff requiring routing, HQ must inspect the repository-backed evidence and complete the appropriate governance action in the same work chunk where possible:

1. publish/authorize the next bounded Local Codex task;
2. publish an executable Research/AP task or appropriate handoff; or
3. record the exact genuine blocker and request only the necessary owner intervention.

Routine receiving-state updates, governance records, task publication, acceptance/rejection, and push authorization should be completed in the same work chunk when their conditions are already satisfied. No artificial work should be created.

## Automation

During active migration/integration, the highest supported safe polling cadence is hourly for HQ, Research, AP, and Local Codex intake. If no relevant Issue state has changed, do nothing and generate no notification.

A scheduled task attached to HQ is not equivalent to an executor-side schedule attached to the actual Research, AP, or Local Codex environment. Each executor must attach its intake to the environment that can perform its authorized work. HQ monitoring/dispatch must remain separate from executor intake.

Cadence may later be reduced or made event/session-driven once migration stabilizes. Unsupported sub-hour polling must not be simulated.

## Authority boundaries

- GitHub Issue publication is durable routing, not automatic acceptance.
- `main` remains accepted/integrated project state.
- Research and AP may publish bounded domain packages, proposals, tests, and handoffs but may not independently promote integrated contracts.
- Local Codex may execute only explicit `[HQ-AUTHORIZED][LOCAL-CODEX]` tasks and must follow their branch/PR/direct-main constraints.
- HQ must not accept or promote scientific, AP, product, or semantic changes without the required review.
- Owner-level matters remain subject to `OWNER_CONTROL.md`.

## Current implementation

- The HQ return intake watches formal Local Codex task results and meaningful state transitions.
- Research correction task `HQ-RE-2026-09-05-002` is separately published when the current terminal-byte handoff is converted from input to executable work.
- The existing Local Codex task-publication protocol remains in force for Local Codex tasks.
