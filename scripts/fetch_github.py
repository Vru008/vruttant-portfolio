"""Build public/data/github.json from the public GitHub API.

Runs in CI once a day (see .github/workflows/refresh-stats.yml) so the portfolio
always shows live repository and language stats without a backend.
Standard library only, so there's nothing to install.

    python scripts/fetch_github.py --user Vru008 --out public/data/github.json
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

API = "https://api.github.com"

# Fetcher signature: path -> decoded JSON. Injected so tests never hit the network.
Fetch = Callable[[str], Any]


def http_fetch(path: str) -> Any:
    req = urllib.request.Request(f"{API}{path}", headers={"Accept": "application/vnd.github+json"})
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.load(res)


def aggregate_languages(per_repo: dict[str, dict[str, int]]) -> list[dict[str, Any]]:
    """Sum language bytes across repos -> [{name, bytes, percent}], largest first."""
    totals: dict[str, int] = {}
    for langs in per_repo.values():
        for name, size in langs.items():
            totals[name] = totals.get(name, 0) + size
    grand = sum(totals.values())
    if grand == 0:
        return []
    ranked = sorted(totals.items(), key=lambda kv: (-kv[1], kv[0]))
    return [
        {"name": name, "bytes": size, "percent": round(size * 100 / grand, 1)}
        for name, size in ranked
    ]


def summarize_repo(repo: dict[str, Any], languages: dict[str, int]) -> dict[str, Any]:
    return {
        "name": repo["name"],
        "url": repo["html_url"],
        "homepage": repo.get("homepage") or None,
        "description": repo.get("description"),
        "stars": repo.get("stargazers_count", 0),
        "pushedAt": repo.get("pushed_at"),
        "languages": sorted(languages, key=lambda k: -languages[k]),
    }


# GitHub's linguist files .jsx under "JavaScript", so React never shows up in the
# language bar. These give the framework picture from real package.json files instead.
FRAMEWORKS: dict[str, tuple[str, ...]] = {
    "React": ("react",),
    "React Router": ("react-router", "react-router-dom"),
    "Next.js": ("next",),
    "Framer Motion": ("framer-motion", "motion"),
    "TypeScript": ("typescript",),
    "Vite": ("vite",),
    "Express": ("express",),
    "MongoDB": ("mongoose", "mongodb"),
    "Gemini API": ("@google/generative-ai", "@google/genai"),
    "Claude API": ("@anthropic-ai/sdk",),
    "OpenAI API": ("openai",),
}
SKIP_DIRS = ("node_modules/", "dist/", "build/", ".next/", "vendor/")
CODE_EXT = (".js", ".jsx", ".ts", ".tsx")


def _skipped(path: str) -> bool:
    return any(path.startswith(d) or f"/{d}" in path for d in SKIP_DIRS)


def scan_tree(paths: list[str]) -> tuple[int, int, list[str]]:
    """-> (component files, custom-hook files, package.json paths) for one repo tree."""
    kept = [p for p in paths if not _skipped(p)]
    # React convention: components are PascalCase files under src/ (CRA keeps them in .js),
    # custom hooks are useXxx files. Tests and server code are excluded.
    front = [p for p in kept if p.endswith(CODE_EXT) and "src/" in p and not p.startswith(("server/", "api/"))
             and ".test." not in p and ".spec." not in p]
    names = [p.rsplit("/", 1)[-1] for p in front]
    components = sum(1 for n in names if n[:1].isupper() and not n.startswith("use"))
    hooks = sum(1 for n in names if n.startswith("use") and n[3:4].isupper())
    manifests = [p for p in kept if p == "package.json" or p.endswith("/package.json")]
    return components, hooks, manifests


def detect_frameworks(manifests: list[dict[str, Any]]) -> list[str]:
    deps: set[str] = set()
    for m in manifests:
        deps.update(m.get("dependencies", {}) or {})
        deps.update(m.get("devDependencies", {}) or {})
    return [name for name, pkgs in FRAMEWORKS.items() if any(p in deps for p in pkgs)]


def _read_json_file(user: str, repo: str, path: str, fetch: Fetch) -> dict[str, Any]:
    blob = fetch(f"/repos/{user}/{repo}/contents/{path}")
    try:
        return json.loads(base64.b64decode(blob["content"]).decode("utf-8"))
    except (KeyError, ValueError):
        return {}


def build(user: str, fetch: Fetch = http_fetch) -> dict[str, Any]:
    repos = [r for r in fetch(f"/users/{user}/repos?per_page=100&sort=pushed") if not r.get("fork")]
    per_repo = {r["name"]: fetch(f"/repos/{user}/{r['name']}/languages") for r in repos}

    framework_repos: dict[str, list[str]] = {}
    components = hooks = 0
    react_repos: list[str] = []
    for r in repos:
        branch = r.get("default_branch", "main")
        tree = fetch(f"/repos/{user}/{r['name']}/git/trees/{branch}?recursive=1")
        paths = [t["path"] for t in tree.get("tree", []) if t.get("type") == "blob"]
        c, h, manifest_paths = scan_tree(paths)
        found = detect_frameworks([_read_json_file(user, r["name"], p, fetch) for p in manifest_paths])
        for name in found:
            framework_repos.setdefault(name, []).append(r["name"])
        if "React" in found:
            react_repos.append(r["name"])
            components += c
            hooks += h

    return {
        "user": user,
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "repoCount": len(repos),
        "totalStars": sum(r.get("stargazers_count", 0) for r in repos),
        "languages": aggregate_languages(per_repo),
        "react": {"repos": react_repos, "componentFiles": components, "hookFiles": hooks},
        "frameworks": [
            {"name": name, "repos": framework_repos[name]}
            for name in FRAMEWORKS if name in framework_repos
        ],
        "repos": [summarize_repo(r, per_repo[r["name"]]) for r in repos],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--user", default="Vru008")
    parser.add_argument("--out", default="public/data/github.json")
    args = parser.parse_args(argv)

    try:
        data = build(args.user)
    except urllib.error.URLError as err:
        # Keep the last good snapshot rather than publishing an empty one.
        print(f"GitHub API unavailable ({err}); keeping existing {args.out}", file=sys.stderr)
        return 0

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
    langs = ", ".join(f"{l['name']} {l['percent']}%" for l in data["languages"])
    print(f"Wrote {out}: {data['repoCount']} repos | {langs}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
