import React from 'react';
import { getCategories, getProjects, isPreviewAuthorized } from '@/lib/content';
import ProjectFolderView from '@/components/ProjectFolderView';
import ProjectCaseStudyView from '@/components/ProjectCaseStudyView';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

function cleanDecisionText(text) {
  if (!text) return '';
  const trimmed = text.trim();
  if (
    /^add your design decisions here/i.test(trimmed) ||
    /^أضف قرارات التصميم هنا/.test(trimmed)
  ) {
    return '';
  }
  return trimmed;
}

export async function generateStaticParams() {
  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects()
  ]);
  const categorySlugs = categories.map((c) => ({ slug: c.slug }));
  const projectSlugs = projects.map((p) => ({ slug: p.slug || p.id }));
  return [...categorySlugs, ...projectSlugs];
}

export async function generateMetadata({ params, searchParams }) {
  const slug = params?.slug || '';
  const isPreview = isPreviewAuthorized(searchParams?.preview);
  const [categories, projects] = await Promise.all([
    getCategories(),
    getProjects({ isDraft: isPreview })
  ]);

  const matchedCategory = categories.find((c) => c.slug === slug || c.id === slug);
  const matchedProject = projects.find((p) => p.slug === slug || p.id === slug);

  if (matchedCategory) {
    const title = `${matchedCategory.title.en} (${matchedCategory.title.ar})`;
    const description = matchedCategory.description.en;
    const categoryProjects = projects.filter((p) => p.folderId === matchedCategory.id);
    const firstWithThumb = categoryProjects.find((p) => p.thumbnail);
    const ogImage = firstWithThumb ? firstWithThumb.thumbnail : '/projects/iphone-18-pro-max/01.jpg';

    return {
      title,
      description,
      openGraph: {
        title: `${matchedCategory.title.en} — Mohamed Tarek · Portfolio 2026`,
        description,
        type: 'website',
        images: [{ url: ogImage, alt: matchedCategory.title.en }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${matchedCategory.title.en} — Mohamed Tarek · Portfolio 2026`,
        description,
        images: [ogImage]
      }
    };
  }

  if (matchedProject) {
    const title = `${matchedProject.title.en} — ${matchedProject.cat.en}`;
    const goalText = (matchedProject.goal?.en || '').trim();
    const decisionText = cleanDecisionText(matchedProject.decision?.en);
    const description = [goalText, decisionText].filter(Boolean).join(' ').trim();
    const ogImage = matchedProject.thumbnail || '/projects/iphone-18-pro-max/01.jpg';

    return {
      title,
      description,
      openGraph: {
        title: `${matchedProject.title.en} — Mohamed Tarek · Portfolio 2026`,
        description,
        type: 'article',
        images: [{ url: ogImage, alt: matchedProject.title.en }]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${matchedProject.title.en} — Mohamed Tarek · Portfolio 2026`,
        description,
        images: [ogImage]
      }
    };
  }

  return {
    title: 'Project Folder',
    description: 'Selected design work by Mohamed Tarek — Graphic Designer & UI/UX Designer.'
  };
}

export default async function ProjectFolderPage({ params, searchParams }) {
  const slug = params?.slug || '';
  const isPreview = isPreviewAuthorized(searchParams?.preview);
  const projects = await getProjects({ isDraft: isPreview });
  const matchedProject = projects.find((p) => p.slug === slug || p.id === slug);

  return (
    <main
      id="app"
      className={`standalone-folder-page ${
        matchedProject ? 'standalone-case-study-page' : ''
      }`.trim()}
    >
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
