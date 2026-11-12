import React from 'react';
import { notFound } from 'next/navigation';
import { getCategories, getProjects, isPreviewAuthorized } from '@/lib/content';
import { getActiveCategories } from '@/lib/categoryHelpers';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  buildAlternates,
  toRelativeOrExternalUrl,
  cleanProjectDescription,
  buildCreativeWorkJsonLd
} from '@/lib/seo';
import ProjectFolderView from '@/components/ProjectFolderView';
import ProjectCaseStudyView from '@/components/ProjectCaseStudyView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects()
  ]);
  const activeCategories = getActiveCategories(categories, projects);
  const categorySlugs = activeCategories.map((c) => ({ slug: c.slug }));
  const projectSlugs = projects.map((p) => ({ slug: p.slug || p.id }));
  return [...categorySlugs, ...projectSlugs];
}

export async function generateMetadata({ params, searchParams }) {
  const slug = params?.slug || '';
  const isAr = searchParams?.lang === 'ar';
  const locale = isAr ? 'ar_EG' : 'en_US';
  const alternateLocale = [isAr ? 'en_US' : 'ar_EG'];
  const isPreview = isPreviewAuthorized(searchParams?.preview);
  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects({ isDraft: isPreview })
  ]);

  const activeCategories = getActiveCategories(categories, projects);
  const matchedCategory = activeCategories.find((c) => c.slug === slug || c.id === slug);
  const matchedProject = projects.find((p) => p.slug === slug || p.id === slug);

  if (matchedCategory) {
    const catTitle = isAr
      ? matchedCategory.title.ar || matchedCategory.title.en
      : matchedCategory.title.en;
    const description = isAr
      ? matchedCategory.description.ar || matchedCategory.description.en
      : matchedCategory.description.en;
    const categoryProjects = projects.filter((p) => p.folderId === matchedCategory.id);
    const firstWithThumb = categoryProjects.find((p) => p.thumbnail);
    const ogImage = firstWithThumb
      ? toRelativeOrExternalUrl(firstWithThumb.thumbnail)
      : DEFAULT_OG_IMAGE;
    const canonicalPath = `/projects/${matchedCategory.slug}`;

    return {
      title: `${matchedCategory.title.en} (${matchedCategory.title.ar})`,
      description,
      alternates: buildAlternates(canonicalPath),
      openGraph: {
        title: `${catTitle} — ${SITE_NAME}`,
        description,
        url: canonicalPath,
        type: 'website',
        locale,
        alternateLocale,
        siteName: SITE_NAME,
        images: [{ url: ogImage, alt: catTitle }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${catTitle} — ${SITE_NAME}`,
        description,
        images: [ogImage]
      }
    };
  }

  if (matchedProject) {
    const projTitle = isAr
      ? matchedProject.title.ar || matchedProject.title.en
      : matchedProject.title.en;
    const projCat = isAr
      ? matchedProject.cat.ar || matchedProject.cat.en
      : matchedProject.cat.en;
    const title = `${projTitle} — ${projCat}`;
    const description = cleanProjectDescription(matchedProject, isAr ? 'ar' : 'en');
    const ogImage = toRelativeOrExternalUrl(matchedProject.thumbnail);
    const canonicalPath = `/projects/${matchedProject.folderId}/${
      matchedProject.slug || matchedProject.id
    }`;

    return {
      title,
      description,
      alternates: buildAlternates(canonicalPath),
      openGraph: {
        title: `${projTitle} — ${SITE_NAME}`,
        description,
        url: canonicalPath,
        type: 'article',
        locale,
        alternateLocale,
        siteName: SITE_NAME,
        images: [{ url: ogImage, alt: projTitle }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${projTitle} — ${SITE_NAME}`,
        description,
        images: [ogImage]
      }
    };
  }

  return {
    title: 'Project Folder',
    description: 'Selected design work by Mohamed Tarek — Graphic Designer & UI/UX Designer.',
    alternates: buildAlternates(`/projects/${slug}`)
  };
}

export default async function ProjectFolderPage({ params, searchParams }) {
  const slug = params?.slug || '';
  const isPreview = isPreviewAuthorized(searchParams?.preview);
  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects({ isDraft: isPreview })
  ]);
  const activeCategories = getActiveCategories(categories, projects);
  const matchedProject = projects.find((p) => p.slug === slug || p.id === slug);
  const matchedCategory = matchedProject
    ? categories.find((c) => c.id === matchedProject.folderId || c.slug === matchedProject.folderId)
    : activeCategories.find((c) => c.slug === slug || c.id === slug);

  if (!matchedProject && !matchedCategory) {
    notFound();
  }

  const creativeWorkJsonLd = matchedProject
    ? buildCreativeWorkJsonLd(
        matchedProject,
        matchedCategory,
        `/projects/${matchedProject.folderId}/${matchedProject.slug || matchedProject.id}`
      )
    : null;

  return (
    <main
      id="app"
      className={`standalone-folder-page ${
        matchedProject ? 'standalone-case-study-page' : ''
      }`.trim()}
    >
      {creativeWorkJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
        />
      )}
      {matchedProject ? (
        <ProjectCaseStudyView
          categorySlug={matchedProject.folderId}
          projectSlug={slug}
        />
      ) : (
        <ProjectFolderView slug={slug} isStandalonePage={true} />
      )}
      <Contact />
      <Footer />
    </main>
  );
}
