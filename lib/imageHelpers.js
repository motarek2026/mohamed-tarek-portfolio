// Tiny dark-tinted SVG blur placeholder for next/image project covers
const SVG_BLUR =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20"><rect width="16" height="20" fill="#130f22"/></svg>';

export const BLUR_DATA_URL = `data:image/svg+xml;base64,${
  typeof Buffer !== 'undefined'
    ? Buffer.from(SVG_BLUR).toString('base64')
    : 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyMCI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMTMwZjIyIi8+PC9zdmc+'
}`;
