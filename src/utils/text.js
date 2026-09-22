// Product descriptions come back from the API wrapped in real HTML (e.g.
// "<p>The house signature...</p>"), not plain text — rendered directly in JSX
// that shows up as literal "<p>" tags on the page rather than being parsed.
// DOMParser both strips the markup and decodes entities, without executing
// anything (a parsed HTMLDocument never runs scripts or fetches resources).
export const stripHtml = (html) => {
  if (!html) return '';
  return new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
};
