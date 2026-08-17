# Product README — pre-ship checklist

## Routing

- [ ] This is a public product landing page, not a readable overview or internals dump
- [ ] Readable human README → `readable-readme`; package-by-package → `extensive-readme`
- [ ] If an extensive companion was requested: top banner links to `docs/EXTENSIVE.md`

## First screen

- [ ] Logo centered (existing brand, or new `assets/{product}-logo.svg`)
- [ ] Tagline + pitch answer what it is and who it is for
- [ ] A stranger can see how to try it (install or "Get started" nearby)
- [ ] Badges/nav only include URLs that exist

## Logo

- [ ] Did not overwrite an existing logo
- [ ] New SVG is flat, 1–2 colors, no gradients/3D/emoji-as-logo
- [ ] `alt` text is the product name or tagline

## Truth

- [ ] No invented features, benchmarks, "trusted by", or star counts
- [ ] Numbers come from this repo (benchmarks, issues, docs) or are omitted
- [ ] Terminal demo matches this project's CLI
- [ ] Screenshot captions teach something (not "the UI")

## Teaching

- [ ] 1–5 named techniques, not a generic Features list
- [ ] Each has mechanism + honest limit
- [ ] Citation URLs verified (WebSearch/WebFetch) or omitted
- [ ] Acknowledgements only name systems this repo uses or cites

## Shape

- [ ] Colibri section order, empty sections skipped
- [ ] Full env/API catalogs live in `docs/` or were left to `extensive-readme`
- [ ] Get started is pasteable (one install + one run)
- [ ] License stated if the repo has one
