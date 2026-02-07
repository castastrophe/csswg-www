# CSSWG Website

> ⚠️ This is still a work in progress, please pardon our dust! 🧹

The W3C CSS Working Group website, built with [Eleventy](https://www.11ty.dev/) v3.

## Getting started

Requires Node 24 (see `.nvmrc`) and Yarn 4 via [Corepack](https://nodejs.org/api/corepack.html).

```bash
corepack enable        # one-time, enables the pinned yarn version
yarn install
yarn start             # dev server with hot reload
yarn build             # production build into _site/
```

## Project layout

```
_content/         # source content, organized by locale
  en/             # English pages — page.lang derived from folder
  fr/             # French pages
  css/     # SCSS sources (compiled to /css/styles.css)
assets/           # static assets passed through verbatim
  fonts/
  images/
  js/             # client-side JS
_components/      # WebC components, auto-imported on every page
_includes/        # nunjucks partials and layouts
  _layouts/       # base.njk, home.njk, main.njk
_data/            # global data (site.js)
```

## Templating

- **Layouts and partials**: [nunjucks](https://mozilla.github.io/nunjucks/). `_includes/_layouts/base.njk` is the shared shell; `home.njk` and `main.njk` extend it via `{% extends %}` / `{% block %}`.
- **Components**: [WebC](https://www.11ty.dev/docs/languages/webc/). Components live in `_components/*.webc` and are globally available — drop the tag in any page and it renders. Use `<style webc:scoped>` to ship component-only CSS into the bundled stylesheet.
- **Content**: Markdown (via markdown-it). Indented blocks do *not* become `<pre>` blocks — fence with triple backticks when you actually want code output.

## Internationalization

Uses Eleventy's [I18nPlugin](https://www.11ty.dev/docs/plugins/i18n/). Each locale lives under `_content/<lang>/` and `page.lang` is derived from the folder name automatically — don't set `locale` in front matter.

Localized strings live in `_content/<lang>/<lang>.11tydata.js` under a `site` namespace, e.g. `{{ site.sections.about }}`.

Use the `locale_url` filter for any internal link so the current locale is preserved:

```njk
<a href="{{ "/about" | locale_url }}">{{ site.sections.about }}</a>
```

## Styling

Sass (`@use`) compiled at build time. Entry point is `_content/css/styles.scss`. Component-scoped styles in WebC files are bundled separately and linked alongside the main stylesheet.

Custom properties and tokens live in `_content/css/_config.scss`.

## Content Planning

* Goal: Make the CSSWG website useful to
  * CSSWG Members and regular contributors
  * People who want to get involved
  * People who want to read and understand our specs
  * People who need to follow the CSSWG's progress
  * People who are lost (redirect to MDN, etc.)

* Useful materials we currently have, to reuse/adapt:
  * http://www.w3.org/Style/CSS/current-work
  * http://fantasai.inkedblade.net/weblog/2011/inside-csswg/
  * http://www.w3.org/Style/CSS/read
  * https://rachelandrew.co.uk/archives/2017/04/24/refer-to-the-spec-what-is-all-that-stuff-at-the-top-of-the-spec/
  * https://rachelandrew.co.uk/archives/2017/05/01/whats-happening-in-css/
  * stuff on https://wiki.csswg.org/

### Content Outline

*   About CSSWG
    * Who we are
    * What we do
    * How we operate
    * Where to find us (IRC, www-style, GH, blog, wiki, etc.)
    * New Member Guide

*   Learn CSS
    * What is CSS
    * specs vs tutorials
    * where to learn (not here)
    * index of CSS conferences?
    * localized, not just translated

*   Read Our Specs
    * How to read specs
    * How CSS specs are organized
    * List of specs -> current-work
    * About spec status, advancement
    * Finding test suites

*   Get Involved
    * Process
    * Nature of discussions, decisions
    * How to report problems
    * Relationship to browsers (we don't control them) + how to file bugs
    * Testing
