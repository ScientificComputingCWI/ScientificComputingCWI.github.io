# ScientificComputingCWI

Source files for [group website](https://scientificcomputingcwi.github.io/).

## Page structure

Edit markdown files (`.md`) directly to add content.

To add more pages in the top bar, edit the `nav` section in  `.vitepress/config.ts`.

To add news, seminars, and publication items, make a new `.md`
file in the `news`/`seminars`/`publications` folder
(see existing files for adding date etc.).

Add images to `public/myimage.png` and include it in the
markdown with `![Description](/myimage.png)` (use slash, but not path).

See <https://vitepress.dev/> for details about the template.

## Building the site locally

To build the website locally, you need [node](https://nodejs.org/en).
First run

```sh
npm install
```

To serve the site locally, run

```sh
npm run dev
```

This opens the site in a browser.
The site detects changes to the source files and updates automatically while running.

Please check that the site builds correctly before pushing by running

```sh
npm run build
```

This errors if there are dead links etc.
