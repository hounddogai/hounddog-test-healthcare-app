#!/usr/bin/env python

import os
import sys

import httpx


if __name__ == "__main__":
    http = httpx.Client(
        base_url="https://gitlab.com/api/v4",
        headers={"Private-Token": os.environ["GITLAB_TOKEN"]},
    )
    resp = http.get(f"/projects/{os.environ['CI_PROJECT_ID']}/vulnerabilities")

    if not resp.is_success:
        sys.exit(f"Failed to get security issues: {resp.status_code} {resp.text}")

    security_issues = resp.json()
    print(f"Found {len(security_issues)} security issues")

    for issue in security_issues:
        print(f"Resolving security issue {issue['id']} ...")
        resp = http.delete(f"/vulnerabilities/{issue['id']}/resolve")
        if resp.status_code not in (201, 304):
            sys.exit(f"Cannot resolve issue {issue['id']}: {resp.status_code} {resp.text}")
