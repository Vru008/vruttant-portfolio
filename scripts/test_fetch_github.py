import base64
import json
import unittest

from fetch_github import aggregate_languages, build, detect_frameworks, scan_tree


class AggregateLanguagesTest(unittest.TestCase):
    def test_sums_and_ranks_across_repos(self):
        result = aggregate_languages({
            "a": {"JavaScript": 600, "CSS": 100},
            "b": {"JavaScript": 200, "Python": 100},
        })
        self.assertEqual([l["name"] for l in result], ["JavaScript", "CSS", "Python"])
        self.assertEqual(result[0]["bytes"], 800)
        self.assertEqual(result[0]["percent"], 80.0)

    def test_ties_break_alphabetically(self):
        result = aggregate_languages({"a": {"Python": 5, "CSS": 5}})
        self.assertEqual([l["name"] for l in result], ["CSS", "Python"])

    def test_empty_input(self):
        self.assertEqual(aggregate_languages({}), [])
        self.assertEqual(aggregate_languages({"a": {}}), [])


class BuildTest(unittest.TestCase):
    def test_skips_forks_and_shapes_output(self):
        responses = {
            "/users/me/repos?per_page=100&sort=pushed": [
                {"name": "app", "html_url": "https://x/app", "homepage": "",
                 "stargazers_count": 3, "pushed_at": "2026-01-01T00:00:00Z", "fork": False},
                {"name": "forked", "html_url": "https://x/f", "fork": True},
            ],
            "/repos/me/app/languages": {"TypeScript": 90, "CSS": 10},
            "/repos/me/app/git/trees/main?recursive=1": {"tree": [
                {"path": "package.json", "type": "blob"},
                {"path": "src/App.tsx", "type": "blob"},
                {"path": "src/hooks/useTheme.ts", "type": "blob"},
                {"path": "src", "type": "tree"},
            ]},
            "/repos/me/app/contents/package.json": {"content": base64.b64encode(json.dumps(
                {"dependencies": {"react": "19"}, "devDependencies": {"typescript": "6"}}).encode()).decode()},
        }
        data = build("me", fetch=responses.__getitem__)

        self.assertEqual(data["repoCount"], 1)
        self.assertEqual(data["totalStars"], 3)
        self.assertEqual(data["repos"][0]["homepage"], None)
        self.assertEqual(data["repos"][0]["languages"], ["TypeScript", "CSS"])
        self.assertEqual(data["languages"][0], {"name": "TypeScript", "bytes": 90, "percent": 90.0})
        self.assertEqual(data["react"], {"repos": ["app"], "componentFiles": 1, "hookFiles": 1})
        self.assertEqual(data["frameworks"], [{"name": "React", "repos": ["app"]}, {"name": "TypeScript", "repos": ["app"]}])


class ScanTest(unittest.TestCase):
    def test_counts_components_and_hooks_but_skips_build_output(self):
        components, hooks, manifests = scan_tree([
            "src/App.js", "src/Pages/Nav.tsx", "src/hooks/useFetch.js", "src/user.js",
            "src/App.test.js", "server/src/Models/User.js", "src/index.css",
            "node_modules/react/index.jsx", "client/dist/App.jsx",
            "package.json", "server/package.json", "node_modules/x/package.json",
        ])
        self.assertEqual(components, 2)
        self.assertEqual(hooks, 1)  # "user.js" is not a hook; tests, server and CSS are ignored
        self.assertEqual(manifests, ["package.json", "server/package.json"])

    def test_detects_frameworks_across_client_and_server_manifests(self):
        found = detect_frameworks([
            {"dependencies": {"react": "18", "react-router-dom": "6"}},
            {"dependencies": {"express": "4", "mongoose": "8", "@google/generative-ai": "0.2"}},
        ])
        self.assertEqual(found, ["React", "React Router", "Express", "MongoDB", "Gemini API"])


if __name__ == "__main__":
    unittest.main()
