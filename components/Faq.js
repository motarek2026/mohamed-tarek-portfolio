'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords } from './SharedUI';

export default function Faq() {
  const { site, tx, t, lang, editing, updateSiteField } = usePortfolio();
  const [openIndices, setOpenIndices] = useState([0]);
  const list = site.faq || [];
  if (!list.length && !editing) return null;

  const toggleItem = (idx) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="faq wrap" id="faq">
      <div className="faq-grid">
        <div>
          <h2 className="big rv">
            {editing ? t('faqTitle') : <AnimatedWords text={t('faqTitle')} />}
          </h2>
        </div>

        <div className="faq-list">
          {list.map((f, i) => {
            const isOpen = editing || openIndices.includes(i);
            return (
              <div
                key={i}
                className={`fq rv ${isOpen ? 'open' : ''}`.trim()}
                style={{ '--d': `${(i * 0.06).toFixed(2)}s` }}
              >
                {editing ? (
                  <div className="fq-q">
                    <EditableText
                      path={`site.faq.${i}.q`}
                      value={f.q}
                      tag="span"
                      singleLine
                    />
                    <i className="fq-i" />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="fq-q"
                    aria-expanded={isOpen}
                    onClick={() => toggleItem(i)}
                  >
                    <span>{tx(f.q)}</span>
                    <i className="fq-i" />
                  </button>
                )}

                <div className="fq-a">
                  <div>
                    <EditableText
                      path={`site.faq.${i}.a`}
                      value={f.a}
                      tag="p"
                      className="fq-t"
                    />
                  </div>
                </div>

                {editing && (
                  <button
                    type="button"
                    className="x"
                    aria-label="Remove"
                    onClick={() =>
                      updateSiteField((st) => {
                        st.faq.splice(i, 1);
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
    </section>
  );
}
