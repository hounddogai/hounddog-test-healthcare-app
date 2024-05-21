#!/usr/bin/env python

import os
import sys

import httpx

if __name__ == "__main__":
    http = httpx.Client(
        base_url="https://api.github.com/repos/hounddogai/hounddog-test-healthcare-app",
        headers={
            "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    resp = http.get("/code-scanning/analyses")

    if resp.status_code == 404 and "no analysis" in resp.text.lower():
        sys.exit(0)

    if not resp.is_success:
        sys.exit(f"Failed to get security issues: {resp.status_code} {resp.text}")

    security_issues = resp.json()
    print(f"Found {len(security_issues)} security issues")

    for issue in security_issues:
        print(f"Deleting security issue {issue['id']} ...")
        resp = http.delete(f"/code-scanning/analyses/{issue['id']}?confirm_delete")
        if not resp.is_success:
            sys.exit(f"Cannot delete issue {issue['id']}: {resp.status_code} {resp.text}")
