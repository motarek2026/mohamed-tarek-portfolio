// tests/content.test.mjs — Portfolio Content Fallback & Preview Auth Tests
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getProjects,
  getCategories,
  getSiteData,
  getTranslations,
  getAppearance,
  isPreviewAuthorized
} from '../lib/content.js';

describe('Portfolio Fallback Layer & Preview Security', () => {
  test('isPreviewAuthorized correctly authenticates preview tokens', () => {
    assert.equal(isPreviewAuthorized(null), false);
    assert.equal(isPreviewAuthorized(''), false);
    assert.equal(isPreviewAuthorized('invalid-token'), false);
    assert.equal(isPreviewAuthorized('1'), true);
  });

  test('getProjects falls back to local data with valid project structures', async () => {
    const projects = await getProjects();
    assert.equal(Array.isArray(projects), true);
    assert.equal(projects.length > 0, true);

    const first = projects[0];
    assert.equal(Boolean(first.slug), true);
    assert.equal(typeof first.title, 'object');
    assert.equal(Boolean(first.title.en), true);
    assert.equal(Array.isArray(first.images), true);
  });

  test('getCategories falls back to all portfolio category folders', async () => {
    const categories = await getCategories();
    assert.equal(Array.isArray(categories), true);
    assert.equal(categories.length >= 4, true);

    const slugs = categories.map((c) => c.slug);
    assert.equal(slugs.includes('social-media-campaigns'), true);
    assert.equal(slugs.includes('branding-identity'), true);
    assert.equal(slugs.includes('website-ui-ux'), true);
  });

  test('getSiteData falls back with complete bio, socials, and services', async () => {
    const site = await getSiteData();
    assert.equal(typeof site, 'object');
    assert.equal(site.name.en, 'Mohamed Tarek');
    assert.equal(Array.isArray(site.socials), true);
    assert.equal(Array.isArray(site.services), true);
  });

  test('getTranslations returns complete en and ar translation keys', async () => {
    const str = await getTranslations();
    assert.equal(typeof str.en, 'object');
    assert.equal(typeof str.ar, 'object');
    assert.equal(Boolean(str.en.work), true);
    assert.equal(Boolean(str.ar.work), true);
  });

  test('getAppearance provides valid studio tokens', async () => {
    const app = await getAppearance();
    assert.equal(Boolean(app.accent), true);
    assert.equal(Boolean(app.purple), true);
    assert.equal(app.defaultTheme, 'dark');
  });
});
