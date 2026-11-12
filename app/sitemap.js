import { getCategories, getProjects } from '@/lib/content';
import { getActiveCategories } from '@/lib/categoryHelpers';
import { SITE_URL, withLangQuery } from '@/lib/seo';

function buildSitemapEntry(route, now, { changeFrequency, priority }) {
  const normalized = route === '' ? '/' : route;
  return {
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: `${SITE_URL}${withLangQuery(normalized, 'en')}`,
        ar: `${SITE_URL}${withLangQuery(normalized, 'ar')}`
      }
    }
  };
}

export default async function sitemap() {
  const now = new Date();

  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects()
  ]);

  const staticRoutes = [
    '',
    '/projects',
    '/about',
    '/creative-lab',
    '/services',
    '/pricing',
    '/start-project'
  ].map((route) =>
    buildSitemapEntry(route, now, {
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1.0 : 0.8
    })
  );

  const activeCategories = getActiveCategories(categories, projects);
  const categoryRoutes = activeCategories.map((cat) =>
    buildSitemapEntry(`/projects/${cat.slug}`, now, {
      changeFrequency: 'monthly',
      priority: 0.7
    })
  );

  const projectRoutes = projects.map((proj) =>
    buildSitemapEntry(`/projects/${proj.folderId}/${proj.slug || proj.id}`, now, {
      changeFrequency: 'monthly',
      priority: 0.6
    })
  );

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes];
}
