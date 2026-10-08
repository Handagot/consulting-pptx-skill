#!/usr/bin/env python3
"""Example: Build a 2-page insert directly on the master of an existing presentation (slide-rules §8.7). Content is illustrative.

  python3 examples/house_deck_example.py house.pptx pages.pptx    # Using house.pptx as base; measures formatting on the fly
  python3 examples/house_deck_example.py                         # Standalone test using blank template

After building: python3 scripts/check_deck.py pages.pptx --house house.skin.json → Visual verification (slide-rules §8).
Positions are in inches. Height is estimated as "lines × (pt × 1.2 ÷ 72)", leaving 1-2 lines of breathing room.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
from deck_pptx import Deck, P  # noqa: E402


def table_page(d):
    """Table with rows=stages and cols=perspectives. Highlights right column with panel and numbers row headers."""
    s = d.slide("Expense reimbursement wait times are longest in the approval step")
    y = d.top + 0.1
    w = d.x1 - d.x0
    cols = [w * 0.24, w * 0.36, w * 0.40]   # Print width varies across decks; calculate column widths by proportions
    rh = min(1.1, (d.bottom - y - 0.5) / 4)
    rows_data = [
        ("Submission", ["Applicant photographs receipt", "Manually inputs account and amount"], "AI extracts receipt details;\napplicant verifies amount"),
        ("Approval", ["Manager manually reviews all entries", "Rejections communicated via email"], "Standard requests approved automatically;\nmanager handles exceptions only"),
        ("Payment", ["Accounting batches at month-end", "Manually prepares transfer data"], "Accounting finalizes payments\non the next business day after approval"),
        ("Archiving", ["Departments store paper receipts", "Staff locate files during each audit"], "Stored electronically;\naudits verified via search"),
    ]
    d.panel(s, d.x0 + cols[0] + cols[1] - 0.15, y - 0.08, cols[2] + 0.2, 0.35 + rh * len(rows_data) + 0.12)
    rows = [[None, d.bullets(now), P(after)] for _, now, after in rows_data]
    t = d.table(s, d.x0, y, cols, ["Stage", "Current State", "Target State"], rows, [rh] * len(rows), x1=d.x1)
    for i, ((name, _, _), ry) in enumerate(zip(rows_data, t["ys"])):
        d.num_circle(s, d.x0, ry + (rh - 0.31) / 2, i + 1)
        d.text(s, d.x0 + 0.45, ry, cols[0] - 0.6, rh, P(name, b=True), anchor="m")
    return s


def steps_page(d):
    """Chevron sequence with step explanations beneath. Highlights comparison items with semantic marks."""
    s = d.slide("Pilot begins in 1 department for 2 months, expanding company-wide after validating impact")
    y = d.top + 0.1
    steps = [("Preparation", "Month 1"), ("Pilot", "Months 2-3"), ("Company Rollout", "Month 4+")]
    segs = d.chevrons(s, d.x0, y, d.x1 - d.x0, 0.62,
                      [P([(a, {}), ("\n" + b, dict(sz=d.sz_dense, b=False))], b=True, c="bg1") for a, b in steps],
                      pad_left=0.3)
    notes = [
        ["Convert regulations to machine-readable rules", "Determine target department and approvers"],
        ["Process sales department requests with new workflow", "Review rejection volume and reasons weekly"],
        ["Report pilot metrics to executive committee", "Establish launch dates for each department"],
    ]
    for (sx, sw), items in zip(segs, notes):
        d.text(s, sx + 0.1, y + 0.8, sw - 0.3, 1.3, d.bullets(items))
    yy = y + 2.4
    d.head(s, d.x0, yy, (d.x1 - d.x0) / 2, "Criteria for advancing to company-wide rollout")
    d.rule(s, yy + 0.41, heavy=True)
    checks = [("ok", "Average days to approval decreases by more than half compared to pre-pilot baseline"),
              ("ok", "Rejection rate does not increase compared to pre-pilot baseline"),
              ("ng", "Non-compliant request passes automatically (halt immediately if even 1 occurs)")]
    t = d.table(s, d.x0, yy + 0.46, [d.x1 - d.x0], None, [[None] for _ in checks], [0.42] * len(checks), x1=d.x1)
    for (mk, label), ry in zip(checks, t["ys"]):
        d.mark(s, mk, d.x0 + 0.04, ry + 0.11)
        d.text(s, d.x0 + 0.4, ry, d.x1 - d.x0 - 0.5, 0.42, P(label), anchor="m")
    return s


def build(template=None, out="pages.pptx", skin=None):
    d = Deck(template, skin)
    table_page(d)
    steps_page(d)
    d.save(out)
    return d


if __name__ == "__main__":
    a = sys.argv[1:]
    build(a[0] if len(a) > 1 else None, a[-1] if a else "pages.pptx")
    print("saved", a[-1] if a else "pages.pptx")
