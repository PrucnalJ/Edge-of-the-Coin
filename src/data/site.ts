export const site = {
  name: 'Edge of the Coin',
  domain: 'edgeofthecoin.com',
  tagline:
    'Every argument has two faces. This is about the third one \u2014 the narrow rim you stand on once you have read the honest case and the honest cost of both.',
  /**
   * Murray & Teare (1993), Physical Review E: an American nickel lands on its edge
   * roughly once in six thousand throws.
   */
  epigraph:
    'A tossed nickel lands on its edge about once in six thousand throws. Rare, unstable, and the only position from which you can see both faces at once.',
} as const;

/** The house rules, published on the site because that is the entire defence. */
export const houseRules = [
  {
    name: 'The steelman rule',
    body: "Each case is written as that side's smartest advocate would write it, never as its opponent characterises it. If an advocate would not sign the paragraph, it does not run.",
  },
  {
    name: 'No verdict, ever',
    body: 'This site never concludes. Every page ends by naming the trade-off. Breaking this rule once destroys the reason to read anything here.',
  },
  {
    name: 'Randomised order',
    body: 'Which position appears first is randomised per visit. Order bias is real and measurable; a fixed order quietly hands one side an advantage.',
  },
  {
    name: 'Sources from inside',
    body: "Each case is drawn from that position's own best writers, never from the opposition's summary of them. Partisan sources are labelled in line.",
  },
  {
    name: 'Every claim is typed',
    body: 'Empirical, values, or predictive. Empirical claims carry a source or they do not publish \u2014 the build fails on a missing citation.',
  },
  {
    name: 'Corrections are public',
    body: 'Every page carries its revision history. If we have misrepresented a position, say so and it gets fixed in the open.',
  },
] as const;
