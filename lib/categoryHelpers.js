/**
 * Returns only categories that have at least one matching project.
 * Empty categories remain defined in data/categories.js (or Supabase)
 * and appear automatically as soon as a project is assigned to them.
 */
export function getActiveCategories(categories = [], projects = []) {
  return (categories || []).filter((cat) =>
    (projects || []).some((p) => p.folderId === cat.id)
  );
}
