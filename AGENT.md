# AGENT.md

Project guidance for AI coding assistants working in this repository. Human-facing docs are in [README.md](README.md).

## Project overview

The W3C CSS Working Group website, built with [Eleventy](https://www.11ty.dev/) v3 using WebC components and the I18nPlugin for English/French content.

## Commands

```bash
yarn start          # dev server with hot reload
yarn build          # production build into _site/
yarn ci             # clean + build (used in CI)
yarn clean          # remove _site/
```

Requires Node 24 (`.nvmrc`) and Yarn 4 via Corepack. `ELEVENTY_ENV=production` enables minification.

## Architecture

### Directory layout

| Path | Role |
|---|---|
| `_content/<lang>/` | Source content per locale (en, fr) — `page.lang` is derived from the folder |
| `_content/css/` | SCSS sources compiled to `/css/styles.css` |
| `assets/` | Static passthrough assets (fonts, images, JS) |
| `_components/*.webc` | WebC components, auto-imported on every page |
| `_includes/` | Nunjucks partials |
| `_includes/_layouts/` | Layout templates — `base.njk` is the shared shell |
| `_data/site.js` | Site-wide constants (year, name, languages) |

### Template system

- **Layouts**: nunjucks. `base.njk` is the shared shell; `home.njk` and `main.njk` extend it via `{% extends "_layouts/base.njk" %}` and override the `main` block. Note: `extends` resolves from `dir.includes`, NOT `dir.layouts` — always use the `_layouts/` prefix when extending.
- **Components**: [WebC](https://www.11ty.dev/docs/languages/webc/). Use `<style webc:scoped>` to ship component CSS into the bundled stylesheet. Custom-element-style names (with a hyphen) are preferred so components don't intercept native HTML tags.
- **Markdown**: markdown-it with the `code` rule disabled — indented content stays as paragraphs. Fence code blocks explicitly with triple backticks.

### Internationalization

Uses Eleventy's [I18nPlugin](https://www.11ty.dev/docs/plugins/i18n/). Per-locale content lives under `_content/<lang>/` and `page.lang` is set automatically.

- **Do NOT set `locale:` in front matter** — it conflicts with the plugin's automatic derivation.
- **Use the `locale_url` filter** for internal links: `{{ "/about" | locale_url }}`.
- Localized strings go in `_content/<lang>/<lang>.11tydata.js` under the `site` namespace, deep-merged with global `_data/site.js`.

### Styling

- Sass via `@use` modules (not legacy `@import`). Entry point: `_content/css/styles.scss`.
- `@extend` only works within a single module — to share rules across files, define a mixin in `_config.scss` and `@use "config";` + `@include config.mixin-name;` from consumers.
- Custom property tokens live in `_config.scss`. Light + dark mode share the same token names; the dark-mode block at the bottom redefines values.
- Tabs for indentation (tabWidth: 4). CSS printWidth: 500.

## Conventions worth knowing

- **No empty `<link href="">`**: the WebC CSS bundle can be empty when no components are used on a page. Guard the bundle link with a truthiness check (see `base.njk`).
- **Component files match tag names**: `foo.webc` matches `<foo>` everywhere on the site, including inside markdown. Name components carefully — prefer hyphenated names (`date-box.webc`) to avoid intercepting native HTML elements.
- **Hidden pages**: set `eleventyExcludeFromCollections: true` in front matter — `base.njk` adds `<meta name="robots" content="noindex">` automatically.

## WebC gotchas

These bit us during the migration. Worth remembering:

- **`webc:for="item of items"` — use `of`, not `in`.** JavaScript `for...in` iterates keys; `for...of` iterates values. WebC inherits this.
- **`webc:root="override"` to replace the host tag.** Plain `webc:root` only *merges attributes*; the host tag stays. To make a `<table-styled>` host render as `<table>` (so the browser applies table semantics), the component's root needs `webc:root="override"`.
- **Pass arrays/objects with `:` prefix, not `@`.** `:items='[...]'` evaluates as a JS expression; `@items='[...]'` stores the literal string `"[...]"` and breaks `webc:for`. The `@` prefix is for static string props.
- **`@attributes` leaks consumed props onto the rendered element.** If you pass `:items='[...]'` to a `<list>`, the rendered `<ul>` will have `items="..."` as an invalid HTML attribute. Harmless but ugly. No clean filter exists — live with it or list specific attributes to forward instead of using `@attributes`.
- **HTML5 foster-parenting strips table elements from custom-element hosts.** Don't try to slot `<tr>`/`<td>`/`<caption>` into a custom-element host — the HTML parser moves them out before WebC sees them. Use either `webc:is="tr"` on neutral elements, or a data-driven prop API (see `table-styled.webc`).
- **Host element attributes are not in template-expression scope.** `<my-comp foo="bar">` does NOT make `foo` available as a variable inside `my-comp.webc`. To access host data in expressions, pass with `:foo='value'` so it's an evaluated expression bound to a prop name, OR use slots for content.

## Translations popover

The page-utility `Translations` button (top.njk) opens a native popover ([translations.njk](_includes/translations.njk)) listing every locale that has this page translated. The popover is anchored to the trigger button via CSS anchor positioning. Implementation notes:

- The trigger is `<button popovertarget="translations-popover">` — the browser auto-wires the toggle and manages `aria-expanded` for free. **No JS is needed.**
- The popover panel is `<div popover="auto">` — `auto` gives free light-dismiss (click outside or Escape closes) and top-layer rendering.
- The close button uses `popovertarget="translations-popover" popovertargetaction="hide"` — again, no JS.
- CSS uses `anchor-name: --translations-trigger` on the trigger and `position-anchor` + `position-area: bottom span-left` on the popover for native anchored positioning. `position-try-fallbacks: flip-block` automatically flips above if there's no space below.
- An `@supports not (anchor-name: --x)` fallback gives Firefox (which is still implementing anchor positioning as of early 2026) a `position: fixed` top-right placement. Functionally identical for keyboard/AT users.
- Open animation uses `:popover-open` + `@starting-style` + `transition-behavior: allow-discrete` so the panel fades in smoothly from the top layer.
- The current language is marked with `aria-current="page"` AND a visible checkmark AND bold weight (don't rely on color alone).
- Localized strings (`translationsClose`, `translationsAbout`) live in `_content/<lang>/<lang>.11tydata.js`.

### Why popover over `<dialog>` here

`<dialog>` + `showModal()` is the right choice for full-page modals (blocking, focus-trapped, backdrop-dimmed). For anchored UI like menus, language pickers, tooltips — popover is the platform-native fit: lightweight, non-blocking, automatic dismiss. The browser handles ARIA state.

## Online references

- Eleventy: https://www.11ty.dev/
- Eleventy WebC: https://www.11ty.dev/docs/languages/webc/
- Eleventy I18n: https://www.11ty.dev/docs/plugins/i18n/
- nunjucks: https://mozilla.github.io/nunjucks/
