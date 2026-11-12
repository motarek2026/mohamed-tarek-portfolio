import { getCategories, getProjects } from '@/lib/content';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects()
  ]);

  const staticRoutes = [
    '',
    '/about',
    '/creative-lab',
    '/services',
    '/pricing',
    '/start-project'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8
  }));

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/projects/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7
  }));

  const projectRoutes = projects.map((proj) => ({
    url: `${baseUrl}/projects/${proj.folderId}/${proj.slug || proj.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes];
}
