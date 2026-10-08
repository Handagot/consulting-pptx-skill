# local/ — Directory for Organization-Specific Rules and Templates (Untracked in Git)

Everything in this folder except `local/README.md` is ignored by git (`.gitignore`). When updating upstream via `git pull`, files placed here will never be overwritten.

| File | Purpose | How It Is Used |
|---|---|---|
| `slide-rules.local.md` | Organization-specific rules (extensions and overrides to `references/slide-rules.md`) | The skill reads core rules first, then loads this file. Overlapping rules take precedence from here. |
| `forbid.txt` | Confidential terms that must never appear externally (client names, deal codes, etc.; 1 term per line, `re:` for regex) | `python3 scripts/check_deck.py deck.html --forbid local/forbid.txt` |
| `templates/` | Custom component libraries, skins, destination house decks (`.pptx` / `.potx`), and `skin.json` | Used in place of or in addition to core `templates/` |
| `examples/` | Reference decks created within your organization | Blueprints when authoring similar presentations |

## Writing Guidelines

- Format `slide-rules.local.md` in the same structure as the core rules (use prefixes like `L1`, `L2`, ... for section numbers to avoid collisions with core numbering). Adding a 1-line "why" rationale ensures future readers (and AI agents) understand the boundary.
- For rules that intentionally conflict with core rules, reference the conflicting core section number (e.g., "Instead of §7.3, our company uses standard square bullets for level 1").
- **Do not hoard generalizable rules here; contribute them upstream via Pull Request** (see `CONTRIBUTING.md`). Keep only rules containing client names, deal-specific values, or company-proprietary policies in `local/`.
