import path from "node:path";

import markdownIt from "markdown-it";
import * as sass from "sass";

/* Plugins */
import { I18nPlugin } from "@11ty/eleventy";
import i18n from 'eleventy-plugin-i18n';
import pluginWebc from "@11ty/eleventy-plugin-webc";

/**
 * @param {string} inputContent
 * @param {sass.Options} config
 * @returns {sass.CompileResult}
 */
function processSass(inputContent, config = {}) {
    return sass.compileString(inputContent, config);
}

/** @param {import('@11ty/eleventy')} config */
export default async function(config) {
    /* Plugins */
    config.addPlugin(pluginWebc, {
        components: "./_components/*.webc",
        useTransform: true,
        bundlePluginOptions: {
            transforms: [
                async function(content) {
                    let { type, page } = this;

                    if (type !== 'css') return content;

                    // todo: look at why this is passing markdown content through the check
                    const parsed = path.parse(page.inputPath);
                    let result = processSass(content, {
                        loadPaths: [parsed.dir || '.']
                    });

                    return result.css;
                }
            ]
        },
    });

    config.addPlugin(I18nPlugin, {
		defaultLanguage: "en", // Required, this site uses "en"
	});

    config.addPlugin(i18n, {
        translations: {
        },
        fallbackLocales: {
            "en-GB": "en",
            "fr-FR": "fr",
        }
    });

    config.addBundle("css");

    config.addPassthroughCopy("assets");

    // config.addTemplateFormats("scss");
	config.addExtension('scss', {
		outputFileExtension: 'css',
		// opt-out of Eleventy Layouts
		useLayouts: false,
		compile: async function (inputContent, inputPath) {
            const parsed = path.parse(inputPath);

            // Skip compiling file names that start with an underscore
            if (parsed.name.startsWith('_')) return;

            const result = processSass(inputContent, {
                loadPaths: [parsed.dir || '.']
            });

			// Map dependencies for incremental builds
			this.addDependencies(inputPath, result.loadedUrls);

			return async () => {
				return result.css;
			};
		},
	});

    // Disables the behvaior of putting indented content in a pre block
    // Similar to https://tabatkins.github.io/bikeshed/#markdown
	config.setLibrary('md', markdownIt({
		html: true,
	}).disable("code"));

    config.addFilter("language_name", (lang) => {
        return new Intl.DisplayNames([lang], { type: "language" }).of(lang);
    });
    config.addShortcode("year", () => {
        return new Date().getFullYear();
    });

    return {
        dir: {
            input: "_content",
            includes: "../_includes",
            layouts: "../_includes/_layouts",
            data: "../_data",
        },
        templateFormats: ["md", "webc", "njk", "scss"],
    };
};
