// Redirects www.labelcroptools.com to the apex, preserving path and query.
//
// Why a whole separate Worker: the site Worker is assets-only, and Cloudflare serves a
// matching static asset *without* invoking Worker code, so a redirect placed there would
// never run for a normal page request. Forcing it to run (run_worker_first) would bill an
// invocation for every hit on the real site. The `_redirects` file cannot help either —
// Cloudflare lists "domain-level redirects" as unsupported there, because its rules match
// paths, not hostnames. So www gets its own Worker, which only ever sees www traffic.
const APEX = 'labelcroptools.com';

export default {
  fetch(request) {
    const url = new URL(request.url);
    url.hostname = APEX;
    url.protocol = 'https:';
    url.port = '';
    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
        // Deliberately an hour, not a year. A 301 is cached hard by browsers and is
        // painful to take back; an hour is plenty to avoid repeat round trips while
        // keeping the decision reversible.
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
};
