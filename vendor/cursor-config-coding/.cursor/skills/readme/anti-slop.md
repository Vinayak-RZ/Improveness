# Anti-AI slop (public copy)

Load this **before writing** any public prose this family authors:
`copywriting`, `product-readme`, `readable-readme`, `extensive-readme`. After
the draft, run **Pass** at the bottom. Rewrite until the pass is clean.

Patterns come from Wikipedia’s field guide
[Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
(WikiProject AI Cleanup). Encyclopedia detection, adapted for software docs
and marketing pages. Wikitext / AfC / citation markup is out.

One or two of these in isolation can be human. A page that stacks them is
unusable. Ban the stack.

This file stops **LLM cadence**. It does not flatten copy into beige. Specific
true contrast is how good copy works. Empty upgrade reframes are how models
write. The test is below.

## Allowed: factual nearby-wrong

Product and readable first screens **may** name what the thing is and what it
is not, in plain sentences:

> Queuekit is a job queue you can run today. It is not a workflow engine.

That is a contract. One nearby-wrong neighbor. No "just". No vibe-upgrade.

## Allowed: category claim

A named product people clone and run with an AI host **may** open with a
narrow category bet, immediately backed by inventory this tree can count:

> The first open-source {specific job-system}.
> 12 {pipelines}, 100 {tools}. Turn your AI coding assistant into a {complete job}.

"World's first" / "The first" is positioning, not a census. Keep it when the
category is narrow enough a rival cannot paste it, and the next sentence has
**tree-true counts**. Drop it on a crowded commodity (another HTTP client).
Do not invent a third count to complete a cadence.

This is not an empty upgrade. Empty upgrade is "it's not a tool, it's a
revolution" with no inventory.

## Allowed: earned contrast

Two checkable facts in tension may sit next to each other:

> The write path returns 204. It does not enqueue a second job.
> Melatonin knocks you out. This does not.

Keep it when **both** sides point at something you can verify (a command, a
file, a number, a named rival in this tree). Delete "not just". Delete the
second clause if it is a mood ("revolution", "backbone", "experience",
"future").

## Stop: empty upgrade cadence

Do not write the LLM "clearing up a misconception" move when the second half
is a bigger vibe. Wikipedia calls the family **negative parallelism**.

| Banned | Why |
|--------|-----|
| "It's not just X, it's Y" | Upgrade reframe. Ban even when Y is pretty. |
| "This isn't X. It's Y." | Same move, two sentences, unless both sides are facts (see earned contrast). |
| "Not only X, but also Y" | Inflates a list into a speech. |
| "No X, no Y, just Z" | Sales cadence. |

"X rather than Y" is fine when Y is a real alternative (a named rival in this
tree, a general-purpose tool for the same job). It is slop when Y is a slogan.

## Stop: inflated significance

Do not puff ordinary facts into legacy, landscape, or a broader movement.

Banned stems: stands as, serves as, testament, reminder, crucial / pivotal /
vital / significant / key role, underscores, highlights its importance,
reflects broader, symbolizing, contributing to, setting the stage, marking a
shift, turning point, evolving landscape, focal point, indelible mark, deeply
rooted, plays a role in.

Write the fact. Stop. If there is no specific, unusual fact, omit the sentence.

## Stop: -ing tails and fake analysis

Do not bolt a present-participle onto the end of a true sentence to add
"meaning":

- highlighting / underscoring / emphasizing …
- ensuring / reflecting / symbolizing …
- contributing to / cultivating / fostering / encompassing / enhancing …
- "valuable insights", "align with", "resonate with"

If the clause does not add a mechanism or a limit, delete it.

## Stop: AI vocabulary

Do not pack these. One accidental use is noise; several is the voice.

Additionally (especially starting a sentence), align with, boasts (for "has"),
bolstered, crucial, deep dive, delve, emphasizing, enduring, enhance,
fostering, garner, highlight (verb), interplay, intricate / intricacies, key
(adjective padding), landscape (abstract), meticulous, pivotal, robust,
showcase / showcasing, tapestry, testament, underscore (verb), valuable,
vibrant, nestled, rich, profound, groundbreaking, renowned, diverse array,
seamless, unlock, empower, leverage, cutting-edge, game-changing,
revolutionize, holistic, utilize (for "use").

Say **is** / **has** / **does**. Not "serves as", "stands as", "functions as",
"operates as", "represents a", "boasts", "features" (marketing), "offers a".

Do not hide the relationship: "X is associated with Y" / "in connection with"
when you mean "X is the CEO" or "X imports Y".

## Stop: rule of three and false ranges

Do not default to adjective triplets ("fast, reliable, and developer-friendly")
or three parallel noun phrases to look complete.

Do not write fake spectra: "from weekend scripts to global enterprises",
"ranging from X to Y" when there is no real range.

A list of three is fine when there are exactly three real items. Inventing a
third to complete the cadence is the tell.

## Stop: weasels and challenges formula

No "experts say", "observers note", "industry reports", "some critics argue"
without a named source. No "studies show". Cite or omit.

Do not close with the stock essay:

> Despite its [praise], {subject} faces several challenges… Despite these
> challenges, {subject} continues to…

Futures in these skills are named, short, done-when. Not "Challenges and
legacy" / "Future outlook".

## Stop: chatbot residue

These never belong in shipped public copy:

- "I hope this helps", "Of course!", "Certainly!", "You're absolutely right"
- "Would you like…", "let me know", "here is a more detailed breakdown"
- "In this README we will…", "Let's dive in", "Welcome to X"
- "It's important / crucial to note / remember"
- "In summary", "In conclusion", "Overall,"
- "As an AI…", knowledge-cutoff hedges, "while specific information is limited"
- Placeholders: `[Your Name]`, `[link]`, `TODO: add URL`, `INSERT_…`
- "Happy coding!", "And that's it!", "Ready to get started?"
- "Whether you're a beginner or an expert"
- "Why choose X?"

Do not restate a heading in the first sentence ("## Install" then "This
section covers installation").

Do not elegant-vary the product name into "the solution", "the platform", "the
offering", "the experience" in consecutive sentences. Repeat the real name.

## Stop: formatting tells

- **No em dashes** (`—`) and no `--` stand-ins. Comma, colon, semicolon,
  period, or parentheses.
- **Sentence-case headings.** Not Title Case Like A Slide Deck.
- **No emoji** in headings or as list bullets.
- **Bold sparingly.** Not every term. Not a "key takeaways" highlighter.
- Do not make every bullet `**Inline header:** rest of sentence`.
- Do not skip heading levels (`####` under `#` with no `##`).
- Do not put a duplicate H1 that only repeats the repo title.
- Do not decorate sections with `---` thematic breaks between every heading.
- Curly quotes (`“ ” ‘ ’`) in Markdown you author: use straight `"` and `'`.

Tables are for catalogs (commands, env, packages). Do not table two sentences.

## README-flavored slop

Same Wikipedia habits, software-docs costume. Also banned:

- Slogan claims you cannot prove ("trusted by", "blazing fast", "production-ready"
  with no proof command)
- Feature grids of interchangeable adjectives
- Restating the pitch after every section
- A concluding paragraph that repeats the first screen

## How to rewrite

1. Prefer **is / has / does** over marketing verbs.
2. One idea per sentence. Delete the -ing tail.
3. Name the concrete thing (command, file, invariant). Delete the vibe.
4. Keep the factual is / is not **once**, in the positioning blockquote.
5. If a stranger would say "ChatGPT wrote this", rewrite the paragraph. Do not
   sprinkle synonyms. Cut.

## Ineffective tells (do not over-correct)

Do not strip all formal words, all commas, or all transitions. Perfect grammar
is not proof of AI. "Bland" is not the goal. Specific and true is the goal.

## Pass (required before shipping)

- [ ] No "not just X, it's Y" / empty "this isn't X, it's Y" / "not only… but also" punch
- [ ] Remaining contrast has two checkable sides, or the is / is not contract appears once
- [ ] No inflated-significance stems; no -ing analysis tails
- [ ] AI vocabulary is absent or a single justified technical use
- [ ] Copulas stay "is/are/has"; no "serves as" / "boasts" / "stands as"
- [ ] No triplet padding; no fake "from X to Y"
- [ ] No weasels; no Despite-its-challenges closer
- [ ] No chatbot residue, placeholders, or "in conclusion"
- [ ] No em dashes, Title Case headings, emoji headings, or bold-every-term
- [ ] Product name stays the product name
- [ ] "World's first" / "The first" has a narrow category and tree-true counts, or it is absent
