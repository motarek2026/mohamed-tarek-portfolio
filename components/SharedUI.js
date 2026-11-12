'use client';

import React from 'react';
import { usePortfolio, socHref } from '@/context/PortfolioContext';

export function AnimatedWords({ text }) {
  const words = String(text || '')
    .split(/\s+/)
    .filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="wd">
            <span style={{ '--i': i }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </>
  );
}

export function EditableText({
  path,
  value,
  tag: Tag = 'span',
  className = '',
  singleLine = false,
  animatedWords = false,
  style
}) {
  const { editing, updateLocalizedPath, tx } = usePortfolio();
  const text = value !== undefined ? tx(value) : '';

  if (!editing && animatedWords) {
    return (
      <Tag className={`ed ${className}`.trim()} style={style}>
        <AnimatedWords text={text} />
      </Tag>
    );
  }

  return (
    <Tag
      className={`ed ${className}`.trim()}
      style={style}
      contentEditable={editing}
      suppressContentEditableWarning
      spellCheck={false}
      onKeyDown={(e) => {
        if (singleLine && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onBlur={(e) => {
        if (editing && path) {
          const nextVal = e.currentTarget.innerText.replace(/\n$/, '');
          updateLocalizedPath(path, nextVal);
        }
      }}
    >
      {text}
    </Tag>
  );
}

export function ToolIconBadge({ tool, className = '', index = 0 }) {
  return (
    <span
      className={`tool ${className}`.trim()}
      style={{
        '--tbg': tool.bg,
        '--tfg': tool.fg,
        '--tc': tool.tc,
        '--n': index
      }}
      title={tool.name}
    >
      {tool.id === 'fig' ? (
        <svg viewBox="0 0 38 57" aria-hidden="true">
          <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
          <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
          <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" />
          <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5z" />
          <path fill="#FF7262" d="M19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z" />
        </svg>
      ) : tool.id === 'cc' ? (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M14 8l20 24M34 8L14 32" />
          <circle cx="12" cy="38" r="5" />
          <circle cx="36" cy="38" r="5" />
        </svg>
      ) : (
        <b translate="no">{tool.txt}</b>
      )}
    </span>
  );
}

export function NetworkSvg({ id }) {
  switch (id) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'behance':
      return (
        <b className="g" translate="no" aria-hidden="true">
          Bē
        </b>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14 8h2.5V4.5H14C11.8 4.5 10.5 5.9 10.5 8v2H8v3.5h2.5V20H14v-6.5h2.3l.5-3.5H14V8.8c0-.5.2-.8.8-.8z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 4v10.2a3.6 3.6 0 1 1-3.6-3.6" />
          <path d="M14 4c.3 2.4 2 4 4.5 4.2" />
        </svg>
      );
    case 'linkedin':
      return (
        <b className="g" translate="no" aria-hidden="true">
          in
        </b>
      );
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z" />
          <path
            d="M9.2 8.5c.3 2.2 2.8 5 5.6 5.7l1.3-1.3-2-1-.9.8c-.9-.4-1.9-1.4-2.3-2.3l.8-.9-.9-2z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case 'email':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M3.5 7.5l8.5 6 8.5-6" />
        </svg>
      );
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5.5" width="18" height="13" rx="4" />
          <path d="M10 9.3l5 2.7-5 2.7z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'pinterest':
      return <b className="g">P</b>;
    case 'x':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      );
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 2L11 13" />
          <path d="M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      );
    case 'dribbble':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M5 7.5c5 .5 9.5 0 13.5-3" />
          <path d="M8 20c.5-5 3.5-9 8.5-11" />
          <path d="M9.5 3.5C12 7 13.5 12 14 20.5" />
        </svg>
      );
    default:
      return <b className="g">•</b>;
  }
}

export function SocialLinksList({ skip = [] }) {
  const { site, networks, editing, updateSiteField, t } = usePortfolio();
  const list = site.socials || [];

  const handleEditSocial = (idx) => {
    const item = list[idx];
    if (!item) return;
    const net = networks[item.id];
    const v = window.prompt(t('socPrompt').replace('{name}', net ? net.name : item.id), item.value || '');
    if (v !== null) {
      updateSiteField((s) => {
        s.socials[idx].value = v.trim();
        return s;
      });
    }
  };

  const handleRemoveSocial = (idx) => {
    updateSiteField((s) => {
      s.socials.splice(idx, 1);
      return s;
    });
  };

  const handleAddSocial = (e) => {
    const id = e.target.value;
    e.target.value = '';
    if (!id || !networks[id]) return;
    const v = window.prompt(t('socPrompt').replace('{name}', networks[id].name), '') || '';
    updateSiteField((s) => {
      s.socials.push({ id, value: v.trim() });
      return s;
    });
  };

  const restNetworks = Object.keys(networks).filter((id) => !list.some((s) => s.id === id));

  return (
    <div className="socials in">
      {list.map((s, i) => {
        const n = networks[s.id];
        if (!n || skip.includes(s.id)) return null;
        const href = socHref(s.id, s.value);
        const tooltip = n.name + (href ? '' : ' · ' + t('notLinked'));
        const styleObj = { '--bh': n.bh, '--n': i };

        if (editing) {
          return (
            <span className="socw" key={`${s.id}-${i}`}>
              <button
                type="button"
                className={`soc ${href ? '' : 'off'}`}
                style={styleObj}
                data-name={tooltip}
                aria-label={n.name}
                title={s.value || t('notLinked')}
                onClick={() => handleEditSocial(i)}
              >
                <NetworkSvg id={s.id} />
              </button>
              <button
                type="button"
                className="sx"
                aria-label="Remove"
                onClick={() => handleRemoveSocial(i)}
              >
                &times;
              </button>
            </span>
          );
        }

        // In view mode, only render functional links so there are no dead/decorative buttons
        if (!href) return null;

        const isExternal = /^https?:/.test(href);
        return (
          <a
            key={`${s.id}-${i}`}
            className="soc"
            style={styleObj}
            data-name={tooltip}
            aria-label={n.name}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            <NetworkSvg id={s.id} />
          </a>
        );
      })}

      {editing && restNetworks.length > 0 && (
        <select className="socadd" aria-label="Add account" onChange={handleAddSocial} defaultValue="">
          <option value="">{t('socAdd')}</option>
          {restNetworks.map((id) => (
            <option key={id} value={id}>
              {networks[id].name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
