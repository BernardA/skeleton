/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
workbox.setConfig({
    debug: true,
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.routing.registerNavigationRoute('/', {
    blacklist: [
        new RegExp('/logout'),
        new RegExp('/_wdt.*'), // symfony's debugger
        new RegExp('/_profiler/.*'), // symfony's debugger
        new RegExp('/templates/.*'),
        new RegExp('/api.*'),
        new RegExp('/opcache_clear.php'),
        new RegExp('/favicon.ico'),
        new RegExp('/register/confirm/.*'),
        new RegExp('/img/.*'),
        new RegExp('/img-cache/.*'),
        new RegExp('/uploads/.*'),
        new RegExp('/MAMP.*'),
        new RegExp('/php.*'),
        new RegExp('https://maps.googleapis.com.*'),
        new RegExp('https://www.googleapis.com.*'),
    ],
});

// https://developers.google.com/web/tools/workbox/guides/common-recipes
// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    }),
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    }),
);

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
