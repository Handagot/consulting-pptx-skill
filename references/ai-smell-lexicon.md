# AI Smell & Slop Lexicon (Eliminating Artificial AI Tone)

A canonical guide for stripping presentation decks, emails, and consulting deliverables of "AI smell"—the industry phenomenon known as **AI slop: verbose, diluted, mass-produced writing characteristic of LLMs**.

Source: Consolidated from real-world executive review pushback where drafts were flagged as "sounding like AI", synthesized with linguistic markers of AI-generated text. Referenced directly by `slide-rules.md §7.9`. **Scan your vocabulary against this file and perform the 30-second self-check before final delivery.**

---

## 0. Core Lessons from Real Executive Reviews

- **Excessive Length. Cut ruthlessly** — "This is far too long; condense it to the core essence."
- **Condescending Over-Explanation** — Painstakingly spelling out obvious concepts or restating the prompt instantly exposes AI authorship.
- **Roundabout, Indirect Phrasing** — Excessive hedging and layers of modification disguise the point. State conclusions directly.
- **Repetitive Template Loops** — Repeating the exact same canned structure or acknowledging phrases across consecutive sections.
- **Superficial Decorative Bloat** — Traffic-light colored tables (red/yellow/green everywhere), emoji icons in headings, and decorative badges.

---

## 1. Words and Phrases to Eliminate

- **Empty Intensifiers**: *Truly*, *fundamentally*, *vastly*, *groundbreaking*, *revolutionary*, *next-generation*, *unprecedented*, *game-changing*, *it goes without saying that...*, *serves as nothing less than...*
- **Buzzword Overload**: *Synergy*, *seamless*, *end-to-end*, *holistic*, *paradigm*, *deep dive*, *value-add*, *actionable insights*, *leverage*, *streamline*.
- **Bloated Nominalizations**: *Optimization*, *efficiency enhancement*, *acceleration*, *maximization*, *utilization*, *foster*, *drive* → Replace with plain, active verbs (*improve*, *speed up*, *use*, *build*).
- **Corporate Sloganizing**: *Partnering hand-in-hand*, *walking alongside*, *striving tirelessly*, *reaching new heights*, *shaping the future of...*
- **Throat-Clearing Intros**: *In today's fast-paced world...*, *In recent years...*, *In the current business landscape...*, *As outlined below...*, *First and foremost...*
- **Excessive Hedging**: *It could be said that...*, *May be considered as...*, *Appears to potentially indicate...* → State facts directly.
- **Abstract Padding**: *From the perspective of...*, *In terms of...*, *Regarding the aspect of...*, *Key considerations around...* → Delete and connect the sentence directly.

---

## 2. Syntax and Structure to Break

- **Mechanical Framework Formulae**: Rigid three-part structures (Conclusion → Reason → Summary) repeated on every slide; "Here are 3 key pillars" templates; "First... Second... Finally..." numbering on trivial lists.
- **Generic Report Tone**: Bullet lists where every bullet has an artificial bolded label followed by run-on text, preceded by emoji icons.
- **Roundabout Passive Voice**: *Improvements were realized through the implementation of...* → *Implementing [X] improved [Y]*.
- **Rhythmic Triplets**: The compulsive urge to list exactly three parallel clauses (*streamline X, enhance Y, and optimize Z*).
- **Connector Overuse**: Beginning nearly every sentence with *Furthermore*, *In addition*, *Moreover*, *Therefore*, *Thus*, *Consequently*, or *Accordingly* (80% of these can be deleted outright).
- **Dash-Joined Pseudo-Structure**: Overusing ` — ` em-dashes to glue disparate clauses and explanations (*Label — Detailed explanation* repeated on every line) → Replace with periods, colons, or proper indentation.
- **Exposing Internal Thinking Frameworks**: Displaying theoretical labels like *Situation*, *Complication*, *Resolution* or *Issue / Countermeasure* directly on client slides → Use plain, business-grounded terms like *Context*, *Current Bottlenecks*, *Recommended Actions* (slide-rules §7.32).

---

## 3. Tone and Closings: Pruning the AI "Tail"

- **Deferred Action Stock Phrases**: *Details will be provided separately*, *We will examine this in due course*, *Further exploration will occur at a later stage* → State the concrete details, name the specific owner and timeline, or delete the line entirely (triggers WARN in `check_deck.py`).
- **Canned Sycophantic Sign-offs**: *We hope this proposal meets your expectations*, *Please let us know if you have any questions*, *We look forward to embarking on this transformative journey together*.
- **Unearned Flattery in Chat**: *Great question!*, *Spot-on observation!*, *You make an excellent point!* → Address the inquiry directly with precision.
- **Decorative Clutter**: Emojis and decorative symbols in slide headings (✉, 🔒, ✅, 📋, ⚠️, 👉, ▪).
- **Lifeless Perfection**: Devoid of real trade-offs, human voice, or concrete edge cases; overly neat, optimistic, and sterile.

---

## 4. Information Design

- **Exhaustive MECE Bloat**: Compulsively categorizing every minor detail into exhaustive taxonomies, where disclaimers and introductory fluff outweigh actionable substance → Prune ruthlessly.
- **The Human Counter-Standard**: Concise sentences; 1 thought per bullet; specific figures, dates, and explicit trade-offs; clear acknowledgment of constraints and uncertainties.

---

## 5. 30-Second Pre-Flight Self-Check (Before Delivery)

1. Have you deleted empty buzzwords, filler connectors, and throat-clearing openers?
2. Have you stripped emojis, decorative bullet symbols, and excessive bolding?
3. If you read the text out loud, does it sound like something an experienced human partner would say in a boardroom?
4. Are conclusions stated directly without timid hedges?
5. If a bullet or slide feels wordy, have you condensed it by at least 30%?

---

## Integration and Workflow

- **Presentation Slides**: Governed formally under `slide-rules.md §7.9`. The automated linter `check_deck.py` flags high-confidence AI smell patterns as `WARN`.
- **Division of Responsibility**: Phrasing habits common to both emails and slides belong in this lexicon. Rules specific to slide architecture (canvas layout, table axes, title message lines) belong in `slide-rules.md`.
- **Accumulation**: When you receive review feedback identifying unnatural phrasing, append a new line to this lexicon to continuously refine standards.
