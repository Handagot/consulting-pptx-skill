# Canonical Slide Design Rules (Unified HTML / PPTX, Brand-Agnostic)

In the event of any contradiction with other documentation, this file takes precedence.

> **Reading Order**: §0 Before Starting → §1 Canvas → §2 Titles → §3 Subtitle Prohibition → §4 Layout Structure (index by topic at top) → §5 Colors, Lines & Visuals → §6 Tables → §7 Writing & Phrasing (3 causes of AI smell at top) → §8 Automated Checks → §8.6 When Converting to PPTX → §8.7 Inserting Pages into Existing Decks → §9 Pitch Decks (Stage Presentations Only). Section numbers are cross-referenced by `check_deck.py` and other documentation; **never renumber existing sections; append new rules to the end**.
>
> Rather than drafting new visual components from scratch, reuse components from the template libraries (`templates/`) that adhere to these rules, and always pass automated checks (§8) before delivery.
>
> **Rule Strength**: Among rules phrased as "do not...", those where the ideal choice depends on deck type or audience specify explicit conditions for application and exceptions (e.g., §4.47 source line placement, §4.33 kickers, §4.26 vertical steps). Outside those conditions, client instructions and existing house deck styles (§8.7) take precedence. Rules without conditional clauses apply universally to all presentations.
>
> **Terminology and Units Used in this Rulebook**
> - **Kicker / Top-Right Tag Chip**: A small label placed at the top-right of a slide indicating the current topic, chapter, or issue number (`.kicker` in the additional component library). Titles must not rely on kickers; state the core takeaway in the title itself (§2.12).
> - **rows / `.rh`**: The row list component in the base library (`<div class="rows">`, row header `.rh` + description pairs). While not a `<table>`, it is treated identically to tables under these rules (§4.21, §6).
> - **Axis Title (`.axh`)**: A single line placed directly above a chart or table indicating "Data Content + Unit / Time Horizon". Features a full-width thick underline (the sole exception to §3; see archetypes 11, 17, etc.).
> - **Chevron**: Arrow-shaped blocks arrayed horizontally to show stages or processes. **Harvey Ball**: Circular rating glyphs (○ ◐ ●) indicating degree of completion or satisfaction. **Stat Box**: A callout card featuring one large number and a concise label.
> - **Canvas / Live Area**: The usable body region between the slide title and the source line. **Orphan / Trailing Word**: A typographic flaw where a line wrap leaves only a few characters stranded on the final line.
> - **Units**: Specify typography in `pt`, and borders, corner radii, and padding in `px` or `mm`. The `check_deck.py` table header/cell check reads `px` specifications (fails if `th` font size is less than `td + 2px`).

---

## 0. Before Starting (Define-before-Produce)

**Standard Workflow (Never jump straight into visual archetypes without steps 1 and 2):**
1. **Storyline Design**: Deconstruct the problem using an issue tree, then draft and align on a storyline (a sequence of 1-line takeaways that will become slide titles). Each line must represent not only assertions, but shared premises, empirical facts, or core questions. Reading the sequence from top to bottom must form a cohesive executive speech. Slide counts and visual archetypes are determined only after this step.
2. **Archetype Selection**: Select visual layouts that best substantiate each takeaway from the archetype catalog (`references/archetype-catalog.md`). If no archetype fits naturally, assemble custom layouts freely.
3. **Fact and Format Verification**: Reconcile numbers, dates, and proper nouns against primary sources (verify unfavorable facts by inspecting primary source records directly; document measurement conditions for benchmarks). Format validation requires `check_deck.py` FAIL 0 plus visual PDF inspection of all pages (checking for overlaps, overflow, orphaned words, and bottom alignment).
4. **AI Habit Pruning**: Conduct a self-check against `references/ai-smell-lexicon.md` (flagging AI-specific jargon, passive voice, and mechanical symmetry) and eliminate all AI smell warnings from `check_deck.py`.
5. **Fresh-Eye Review**: Hand the deck file to an independent agent with no prior context to catch phrasing defects, logical leaps, and contradictions; compile a disposition table and implement accepted fixes (§8; omit only when "speed-first" mode was explicitly agreed upon).

- Read domain knowledge files and primary documentation before drafting. Never invent or speculate.
- Explicitly state the objective, deliverable definition, and in-scope / out-of-scope boundaries in 3–5 lines before producing slides (except for trivial tasks).
- Substance > Appearance. If the content is thin, state candidly that it is thin.
- **Clarify the background and expectation upfront.** Explicitly establish who requested the document, for what meeting, and whether the deliverable is an exploratory draft or a polished executive submission.
- **Agree on the textual narrative before drawing diagrams.** Present the storyline (sequence of slide titles) alongside four items per page: Title, Conclusion, Body Content, and Visual Approach. Agree in text before constructing slides. Do not mistake a high-level outline for a spoken transcript. When the user provides a slide structure or sequence of titles upfront, use it as-is without rearranging, as described in the next point.
- **If a slide outline is provided upfront, use it directly as the sequence of titles.** When the user specifies a page-by-page breakdown (what to state on each slide), that breakdown constitutes the storyline (§0-1). Reordering, merging, or splitting slides is permitted only when narrative logic is fundamentally broken (e.g., premises appear after conclusions, or the same point is stated twice); even then, confirm with a 1-line rationale before reorganizing. Never alter slide order merely because another sequence feels "prettier".
- **Write down the explicit objective of every page in one line; cut any page where this cannot be stated.** An objective must be either "what this page communicates" or "what decision or feedback is requested from the audience on this page". Exclude title pages, dividers, and back covers. If uncertain about keeping a slide, ask the stakeholder directly rather than relegating it to the appendix: "This slide exists to address [X]; is it needed?"
- **For recurring materials (weekly syncs, monthly reports, continuation decks for the same client), use the previous finalized version as your baseline and update only changed elements.**
  - Baseline only against the final version delivered to the client. Never build on draft versions (formatting defects in drafts will multiply). If the latest meeting lacks a final version, trace back to the most recent finalized deck. If none exists, ask the stakeholder before picking a baseline.
  - Inherit visual styling (archetypes, color scheme, slide sequencing). Do not blindly inherit previous wording, figures, or agenda items. Update numbers and progress directly from primary sources (minutes, chats, emails, live databases). Retain previous wording only when an item has genuinely seen zero change and that stability has been verified.
  - Agendas should reflect the current meeting's needs. Maintaining stylistic consistency is distinct from freezing content.
- **Demonstrate a single pilot slide before mass production.** When building a deck containing 5 or more slides of the same archetype, finish and confirm one representative slide before rolling it out across the rest. Expanding before confirmation replicates identical defects across every page.
- **Distinguish researched volume from presented volume.** Omit operational trivia that does not influence executive decisions (investigative detours, tangential questions, setup timelines). However, evidence emphasized by the client (pilot approvals, live deployment track records) must be given dedicated slides rather than buried in bullet points.
- **For meeting decks, establish context upfront: "Prior Discussions → Today's Core Agenda".** When time has elapsed since the last sync, present a baseline status confirmation before advancing proposals.
- **Stay strictly within the agreed scope.** Do not tack on unsolicited use cases or pose questions that exceed the counterpart's operational role. Regular sync decks must maintain an attitude of "reporting progress and seeking guidance", avoiding premature scope-expansion pitches.
- **Proposals, contractual deliverables, and client-circulated materials must undergo review by an experienced human practitioner before submission** (§8 checklist final row).
- **If the strategic background is unknown, do not build a presentation deck.** Until you know who the audience is, what meeting they are attending, and what decision they need to make, **deliver a 1-page issue outline or plain text document**. Adding slides prematurely only multiplies artificial tone and errors. Quality on a single page outweighs mass production.

---

## 1. Canvas Dimensions

| Property | Value |
|---|---|
| Aspect Ratio | **Always 16:9**. Never use A4 landscape (297×210 mm). Exception: Brand skins designed to reproduce a client's legacy A4 format take precedence (size failure warnings in `check_deck.py` may be ignored in that scenario). |
| PPTX Dimensions | 13.333 × 7.5 inches (12,192,000 × 6,858,000 EMU) |
| HTML Dimensions | `.slide { width: 338.67mm; height: 190.5mm; }` + `@page { size: 338.67mm 190.5mm; margin: 0; }` |
| PDF Export | Headless print margins must match `@page` above. Physical PDF page count = slide count (including section dividers). Printed page numbers exclude dividers per §4.45. |
| Typography | Follow client/brand guidelines (maximum 2 font families: one heading serif/sans, one body sans). Never mix font families within the same deck. |
| Palette | Unify around brand palette tokens. Never introduce colors outside the palette family. Neutral grays are permitted for third-party or baseline data. Use default `:root` tokens if no brand is specified. |

A **brand skin** encapsulates colors, fonts, and dimensions tailored to a specific brand. Do not modify core rules; customize tokens in the `:root` block at the top of the `<style>` block in both template files.

---

## 2. Titles (Message Lines)

1. **State the conclusion directly in the title. Default to 1 line; use 2 lines when the message warrants it.** HTML (`h1` at 22pt) targets approximately 40 full-width characters per line (approx. 70–80 English characters). Converted PPTX files (§8.6) match these dimensions. When inserting slides into house decks (§8.7), respect the house title box dimensions. **Conditions for 2-line titles**: Break explicitly at natural semantic boundaries; never leave stranded 1–2 word orphan lines; do not use `text-wrap: balance` on `h1` (it forces single-line headers into equal 2-line splits); **never shrink font size below body size to squeeze text onto 1 line** (use 2 lines instead); account for reduced canvas height when a title spans 2 lines by verifying the gap below the title and bottom margins.
   - `nowrap` combined with `overflow: hidden` silently truncates text. Verify that the right edge of every title stays within margins.
2. **Write in declarative, direct statements. Never end titles with polite conversational fluff.** Use complete sentences with clear subjects and predicates. Noun-phrase titles are permitted but not required (bullet ending parallelism is governed by §7.4).
   - **Exception: Slides requesting client feedback, approvals, or answers may end with clear, polite interrogative or request phrasing.** Apply this only when: (a) The page's purpose is for the reader to make a decision, respond, or take action (confirmation items, consultations, interview topics, requests); (b) The reader is the immediate decision-maker; (c) Declarative phrasing would sound like an aggressive command. Formulate as a single question or request sentence (e.g., "Please confirm preferred approach for [X]").
   - Declarative assertion, fact, and progress report pages must remain in direct statement style.
   - Align stylistic tone across assertion pages within the same section.
   - If client brand guidelines dictate specific sentence endings, follow them. When in doubt, use direct declarative statements.
3. **Write natural, autonomous sentences.** Do not compress titles into artificial slogan shorthand. Never omit grammatical subjects or core targets. Avoid referential pronouns ("this", "that", "as shown above") that require reading other slides. **The test: If a title is extracted in isolation, can a first-time executive understand its full meaning?** Never drop subjects or key nouns to fit 1 line; expand to 2 lines instead (§2.1). Titles that make sense only after reading body copy will be rejected.
4. **Focus on substantive content rather than pure item counts.** Name actual initiatives instead of writing "5 Types of Agents".
   - **Do not put pure item counts in titles.** AI models routinely assume that putting the count of items in the title satisfies message-driven design. However, counts provide value only when the number itself is the core takeaway (percentages, growth multiples, revenue figures). Phrases like "Standard Flow Has 5 Stages", "7 Critical Pieces Required", or "3 Reasons Why" are **not executive assertions**. Mention numbers in titles only when the metric is the actual message ("Price Gap Exceeds 8x", "62% Adoption", "Grew 2.9x in 4 Years"). When tempted to write a count, write the **underlying structure or conclusion** instead ("Standard Flow Has 5 Stages" → "Establish Storyline Before Archetypes, Concluding with Independent Fresh-Eye Review"). Section §2.9 governs numerical consistency when numbers are used; it does not encourage gratuitous counts.
5. **Never color-code title text** (do not use `<span class="ac">` in HTML, or split accent color runs in PPTX).
6. **Reading only the titles sequentially must form a complete, compelling storyline.** Print out all titles and read them aloud in sequence before delivery (`check_deck.py` prints this list).
7. Do not concatenate tags like "Step 1: " into the title string (use the top-right kicker chip instead).
8. **Write titles from your storyline (§0-1). Template sample titles are layout references, not text molds.** Never let template placeholder titles dictate your message.
   - Sample titles in component libraries merely illustrate the semantic density appropriate for that archetype. Do not copy their phrasing structure.
   - **A deck where all titles share the exact same grammatical pattern feels artificial.** If every title follows "X delivers Y by Z", you are copying a template formula rather than conveying nuanced points. Facts, questions, and premises naturally require diverse sentence structures.
   - Automated check: Retaining placeholders (`Text N`, `Label N`, `YYYY`) triggers a **FAIL**. Having over 60% of titles match the identical grammatical pattern triggers a **WARN**.
9. **When a number appears in the title, it must strictly match the items on that slide.** Writing "Migrate in 3 Phases" on a slide containing 4 chevrons is an immediate structural failure. Resolve either by aligning the number with reality or regrouping items. `check_deck.py` compares title numbers with body labels and triggers a FAIL on mismatch.
10. **Chart slides must include a clear "So What" takeaway. Never stop at presenting raw visual facts.** When a visual illustrates a fact ("Prices vary by over 8x across channels"), always accompany it with its strategic significance ("Distribution efficiency drives the entire margin delta"). Place the primary So What in the **title**. If the title states the empirical fact, the right-hand column header must serve as the assertive So What (§4.20).
11. **Do not assert claims stronger than your evidence supports. Keep claims conservative, especially concerning the client.** Claims like "Our client is the only player in this market with end-to-end capabilities" will be challenged if capabilities are still emerging. State defensible boundaries: "Currently, only our client and Competitor A have initiated deployment across both domains", anchoring claims to verifiable comparison tables (§4.42). Conversely, do not narrow evidence arbitrarily; match claim scope precisely to evidentiary scope.
12. **Do not prefix titles with topic labels (e.g., "Current State: [Message]").** AI models frequently format every slide as "Current State and Challenges: ...", "Governance: ...", or "Roadmap: ...". Prefixes turn titles into a table of contents. The topic belongs in the top-right kicker tag; the title must begin with the subject and state the takeaway. If a title has a label before a colon, delete the label and keep the assertion.
13. **In 2-line titles, insert line breaks at natural semantic boundaries; never leave 1–3 trailing orphan words.** Use explicit `<br>` breaks in HTML. `check_deck.py` warns on PPTX titles with 3 or fewer characters on the last line.
14. **Disambiguate relative terms ("external", "internal", "on-site", "we").** Phrases like "The moment implementation moves externally" are ambiguous (does external mean vendors to the client, or the client to us?). Name the actual actor: "The moment implementation is outsourced to vendors, internal operational iteration halts."
15. **When describing your own organization, stay modest and factual.** In pitches and executive decks, self-aggrandizing claims ("We possess world-class talent", "Our passionate mission is to...") undermine credibility. Keep concrete facts (deployment records, pilot results) in content panels, and keep titles restrained. State founding motivations once, concisely.
16. **Company profiles and section divider pages may use simple descriptive labels ("Company Overview", "About Us").** This is an exception to the assertion title rule (§2.1). Company overviews present basic facts rather than persuasive theses; forcing them into assertive statements results in self-praise that violates §2.15.
    - Descriptive labels are permitted only on: company profiles, section dividers, table of contents, executive summary (§2.20), and reference glossaries. **Appendix, comparison, and data slides must carry assertive titles.**
17. **In regular status reports, titles may follow the structure "[Subject] + Current Status".** Example: "SSO integration is paused pending client tenant configuration." This is a definitive statement of current reality, falling under §2.1. However, state conclusions or requests directly when: (a) Delays, risks, or decision points require executive intervention ("To recover SSO integration timeline, request narrowing testing scope to two pilot units"); (b) Multiple status items point to an overarching takeaway. Labels like "Status of [X]" or "Regarding [Y]" are prohibited even in status decks.
18. **Never begin titles with conversational transitions.** Starting with "First,", "Next,", "Furthermore,", "Moreover,", or "In addition," obscures the grammatical subject when titles are read in isolation (`check_deck.py` triggers a WARN). Phrases explicitly bridging content from preceding slides ("Building on the core foundation established in Phase 1, ...") are acceptable (§4.13).
19. **The title must state what this slide communicates to the reader, not echo the instruction you received.** If instructed to "Add discussion on security controls", do not title the slide "Adding Security Controls". Prompts are instructions to the author; titles are takeaways for the executive reader.
20. **Use the title "Executive Summary" exclusively on the executive summary slide.** The summary slide must be immediately recognizable. Do not title non-summary slides (e.g., system overviews, issue mappings) as "Summary".
21. **Never alter titles or wording previously confirmed by stakeholders without explicit approval.** Changing confirmed text during structural adjustments discards vetted decisions. If you recommend an enhancement, present a diff and seek confirmation.
22. **Frame headings in terms of business outcomes rather than operational activities.** Prefer "Maximizing Business Impact from AI Implementation" (outcome) over "How to Identify Target Workflows" (activity). If stating the outcome exceeds defensible evidence, §2.11 takes precedence.
23. **Calibrate claim certainty to evidentiary strength.**
    - Soften: When citing external benchmarks or historical comments, moderate phrasing ("actively engaged in" rather than "fully deployed"). Replace sweeping audit words ("100%", "zero", "never", "guaranteed") with explanations of the governance mechanism ("Every case is human-reviewed prior to submission").
    - Do not soften: Never label verified production deployments as "experimental" or "potential".
    - Metrics: For bold figures ("99% cost reduction"), present calculation formulas and baselines on the same slide. If estimates span a range, cite conservative figures. Never fabricate unsupported cost-savings calculations.
24. **Describe competitors and legacy solutions neutrally.** State objective operational boundaries ("Tool A manages X") rather than dismissive generalizations ("Tool A cannot do Y"). Establish your own stance via your title and summary line.

---

## 3. Subtitles and Label Rows (Strictly Prohibited)

- **Never place an explanatory subtitle or introductory text block directly beneath the slide title.**
- **Never place figure/table title bars (`figttl`, etc.) directly above tables or charts.** Do not place captions underneath images (except for 1-line software screenshot operational directions under conditions below). Identify data through the slide title or column headers.
- Linters check for legacy `.sub` classes or `subtitle()` calls (§8).
- **Never place rephrasing lines directly below in-slide headers.** Avoid adding small explanatory lines below card headers, row labels, or phase names that simply rephrase the header (§4.61). Concrete details containing metrics or proper nouns constitute real content and are permitted.
- **Image operational captions are permitted under one strict condition**: In manuals, workflow demos, or procedural walkthroughs where screenshots cannot convey which specific action is depicted (e.g., sequential similar screens, small UI buttons). Permitted content: a single operational instruction ("Click 'Execute' in top-right to display results in right pane"). Rephrasing image content, repeating the title, or expressing opinions ("offers intuitive operation") is prohibited. Place one left-aligned line directly below the image. If an explanation requires 2 or more lines, use archetype §4.76 ("Screenshots on Left, Steps on Right").
- **The Sole Exception: A Single "Axis Title" Line.** Indicating "Data Content + Unit / Time Horizon" (e.g., "Domestic Power Demand, GW, 2024–2030") **may appear directly above a chart/table accompanied by a full-width thick underline (1.8px)** (treated identically to §4.26 axis titles). What is prohibited is generic commentary placed directly below the slide title. Implemented using `.axh` in the base library (archetypes 11, 13, 17, 23; metric name left, units/dates separated in muted tone on right).

---

## 4. Layout Architecture

> **Index by Layout Topic**
>
> | Topic | Relevant Sections |
> |---|---|
> | 1 theme per slide & splitting | 4.1, 4.29, 4.34 |
> | 2-column layout mechanics (headers, baselines, heights) | 4.2–4.7, 4.20, 4.21, 4.23, 4.26, 4.27 |
> | Prohibition of bottom takeaway banners & floating objects | 4.8, 4.9, 4.24, 4.28 |
> | Structured axis tables over card grids | 4.10, 4.11, 4.15–4.17, 4.25 |
> | Processes, chevrons, and sequential steps | 4.17, 4.18, 4.26 |
> | Overall deck structure (summary ⇄ deep dives, axis consistency, narrative flow) | 4.13, 4.31, 4.33, 4.35, 4.43, 4.44, 4.45 |
> | Figures, icons, and scope framing | 4.4, 4.32, 4.36 |
> | TOC, margins, template uniformity, pricing stats, review trackers | 4.12, 4.14, 4.19, 4.22, 4.30 |
> | Background fills, symmetry, issue/solution, whitespace balance, single logos | 4.50–4.57 |
> | Pitch deck specific rules | §9 |
> | **Reading order & visual flow (premises left, chart orientation, alignments)** | **4.37–4.46** |
> | Source line placement & chevron rail mechanics | 4.47, 4.48 |
> | Formulating 2-column headers | 4.49 |
> | Consolidation, layout variety, subheaders, decorative elements | 4.58–4.63 |
> | Problem structuring (SCR, issue trees), case studies, firm strengths | 4.64–4.68 |
> | Narrative transitions, appendix boundaries, tentative figures, closings | 4.69–4.74, 4.80 |
> | Non-table archetypes (Venn, Gantt, swimlanes, UI walkthroughs, org charts) | 4.75–4.79 |
> | Real screenshots, raw assets, breakdowns, diffs, arrows | 4.81–4.87 |
> | Issue tree splits, answering core questions, competitor research, execution facts | 4.88–4.95 |

1. **1 slide = 1 message = 1 theme.** If a slide addresses two distinct themes, split it across two slides.
2. **Do not force vertical reading paths.** Never stack unrelated content vertically. Divide sections **horizontally into left and right columns**, each carrying an explicit header. Elements with an inherent chronological sequence within a single visual (e.g., vertical process steps in §4.26) are permitted.
3. **Maximum one primary table per slide. Never stack a table beneath a card grid.** If a primary visual/table represents empirical facts or analysis, place it in the left column and place qualitative takeaways in the right column. However, if foundational premises or definitions logically precede the table, place the text in the left column and the table in the right column (§4.6 and §4.37 take precedence; evaluate which content is logically upstream).
4. **Visual slides follow a 2-column format: Visual on Left, Commentary on Right** (if foundational premises precede the visual, place premises on the left per §4.37). Never place commentary underneath a diagram. **Exception**: When the core takeaway is completely stated in the title (§2.10) and the visual is self-evident (simple charts with direct data labels requiring no explanation), the visual may span the full width. Complex visuals requiring interpretation must use the 2-column layout.
5. **Align the bottom baselines of left and right columns.** Never leave one column short with uneven whitespace at the bottom (`flex: 1` or `stretch`).
6. **Provide clear relational headers for left and right columns** (e.g., Left: "System Architecture" / Right: "Design Rationale"). For premise + table layouts, place premise text on the left and table on the right.
7. **Insert a horizontal triangular arrow between columns only when a direct causal relationship (Premise → Conclusion) exists** (same triangle as §4.27). Never insert arrows for simple table + commentary layouts.
8. **Never place takeaway message banners (GOAL / KEY / POINT blocks) at the bottom of a slide.** Bottom bands are permitted exclusively for **cataloging content assets** (deliverable chips, client logos). The single-line source attribution (§4.47) and reference footnote (§4.31) are not takeaway banners and are permitted.
9. **Do not overuse bordered callout boxes.** Body content belongs on the neutral slide surface; reserve bordered boxes for the 1–2 elements requiring deliberate focus.
10. **Use structured axis tables over disconnected card grids** (rows = item axis, columns = perspective axis). Group rows under clear parent categories using vertical rowspans where appropriate.
11. **Do not make readers compare two side-by-side cards.** Instead of Card Company A vs. Card Company B, build a table with evaluation criteria on the rows and companies on the columns.
12. **Center sparse content vertically when excess bottom whitespace occurs.** Large visuals should align to the top. **Never stretch container boxes or inflate line spacing artificially to fill canvas height** (§5.13 canvas fill ratios must be satisfied with substantive information, not artificial stretching). Workflow: (a) Add substantive content or switch archetypes if information is insufficient (§5.13); (b) If content remains concise, center vertically to balance top and bottom margins.
13. **Separate Executive Overviews from Deep Dives.** Open major sections with an overview map (referencing specific slide numbers: "→ P. n"), and link subsequent deep-dive slides using top-right kicker tags. Provide matching deep dives for each step.
    - **Mandatory structure for decks of 11 or more content slides.** Without an upfront overview followed by detailed explorations, overall architecture becomes disjointed. Place an overview map upfront, link downstream deep-dive slides via top-right tags, bridge titles explicitly, and **ensure sequential reading forms a cohesive speech**. Decks with 10 slides or fewer, or focused on a single issue, do not need an overview map (§0, §4.45).
14. **Format table of contents as a single vertical column.**
15. **Ensure parallel cards have identical heights and uniform spacing.** Uneven box dimensions undermine polish. Enforce strictly with `grid-auto-rows: 1fr`.
16. **Align grammatical structure and abstraction level across parallel items.** Do not mix active statements ("Staff can draft directly") with passive fragments ("Automated creation"). Write all parallel cards using identical grammatical structures (Subject + Action).
17. **Present Steps × Enablers as a table rather than stacked boxes.** Left column = Phase/Step, Right column = Enablers/Mechanisms. Avoid unmapped layouts like 4 top boxes over 3 bottom boxes.
18. **Use chevron charts as the primary archetype for standalone processes.** Prefer chevrons over generic horizontal boxes. When pairing steps with commentary, use a vertical step flow with right-hand commentary (§4.26).
19. **Maintain absolute template consistency across the deck.** Never vary headers, margins, or fonts between the first and second half of a presentation. When merging slides from multiple sources, standardize everything to a single template.
20. **Place strategic implications (So What) in the right-hand column, never in a bottom banner.** Left = Data/Visual, Right = Implications.
21. **Align the top baselines of left and right column headers.** When the left column contains a table, the right column header must match the table `th` padding, font size, and 1.8px underline, aligning text baselines and rules. When the left column contains a row header (`.rh`), apply the same rule. Ensure headers fit on a single line.
22. **Place pricing and fee callout boxes at the bottom-right of the right column.** The upper right column holds strategic analysis; financial terms occupy the lower right.
23. **Never stack two headers in a single column.** Stacking headers (e.g., "Perspective" over "Next Steps") duplicates the category axis. Use one header per column, expressing internal hierarchy through **indented bullet structures (Level 2 bullets)**.
24. **Never place substantive calls-to-action on the final slide.** Conclude with a **clean back cover** (logo, company name, contact info only). Critical conclusions or next steps belong on the **penultimate content slide** structured as a standard content slide (title line + axis table). Never create a closing slide made of 3 dark cards.
25. **Never write long paragraphs into table cells or row lists.** If cell content exceeds one sentence, decompose it into concise bullet points (`•`).
26. **Never stack a 2-column layout underneath horizontal chevrons.** This obscures the relationship between the top process and bottom content. Process slides requiring commentary must use a vertical step flow on the left with commentary on the right.
    - **Exception for horizontal layouts**: Permitted when there are 4 or fewer phases, each phase description spans only 1–2 lines, and descriptions sit directly beneath each phase in dedicated columns in a 1:1 relationship (§4.48).
    - Align arrows with reading direction (rightward for horizontal, downward for vertical).
    - **Span axis titles across both columns with a single full-width rule.** In vertical step + commentary layouts, place a full-width axis title (e.g., "Document Creation Workflow") with a thick 1.8px rule across both columns, leaving the right column without an independent header.
    - **When the right column is shorter than the left, vertically center only the bullet points.** Match the right header height to the left table header, then vertically center the bullets below it (`flex: 1; justify-content: center`).
27. **In 2-column premise-to-conclusion layouts, represent strong causality with a horizontal triangular arrow.** Left = Premise/Facts, Center = Horizontal Triangle, Right = Conclusion. The triangle and text establish causality; right headers must remain standalone noun phrases (§4.49).
    - **Triangle mechanics**: Left and right columns must have equal width and height. Place **exactly one triangle** vertically centered in the inter-column gap; do not repeat triangles per row. Use a clean filled triangle, never an oversized block arrow.
28. **Never place floating, disconnected objects.** Labels, chips, and callouts must never float independently on the slide surface; integrate them into tables, columns, or chart structures (e.g., classification tags belong in table headers).
29. **Pair every risk or concern with a concrete mitigation.** Never present an isolated list of risks. Do not mix disparate topics like "Why risk is low" and "Risk mitigations" on the same slide; separate them (§4.1).
30. **Do not leave raw reviewer comments or action items on content slides.** Consolidate them onto a dedicated "Review Topics Tracker" slide at the end of the deck.
31. **Include reference footnotes when an element is detailed on a later slide.** If "Admin Role A" appears in a table and is detailed on the next slide, add a footnote: "Admin Roles A & B detailed on page [n]" (§4.13).
32. **Represent people and documents using monochrome line icons.** Avoid abstract blobs or generic circles; use simple single-color SVG icons paired with text labels. Represent roles in the singular ("User", not "Users"). Speech bubbles must include tails and represent complete interactions (user request → system response).
33. **Maintain strategic axes consistently from opening slides through deep dives.** If issues are categorized in the overview map, (a) assign clear identifiers (e.g., "Issue 1: Learning Efficacy"), (b) display kicker tag chips on corresponding downstream slides, and (c) use identical numbers and terminology in kickers.
34. **Split dense topics across 2–3 slides using progressive build-up.** Rather than overcrowding one slide, present sequential slides that preserve the exact layout while revealing new elements (left half first → full layout revealed). **The layout must not shift by even 1 millimeter between slides.**
35. **When detailing multiple sections, carry numbering from the overview table into individual slides** (§4.13, §4.33). Use a dark callout panel on the left 25% (Number + Category + Core Assertion) and place supporting exhibits on the right 75%. Match naming word-for-word with the overview.
36. **When narrowing scope, illustrate the boundary directly on an overarching diagram.** Display the complete architecture, draw a distinct bounding box around the targeted component, and label it "In Scope for this Proposal". This is clearer and faster than textual disclaimers.

**Reading Order and Placement Principles**

37. **Premises, definitions, and rationales belong on the left; examples, outcomes, and actors belong on the right.** Executives read from left to right: "Why → What → Who". Place definitions on the left and tables on the right. In a 3-column layout: Left = Policy/Demand Drivers, Center = Industry Breakdown Table, Right = Market Players. When uncertain, place the more upstream/foundational content on the left.
38. **Align ordering between tables and charts.** If presenting the same data via a table and a stacked chart, align table rows with the chart's stacking order, placing the defining structure on the left.
39. **Visually map right-hand analytical points to left-hand exhibits using indicator bands.** If the right column discusses "4–5x variance" or "Top Benchmark", highlight the corresponding row in the left chart with a subtle tint and matching label.
40. **Indicate comparison deltas and ratios with explicit baseline arrows.** Writing "4–5x" without showing what is compared to what causes confusion. Place a baseline marker at the origin, draw an arrow to the target, and explain the direction in the legend.
41. **Provide directional axes for ordered rows.** If table rows represent increasing volume downward, add a tapered directional axis on the left edge labeled "Increasing Complexity".
42. **Anchor competitor comparisons to the same structural axis used in architectural diagrams.** If evaluating competitors, use the same layers from your value chain diagram as evaluation rows.
43. **Pair every problem slide with a resolution slide, titling the resolution with active solutions.** A bottleneck list should be followed by a slide titled: "Bottleneck [X] is Resolved Through [Mechanism]".
44. **Advance narrative storylines by exactly one logical step per slide.** Do not jump ahead or overload multiple thesis shifts onto one slide.
45. **Section Divider Mechanics.** Use the base background color, display "SECTION n / N" alongside the full agenda list, and highlight only the active section in bold. Dividers are excluded from printed page counts. Decks of ~10 slides or fewer do not need dividers. Decks of 11 or more slides should include dividers at natural shifts in topic.
46. **Ground illustrations in concrete real-world entities.** When displaying value chains, name real industry players across rows, placing the client on the top tier. Listing only 2–3 players makes markets look artificially thin.
47. **Position source attributions and technical notes in the lower-left corner (above the footer rule).** Never put source citations in slide titles or table headers (§6).
    - Decks requiring source lines: research reports, market analyses, board submissions where readers must verify empirical evidence.
    - Decks omitting source lines: sales pitches and regular operational syncs where verbal context suffices.
    - Never include internal document names, internal meeting IDs, or local file paths in source lines (§7.29).
    - Keep source lines to 1 line; never include narrative commentary.
48. **Value chain chevron rails should span full width as a slender bar, with descriptions placed in vertical columns beneath.** Never cram text inside chevron shapes.
49. **Formulate 2-column headers as standalone noun phrases.** Never begin column headers with conversational connectors ("Consequently, [X]"). The header must describe its content independently; causality is conveyed by the layout and inter-column triangle.

**Fills, Symmetry, and Spacing**

50. **Apply background fills to cards only when color conveys distinct functional meaning.** Fills without functional meaning create visual noise. Fills must be explainable in a legend (e.g., highlighted focal phase vs. neutral gray). Standard content containers should use a white background with a crisp header and underline (§5.2).
51. **Maintain symmetric dimensions and structures in side-by-side comparisons.** Both columns must share identical widths, heights, and internal layouts. If comparing structured criteria, use a table (§4.11).
52. **Structure problem-to-solution case studies as "Challenges (Left) vs. Solutions (Right)".** Do not format as a historical timeline (Before vs. After). Left = bulleted challenges; Right = solutions structured along clear row axes (Who / What / Mechanism).
53. **In process workflows, highlight the focal bottleneck step with a single distinct accent color.** Extract the critical inflection point as an independent chevron and highlight it; keep all other steps uniform.
54. **Resolve lower-half whitespace by expanding substance, not by inflating spacing.** Priority: (a) Provide deeper analytical points (up to 3 bullets per cell per §6); (b) Increase typography slightly toward 12pt; (c) Vertically center the content (§4.12). Never fill space with decorative banners (§4.28).
55. **Ensure lower-tier elements relate logically to upper-tier elements.** Never drop an unexplained box at the bottom of a slide.
56. **Limit presentations to one logo per slide.** Never combine header logos with giant body logos.
57. **Highlight focal table rows only when essential for reading flow; default to unhighlighted rows.** Excessive row tinting looks artificial. Highlight a row only when subsequent slides focus exclusively on that row and confusion would otherwise result.

**Consolidation, Layout Variety, and Headings**

58. **Consolidate adjacent thin slides that communicate the same point.** If two slide titles can be merged into one sentence without losing meaning, combine them.
59. **Present Current State and Future State (As-Is vs. To-Be) side-by-side.** Comparing across vertical tiers makes difference analysis difficult.
60. **Do not repeat the identical layout archetype across three consecutive slides.** Re-evaluate whether the visual format truly fits the specific message of each slide.
61. **Never place a redundant rephrasing line directly beneath a heading.**
62. **Do not add decorative lines, logos, or dates above slide titles.**
63. **Align text baselines to the left margin.** Align labels and text along the left edge; right-align only numerical data columns.

**Structuring Business Problems and Case Studies**

64. **Situation, Complication, Resolution (SCR) Slide Mechanics.** Situation: state both operational capabilities and limitations factually. Complication: isolate root causes of performance gaps, not just the gap itself. Resolution: align solutions 1:1 with complications. Never print theoretical framework labels ("Situation", "Complication") on client slides.
65. **Anchor the root of an issue tree in the client's business challenge.** Never place internal vendor goals or product sales targets at the root.
66. **Case study slides must cite concrete operational scale**: author, data volume, automated scope, active users. Express scale in document counts, row counts, and team sizes (§7.27). Allocate overview on left 1/3 and verified results on right 2/3.
67. **Move firm capability and credential slides to the appendix unless directly required for executive decision-making.** Integrate capabilities directly into problem-solving logic.
68. **When updating summary tables or overview maps, synchronize corresponding deep-dive slides.**

**Narrative Flow and Next Steps**

69. **Insert a transition slide or bridging statement when shifting narrative topics.**
70. **Keep decision-critical analysis in the main deck, not the appendix.** If omitting an analysis would lead an executive to make a flawed decision, keep it in the core deck.
71. **Label unconfirmed metrics, timelines, or costs explicitly as "Tentative".** State underlying assumptions clearly.
72. **Frame consultation items as "Our Recommended Proposal + Evaluation Request".** Never ask open-ended questions like "How should we proceed?"; propose a concrete recommendation and request approval or specific trade-off choices.
73. **Format consultation and feedback slides using bordered white boxes with generous padding.**
74. **Tailor deck closings to the presentation's operational purpose**:
    - Exploratory briefings: Conclude with capabilities and collaborative possibilities.
    - Regular status syncs: Conclude with specific decision/confirmation items (§4.72).
    - Formal proposals: Conclude with pricing terms and phase-gate criteria.

**Non-Table Archetypes**

75. **Do not force non-comparative relationships into tables.**
    - Overlapping categories: Venn diagrams or icon groupings.
    - Schedules: Gantt charts or timeline roadmaps.
    - Sequential phases: Chevrons (§4.18).
    - Coordination flows: Swimlane diagrams (§5.23).
76. **Structure software walkthroughs as "Actual Screen on Left, Procedural Steps on Right".** Left = high-resolution screenshot (§4.81); Right = numbered steps matching callouts placed on the screenshot.
77. **Map enterprise workflows using swimlane diagrams.** Rows = operational actors (teams, systems); Horizontal axis = timeline. Place decision branches directly within the main workflow using diamond symbols. Separate As-Is and To-Be workflows onto distinct slides.
78. **Draw horizontal issue trees with boxes framed as business questions.** Primary question on left, decomposing rightward across up to 3 tiers. Anchor the root in client operational challenges (§4.65).
79. **Structure governance and staffing as an organization chart.** Executive sponsor at top, functional leads below, clearly separating client and partner organizations. Verify names and titles against primary records.
80. **Include a "Next Steps" slide only when concrete actions, owners, and dates exist.** If next steps are merely "continue ongoing work", omit the slide entirely.
81. **Embed genuine, unedited user interface screenshots.** Never present fabricated mockups or outdated screens (§5.8). Mask sensitive PII cleanly.
82. **Include primary validation results alongside summary takeaways in status decks.**
83. **Faithfully incorporate client-provided assets and terminology without arbitrary truncation.**
84. **Provide comprehensive numerical breakdowns alongside totals.**
85. **Display progress updates using identical formats to previous versions, highlighting only changed items.**
86. **Exercise strict palette discipline; use non-standard colors only when assigned functional meaning.**
87. **Use arrows solely to denote sequence, causality, or data flows.** In PPTX, connect shapes using formal connectors rather than loose lines.
88. **Deconstruct issue tree roots into decisive analytical drivers.** Break questions like "Can we achieve profitability?" into demand, unit margins, volume, and operational risk.
89. **Decide whether the deck should answer the root question based on its stated purpose.** Decision decks must deliver definitive answers; exploratory decks may conclude with prioritized hypotheses and test plans.
90. **Sequence downstream implementation slides after selection/evaluation slides.**
91. **Extract repeated column subheaders into row axes.**
92. **When commentary applies row-by-row, add an "Implications" column to the table rather than creating a right-hand column.**
93. **Include verified competitor research in business planning decks.** Ground claims in primary sources, explicitly documenting comparison dates and currency/tax baselines.
94. **Ground implementation roadmaps strictly in verifiable capabilities and resources.**
95. **Table headers may incorporate subtle, monochrome line icons matching domain concepts.**

---

## 5. Visual Styling, Palette Discipline, and Exhibits

1. **Never use rounded corners by default.** All cards, containers, and chips must use sharp right angles (HTML: `border-radius: 0`; PPTX: `MSO_SHAPE.RECTANGLE`). Exception: Small status pills under 0.4 inches in height, or explicit client brand guidelines (§1).
2. **When varying container background colors, provide an explicit legend on the same slide.** Meaningless dark callout boxes are prohibited.
3. **Never place borders on filled background containers.** The fill defines the boundary; adding a border is visual redundancy. Use borders only on unfilled (white) containers.
4. **Draw horizontal borders only where content separates below.** Never place a border below the final row of a table or list.
5. **In comparison tables, apply color highlights to the winning option.** Never highlight your own company column unconditionally across all rows.
6. **When presenting competitive comparison tables, always include criteria where competitors excel.** Evaluate mechanisms, deployment flexibility, and operational fit objectively.
7. **Document measurement conditions for internal benchmarks** (sample size, workload type, testing body).
8. Semantic colors (red for errors/risks, green for positive deltas) must be preserved across branding shifts. Keep UI screenshots unmanipulated.
9. **Always include neutral monotone grays in multi-series palettes.** Never paint every series with saturated chromatic colors. Reserve chromatic accents for target series; render baselines in neutral gray.
10. **Render charts for bounded metrics across their full theoretical scale (0–100%).** Truncating scales distorts perception of correlation or progress.
11. **Plot trends, composition breakdowns, and distributions as charts.** Never dump trends or percentages into tables. If a slide calls for a chart, draw it directly rather than settling for a table.
12. **Select standard consulting chart archetypes**:
    - Avoid creative gimmicks: focus on one message per chart, consistent typography, and standard visual forms.
    - Core formats: ① Table Chart, ② Premise (Left) vs. Implications (Right), ③ Direct Contrast (Left vs. Right), ④ Analytical Visual (Left) + Commentary (Right).
    - Data charting guide: Composition = 100% stacked horizontal bar; Category comparison = horizontal bar; Time series = vertical bar or line; Distribution = histogram/bar; Correlation = scatter plot. Use pie charts only when showing 2–3 segments where overall share is the primary message.
13. **Canvas Vertical Fill Ratio: Content must occupy at least 55% of the vertical space between title and source line.** When excess vertical space occurs, add substantive So What points, scale visuals properly, or switch archetypes. Never stretch line heights artificially or insert decorative fluff to bypass linters.
14. **Lines must not cross; limit turns to a single 90-degree angle.** Connect parent shapes to children cleanly through center points.
15. **Separate line labels from shape boundaries by at least 8px.** Position labels adjacent to the origin of an arrow rather than crowded near its head.
16. **Do not use dashed vs. solid lines to denote semantic meaning.** Use distinct colors paired with a clear legend. Draw arrows in the direction of data or workflow movement.
17. **Retain the full operational granularity of primary source workflows.** Include active verbs in step labels.
18. **Chart layout standards**: units in top-left, data values on bar ends or centers, totals atop stacked bars, legends adjacent to the visual.
19. **Render compared quantities on common scales.** A 1-hour bar and a 40-hour bar must visually reflect a 1:40 ratio.
20. **Timeline standards**: equal-width time intervals, continuous duration bars, and historical baselines retained under future projections.
21. **Specify metric names with operational precision** (e.g., "Cumulative FTE Reductions", not "FTE").
22. **When denoting priority with color, ensure differences are immediately distinguishable.**
23. **Examine workflow diagrams before defaulting to comparison matrices for operational coordination.**
24. **Capture genuine software screenshots.** Never recreate interfaces in HTML. Mask sensitive client data cleanly.
25. **Format software outputs with clear headers, metrics, and charts rather than pasting raw dumps.**

---

## 6. Structured Tables

| Property | Standard Rule |
|---|---|
| Header Row | **At least 2pt larger than body text (target +3pt: 11.5pt body → 14.5pt header), bold, rendered in primary ink/navy**. No background fills. **Axes are defined by borders, not fills**: thick border below header (`th { background: none; border-bottom: 1.8px solid var(--navy); }`). |
| Row Lines | No zebra striping; no unexplained tinted backgrounds. Separate rows with a single thin 1px light gray border (`#CCCCCC`). |
| Grouped Tables | **In tables where row labels do not have a 1:1 relationship with right-hand content (e.g., multi-row groupings), omit row-level borders.** Dividing grouped items creates false 1:1 associations. Place rules only between major groups. |
| Border Rules | Thick primary border beneath header; thin light border between rows. **No border below the final row** (§5.4). |
| Column Names | Avoid abbreviations and acronyms. Use natural terms that identify cell contents independently. Avoid orphan word wraps. |
| Typography | **Table body text must be ≥ 11.5pt (10pt is too small for projection/PDF), header text must be body + 3pt (14.5pt), and row header axis (leftmost column) must match `th` size.** Diagrams and footnotes may use ≥ 9pt. |
| Stretched Rows | When stretching sparse tables vertically (`flex: 1`), apply `td { vertical-align: middle; }` to prevent text from clinging to the top. |
| Detail Cells | **Explanation cells containing 2 or more distinct points should use 2–3 concise bullets (`•`).** Avoid walls of run-on text. |
| Source Lines | Place attributions in the standard bottom-left position (§4.47), never inside table titles. |
| N/A Cells | **Mark non-applicable or uninvolved cells with "—" and a subtle gray background.** This deprioritizes non-essential cells visually. |
| Cell Highlights | Highlight decision-critical cells (core policies, key approvals) in **bold**. Restrict highlights to 2–3 cells per table. |
| Simple Definitions | For concise 3-item definitions, format as single lines (`Label: Definition`) rather than complex nested tables. |
| Rating Legends | When using Harvey Balls or rating glyphs (○ △ ×), **define every grade explicitly in a legend**. |
| Axis Prominence | **Format the leftmost row header axis with bold text and a vertical dividing rule** to clearly mark it as the defining dimension. |
| Category Scope | **Table rows must strictly belong to the set defined by the leftmost axis label.** If the axis is "Demand Drivers", do not include macro financial rows. |
| Relevant Columns | **Omit columns that do not advance your core assertion.** |
| Column Headers | **Use concrete descriptive nouns for column headers**, avoiding vague abstractions like "Facts" or "Assets". |
| Inactive Cells | Use "—" for empty cells. When background colors denote meaning, apply them consistently across all slides and document them in a legend. |
| Column Granularity | Maintain uniform scope and perspective across all cells in a column. |
| Omit Static Facts | In differential comparison tables, list only changed elements; summarize unchanged baselines in a 1-line note. |
| Staffing Tables | Staffing tables follow: Rows = Roles, Columns = Time Horizons (Initial / Current / Target); Cells = "Count: Names". |
| Conclusion Rows | **Never append an artificial conclusion row with different granularity at the bottom of a table.** Rows must maintain equal analytical depth. |
| Noun Column Headers | Column headers must be concise noun phrases ("Challenges", "Solutions"), never complete declarative sentences. |
| Bullet Target | Aim for approximately 3 concise bullets in explanatory cells where multiple drivers exist. |
| Professional Terms | Use formal operational language in row headers; avoid conversational shorthand. |
| Grouping Limits | Limit major table groupings to 7 or fewer categories. |
| Mutually Exclusive Rows | Quantitative counting tables must use mutually exclusive rows whose column sums strictly reconcile with stated totals. |
| Alignment with Titles | Ensure the analytical axes used in slide titles match the axes defined in tables. |
| Respect Client Templates | When given client-mandated table formats, preserve specified columns and sequences. |
| Baseline Table Alignment | Align side-by-side tables by their text baselines, not by outer bounding boxes. |

---

## 7. Writing, Phrasing, and Labeling

> **The Three Drivers of Artificial "AI Smell" (Inspect every slide for these before delivery):**
> 1. **Floating Boxes**: Labels, chips, or callouts disconnected from table, column, or chart structures (→ §4.28).
> 2. **Walls of Unstructured Prose**: Dumping run-on sentences instead of structuring items into crisp bullet points (→ §7.3, §4.25).
> 3. **Compressed Slogan Shorthand**: Stripping grammatical subjects and predicates into artificial jargon ("manual creation", "accuracy enhancement"). Write clear sentences stating who does what (→ §2.3, §7.2, §7.14).

1. **Avoid excessive parentheses.** Format supplemental details with slashes or separate sentences. Use colons for label separators; do not use em-dash ` — ` concatenation (§7.12; see `ai-smell-lexicon.md`). Standalone em-dashes for N/A table cells (§6) are permitted.
2. **Never invent shorthand or synthetic jargon.** Use complete, standard professional vocabulary.
3. **Bullet Standards**: Break dense paragraphs into bullets. Eliminate orphaned trailing words. Default hierarchy: Level 1 = `•` with hanging indent; Level 2 = `–` with hanging indent.
   - Do not hardcode bullet characters into text strings in PPTX; use native bullet formatting (`buChar`).
   - Do not add bullet symbols to single-sentence standalone assertions (e.g., Executive Summary lines).
4. **Maintain parallel grammatical endings across bullets within the same level.** Never mix polite endings with direct statements. Ensure all bullets within a tier share the same grammatical form (all active verbs, or all noun phrases).
   - **Exception: Direct questions posed to the stakeholder** (e.g., interview guides, confirmation lists) may use interrogative phrasing.
5. Integrate small footnotes into the body text whenever possible.
6. **Terminology and Data Consistency**:
   - **One Term Per Document.** Never vary terms for the same concept (e.g., do not alternate between "users", "clients", and "operators"). Run a consistency check across the full text.
   - **Expand acronyms upon first appearance** (e.g., "Workspace (WS)"). Never use undefined internal acronyms.
   - **Numerical Consistency.** When citing a metric across multiple slides, ensure values, units, rounding, and time horizons match exactly (do not write "$120M" on the overview and "$118M" in the body). `check_deck.py` flags numerical discrepancies as warnings.
   - **Phrasing Consistency.** When repeating core conclusions or definitions across slides (especially between the Executive Summary and the body), use identical phrasing.
   - **Precision in Domain Terminology.** Use industry, legal, and financial terms in accordance with formal standards.
   - Maintain appropriate distinctions between homonyms in context.
7. **Place quotation marks around figurative or metaphorical terms.**
8. **Explicitly state what feedback or decisions are requested from the audience.**
9. **Eliminate AI smell vocabulary and syntax.** Strip empty buzzwords, corporate flattery, and formulaic templates. Refer to `references/ai-smell-lexicon.md`. `check_deck.py` warns on high-confidence AI slop terms.
   - Distinct status markers: When comparing options, checkmarks (✓) and caution triangles (△) may precede lines, provided they use monochrome ink and are explained in a legend.
10. **Begin functional descriptions with explicit actors.** Write "Users manually submit requests" rather than "Manual submission". When describing automated AI behavior, always specify the human verification checkpoint.
11. **Do not bring internal company metaphors into client-facing decks.**
12. **Express conceptual relationships through visual structure rather than punctuation tricks.** If repeatedly writing "Label: Explanation" or "Label — Explanation", convert the content into a 2-column table or indented hierarchy.
13. **Introduce numbering on elements only when those numbers are cross-referenced downstream.**
14. **Preserve grammatical subjects and predicates in body copy and bullets.** Avoid dense passive nominalizations ("automation of reports is achieved"); write active statements ("The system compiles reports, and managers verify exceptions").
15. **Proofread AI-generated text thoroughly prior to delivery.** Titles and key messages are frequent failure modes for LLMs; review them for both logical rigor and natural professional phrasing.
16. **Structure the Executive Summary as a parallel series of takeaway lines paired with 2–3 indented supporting details.** Each line should correspond to a major section of the deck.
    - Never nest single child items under a parent (an indent requires at least 2 parallel items).
17. Omit redundant explanatory text beneath charts when the title and legend already explain the visual.
18. When presenting 4 or more parallel bullets, group them under 2 logical parent categories if natural.
19. Ensure every bullet point introduces a distinct analytical perspective; do not write three variations of the same thought.
20. Do not state self-evident common-sense facts as bullet points.
21. Eliminate colloquialisms, hyperbole, and unexplained abbreviations from body text.
22. Keep visual labeling languages consistent.
23. When illustrating AI workflows, frame operations as "AI proposes, humans decide".
24. **Never pack two or more sentences into a single text block.** Divide dense text blocks into discrete 1-sentence bullets.
25. **Omit periods at the end of single-sentence bullet points and table cell labels** (maintain internal commas).
26. Describe operational states using verifiable factual terms ("deployed in production", "verified in staging").
27. Do not conflate counting units with operational mechanisms.
28. Clearly distinguish acting entities from originators.
29. **External Presentation Hygiene**:
    - Apply proper honorifics and formal names to client entities.
    - Never include internal meeting timestamps, recording IDs, or internal URLs.
    - Remove all internal drafting notes, revision histories, and team member monologues.
    - Anonymize case studies thoroughly when confidentiality requires it.
30. Tailor examples to the client's industry and existing toolset.
31. Frame presentations around the client's perspective, avoiding aggressive internal sales jargon.
32. Do not expose internal consulting framework labels (SCR, Issue/Resolution) on client slides.
33. Verify software screen names, feature titles, and contract timelines against primary records.

---

## 8. Automated Pre-Delivery Checks (Mandatory)

Run automated checks before delivery:
**PPTX**: `python3 scripts/check_deck.py out.pptx`
**HTML**: `python3 scripts/check_deck.py deck.html`

Checklist items (Every FAIL must be resolved before delivery):
- [ ] 16:9 Aspect Ratio (PPTX 12192000×6858000 EMU / HTML 338.67×190.5 mm)
- [ ] Titles state conclusions, avoid conversational endings, and span **at most 2 lines**
- [ ] Titles contain no template placeholders (`Text N`, `Label N`, `YYYY`) and avoid repetitive grammatical molds (§2.8)
- [ ] Body copy, tables, cards, and chips contain no remaining placeholders or raw archetype names
- [ ] Text blocks do not contain multiple run-on sentences (§7.24)
- [ ] Client decks achieve FAIL 0 against forbidden terms lists using `--forbid`
- [ ] No slide leaves over 40% of its vertical canvas empty (verified via `check_layout.mjs`)
- [ ] No rounded corners (`border-radius: 0`; sharp rectangles in PPTX)
- [ ] (PPTX) XML integrity passes with `--xml-only`: valid theme colors, positive dimensions, valid font sizes
- [ ] No legacy subtitle classes or `.sub` structures
- [ ] No prohibited legacy colors
- [ ] Table headers are bold and at least 2pt larger than body copy
- [ ] No horizontal borders beneath the final row of tables or lists
- [ ] Numbers stated in titles match item counts in the body (§2.9)
- [ ] Metrics are consistent across slides (no conflicting figures for the same metric)
- [ ] Sequential title reading forms a cohesive executive storyline
- [ ] Executive summary is formatted as a structured hierarchy rather than a flat title list
- [ ] Sequential slide numbering is accurate (excluding title, dividers, back cover)
- [ ] Verified absence of the 3 AI Smell drivers across all slides
- [ ] Completed fresh-eye review via an independent agent
- [ ] Verified `<meta charset="utf-8">` in HTML files
- [ ] (PPTX) Removed all hidden slides

**Live Layout Rendering Check**: `node scripts/check_layout.mjs deck.html` catches footer overlaps, title overflows, and excessive whitespace (>40% empty canvas).

**Turn every piece of review feedback into both a 1-line rule and an automated check.** Adding a rule to markdown alone means the defect will recur. For measurable feedback, add a check to `check_deck.py` or `check_layout.mjs`, and add test cases to `tests/test_checks.py`.

**Fresh-Eye Review Process (Mandatory for Standard and Quality Modes):**
1. After achieving automated check FAIL 0, hand `references/content-review-prompt.md` to an independent agent **without revealing creation instructions or context**, passing the deck file directly.
2. Compile findings into a **Disposition Table** (Accept / Reject / Hold + rationale).
3. Fix accepted items, document rationales for rejected items, and re-run automated checks.
4. When possible, run in parallel with an alternative model family (e.g., Codex CLI) to cross-verify findings.

**Review Loop Governance**:
- One rally consists of: Automated checks → Visual QA → Fresh-eye review → Fixes → Automated re-check.
- **Stop after 1 rally**, present deliverables and disposition table, and ask whether to execute another rally. Never run unprompted multiple loops unless explicitly instructed upfront.
- Modes: **Speed-first** (automated checks + self-QA only), **Standard** (1 rally), **Quality-first** (up to user-specified rally limit).

---

## 8.6 When PowerPoint (.pptx) Is Required

**Always finalize the presentation in HTML first. Convert to PPTX only when the user explicitly requests PPTX.** Conduct all edits and reviews in HTML, converting only once at the end. If revisions are requested after delivery, update HTML and re-convert.

1. Complete automated checks (FAIL 0), fresh-eye review, and visual QA in HTML.
2. Convert: `python3 scripts/html_to_pptx.py deck.html` (produces `deck.pptx`).
3. Validate: `python3 scripts/check_deck.py deck.pptx` until FAIL 0; inspect text wrap in PowerPoint.
4. Sanitize metadata properties before external delivery.

Conversion capabilities: Text, shapes, borders, and tables convert to fully editable native PowerPoint elements. Complex SVG charts and external images convert to high-resolution raster images.

---

## 8.7 Inserting Pages into Existing PowerPoint Decks

**When provided with an existing PowerPoint deck, build insertion pages directly on top of that document's master template.** Converted PPTX files carry their own formatting and look discordant when spliced into house decks.

1. Measure: `python3 scripts/measure_deck.py house.pptx` → Generates `house.skin.json`.
2. Build: Use `scripts/deck_pptx.py` with `Deck(house_path, skin)` (sample in `examples/house_deck_example.py`).
3. Validate: `python3 scripts/check_deck.py pages.pptx --house house.skin.json` until FAIL 0. **Always pass this check before opening in PowerPoint.**
4. Visually inspect all pages.
5. Deliver only the newly generated insertion pages. The user pastes them into their house deck.

House deck matching rules:
- Do not hardcode font families or background colors on slides; let the master template govern them.
- Place titles into native layout placeholders.
- Construct tables matching the source deck's conventions (textboxes + borders if the house deck avoids table objects).
- Select colors strictly from the house deck's theme palette.

---

## 9. Pitch Decks (Stage Presentations, 7–10 Minutes)

1. **A pitch deck is not an explanatory briefing document.** Revising a deck for a stage pitch is a narrative and phrasing overhaul, not an archetype swap. Preserve high-impact visuals, bold numbers, and clean design, refining flow and verbal conciseness.
2. **Determine slide count strictly from allocated speaking time.** For a 7-minute pitch, target 8–10 slides (~40 seconds per slide). Limit the problem statement to at most 2 slides. Company overview is strictly 1 slide.
3. **Standard Narrative Progression (1 slide each)**:
   1. Visual Hook / Catch Slide
   2. Company Overview (factual label title, sourced from current canonical profile)
   3. Product Definition (state clear definition in title before discussing genesis)
   4. Why We Built It (2-row table of Problem vs. Root Cause)
   5. Latent Value (untapped opportunity addressed)
   6. Operating Flywheel / Core Engine (pairing AI actions with human oversight §7.23)
   7. Case Study (empirical evidence → operational results → conservative impact estimates)
   8. Strategic Proposal (target scope → product components → live demo → collaboration terms)
   9. Appendix (supplemental data moved out of core flow)
4. **Visual Hook Slide**: Large logo and product interface on left; bold single-line thesis and concise subtitle on right.
5. **Omit competitive comparison matrices from pitch decks.**
6. **Eliminate artificial kickers, redundant subtitles, and decorative clutter.**
7. **Maintain modesty when describing your own firm.**
8. Explicitly mark projected savings or ROI estimates as "Estimated".
