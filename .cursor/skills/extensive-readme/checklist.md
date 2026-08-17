# Extensive README — pre-ship checklist

Run before delivering. Fix every fail. Do not ship a catalog-only README.

## Accuracy

- [ ] Features, paths, and counts match the current tree (not memory or an old README)
- [ ] Env vars match `.env.example` / config modules; required vs optional is correct
- [ ] Tool / API / CLI counts match the registry or routes
- [ ] Diagrams show interfaces that still exist
- [ ] Stack names are the ones in code (do not mix Chroma/Qdrant/Postgres by habit)

## Structure

- [ ] Major `##` sections numbered sequentially `1…N`
- [ ] Subsections use `N.M` matching the parent
- [ ] TOC lists every major section; anchors work
- [ ] Physical order matches numeric order
- [ ] Empty inapplicable sections were omitted, not left as placeholders

## Teaching (mandatory)

- [ ] 3–8 **ideas worth understanding** (or fewer only if the repo truly has fewer)
- [ ] Each idea has: name, mechanism, analogy, constraint, honest limits
- [ ] Each idea cites `{path}` or an invariant in this repo
- [ ] Ideas are bets/techniques, not a restated feature list
- [ ] **Further reading** exists when there are ideas to teach
- [ ] Every citation URL was verified (see [further-reading.md](further-reading.md))
- [ ] No invented, guessed, or "probably this arxiv id" links
- [ ] Glossary teaches terms as used here, not generic Wikipedia blurbs

## Voice

- [ ] Opening 30 lines: title, positioning, TL;DR
- [ ] A curious non-specialist can follow the narrative without a glossary in the other hand
- [ ] Required jargon is defined in one plain sentence on first use
- [ ] Hard ideas: simple explanation in the README, then a verified blog or wiki link
- [ ] Narrative (vision + ideas + how it works + future) is finishable in one sitting (~10–20 min); catalogs are tables, not essays
- [ ] No engagement bait; present tense for current behavior; past tense only in changelog
- [ ] Honest today vs roadmap

## Future advancements (mandatory)

- [ ] Section exists near the end of the README (after further reading / roadmap)
- [ ] At least **3** advancements, prefer **4**
- [ ] Each names a next bet, why it matters, what would land, and done-when
- [ ] Each is grounded in this repo (`{path}`, TODO, missing test, incomplete interface)
- [ ] None are generic slogans ("scale", "add AI", "more features")

## Routing

- [ ] This file is a reference manual, not a product landing page
- [ ] If the user asked for a public product README (logo, tagline, tiny quickstart), stop and use `product-readme`
