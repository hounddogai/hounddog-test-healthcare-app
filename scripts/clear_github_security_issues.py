#!/usr/bin/env python

import os

import httpx


if __name__ == "__main__":
    base_url = "https://api.github.com/repos/hounddog-ai"
    repo_name = "hounddog-test-healthcare-app"
    headers = {
        "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    while True:
        response = httpx.get(
            url=f"{base_url}/{repo_name}/code-scanning/analyses",
            headers=headers,
        )
        if not str(response.status_code).startswith("2"):
            print(response.content, response.status_code)
            break

        analyses = response.json()
        print(f"Found {len(analyses)} analyses")

        for analysis in analyses:
            response = httpx.delete(
                f"{base_url}/{repo_name}/code-scanning/analyses/{analysis['id']}?confirm_delete",
                headers=headers,
            )
            if str(response.status_code).startswith("2"):
                print(f"Deleted code scanning analysis {analysis['id']}")
            else:
                print(response.content, response.status_code)
