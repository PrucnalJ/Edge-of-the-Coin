/**
 * Prefixes Astro's `base` so root-relative links survive the GitHub Pages subfolder
 * preview. A no-op in production. Never write bare href="/..." in a template.
 */
const base = import.meta.env.BASE_URL;

export function url(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${base.endsWith('/') ? '' : '/'}${clean}`;
}
