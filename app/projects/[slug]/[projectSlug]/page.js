import React from 'react';
import { getCategories, getProjects, isPreviewAuthorized } from '@/lib/content';
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  buildAlternates,
  toRelativeOrExternalUrl,
  cleanProjectDescription,
  buildCreativeWorkJsonLd
} from '@/lib/seo';
import ProjectCaseStudyView from '@/components/ProjectCaseStudyView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({
    slug: p.folderId,
    projectSlug: p.slug || p.id
  }));
}

export async function generateMetadata({ params, searchParams }) {
  const categorySlug = params?.slug || '';
  const projectSlug = params?.projectSlug || '';
  const isAr = searchParams?.lang === 'ar';
  const locale = isAr ? 'ar_EG' : 'en_US';
  const alternateLocale = [isAr ? 'en_US' : 'ar_EG'];
  const isPreview = isPreviewAuthorized(searchParams?.preview);

  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects({ isDraft: isPreview })
  ]);

  const matchedProject = projects.find(
    (p) => p.slug === projectSlug || p.id === projectSlug
  );
  const matchedCategory = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  );

  if (matchedProject) {
    const projTitle = isAr
      ? matchedProject.title.ar || matchedProject.title.en
      : matchedProject.title.en;
    const catLabel = matchedCategory
      ? isAr
        ? matchedCategory.title.ar || matchedCategory.title.en
        : matchedCategory.title.en
      : isAr
        ? matchedProject.cat.ar || matchedProject.cat.en
        : matchedProject.cat.en;
    const title = `${projTitle} — ${catLabel}`;
    const description = cleanProjectDescription(matchedProject, isAr ? 'ar' : 'en');
    const ogImage = toRelativeOrExternalUrl(matchedProject.thumbnail);
    const canonicalPath = `/projects/${matchedProject.folderId || categorySlug}/${
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
    title: 'Project Case Study',
    description: 'Selected design work by Mohamed Tarek — Graphic Designer & UI/UX Designer.',
    alternates: buildAlternates(`/projects/${categorySlug}/${projectSlug}`),
    openGraph: {
      title: `Project Case Study — ${SITE_NAME}`,
      description: 'Selected design work by Mohamed Tarek — Graphic Designer & UI/UX Designer.',
      url: `/projects/${categorySlug}/${projectSlug}`,
      type: 'article',
      locale,
      alternateLocale,
      siteName: SITE_NAME,
      images: [DEFAULT_OG_IMAGE]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Project Case Study — ${SITE_NAME}`,
      description: 'Selected design work by Mohamed Tarek — Graphic Designer & UI/UX Designer.',
      images: [DEFAULT_OG_IMAGE]
    }
  };
}

export default async function ProjectCaseStudyPage({ params, searchParams }) {
  const categorySlug = params?.slug || '';
  const projectSlug = params?.projectSlug || '';
  const isPreview = isPreviewAuthorized(searchParams?.preview);

  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects({ isDraft: isPreview })
  ]);

  const matchedProject = projects.find(
    (p) => p.slug === projectSlug || p.id === projectSlug
  );
  const matchedCategory = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  );

  const creativeWorkJsonLd = matchedProject
    ? buildCreativeWorkJsonLd(
        matchedProject,
        matchedCategory,
        `/projects/${matchedProject.folderId || categorySlug}/${
          matchedProject.slug || matchedProject.id
        }`
      )
    : null;

  return (
    <main id="app" className="standalone-folder-page standalone-case-study-page">
      {creativeWorkJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
        />
      )}
      <ProjectCaseStudyView categorySlug={categorySlug} projectSlug={projectSlug} />
      <Contact />
      <Footer />
    </main>
  );
}
