export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugToTitlePattern(slug: string): string {
  return slug.replace(/-/g, ' ');
}

/** Checks if a string value has meaningful (non-whitespace) content */
export function hasContent(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0);
}
