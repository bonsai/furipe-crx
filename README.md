# FURIPE Scout

Chrome extension for discovering Japanese free papers while browsing the web.

## Current features

- Search FURIPE from the current page title or selected text.
- Right-click selected text and search it on FURIPE.
- **Hide job-information magazines** with a local setting.
- The setting is stored in `chrome.storage.sync`.

Default setting:

```json
{
  "filters": {
    "exclude_genres": ["求人"]
  }
}
```

The filter is genre-based. A regional free paper is not excluded merely because it contains job articles.

## Data direction

FURIPE should be crawled periodically by GitHub Actions and committed to this repository as the reproducible data layer. The extension can then consume a stable local/static snapshot rather than depending on live scraping.

Current scheduled workflow: Saturday UTC.

Source: https://furipe.net/
