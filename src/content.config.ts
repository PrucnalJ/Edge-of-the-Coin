import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Every claim on the site is one of three kinds. This distinction is the whole
 * editorial point: most political and religious arguments are two people disputing
 * incompatible VALUES while both pretend to be disputing FACTS.
 *
 *   empirical  - a claim about the world. Requires a source.
 *   values     - a moral premise. No amount of data settles it.
 *   predictive - a forecast about consequences. May be falsified later.
 */
const claim = z.object({
  type: z.enum(['empirical', 'values', 'predictive']),
  text: z.string().min(20),
  /** Where it comes from. Required for empirical claims - enforced below. */
  source: z.string().optional(),
  /** Set when the source argues for the other side, or is otherwise partisan. */
  caveat: z.string().optional(),
}).superRefine((c, ctx) => {
  if (c.type === 'empirical' && !c.source) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Empirical claim has no source: "${c.text.slice(0, 60)}..."`,
    });
  }
});

/**
 * A position, not a "side". Political questions usually have two; religious ones
 * routinely have five or six. The array below is min(2) with no maximum on purpose -
 * hard-coding heads and tails here is the one mistake that is painful to undo later.
 */
const position = z.object({
  /** Short slug used for the colour ramp and the flip toggle. */
  id: z.string(),
  /** What this position is called by the people who hold it. */
  name: z.string(),
  /** One sentence, in that side's own terms. */
  summary: z.string(),
  /** The case, written as its strongest advocate would write it. */
  case: z.array(claim).min(3),
  /** The cost, conceded by that side's own serious thinkers. Never the opponent's attack. */
  cost: z.array(claim).min(3),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/topics' }),
  schema: z.object({
    /** Neutrally framed. Bad framing here poisons everything downstream. */
    question: z.string(),
    /** Short label for listings. */
    title: z.string(),
    domain: z.enum(['politics', 'religion']),
    status: z.enum(['draft', 'review', 'published']).default('draft'),
    updated: z.coerce.date(),
    positions: z.array(position).min(2),
    /**
     * The one question that, if answered, actually moves people. A page without a
     * crux is a list of talking points, so this is required, not optional.
     */
    crux: z.object({
      question: z.string(),
      explanation: z.string(),
      /** What each side would have to concede to cross over. */
      pivot: z.string(),
    }),
    /** Visible revision history. Being seen to correct is worth more than being right first. */
    revisions: z.array(z.object({
      date: z.coerce.date(),
      note: z.string(),
    })).default([]),
  }),
});

export const collections = { topics };
