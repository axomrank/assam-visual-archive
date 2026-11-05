"""Generate a metadata coverage census without inferring historical facts."""
from collections import Counter
import csv
import json

from check_archive import ROOT, read, main as validate


def audit():
    validate()
    manifest = ROOT / "images/photos/manifest.csv"
    photos = {}
    if manifest.is_file():
        with manifest.open(encoding="utf-8", newline="") as handle:
            photos = {row["file"]: row for row in csv.DictReader(handle)}

    periods = {
        "15th-century": "15th century",
        "18th-century": "18th century",
        "1950s": "1950s",
        "1990s": "1990s",
        "present-day": "Present day",
        "present-day-attire": "Present day",
        "modern": "Modern, unspecified",
        "modern-site-context": "Modern, unspecified",
    }
    kinds = {
        "Scenes": "illustration",
        "Portraits": "portrait illustration",
        "Community character sheets": "present-day illustration",
        "Objects": "object illustration",
        "Photographs": "photograph catalogue record",
        "References": "reference catalogue record",
    }
    rows = []
    for group in read("data/collections.json"):
        section = group["section"]
        for item in read(group["file"]):
            key = item["id"]
            parts = key.split("/")
            tag = parts[1] if len(parts) >= 3 else ""
            photo = photos.get(key.removeprefix("photos/") + ".jpg", {}) if section == "Photographs" else {}
            period = periods.get(tag)
            if section == "Community character sheets":
                period = "Present day"
            community = group["title"] if section == "Community character sheets" else None
            if section == "References" and tag in {"bhuyan", "chutia", "koch", "koch-hajo", "manipur-royal"}:
                community = group["title"]
            source = item.get("source")
            license_name = item.get("license")
            gaps = ["historicalApplicability", "captureDate", "verifiedLocality",
                    "verifiedCommunityContext", "generationPermission", "filmReleasePermission"]
            if not period:
                gaps.append("periodTag")
            if not source:
                gaps.append("sourceLink")
            if not license_name or not item.get("licenseUrl"):
                gaps.append("displayLicenseLink")
            rows.append(dict(id=key, title=item["title"], section=section,
                             collection=group["title"], evidenceType=kinds[section],
                             periodTag=period, subjectGroupTag=community,
                             monumentTag=photo.get("monument") or None,
                             viewTypeTag=photo.get("view_type") or None,
                             image=item.get("image"), source=source,
                             license=license_name, licenseUrl=item.get("licenseUrl"),
                             note=item.get("note"), gaps=gaps))
    packs = []
    for path in read("data/packs/index.json"):
        pack = read(path)
        packs.append(dict(id=pack["id"], version=pack["version"], status=pack["status"],
                          period=read(pack["period"]), place=read(pack["place"]),
                          claims=[read(p) for p in pack["claims"]],
                          assets=[read(p) for p in pack["assets"]], gaps=pack["gaps"]))
    return dict(
        scope="All published catalogue records and registered historical packs; metadata census",
        methodology=dict(periodTags="Collection labels, not verified depiction dates",
                         subjectTags="Collection labels, not verified community attribution",
                         photoTags="Original photo manifest where present",
                         gaps="Missing or unverified structured metadata; not a rights determination"),
        photoManifestAvailable=manifest.is_file(), records=rows, packs=packs)


def main():
    result = audit()
    rows = result["records"]
    target = ROOT / "data/audits"
    target.mkdir(exist_ok=True)
    (target / "historical-coverage.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for key in ("section", "periodTag", "subjectGroupTag"):
        print(key, dict(Counter(row[key] or "Unspecified" for row in rows)))
    print("Gaps", dict(Counter(gap for row in rows for gap in row["gaps"])))
    print("Image available", sum(bool(row["image"]) for row in rows))
    print("Monument tag", sum(bool(row["monumentTag"]) for row in rows))
    for section in sorted({row["section"] for row in rows}):
        entries = [row for row in rows if row["section"] == section]
        print(section, len(entries), sum(bool(r["image"]) for r in entries),
              sum(bool(r["source"]) for r in entries),
              sum(bool(r["licenseUrl"]) for r in entries))


if __name__ == "__main__":
    main()
