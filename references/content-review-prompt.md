# Fresh-Eye Review Instructions (For an Independent Agent Without Prior Context)

This is the **mandatory final quality assurance step** conducted after achieving automated check FAIL 0, prior to final delivery. An independent agent with no prior knowledge of the project reviews the deck to catch **blind spots invisible to the author**—awkward phrasing, logical disconnects, discrepancies between titles and visuals, unsubstantiated evaluative claims, and repeated content rehashed from earlier slides.

## How to Use

1. **Provide the deck file directly** (path to HTML, PDF, or PPTX; no image rendering needed). The review agent reads the file directly using read tools. It can inspect HTML source or extract text from PDF/PPTX for body copy, titles, and tables. Only if full visual canvas evaluation (margins, overlap, overflow) is needed, optionally provide page images via `pdftoppm -png -r 60 deck.pdf pages/p`.
2. Hand the prompt below to a separate agent (e.g., Claude Code Agent tool or a new session), **without disclosing how the deck was built, what skills were used, or what trade-offs were made**. Replace `{FILE}` and `{N}`.
2b. **Run in parallel with an alternative model family (Recommended).** Pass the same prompt to an alternative LLM CLI (e.g., Codex CLI). Extract text and pass page images:
   ```bash
   pdftotext -layout deck.pdf deck.txt && pdftoppm -r 55 -jpeg deck.pdf p
   bash -c 'a=(); for f in p-*.jpg; do a+=(--image "$f"); done; codex exec --skip-git-repo-check -s read-only "${a[@]}" -o review.md - < prompt.md'
   ```
   Modify the target in the prompt to reference `deck.txt` and attached images. Pass images as an array argument. Pass the prompt via standard input. Prioritize feedback shared across both reviews, and evaluate one-off issues individually in the disposition table.
3. Compile the reviewer's findings into a **Disposition Table** (format below). Do not blindly accept every critique; categorize each item as "Accept", "Reject", or "Hold". Consult the client or stakeholder on ambiguous points that alter business meaning or structure.
4. Implement accepted fixes and re-run automated checks (`check_deck.py`). For rejected items, record a 1-line rationale ("Stylistic preference", "Self-evident to target audience", "Factually accurate as stated", etc.).
5. Attach the completed disposition table to the final delivery summary, providing transparency on what was flagged, what was fixed, and why certain feedback was left as-is.

### Disposition Table Format

| # | Page | Original Feedback | Category | Decision | Action Taken / Rationale |
|---|---|---|---|---|---|
| 1 | P. 7 | "Caught up with accuracy band" sounds awkward in past tense | Phrasing | Accept | Changed to "Matches industry accuracy benchmark" |
| 2 | P. 9 | Right-hand column does not follow logically from premise table | Logic | Accept | Changed right header to "Consequently: [Strategic Action]" |
| 3 | P. 3 | "Global players" is overly vague | Phrasing | Reject | Intentionally broad term; explicitly defined in glossary |

Categories: **Phrasing**, **Logic**, **Structural Failure (Counts / Visuals / Numbers)**, **Formatting**.

---

## Reviewer Prompt (Copy from Here)

You are an executive presentation reviewer. Review this {N}-slide presentation deck and identify **blind spots, logical flaws, and inconsistencies invisible to the author**. You are not told how this presentation was built, nor should you speculate.

### Review Target
File `{FILE}` (an {N}-slide deck in HTML, PDF, or PPTX). **Use your file reading tools to read the entire file from beginning to end, inspecting every page sequentially.** Do not make assumptions based on a partial read. If page images are provided, use them strictly to evaluate visual layout and spacing. Do not read other project files (rules, skills, templates). Score the document based on your own professional judgment.

### 1. Initial Freeform Critique (Before Applying Frameworks)
Before reviewing the specific checklist items below, write 3 to 10 immediate observations describing **what would most trouble, confuse, or dissatisfy you as an executive reader, or why you would push back on this deck if you were the decision-maker**. This section exists to surface holistic concerns not captured by structured checklists (e.g., uneven comparison baselines, misaligned industry definitions, missing computational formulas).

### 2. Foundational Review (Phrasing and Logic — Report with Page Numbers)
- **Language and Phrasing**: Identify any expressions that disrupt executive reading flow. Flag mismatched tenses, colloquialisms ("cost-effective", "game changer"), compressed jargon lacking clear subjects/verbs ("manual creation", "accuracy boosting"), unaligned bullet endings within the same hierarchy level, dense run-on noun phrases, undefined acronyms, or terminology drifting between pages. **Even if the core thesis is sound, flag any awkward or artificial phrasing.**
- **Narrative Logic**: Read through the slide titles sequentially from top to bottom. Flag any instance where the storyline leaps unexpectedly, backtracks, repeats itself, or reaches conclusions without establishing premises. Within each slide, verify whether the relationship flows clearly from left (premise / evidence) to right (implication / conclusion), whether right-hand headers derive naturally from left-hand facts, and whether comparison baselines (what is being compared against what) are explicit.

### 3. Critical Structural Failures (Report with Page Numbers)
1. **Title Count vs. Body Count Mismatches**: e.g., A title announcing "A 3-stage transition" paired with 4 chevrons, or "4 strategic pillars" paired with 3 cards.
2. **Title vs. Visual Conclusion Conflicts**: e.g., A title qualifying or denying an outcome, while the diagram or conclusion box on that same slide declares it unconditionally.
3. **Unsubstantiated Evaluative Buzzwords**: Words like "limited", "sufficient", "seamless", or "negligible" used without supporting data or thresholds on that slide.
4. **Rehashed Content**: Later slides repeating earlier points almost verbatim without introducing a new perspective or layer of analysis.
5. **Drift Between Overview and Body**: Discrepancies between the chapters, agenda items, or issue counts promised in the overview and the actual content delivered in the deck.
6. **Numerical Inconsistencies**: The same metric showing conflicting figures across slides, subtotals failing to add up, or units and time horizons shifting without explanation.
7. **Missing Sources and Attributions**: Missing source lines on slides containing empirical metrics, or absent disclaimers where estimates and sample values are used.
8. **Inconsistent Phrasing Across Slides**: The same core conclusion, initiative, or definition expressed in varying terms across slides, creating the impression of separate concepts. Pay special attention to discrepancies between the executive summary and the body.
9. **Misuse of Domain Terminology**: Industry, legal, academic, or technical terms used outside their standard accepted scope or definitions. Flag suspicious terms along with the correct definition and reference source.

### 4. Evaluation Rubric (10 Points Each, 70 Points Total)
1. **Storyline Narrative**: Does reading only the titles sequentially form a compelling, airtight executive narrative?
2. **One Message per Slide**: Is each slide focused on a single clear takeaway, without overcrowding or fluff?
3. **Information Architecture**: Are comparisons, causal relationships, and breakdowns visualized using the right structural format (tables, flows, charts, 2-column layouts) rather than dense walls of text?
4. **Layout Quality**: Spacing balance, alignment of elements, font hierarchy, absence of overflows or awkward line wraps.
5. **Executive Persuasiveness**: Does the deck provide the exact clarity and evidence needed for a decision-maker to decide, debate, or act?
6. **Deck Consistency**: Are terminology, styling conventions, and labeling formats strictly consistent across all slides?
7. **Intellectual Honesty**: Are data sources, estimation assumptions, and scope limitations stated transparently without misleading the reader?

### 5. Output Format
- Initial freeform critique (page number, quote, problem identified).
- Language & phrasing / narrative logic issues: List with **Page Number**, **Exact Quote**, **What Is Wrong**, and **Recommended Revision** (be thorough; 10+ items is completely acceptable).
- Critical structural failures (items 1–9): List with **Page Number**, **Exact Quote**, and **Nature of Discrepancy** (mark "None identified" for clean categories).
- Rubric scores per axis (1–10) with 1–2 sentences explaining the rationale for each score.
- Total score (out of 70).
- **Prioritized Action List**: Top 5 critical fixes ranked by importance, with 1–2 sentences describing exactly how to fix each item.

Be candid and rigorous. Identify at least 3 actionable defects. No presentation deck is completely flawless.
