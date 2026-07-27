# Contributing to sorowill-app

This repo participates in the **Stellar Wave Program** on [Drips](https://drips.network/wave). Contribution work is tied to issues that maintainers tag for an active Wave, and contributors earn rewards proportional to the Points assigned to the issues they resolve.

## Ground rules

- **Do not start work on any issue until you have been assigned by the maintainer.** Applying to an issue does not mean you're assigned — wait for confirmation (via the Drips Wave dashboard or a direct assignment on GitHub) before opening a PR.
- Keep PRs scoped to the issue they resolve. Unrelated changes slow down review and can cost you the Wave window.
- Be responsive during an active Wave — issues must be resolved before the Wave ends for Points to be awarded.

## Branch naming

Use the issue number in your branch name:

```
feat/N-short-description
fix/N-short-description
```

## Pull requests

- Your PR description must reference the issue it resolves (e.g. `Closes #7`).
- Make sure `npm run typecheck`, `npm run lint`, and `npm run build` all pass cleanly before requesting review.
- Test the affected page in a real browser with Freighter installed where the change touches wallet or transaction flows.
- Keep the dark purple theme (`will-purple`, `will-dark`, `will-light`) consistent with the rest of the app.

## Dependency security

CI runs `npm audit --audit-level=high` on every PR and push to `main`. If a high- or critical-severity advisory is flagged:

1. Check the advisory URL in the CI log to understand the vulnerability.
2. If a compatible fix is available, run `npm audit fix` to apply patches automatically.
3. If `npm audit fix` cannot resolve the advisory (e.g. the fix requires a semver-major bump), evaluate whether the affected package can be upgraded manually. Document any required code changes in the PR.
4. If no fix is available or the upgrade is infeasible, file an issue describing the advisory and the reason it cannot be resolved immediately. The team may suppress the advisory temporarily with `npm audit --audit-level=critical` until a fix lands upstream — but this must be approved by a maintainer.

## Storybook

This project uses [Storybook](https://storybook.js.org/) for isolated component development. To run it locally:

```bash
npm run storybook
```

Stories live alongside their components under `src/components/` and cover meaningful states (default, empty, loading, error, etc.). When adding or modifying a component in `src/components/`, include a corresponding story.

## Local setup

See the [README](./README.md#local-setup) for installation and environment configuration.

## Learn more

Full details on how Wave Programs work — applying, Points, rewards, and payouts — are documented at <https://drips.network/wave>.
