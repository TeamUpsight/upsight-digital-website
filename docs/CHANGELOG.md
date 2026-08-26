# Changelog

## V8 — cleanup and organization

- Removed legacy PNG/WebP duplicates and unused visual assets.
- Removed obsolete Manus/migration/debug documentation and VS Code launch configuration.
- Replaced the 2048px transactional-email logo with a smaller dedicated PNG.
- Replaced the legacy `trpc` compatibility module with a small framework-neutral API client.
- Removed dead Health Check mutation code and unused imports.
- Simplified the migrated routing helper.
- Removed unused Card component exports.
- Kept only assets and scripts referenced by production behavior.

## V7 — interactive hero restoration

- Restored full-height hero presentation and denser canvas animation without restoring the original React animation loop.

## V6 — performance and SEO pass

- Reduced unnecessary client hydration on content pages.
- Improved metadata, structured data, sitemap/robots configuration, link descriptions, accessibility and internal linking.
