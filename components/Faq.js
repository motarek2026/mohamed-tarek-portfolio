'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  MessageSquare,
  Plus,
  Minus,
  Sparkles,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords } from './SharedUI';

export default function Faq() {
  const { site, tx, t, lang, editing, updateSiteField, waLink } = usePortfolio();
  const [openIndices, setOpenIndices] = useState([0]); // Open first item by default
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const list = site.faq || [];
  const isAr = lang === 'ar';

  // Category mapping based on question keywords/indices
  const categorizedList = useMemo(() => {
    return list.map((item, idx) => {
      let category = 'process';
      const qText = ((item.q?.en || '') + ' ' + (item.q?.ar || '')).toLowerCase();
      if (qText.includes('file') || qText.includes('ملفات') || qText.includes('arabic') || qText.includes('عربي')) {
        category = 'deliverables';
      } else if (qText.includes('change') || qText.includes('تعديل') || qText.includes('touch') || qText.includes('تواصل')) {
        category = 'revisions';
      }
      return {
        ...item,
        originalIndex: idx,
        category
      };
    });
  }, [list]);

  // Filtered questions based on category and optional search query
  const filteredList = useMemo(() => {
    return categorizedList.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const questionStr = (tx(item.q) || '').toLowerCase();
      const answerStr = (tx(item.a) || '').toLowerCase();
      return questionStr.includes(q) || answerStr.includes(q);
    });
  }, [categorizedList, activeCategory, searchQuery, tx]);

  if (!list.length && !editing) return null;

  const toggleItem = (idx) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const areAllExpanded =
    filteredList.length > 0 &&
    filteredList.every((item) => openIndices.includes(item.originalIndex));

  const toggleExpandAll = () => {
    if (areAllExpanded) {
      setOpenIndices([]);
    } else {
      setOpenIndices(filteredList.map((item) => item.originalIndex));
    }
  };

  const directWaHref = waLink(
    isAr
      ? 'أهلاً محمد، كان عندي استفسار بخصوص تفاصيل الشغل والخدمات.'
      : 'Hello Mohamed, I have a question regarding your design services.'
  );

  return (
    <section className="faq wrap faq-modern-section" id="faq" aria-label={t('faqTitle')}>
      <div className="faq-modern-grid">
        {/* Left Sticky Column: Title, Narrative & Direct Help Card */}
        <div className="faq-sidebar">
          <div className="faq-sidebar-header">
            <span className="eyebrow">
              <HelpCircle size={14} className="eyebrow-icon" />
              {t('faqBadge')}
            </span>

            <h2 className="big faq-headline rv">
              {editing ? t('faqTitle') : <AnimatedWords text={t('faqTitle')} />}
            </h2>

            <p className="lead faq-sidebar-lead">{t('faqSub')}</p>
          </div>

          {/* Direct WhatsApp Consultation Card */}
          <div className="faq-consultation-card">
            <div className="fcc-top-row">
              <div className="fcc-avatar-wrap">
                <Image
                  src="/images/profile-photo.jpg"
                  alt="Mohamed Tarek"
                  width={46}
                  height={46}
                  className="fcc-avatar-img"
                />
                <span className="fcc-online-dot" title="Available for projects" />
              </div>
              <div className="fcc-text-col">
                <span className="fcc-name">Mohamed Tarek</span>
                <span className="fcc-status-note">
                  <Clock size={11} />
                  {t('faqRepliesQuick')}
                </span>
              </div>
            </div>

            <p className="fcc-description">
              {isAr
                ? 'عندك سؤال أو متطلبات خاصة بمشروعك؟ اسألني مباشرة وسأوضح لك كل التفاصيل.'
                : 'Have a specific question or custom scope? Message me directly on WhatsApp.'}
            </p>

            <a
              href={directWaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn ghost fcc-wa-btn"
            >
              <MessageCircle size={15} className="fcc-wa-icon" />
              <span>{t('faqAskWhatsApp')}</span>
              <ArrowUpRight size={14} className="fcc-arrow-icon" />
            </a>
          </div>
        </div>

        {/* Right Column: Category Filters, Utility Actions & Accordion Cards */}
        <div className="faq-main-col">
          {/* Top Control Bar: Category Chips + Expand All Button */}
          <div className="faq-controls-bar">
            <div className="faq-category-pills" role="tablist" aria-label="FAQ categories">
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'all'}
                className={`faq-cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                {t('faqCategoryAll')}
                <span className="faq-pill-count">{list.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'process'}
                className={`faq-cat-pill ${activeCategory === 'process' ? 'active' : ''}`}
                onClick={() => setActiveCategory('process')}
              >
                {t('faqCategoryProcess')}
                <span className="faq-pill-count">
                  {categorizedList.filter((c) => c.category === 'process').length}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'deliverables'}
                className={`faq-cat-pill ${activeCategory === 'deliverables' ? 'active' : ''}`}
                onClick={() => setActiveCategory('deliverables')}
              >
                {t('faqCategoryDeliverables')}
                <span className="faq-pill-count">
                  {categorizedList.filter((c) => c.category === 'deliverables').length}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCategory === 'revisions'}
                className={`faq-cat-pill ${activeCategory === 'revisions' ? 'active' : ''}`}
                onClick={() => setActiveCategory('revisions')}
              >
                {t('faqCategoryRevisions')}
                <span className="faq-pill-count">
                  {categorizedList.filter((c) => c.category === 'revisions').length}
                </span>
              </button>
            </div>

            <button
              type="button"
              className="faq-expand-toggle-btn"
              onClick={toggleExpandAll}
              aria-label={areAllExpanded ? t('faqCollapseAll') : t('faqExpandAll')}
            >
              <span>{areAllExpanded ? t('faqCollapseAll') : t('faqExpandAll')}</span>
              {areAllExpanded ? <Minus size={13} /> : <Plus size={13} />}
            </button>
          </div>

          {/* Accordion Questions List */}
          <div className="faq-cards-list">
            {filteredList.map((f, i) => {
              const originalIndex = f.originalIndex;
              const isOpen = editing || openIndices.includes(originalIndex);
              const numStr = String(i + 1).padStart(2, '0');

              return (
                <div
                  key={originalIndex}
                  className={`faq-card-item ${isOpen ? 'open' : ''}`.trim()}
                  style={{ '--d': `${(i * 0.05).toFixed(2)}s` }}
                >
                  {editing ? (
                    <div className="faq-card-header-edit">
                      <span className="faq-num-badge">{numStr}</span>
                      <EditableText
                        path={`site.faq.${originalIndex}.q`}
                        value={f.q}
                        tag="span"
                        singleLine
                        className="faq-q-text"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="faq-card-trigger"
                      aria-expanded={isOpen}
                      onClick={() => toggleItem(originalIndex)}
                    >
                      <span className="faq-num-badge">{numStr}</span>
                      <span className="faq-q-text">{tx(f.q)}</span>
                      <span className="faq-card-icon" aria-hidden="true">
                        <ChevronDown size={17} className="faq-chevron" />
                      </span>
                    </button>
                  )}

                  <div className="faq-answer-collapse">
                    <div className="faq-answer-inner">
                      <div className="faq-answer-content">
                        <EditableText
                          path={`site.faq.${originalIndex}.a`}
                          value={f.a}
                          tag="p"
                          className="faq-a-paragraph"
                        />
                      </div>
                    </div>
                  </div>

                  {editing && (
                    <button
                      type="button"
                      className="x"
                      aria-label="Remove"
                      onClick={() =>
                        updateSiteField((st) => {
                          st.faq.splice(originalIndex, 1);
                          return st;
                        })
                      }
                    >
                      &times;
                    </button>
                  )}
                </div>
              );
            })}

            {editing && (
              <div className="addrow">
                <button
                  type="button"
                  className="addbtn"
                  onClick={() =>
                    updateSiteField((st) => {
                      st.faq.push({
                        q: { en: 'New question?', ar: 'سؤال جديد؟' },
                        a: { en: 'Write the answer here.', ar: 'اكتب الإجابة هنا.' }
                      });
                      return st;
                    })
                  }
                >
                  {t('addFaq')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
