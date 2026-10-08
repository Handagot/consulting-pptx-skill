# Archetype Catalog (Design Idea Book): 62 Archetypes by ID, Use Case, and Source

> **Archetypes are not rigid molds to force-fit; they are drawers of inspiration for presenting ideas.** The canonical source of slide rules is `slide-rules.md`, and archetypes are merely tools to satisfy those rules efficiently. If no archetype fits your storyline, discard them and assemble your slide freely from first principles.
>
> When to read: When determining the visual layout for each item in your storyline. You do not need to read this from top to bottom every session; for visual browsing, `assets/SlideCatalog_16x9.pdf` (printed 62-page catalog of all base and additional components) is much faster.

Components are split into two standalone 16:9 HTML files (1 component = 1 slide). Select components by specifying IDs: `python3 scripts/new_deck.py --parts b01,m05,... -o mydeck.html` to generate a merged deck, then replace placeholder content (`b` numbers = base, `m` numbers = additional).

| File | Content | Frequency |
| --- | --- | --- |
| `templates/freeform_parts_16x9.html` (Base Library) | 27 components: title page, overview map, TOC, section divider, chevrons, premise-to-conclusion, tables with axes, claim panels, evaluation matrices, distribution charts, etc. | High. Start here. |
| `templates/freeform_parts_more_16x9.html` (Additional Library) | 35 components: executive summary, charts (stacked bar, waterfall, scatter), comparison tables, 2x2 matrix, issue tree, roadmap, Gantt, etc. | Medium. Use when base library is insufficient. |

---

## 1. Base Component Library (27 Archetypes)

| # | Archetype ID | Name | Source Location |
| --- | --- | --- | --- |
| 01 | `title_page` | Title Page | Base Library Part 01 |
| 02 | `overview_map` | Overview Map | Base Library Part 02 |
| 03 | `table_of_contents` | Table of Contents | Base Library Part 03 |
| 04 | `section_divider` | Section Divider | Base Library Part 04 |
| 05 | `chevron_steps` | Chevron Process / Progression | Base Library Part 05 |
| 06 | `premise_conclusion` | Premise → Conclusion 2-Column | Base Library Part 06 |
| 07 | `stat_table_readout` | Large Metric Table + Readout | Base Library Part 07 |
| 08 | `card_grid_2x2` | 2×2 Card Grid | Base Library Part 08 |
| 09 | `axis_table` | Table with Structured Axes | Base Library Part 09 |
| 10 | `back_cover` | Back Cover | Base Library Part 10 |
| 11 | `claim_panel_figure` | Key Claim Panel + Visual | Base Library Part 11 |
| 12 | `lever_effect_table` | Strategic Levers & Impact Table | Base Library Part 12 |
| 13 | `status_heatmap_comment` | Status Heatmap + Right Commentary | Base Library Part 13 |
| 14 | `harvey_ball_table` | Harvey Ball Evaluation Matrix | Base Library Part 14 |
| 15 | `dot_matrix_share` | Dot Matrix Distribution / Share | Base Library Part 15 |
| 16 | `progress_bubble_matrix` | Progress Bubble Matrix | Base Library Part 16 |
| 17 | `ranked_bar_annotated` | Ranked Bar Distribution + Callouts | Base Library Part 17 |
| 18 | `scatter_annotated` | Annotated Scatter Plot | Base Library Part 18 |
| 19 | `pillars_foundation` | Strategic Pillars & Foundation | Base Library Part 19 |
| 20 | `opposing_chevrons` | Opposing Chevrons (Dual Forces) | Base Library Part 20 |
| 21 | `evidence_clip_grid` | External Evidence / Market Trends Grid | Base Library Part 21 |
| 22 | `proportional_circles` | Proportional Circle Comparison | Base Library Part 22 |
| 23 | `delta_bars_totals` | Variance Bars + Totals | Base Library Part 23 |
| 24 | `scenario_lines_cagr` | Scenario Trajectories + CAGR Chips | Base Library Part 24 |
| 25 | `research_basis` | Research & Methodology Foundation | Base Library Part 25 |
| 26 | `issue_action_columns` | Issues vs. Actions 2-Column | Base Library Part 26 |
| 27 | `agenda_separator` | Agenda Tracker (Section Divider) | Base Library Part 27 |

---

## 2. Additional Component Library (35 Archetypes)

| # | Archetype ID | Name | Best Use Case | Source Location |
| --- | --- | --- | --- | --- |
| 1 | `executive_summary` | Executive Summary | Providing an executive birds-eye view of conclusions and core issues at the outset | Additional Library P. 1 |
| 2 | `evidence_basis` | Research Foundation | Establishing what datasets, interviews, or factual foundation the deck rests on | Additional Library P. 2 |
| 3 | `big_stat_pair` | Big Stat Comparison | Contrasting scale or impact using two prominent metrics | Additional Library P. 3 |
| 4 | `kpi_dashboard` | KPI Dashboard | Displaying key operational or financial metrics at a glance | Additional Library P. 4 |
| 5 | `chart_insight` | Single Chart + Strategic Implications | Proving a core thesis with a single chart paired with qualitative implications | Additional Library P. 5 |
| 6 | `stacked_bar` | Stacked Bar Breakdown | Showing shifts in composition or mix over time | Additional Library P. 6 |
| 7 | `waterfall` | Contribution Bridge / Waterfall | Illustrating driver contributions to overall growth or variance | Additional Library P. 7 |
| 8 | `true_waterfall` | Full Variance Bridge | Walking step-by-step from baseline to landing with exact positives/negatives | Additional Library P. 8 |
| 9 | `small_multiples` | Small Multiples Comparison | Comparing different segments or regions using identical visualization schemes | Additional Library P. 9 |
| 10 | `comparison_table` | Multi-Option Evaluation Matrix | Comparing multiple strategic alternatives against weighted evaluation criteria | Additional Library P. 10 |
| 11 | `scenario_table` | Scenario Comparison Table | Comparing key assumptions and expected outcomes across multiple scenarios | Additional Library P. 11 |
| 12 | `risk_table` | Risk Assessment & Mitigation Matrix | Structuring identified risks, leading indicators, and mitigations | Additional Library P. 12 |
| 13 | `horizontal_axis_table` | Horizontal Axis Evaluation Table | Evaluating items mapped along a horizontal progression or continuum | Additional Library P. 13 |
| 14 | `heatmap_table` | Heatmap Matrix | Showing relative intensity or performance across dimensions via color density | Additional Library P. 14 |
| 15 | `matrix_2x2` | 2×2 Strategic Matrix | Positioning items, competitors, or initiatives across two strategic dimensions | Additional Library P. 15 |
| 16 | `process_matrix` | Process × Perspective Matrix | Cross-analyzing process stages against functional perspectives or criteria | Additional Library P. 16 |
| 17 | `nested_row_matrix` | Nested Row Hierarchy Matrix | Showing multi-level hierarchical structures within categorical rows | Additional Library P. 17 |
| 18 | `timeline_matrix` | Timeline Matrix | Mapping strategic workstreams and initiatives across temporal phases | Additional Library P. 18 |
| 19 | `theme_card_grid` | Theme Card Grid | Grouping initiatives or insights into structured thematic cards | Additional Library P. 19 |
| 20 | `recommendation_pillars` | Recommendation Pillars | Organizing strategic proposals into distinct, parallel pillar structures | Additional Library P. 20 |
| 21 | `numbered_imperatives` | Numbered Strategic Imperatives | Presenting prioritized actions or imperatives in clear sequential order | Additional Library P. 21 |
| 22 | `scr` | Situation, Complication, Resolution | Structuring narrative context using the 3-tier SCR framework | Additional Library P. 22 |
| 23 | `issue_to_solution_map` | Issue-to-Solution Mapping | Directly pairing identified operational challenges with dedicated solutions | Additional Library P. 23 |
| 24 | `issue_cause_solution` | Issue -> Root Cause -> Solution | Illustrating the end-to-end diagnostic and resolution logic flow | Additional Library P. 24 |
| 25 | `issue_tree` | Issue Tree | Deconstructing an overarching business challenge into MECE components | Additional Library P. 25 |
| 26 | `current_target_state` | Current vs. Target State | Contrasting the baseline As-Is against the future To-Be state | Additional Library P. 26 |
| 27 | `calc_flow` | Calculation Logic Flow | Visualizing formulaic logic and financial / operational value drivers | Additional Library P. 27 |
| 28 | `process_flow` | Process Flow Stages | Depicting step-by-step operational workflows and procedural stages | Additional Library P. 28 |
| 29 | `cycle` | Closed-Loop Cycle | Depicting virtuous cycles, flywheel dynamics, or iterative feedback loops | Additional Library P. 29 |
| 30 | `chevron_rail` | Chevron Rail Stages | Showing progression through high-level phases using a top-level chevron rail | Additional Library P. 30 |
| 31 | `chevron_value_chain` | Value Chain Chevrons | Displaying an end-to-end industry or enterprise value chain | Additional Library P. 31 |
| 32 | `decision_fork` | Decision Fork | Illustrating branching decision points, alternatives, and selection criteria | Additional Library P. 32 |
| 33 | `roadmap` | Implementation Roadmap | Mapping long-term strategic execution across milestones and workstreams | Additional Library P. 33 |
| 34 | `gantt` | Gantt Chart | Visualizing detailed project schedules, dependencies, and delivery windows | Additional Library P. 34 |
| 35 | `decision_page` | Executive Decision Page | Formally requesting executive sign-off: decision items, premises, and actions | Additional Library P. 35 |

---

## 3. Usage Guidelines

- The `h1` in each template section simply displays the archetype name. In production decks, overwrite every `h1` with an assertive takeaway statement derived from your storyline (slide-rules §2.8). Never leave template placeholders (`Text N`, `Label N`, `YYYY`) in your deck (`check_deck.py` will report a FAIL).
- Default colors and fonts are identical across both files, configured via `:root` tokens (warm executive default). If adjusting brand tokens, keep both files aligned.
- When assembling by hand, remember that sections from the additional library require their corresponding CSS. `scripts/new_deck.py` handles this automatically by scoping each library's CSS under `.s` and `.slide`, ensuring that shared class names like `.bar` never collide.
- The archived SlideSpec pipeline (JSON to editable PPTX) is preserved at git tag `pipeline-archived` for historical reference.
