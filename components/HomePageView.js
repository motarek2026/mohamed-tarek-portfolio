'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { usePortfolio } from '@/context/PortfolioContext';
import IntroOverlay from '@/components/IntroOverlay';
import Hero from '@/components/HeroPortrait';
import Marquee from '@/components/Marquee';
import FeaturedWork from '@/components/FeaturedWork';

const VisualVault = dynamic(() => import('@/components/VisualVault'));
const ClientLogos = dynamic(() => import('@/components/ClientLogos'));
const About = dynamic(() => import('@/components/About'));
const Services = dynamic(() => import('@/components/Services'));
const Skills = dynamic(() => import('@/components/Skills'));
const Process = dynamic(() => import('@/components/Process'));
const Packages = dynamic(() => import('@/components/Packages'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));
const Faq = dynamic(() => import('@/components/Faq'));
const BriefForm = dynamic(() => import('@/components/BriefForm'));
const Contact = dynamic(() => import('@/components/Contact'));
const Footer = dynamic(() => import('@/components/Footer'));

export default function HomePageView() {
  const { projects, site, tx } = usePortfolio();

  const projectTitles = useMemo(
    () => projects.map((p) => tx(p.title)).filter(Boolean),
    [projects, tx]
  );
  const skillsList = useMemo(
    () =>
      String(tx(site.skills) || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    [site.skills, tx]
  );

  // Map of available homepage sections
  const sectionRenderers = useMemo(
    () => ({
      hero: (key) => <Hero key={key} />,
      work: (key) => (
        <React.Fragment key={key}>
          <Marquee items={projectTitles} reverse={false} />
          <FeaturedWork />
        </React.Fragment>
      ),
      projects: (key) => (
        <React.Fragment key={key}>
          <Marquee items={projectTitles} reverse={false} />
          <FeaturedWork />
        </React.Fragment>
      ),
      vault: (key) => <VisualVault key={key} />,
      clients: (key) => <ClientLogos key={key} />,
      about: (key) => <About key={key} />,
      services: (key) => <Services key={key} />,
      tools: (key) => <Skills key={key} />,
      skills: (key) => <Skills key={key} />,
      process: (key) => <Process key={key} />,
      packages: (key) => <Packages key={key} />,
      testimonials: (key) => <Testimonials key={key} />,
      faq: (key) => <Faq key={key} />,
      brief: (key) => <BriefForm key={key} />,
      contact: (key) => (
        <React.Fragment key={key}>
          <Marquee items={skillsList} reverse={true} />
          <Contact />
        </React.Fragment>
      )
    }),
    [projectTitles, skillsList]
  );

  // Determine sections order and enabled state
  const renderedSections = useMemo(() => {
    if (Array.isArray(site?.sections) && site.sections.length > 0) {
      const sorted = [...site.sections].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );
      const elements = [];
      for (const s of sorted) {
        if (s.enabled === false) continue;
        const renderer = sectionRenderers[s.id];
        if (renderer) {
          elements.push(renderer(s.id));
        }
      }
      if (elements.length > 0) return elements;
    }

    // Default static section sequence if sections config is not provided
    return [
      <Hero key="hero" />,
      <Marquee key="mq-proj" items={projectTitles} reverse={false} />,
      <FeaturedWork key="work" />,
      <ClientLogos key="clients" />,
      <VisualVault key="vault" />,
      <About key="about" />,
      <Services key="services" />,
      <Skills key="skills" />,
      <Process key="process" />,
      <Packages key="packages" />,
      <Testimonials key="testimonials" />,
      <Faq key="faq" />,
      <BriefForm key="brief" />,
      <Marquee key="mq-skills" items={skillsList} reverse={true} />,
      <Contact key="contact" />
    ];
  }, [site?.sections, sectionRenderers, projectTitles, skillsList]);

  return (
    <>
      <IntroOverlay />
      <main id="app">
        {renderedSections}
        <Footer />
      </main>
    </>
  );
}
