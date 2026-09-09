# Edge of the Coin

## What this is

A site for **edgeofthecoin.com**, a domain owned by Jim Prucnal's father. The premise: on a
controversial question, instead of picking heads or tails you stay on the edge of the coin —
you read the pros and cons of every side and decide for yourself. Focus is politics and
religion, at his request.

Built September 2026 with Astro 7 (static output). `npm run build` passes and emits 3 pages.
See README.md for commands and how to write a topic.

## Current status and next step

- **Nothing is launched.** This is a scaffold plus one specimen topic written to demonstrate
  the format. The domain is registered and currently serving a registrar parking page.
- The specimen topic (`capital-punishment.md`) is marked `status: draft`. Its sourcing has
  **not** been verified line by line. Do not publish it or treat its citations as checked.
- Source is on GitHub under the prucnal-sachdev organization. If the GitHub CLI is switched to another
  account, run `gh auth switch --user PrucnalJ` before pushing.
- No hosting decision yet. `.github/workflows/pages.yml` is set up for a GitHub Pages review
  copy, but Pages has not been enabled and the repo is private, so no preview is live.

## The editorial idea, in one place

The differentiator is **the cost section** — what a position gets wrong, conceded by people
who hold it. "Here is the honest cost of your own side" does not exist elsewhere and is the
whole product. Column-A/column-B pro-con lists are already owned by ProCon.org (Britannica);
AllSides does media bias; Kialo does argument trees.

Second differentiator: **every claim is typed** empirical / values / predictive. Most
political and religious arguments are two people disputing incompatible values while both
pretend to be disputing facts. Naming which is which defuses more than balanced prose does.

Third: **the crux** — the single question that actually moves people, named explicitly.

## Rules that are not up for renegotiation without asking

These are published on `/method/` and are the site's entire defence against the bias
accusations this subject matter guarantees:

- **Steelman.** If an advocate of a position would not sign the paragraph, it does not run.
- **No verdict, ever.** The site never concludes. Breaking this once destroys it.
- **Randomised order.** Which position leads is randomised per visit (inline script in
  `Faces.astro`). Order bias is real; a fixed order hands one side an advantage.
- **No open comments.** A free-text comment section on these topics, moderated by one
  person, becomes the brand within a month.
- **Sources from inside.** Each case comes from that position's own best writers, never the
  opposition's summary of them. Partisan sources get a `caveat` in line.

## Architecture decisions worth not undoing

- **Positions are an array with a minimum of 2 and no maximum.** Religion topics genuinely
  have five or six positions ("what happens after death"). Nothing in the codebase may
  assume two. This is why the layout is one column per position rather than a 2x2 grid.
- **The schema is the editorial policy.** Missing source on an empirical claim, missing
  crux, fewer than 3 claims in a section — all build failures, not review notes.
- Design tokens: nickel ground, ink, and a position ramp of coin metals (bronze, patina,
  oxide, slate, moss) matched in weight so none reads as favoured. Deliberately not red and
  blue — on an American politics site that palette carries a verdict before a word is read.
  Newsreader for headings, Libre Franklin for body, IBM Plex Mono for labels and claim tags.
- Claim tags differ by **border style** (solid / dotted / dashed) as well as colour, so the
  distinction survives greyscale, print and colourblind readers.

## Open questions for the client (his father) — all still unanswered

1. Business or passion project? Changes whether there is any revenue surface at all.
2. Named editorial voice, or institutional/anonymous? A byline earns trust and attracts fire.
3. Newsletter from day one? Recommended — it is the only audience actually owned.
4. Who has final approval before a page publishes? Must be one named person.
5. Realistically how many hours a week? Sets cadence, and whether more tooling is worth it.
6. Where is the domain registered, and can we get access to point DNS?

Do not invent answers to these. Do not add topics, hosting, analytics or a newsletter signup
before they are settled.

## Environment notes

- The workspace path contains an ampersand, so `.npmrc` sets `script-shell` to Git Bash.
  Keep it. The Pages workflow overrides it with `npm_config_script_shell=/bin/bash`.
- To reproduce a subfolder build locally from Git Bash, set the MSYS env-conversion exclusion
  first, or MSYS rewrites `BASE_PATH=/Edge-of-the-Coin` into a Windows path.
- On Astro 7, `astro preview` runs as a background daemon. Stop it with `npx astro preview stop`.
