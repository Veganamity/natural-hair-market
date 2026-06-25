export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildListingPath(listing: {
  id: string;
  hair_length: string;
  hair_type: string;
  hair_color: string;
}): string {
  const slug = [
    'cheveux',
    `${listing.hair_length}cm`,
    slugify(listing.hair_type),
    slugify(listing.hair_color),
  ].join('-');
  return `/annonce/${slug}-${listing.id}`;
}

export function extractListingIdFromPath(path: string): string | null {
  const match = path.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
  return match ? match[1] : null;
}
