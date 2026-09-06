# Edge of the Coin

A site about controversial questions in politics and religion that never tells you what to
think. Each position gets **the case** — written as its strongest advocate would write it —
and **the cost**, conceded by that position's own serious thinkers. The second one is the
part nobody publishes, and it is the reason the site exists.

Astro 7, static output. `npm run build` emits the site to `dist/`.

## Commands

| | |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Static build to `dist/` |
| `npm run audit` | Balance audit across all topics |
| `npm run audit -- <slug>` | Balance audit on one topic |
| `npm run check` | Astro type and content-schema check |

## Where things live

| Thing | Path |
|---|---|
| Topics (the content) | `src/content/topics/*.md` |
| Content schema | `src/content.config.ts` |
| Balance audit | `tools/balance-audit.mjs` |
| Design tokens | `src/styles/global.css` |
| Site copy and house rules | `src/data/site.ts` |
| Pages | `src/pages/` |

## Writing a topic

Topics are markdown files with structured frontmatter. The schema in `src/content.config.ts`
enforces the editorial rules, so a page that breaks them fails the build rather than
publishing quietly:

- **At least two positions**, with no upper limit. Political questions usually have two;
  religious ones routinely have five or six. Do not assume two anywhere in the codebase.
- **Each position needs a `case` and a `cost`**, three claims minimum each.
- **Every claim is typed** `empirical`, `values`, or `predictive`.
- **Empirical claims must have a `source`.** No source, no build.
- **Every topic needs a `crux`** — the one question that, if answered, would actually move
  people, plus what each side would have to concede to cross over. A page without a crux is
  a list of talking points.

Use `caveat` when a source argues for the other side or is otherwise partisan. Say so in
line rather than hiding it; see the DPIC citation in `capital-punishment.md`.

## The balance audit

Nobody writes two positions equally well, because everybody has a side. The audit checks the
tells mechanically before anyone reads the page:

- **Length parity** between the case sections, and between the cost sections. The longer
  side usually belongs to the writer.
- **Claim-count and evidentiary parity** — one position argued from data and the other from
  principle is sometimes true of the topic, and sometimes the writer doing homework for the
  side they like.
- **Missing citations** on empirical claims (a hard error).
- **Claim-type coverage** — a position with no values claims is usually under-written.
- **Hedging asymmetry** — "some argue" on one side against "studies show" on the other is
  the classic tell.
- **Loaded language**, anywhere.

Warnings are for a human to overrule. Errors fail the build, and CI runs the audit before it
builds.

## Conventions

- Root-relative links and assets go through `url()` from `src/lib/url.ts`. Never write bare
  root-relative hrefs in a template, or the GitHub Pages subfolder preview breaks.
- The workspace path contains an ampersand, so `.npmrc` pins npm's script shell to Git Bash.
  Keep it; the Pages workflow overrides it with `/bin/bash` for the Linux runner.
- Position colours come from the `--pos-1..5` ramp in `global.css`. They are coin metals,
  matched in weight and saturation so no position reads as the favoured one, and they are
  deliberately **not red and blue**.
