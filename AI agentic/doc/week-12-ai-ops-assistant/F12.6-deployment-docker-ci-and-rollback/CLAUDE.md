# W12-F12.6 — Deployment: Docker, CI/CD, Secrets, Rollback

> [Week 12](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `infra/` — **resolves [ADR-013](../../../TECH-STACK-DECISIONS.md), deferred since Week 1**
**Depends on:** [W11-F11.9](../../week-11-evals-security-observability/F11.9-load-and-capacity-testing/CLAUDE.md)
**Consumed by:** every service

## Goal

Three deployable processes exist — `api`, `agent-runner`, `mcp-server` — and `Dockerfile` was
name-dropped in seven feature files while **owned by none**. Twelve weeks of production-readiness
work that never ships is not production readiness.

The hard part is not the Dockerfile. It is that **rolling back an AI system is not just rolling
back code**: prompt versions, eval baselines, graph versions and checkpoint schemas all move
together, and a partial rollback is worse than none.

## Contract (schema first)

```python
class ServiceSpec(BaseModel):
    name: Literal["api","agent-runner","mcp-server"]
    dockerfile: str
    health_path: str | None           # api only
    ready_path: str | None
    replicas: int
    graceful_shutdown_s: float = 90.0 # ⚠ must exceed the longest in-flight agent iteration
    env_secrets: list[str]            # NAMES only — values come from the secret store

class ReleaseManifest(BaseModel):
    """A release is code + prompts + graphs + baselines. They roll back TOGETHER."""
    version: str
    git_sha: str
    prompt_versions: dict[str, str]   # W3-F3.1
    graph_versions: dict[str, str]    # W8-F8.1
    eval_baseline_ref: str            # W11-F11.3
    model_tiers: dict[str, str]       # W1-F1.1
    migrations_applied: list[str]     # W5-F5.3 alembic revisions

class RollbackPlan(BaseModel):
    to_version: str
    reversible_migrations: bool       # false ⇒ code-only rollback; the DB stays forward
    paused_runs_action: Literal["drain","resume_on_old","fail"]
    checkpoint_compat: bool           # W8-F8.2 refuses cross-version resume
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `services/*/Dockerfile` | NEW | multi-stage, non-root, pinned base digests |
| `infra/docker-compose.yml` | EDIT | full local stack: 3 services + postgres + redis |
| `infra/ci/build.yml` | NEW | lint → test → eval gate → build → scan → push |
| `infra/ci/deploy.yml` | NEW | migrate → deploy → smoke → auto-rollback on failure |
| `infra/release/manifest.py` | NEW | generate + verify `ReleaseManifest` |
| `infra/README.md` | NEW | runbook: deploy, roll back, rotate a secret |

## Flow

```
PR                                    MAIN
lint · unit · contract                build images (digest-pinned)
eval gate (W11-F11.3)                 vulnerability scan
                                      generate ReleaseManifest
                                            ▼
                                      alembic upgrade head      ← BEFORE the new code
                                            ▼
                                      deploy api → smoke test /ready
                                      deploy agent-runner (drain old workers gracefully)
                                      deploy mcp-server
                                            ▼
                                      smoke: one real w04 plan + one w06 ask
                                      fail ──► AUTO ROLLBACK to the previous manifest
                                            ▼
                                      nightly: load test (W11-F11.9) vs baseline
```

## Rules

- **A release is a manifest, not a commit.** Code at `v1.4` with prompts from `v1.3` is a
  configuration nobody tested. Rolling back must restore prompts, graph versions, model tiers and
  the eval baseline together, or the rollback is itself an untested state.
- **Migrations run before code, and must be backward-compatible for one version.** During a rolling
  deploy both versions run simultaneously; a migration the old code cannot read takes production
  down mid-deploy.
- **Graceful shutdown must exceed the longest agent iteration.** A `SIGTERM` with a 30s grace period
  kills in-flight W7 runs mid-iteration. They resume from Redis (F7.2), but only if the worker was
  allowed to checkpoint first.
- **Paused runs are a deployment concern.** W8 runs awaiting approval may span a deploy; the
  rollback plan must state explicitly whether they drain, resume on the old version, or fail — and
  `checkpoint_compat` (W8-F8.2) decides which is even possible.
- **Secrets by name, never by value.** `env_secrets` lists names; values come from the platform
  secret store. Rotation is documented in the runbook and tested — an untested rotation procedure
  is discovered during an incident.
- **The eval gate blocks the build, not the deploy.** Discovering a quality regression after images
  are pushed is discovering it too late.
- **Images are non-root with pinned base digests.** `FROM python:3.11` is a moving target that
  changes your runtime without a commit.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Smoke test fails after deploy | Automatic rollback to the previous manifest |
| Migration is not backward compatible | Caught by a compatibility check pre-deploy |
| Worker killed mid-run | Graceful drain; run resumes from Redis after deploy |
| Rollback with a forward-only migration | `reversible_migrations=false` → code-only rollback, stated |
| Paused approval spans a deploy | Handled per `paused_runs_action`; never silently dropped |
| Prompt rolled back but code was not | Manifest verification fails at startup |
| Secret rotated mid-deploy | Both values valid during the window; documented and tested |
| Base image CVE | Scan blocks the push |

## Tests

- `test_release_manifest_mismatch_fails_at_startup` ← the partial-rollback guard
- `test_migrations_are_backward_compatible_for_one_version`
- `test_graceful_shutdown_exceeds_the_longest_iteration`
- `test_smoke_failure_triggers_automatic_rollback`
- `test_paused_runs_survive_a_deploy`
- `test_images_run_as_non_root_with_pinned_digests`
- `test_secret_rotation_procedure_end_to_end`

## Acceptance criteria

- [ ] `docker compose up` brings the entire stack up locally, first try
- [ ] [ADR-013](../../../TECH-STACK-DECISIONS.md) moves from ⏸ **Deferred** to ✅ **Accepted**
- [ ] A release rolls back code, prompts, graphs and baselines as one unit
- [ ] A failed smoke test rolls back automatically
- [ ] In-flight agent runs and paused approvals both survive a deploy
- [ ] Secret rotation is documented **and** tested
