## Context
<!-- What was the problem? If a bug, include reproduction steps and error messages. If a rule, describe the review feedback received. -->

## Changes
<!-- What changed and how? Keep to 1 PR = 1 objective. -->

## Verification
- [ ] `python3 -m unittest discover -s tests` passes
- [ ] If adding a design rule or automated check: added test cases failing on the unfixed version and passing on the fixed version (if unmeasurable, stated rationale)
- [ ] If modifying procedures or workflows: synchronized SKILL.md, README.md, and slide-rules.md
- [ ] Verified that client names, deal codes, financial amounts, employee names, internal URLs, actual deck files, and skin.json are not included in diffs, commit messages, or PR descriptions (CONTRIBUTING "What NOT to Include" #1)
- [ ] Verified that single-organization preferences, proprietary brand rules, or unexplainable rules are not placed upstream (kept in `local/` if organization-specific; CONTRIBUTING #2)
- [ ] If altering default behavior: formulated rule with default, exception conditions, and boundaries to maintain during exceptions
- [ ] If visual changes were made: documented visual QA results (PDF / renders) below

## Related
<!-- Related Issues or PRs. If stacked on another PR, cite its number. -->
