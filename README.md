# Assam Visual Archive

A buildless AxomRank gallery of Assam scenes, portraits, cultural objects, photographs, and reference records.

Run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000`. The same files work on a static host at a root URL or subpath.

## Edit the catalogue

- `data/collections.json` lists collections in display order. Each has an `id`, `section`, `title`, and `file` pointing to a JSON array.
- Each record requires a stable, unique `id` and a `title`. Optional fields are `image` (repository-relative path), `alt`, `note`, `credit`, `license`, `licenseUrl`, and `source`.
- Add web-sized assets under `media/`, then add or update the matching JSON record. Records without an `image` appear as text cards. Preserve photo attribution and license information when editing records.
- Scenes and portraits are presented as illustrations. Many titles were derived from filenames. Photographic metadata comes from the supplied manifest. Gallery images are resized WebP derivatives.
- The local `images/` folder contains the original working archive. Reference downloads are represented by catalogue entries and available source links.

## License

The website code is MIT-licensed. Photographs retain the licenses shown in their records. Other media and linked sources retain their respective rights.

## Historical film reference

Open `packs.html` from the running server. The first pack covers a fictional
arrival at Rang Ghar and includes source claims, reference images, a shot list,
and a downloadable JSON brief. Its date range is a working production assumption.

Add a pack to `data/packs/index.json` and edit the linked files in
`data/places/`, `data/periods/`, `data/claims/`, `data/sources/`,
`data/assets/`, and `data/productions/`. See `schemas/pack.schema.json` and
`AGENTS.md`. Run `python3 scripts/check_archive.py` before publishing.
