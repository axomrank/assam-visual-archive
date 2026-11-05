# Historical film archive

Run `python3 scripts/check_archive.py` before committing. Serve the repo with
`python3 -m http.server 8000` for local review.

Keep IDs stable and edit the relevant JSON record. Register packs in
`data/packs/index.json`. Pack references are repository-relative JSON paths.
Preserve existing gallery IDs and attribution.

Record what each source supports, its locator and its limits. Preserve
disagreements and distinguish the date a source was made from the period it
depicts. Present-day community character sheets are comparison material.
Historical reconstructions need their own dated sources and review.

Record display and production permissions separately. Keep restricted masters
and consent records outside the public checkout. Label generated media and
document its inputs, prompt, assumptions and review status.
