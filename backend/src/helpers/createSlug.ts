export const createSlug = (slug: string) =>
  slug.toLowerCase().trim().replaceAll(' ', '_').replaceAll("'", '');
