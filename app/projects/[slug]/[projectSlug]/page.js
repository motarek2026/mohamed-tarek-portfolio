import React from 'react';
import { getCategories, getProjects, isPreviewAuthorized } from '@/lib/content';
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
  const projects = await getProjects();
  return projects.map((p) => ({
    slug: p.folderId,
    projectSlug: p.slug || p.id
  }));
}

export async function generateMetadata({ params, searchParams }) {
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

  if (matchedProject) {
    const catLabel = matchedCategory
      ? matchedCategory.title.en
      : matchedProject.cat.en;
    const title = `${matchedProject.title.en} — ${catLabel}`;
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
    title: 'Project Case Study',
    description: 'Selected design work by Mohamed Tarek — Graphic Designer & UI/UX Designer.'
  };
}

export default function ProjectCaseStudyPage({ params }) {
  const categorySlug = params?.slug || '';
  const projectSlug = params?.projectSlug || '';

  return (
    <main id="app" className="standalone-folder-page standalone-case-study-page">
      <ProjectCaseStudyView categorySlug={categorySlug} projectSlug={projectSlug} />
      <Contact />
      <Footer />
    </main>
  );
}
