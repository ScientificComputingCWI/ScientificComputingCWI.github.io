# ScientificComputingCWI

Source files for [group website](https://scientificcomputingcwi.github.io/).

## Page structure

Edit markdown files (`.md`) directly to add content.

To add more pages in the top bar, edit the `nav` section in  `.vitepress/config.ts`.

To add news, seminars, and publication items, make a new `.md`
file in the `news`/`seminars`/`publications` folder
(see existing files for adding date etc.).

## Members

`data/members.json` is the single source of truth for both the
[members page](https://scientificcomputingcwi.github.io/members) and the automatic
publication fetch. To add or remove someone, edit that file — nothing else needs touching.

The `name` you give here is also the name printed in author lists on the site. OpenAlex
names an authorship after its canonical author record, which is sometimes the wrong
person's name (a record conflated with a namesake) and often just a different form of
the same name — so for anyone listed here, that canonical name is replaced by this one.
That is also what lets the site recognise its own members and print them in bold.
Co-authors from outside the group keep whatever OpenAlex calls them.

Each entry may carry `orcid`, `email`, `github`, `website` and `photo` (put the image in
`public/` and reference it as `/name.jpg`). `role` groups people on the page; the grouping
order is set by `ROLE_ORDER` in `data/members.data.ts`.

## Publications

`/publications/` is generated automatically from [OpenAlex](https://openalex.org) and
refreshed weekly — nobody edits it by hand. It shows a rolling window of the last few
years and links out to CWI's institutional repository for the complete list.

Individual `.md` files under `publications/` are optional detail pages: a hand-written
abstract, code and data links for a paper worth featuring. Give one a
`doi: "10.xxxx/yyyy"` line in its frontmatter and the matching entry in the generated
list grows a **Details** link to it. A paper without such a page simply shows without
the link, so these are entirely optional.

Both the homepage and `/publications/` render entries through the shared
`PublicationList` component (`.vitepress/theme/components/`), so the two always show the
same level of detail.

There are two publication pages:

- **`/publications/recent`** — generated automatically from [OpenAlex](https://openalex.org),
  refreshed weekly. Nobody edits this by hand. It shows a rolling window of the last few
  years and links out to CWI's institutional repository for the complete list.
- **`/publications/`** — the hand-written selection, one `.md` file per paper, with
  abstracts, code and data links. Add a `doi: "10.xxxx/yyyy"` line to a page's frontmatter
  and the matching entry in the generated list grows a **Details** link to it.

### The rolling year window

`YEARS_SHOWN` in `data/generatedPublications.data.ts` sets how far back the page goes.
It is `2`, meaning the current year and the two before it — 2024–2026 during 2026.
The window is resolved at build time rather than in the browser, so the server-rendered
HTML and the client always agree; since the weekly workflow rebuilds the site, the window
moves forward on its own in January. The data file itself keeps *everything* that was
fetched, so widening the window is a one-character change and needs no refetch.

### How the automatic list works

`data/members.json` lists each member's OpenAlex author id(s). `scripts/fetch-publications.mjs`
asks OpenAlex for their work, keeps what is affiliated with CWI, merges each preprint with
its published version, and writes `data/publications.generated.json`, which is committed to
the repository. The `.github/workflows/publications.yml` workflow does this every Monday and
can also be run on demand from the Actions tab; when it commits a change it triggers a
redeploy.

To refresh the list locally:

```sh
npm run publications        # fetch and write the data file
npm run publications:dry    # fetch and print a summary, write nothing
```

### Tuning what appears

Edit `data/publications.config.json` — not the script. The setting that matters most is
`affiliationMode`:

| mode | what it keeps |
| --- | --- |
| `strict` | only work where the member's *own* authorship line says CWI. Most precise, but arXiv preprints disappear, because arXiv publishes no affiliation data. |
| `balanced` *(default)* | CWI appears anywhere on the paper, **or** the record has no institutional metadata at all (which is what an arXiv preprint looks like). |
| `any` | everything by everyone listed, affiliation ignored. |

A member whose OpenAlex record is conflated with a namesake can be marked `"strict": true`
in `data/members.json`; they are then always judged strictly, whatever the global mode says.
`fromYear` drops older work, and `excludeDois` / `excludeOpenAlexIds` remove individual
items.

Finding an OpenAlex author id: <https://api.openalex.org/authors?search=Firstname+Lastname>.
One person is sometimes split across several ids, which is why `openalex` takes a list.

A caveat worth knowing: every GitHub release archived to Zenodo becomes a separate "work" in
OpenAlex, so a single Julia package can contribute hundreds of entries. That is why the
`types` list in the config excludes `software` and `dataset`.

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
