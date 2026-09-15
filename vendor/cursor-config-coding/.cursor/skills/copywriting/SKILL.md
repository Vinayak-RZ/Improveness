---
name: copywriting
description: >-
  Writes and audits public copy others will see: product READMEs, landing pages,
  headlines, CTAs, marketing pages, and other shipped prose. Use when the user
  asks for copy, copywriting, headlines, CTAs, taglines, hero copy, punchier
  README prose, marketing copy, or to make public text convert or read human.
  Loads anti-slop.md. Never invents proof. For GitHub READMEs, structure still
  comes from product-readme / readable-readme / extensive-readme.
---

# Copywriting

Write public copy that a stranger gets in two seconds, believes, and can act on.
This skill supplies **sentences**. README skills still own **structure**.

Compiled from: your business-config `direct-response-copy-engine` (Schwartz,
Masterson, Dry); Corey Haines conversion copy (clarity, one CTA, customer
language); Wikipedia [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
via [../readme/anti-slop.md](../readme/anti-slop.md). Fifty frameworks stay out.

**Load before drafting:** [../readme/anti-slop.md](../readme/anti-slop.md) and
[scorecard.md](scorecard.md).

## When to apply

- Marketing: landing, homepage, ads, captions, CTAs, headlines, value lines
- Product: README pitch, first screen, technique blurbs, "why it exists"
- Audit: "this copy is weak", "make this human", "punch this up"

**Not this skill**

| Want | Use |
|------|-----|
| README section order, proof command, file maps | `product-readme` / `readable-readme` / `extensive-readme` |
| Long-form ads, video hooks, 2026 feed playbooks | Business repo: `direct-response-copy-engine` |
| Category / JTBD / positioning workshop | Business repo: `positioning-ideas`, `value-proposition` |
| Internal architecture prose with no reader | Skip. Write the fact. |

If positioning is mushy, say so in one line and write the smallest true claim.
Do not invent a category. Do not invent counts to sound like a studio landing.

## Hard lines

- **One idea, one reader, one promise, one action.** Extra benefits get cut or demoted.
- **Channel desire.** Start at the want they already have, not the product internals.
- **Never invent proof.** Numbers, customers, benches, "trusted by" come from the tree or the user. Missing proof → smaller true claim.
- **Concrete, falsifiable, nobody else.** Harry Dry's three tests on every important line. See [scorecard.md](scorecard.md).
- **Two seconds.** If it needs a decoder, rewrite.
- **Anti-slop pass.** LLM cadence is a ship blocker. Earned contrast (two checkable facts) is allowed. Empty upgrade ("it's not a tool, it's a revolution") is not. A narrow **category claim** with tree-true counts is allowed (see below).

## Surfaces

### README (default when a README skill is also loaded)

GitHub is a **category landing**, not a PAS sales letter, and not a teaching essay that hides the offer.

Pick the lead from the **product kind** (the README skill names the kind; copy fills the blanks from this tree only):

| Kind | Lead (in this order) |
|------|----------------------|
| Named product people clone and run with an AI host (studio, harness, lab, domain kernel, agent system) | **Category line** → **host conversion** → **countable proof** |
| Library / SDK / small CLI | **Promise + proof command** (what it is, then how to prove it) |

**Category line.** Under the product name: `The first {narrow category}.` The blank must be words a stranger already has (lab, studio, system) and specific enough a rival cannot paste it. "AI platform" is not a category. Coined class names (kernel, harness-as-product-class) stay out of this line. "World's first" is a positioning bet, not a census. Skip it on a crowded commodity (the 50th HTTP client).

**Host conversion.** First paragraph of the body: `Turn your {tool they already run} into a {complete job}.` Then: `Describe {input} in plain language. {Product} handles {named stages that exist in this tree}.` Do not restack the category sentence here.

**Countable proof.** Same paragraph or the next: only real inventory (packs, pipelines, workflows, tools, files, hosts). If you have two true counts, stop. Do not invent a third to complete a cadence.

**GitHub About.** Repo-settings blurb, not a second heading: `World's first {narrow category}. {counts}. Turn your {host} into a {job}.` The README heading keeps `The first`. The body keeps conversion + counts.

**Coined class name.** If the tree names a class the public does not already say (for example a kernel that sits under a general agentic harness), define it once, in one sentence, before you ask them to act: `{term} is what enables a general {harness} to have expertise in {this domain}.` Then instantiate: this product is that {term} for {the field}. Do not lead the page with the coinage.

Do **not** PAS-agitate ("tired of buggy X?"). Do **not** open with a chatbot insult. Nearby-wrong stays once, after the conversion, as a contract.

- Structure: the loaded README skill.
- Copy job: category / conversion / counts / invariant / technique lines pass the scorecard.
- Action: the prompt they paste, or the proof command. Not "Get Started" with nothing behind it.
- GitHub **About** blurb: world's first + counts + conversion. Do not paste that stack as a second heading in the README.

### Marketing page / landing

One message, one CTA. Match the lead to awareness (below). Headline = the one idea. Subhead adds the mechanism or the proof. CTA = verb + what they get. Category + conversion is fair here too when the product is a named studio/kernel.

### Ads, captions, hooks

First line earns the next moment. No windup. Point at a fact.

## Intake (do not skip)

Pull from the repo first. Ask only for gaps. Never fill a gap with a guess.

1. **Surface:** README, landing, ad, caption, other
2. **One reader:** one face, one situation
3. **Want they already have:** finish: "They already want ____. They do not believe ____ can get them there."
4. **Offer:** what it is, in one or two plain sentences
5. **Real proof:** commands, numbers, gold tests, named limits. Mark missing.
6. **Awareness:** unaware / problem-aware / solution-aware / product-aware / most-aware
7. **Sophistication:** have they heard this claim to death? If yes, lead with the how, not the promise.
8. **One action:** the next step
9. **Product kind:** named host-run product vs library (drives the README lead)

Thin proof means a quieter claim. It does not mean a louder adjective.

## Generate

1. Lock the **one idea**. Easy to understand, easy to believe, something a competitor cannot sign. Fail any check → work the idea, not the adjectives.
2. Pick the **lead** (Masterson + README kind):
   - Named host-run product: Category + conversion + counts
   - Library README: Promise + Offer (what it is, then the proof command)
   - Cold marketing (unaware/problem-aware): Problem-solution, story, or a checkable proclamation
3. Write the **hook**. Run Dry's tests.
4. Write the **body**. Each section proves the one idea. Features become: mechanism → what changes for the reader → limit or proof. First-screen copy uses **public category language**. Internal codes, harness letters, and ticket ids wait until Go deeper.
5. **One ask.**
6. Run [scorecard.md](scorecard.md) and the anti-slop **Pass**. Rewrite until both are clean.

Headline formulas that stay specific:

- `The first {narrow category}` / `World's first {narrow category}`
- `Turn your {host} into a {complete job}`
- `{outcome} without {named pain}`
- `The {category} for {named reader}`
- `{checkable fact}` (Volvo-style pointing)

Headline formulas that are slop unless the blanks are facts: "Unlock the power of", "The future of", "It's not just X".

## Audit

1. State the one idea in one sentence. If you cannot, that is finding #1.
2. Score with [scorecard.md](scorecard.md). Quote failing lines.
3. Verdict: foundation / wording / structure / ship.
4. Fixes in priority order (foundation first).
5. One strongest rewrite of the hook or the one idea, using only real proof.

## Voice

- Customer language over company language. Mirror how the reader names the job.
- `is` / `has` / `does`. Not "enables you to leverage".
- Short. One idea per sentence.
- Humor only if it is true and cheap. Never puns that hide the claim.
- Repeat the real product name. Do not elegant-vary into "the solution".

## Pairing

| Also loaded | Copywriting does | The other skill does |
|-------------|------------------|----------------------|
| `product-readme` | Category, conversion, counts, invariant wording, technique lines, captions | Section order, mascot vs wordmark, proof command, limits required |
| `readable-readme` | Concept brief in human nouns | 7-section skeleton, cap of 5 ideas |
| `extensive-readme` | Why a file exists, in a sentence you can see | Package map, path accuracy |
| `impeccable` | UI microcopy | Layout, type, motion |

## Do not

- Overlay AIDA/PAS on a product README
- Open a product README by dunking on chatbots
- Stack CTAs ("star, follow, and try")
- Use "Learn More" / "Get Started" / "Click Here" when a specific verb exists
- Pepper rhetorical questions as a default ("Tired of X?")
- Cite invented conversion stats (including third-party "+81% conversions" claims)
- Copy a competitor's line and swap the noun
- Invent inventory counts to mimic another landing's rhythm
- Skip anti-slop because "this is marketing"
- Name a customer product inside this skill file
