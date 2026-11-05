"""Check catalogue and production-pack links from any working directory."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    target = (ROOT / path).resolve()
    if not target.is_relative_to(ROOT):
        raise ValueError(f"Path leaves repository: {path}")
    return json.loads(target.read_text(encoding="utf-8"))


def require(condition, message):
    if not condition:
        raise ValueError(message)


def check_pack(path, gallery):
    pack = read(path)
    for key in ("place", "period", "production"):
        require(read(pack[key])["id"], f"{path}: missing {key} ID")
    for claim_path in pack["claims"]:
        claim = read(claim_path)
        require(claim["sources"], f"{claim_path}: missing sources")
        for source_path in claim["sources"]:
            require(read(source_path)["url"].startswith("https://"), source_path)
    for asset_path in pack["assets"]:
        asset = read(asset_path)
        if "galleryId" in asset:
            require(asset["galleryId"] in gallery, asset_path)
        else:
            require((ROOT / asset["image"]).is_file(), asset_path)
        require(asset["permissions"], f"{asset_path}: missing permissions")
    return pack["id"]


def main():
    gallery = {}
    for collection in read("data/collections.json"):
        for record in read(collection["file"]):
            key = record["id"]
            require(key not in gallery, f"Duplicate catalogue ID: {key}")
            if "image" in record:
                require((ROOT / record["image"]).is_file(), record["image"])
            gallery[key] = record
    packs = read("data/packs/index.json")
    ids = [check_pack(path, gallery) for path in packs]
    require(len(ids) == len(set(ids)), "Duplicate pack ID")
    print(f"Validated {len(gallery)} catalogue records and {len(packs)} film packs")


if __name__ == "__main__":
    main()
