'use client';

import React from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { EditableText, AnimatedWords } from './SharedUI';

export default function Testimonials() {
  const {
    site,
    tx,
    t,
    lang,
    editing,
    updateSiteField,
    pickFile,
    openSingleImageLightbox
  } = usePortfolio();

  const list = site.testimonials || [];
  if (!list.length && !editing) return null;

  return (
    <section className="testi wrap" id="testimonials">
      <h2 className="big rv">
        {editing ? t('testiTitle') : <AnimatedWords text={t('testiTitle')} />}
      </h2>
      <div className="tmgrid">
        {list.map((s, i) => {
          const nm = tx(s.name) || '?';
          const initial = nm.trim().charAt(0).toUpperCase();
          return (
            <figure
              key={i}
              className="tm rv"
              style={{ '--d': `${(i * 0.1).toFixed(2)}s` }}
            >
              {s.shot && (
                <button
                  type="button"
                  className="tm-shot"
                  aria-label={`${t('view')} — ${nm}`}
                  onClick={() => openSingleImageLightbox(s.shot, nm)}
                >
                  <img
                    src={s.shot}
                    alt=""
                    width={420}
                    height={260}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              )}

              <span className="tm-q" aria-hidden="true">
                “
              </span>

              <EditableText
                path={`site.testimonials.${i}.quote`}
                value={s.quote}
                tag="p"
                className="tm-t"
              />

              <figcaption>
                {s.avatar ? (
                  <img
                    className="tm-av"
                    src={s.avatar}
                    alt=""
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="tm-av tm-in">{initial}</span>
                )}
                <span className="tm-who">
                  <EditableText
                    path={`site.testimonials.${i}.name`}
                    value={s.name}
                    tag="span"
                    className="tm-n"
                    singleLine
                  />
                  <EditableText
                    path={`site.testimonials.${i}.role`}
                    value={s.role}
                    tag="span"
                    className="tm-r"
                    singleLine
                  />
                </span>
              </figcaption>

              {editing && (
                <>
                  <div className="tm-ctl">
                    <button
                      type="button"
                      className="pill"
                      onClick={() => pickFile({ type: 'tmavatar', i }, false, 'image/*')}
                    >
                      {t('tmPhoto')}
                    </button>
                    <button
                      type="button"
                      className="pill"
                      onClick={() => pickFile({ type: 'tmshot', i }, false, 'image/*')}
                    >
                      {t('tmShot')}
                    </button>
                    {s.avatar && (
                      <button
                        type="button"
                        className="pill"
                        onClick={() =>
                          updateSiteField((st) => {
                            delete st.testimonials[i].avatar;
                            return st;
                          })
                        }
                      >
                        {t('tmPhoto')} ×
                      </button>
                    )}
                    {s.shot && (
                      <button
                        type="button"
                        className="pill"
                        onClick={() =>
                          updateSiteField((st) => {
                            delete st.testimonials[i].shot;
                            return st;
                          })
                        }
                      >
                        {t('tmShot')} ×
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="x"
                    aria-label="Remove"
                    onClick={() =>
                      updateSiteField((st) => {
                        st.testimonials.splice(i, 1);
                        return st;
                      })
                    }
                  >
                    &times;
                  </button>
                </>
              )}
            </figure>
          );
        })}

        {editing && (
          <div className="addrow">
            <button
              type="button"
              className="addbtn"
              onClick={() =>
                updateSiteField((st) => {
                  st.testimonials.push({
                    quote: {
                      en: "Write the client's words here.",
                      ar: 'اكتب كلام العميل هنا.'
                    },
                    name: { en: 'Client name', ar: 'اسم العميل' },
                    role: { en: 'Role · Company', ar: 'الوظيفة · الشركة' }
                  });
                  return st;
                })
              }
            >
              {t('addTesti')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
