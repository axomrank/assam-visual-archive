# Assam Visual Archive: scenes, community portraits, objects and photographs of Assam

> Assam Visual Archive: a searchable gallery of Assam scenes, community portraits, cultural objects and licensed photographs, with historical film reference packs.

**[Live site](https://axomrank.github.io/assam-visual-archive/)** · [Part of AxomRank](https://github.com/axomrank)

## At a glance

- **Buildless gallery:** collections are listed in `data/collections.json`, one JSON array per collection
- **Community character sets** (Ahom, Bodo, Chutiya, Deori, Bhoi, Chakma and more) and cultural objects
- **Photographs keep their license** and attribution in each record
- **Film reference packs** (`packs.html`) with source claims, reference images and shot lists

## Quick start

```bash
python3 scripts/check_archive.py   # validate before committing
python3 -m http.server 8000        # open http://localhost:8000
```

## Overview

A buildless AxomRank gallery of Assam scenes, portraits, cultural objects, photographs, and reference records.

Run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000`. The same files work on a static host at a root URL or subpath.

## Edit the catalogue

- `data/collections.json` lists collections in display order. Each has an `id`, `section`, `title`, and `file` pointing to a JSON array.
- Each record requires a stable, unique `id` and a `title`. Optional fields are `image` (repository-relative path), `alt`, `note`, `credit`, `license`, `licenseUrl`, and `source`.
- Add web-sized assets under `media/`, then add or update the matching JSON record. Records without an `image` appear as text cards. Preserve photo attribution and license information when editing records.
- Scenes and portraits are presented as illustrations. Many titles were derived from filenames. Photographic metadata comes from the supplied manifest. Gallery images are resized WebP derivatives.
- The local `images/` folder contains the original working archive. Reference downloads are represented by catalogue entries and available source links.

## Historical film reference

Open `packs.html` from the running server. The first pack covers a fictional
arrival at Rang Ghar and includes source claims, reference images, a shot list,
and a downloadable JSON brief. Its date range is a working production assumption.

Add a pack to `data/packs/index.json` and edit the linked files in
`data/places/`, `data/periods/`, `data/claims/`, `data/sources/`,
`data/assets/`, and `data/productions/`. See `schemas/pack.schema.json` and
`AGENTS.md`. Run `python3 scripts/check_archive.py` before publishing.

See the [historical coverage audit](docs/historical-coverage-audit.md) for the
complete catalogue census and production research gaps.

## Roadmap: future improvements

- [ ] Fill the gaps listed in `docs/historical-coverage-audit.md`
- [ ] Add an Assamese title and alt text for every record
- [ ] Make every record its own page with ImageObject structured data, so it can rank in image search
- [ ] Add more community collections, reviewed by community members
- [ ] Run a bulk license audit of every photograph

## For AI agents and contributors

Read [AGENTS.md](AGENTS.md). Keep ids stable, preserve attribution and licenses, and label generated media with its inputs and review status.

Commit as the `axomrank` account. Keep changes small and reviewable, and run the repository's checks before pushing.

## Part of AxomRank

[AxomRank](https://axomrank.pages.dev) offers free, bilingual preparation for Assam government exams. Related repositories:

- **Learn:** [axomrank.github.io](https://github.com/axomrank/axomrank.github.io) (the AxomRank learning app), [floor-test-simulator](https://github.com/axomrank/floor-test-simulator) (parliamentary majority simulator)
- **Explore Assam history:** [ahom-kingdom-history](https://github.com/axomrank/ahom-kingdom-history) (illustrated Ahom kingdom website and 41 reign lessons), [assam-history-map](https://github.com/axomrank/assam-history-map) (year-by-year historical map), [assam-history-characters](https://github.com/axomrank/assam-history-characters) (character sheets for Assam's history), [assam-heritage-ai-art](https://github.com/axomrank/assam-heritage-ai-art) (AI art gallery of Assamese heritage)
- **Open data:** [assam-exam-pyq](https://github.com/axomrank/assam-exam-pyq) (2,398 previous-year questions with answers), [assam-exam-syllabus](https://github.com/axomrank/assam-exam-syllabus) (syllabi for 12 recruitment boards), [assam-maps](https://github.com/axomrank/assam-maps) (map portal and GIS layers), [assam-history-sources](https://github.com/axomrank/assam-history-sources) (Kamarupa inscriptions and primary sources)
- **Publishing and brand:** [axomrank-blog](https://github.com/axomrank/axomrank-blog) (exam guides built from real papers), [assam-history-books](https://github.com/axomrank/assam-history-books) (13-book history of Assam), [axomrank-brand-assets](https://github.com/axomrank/axomrank-brand-assets) (brand kit and social media library)

## License and contact

Code: MIT (see [LICENSE](LICENSE)). Photographs keep the licenses shown in their records.

Corrections and questions: open an issue in this repository. AxomRank is run by Angsuman Das (sole proprietor).
