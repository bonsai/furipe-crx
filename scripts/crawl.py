#!/usr/bin/env python3
"""Minimal scheduled FURIPE snapshot crawler.

The first version keeps the crawl conservative: official FURIPE pages are fetched
and stored as a timestamped raw snapshot. Parsing can evolve independently from
the CRX UI, while failed crawls never overwrite the previous snapshot.
"""
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

URL = "https://furipe.net/"
OUT = Path("data/furipe-home.html")

def main():
    req = Request(URL, headers={"User-Agent": "furipe-crx/0.2 (+https://github.com/bonsai/furipe-crx)"})
    with urlopen(req, timeout=30) as response:
        body = response.read()

    OUT.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUT.with_suffix(".tmp")
    tmp.write_bytes(body)
    tmp.replace(OUT)

    checked = datetime.now(timezone.utc).isoformat()
    Path("data/checked_at.txt").write_text(checked + "\n", encoding="utf-8")
    print(f"saved {OUT} at {checked}")

if __name__ == "__main__":
    main()
