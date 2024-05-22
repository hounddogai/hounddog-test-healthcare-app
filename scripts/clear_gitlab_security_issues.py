#!/usr/bin/env python

import os
import sys

import httpx


def run_graphql_query(query):
    response = httpx.post(
        url="https://gitlab.com/api/graphql",
        headers={
            "Authorization": f"Bearer {os.environ['GITLAB_TOKEN']}",
            "Content-Type": "application/json",
        },
        json={"query": query},
        timeout=30,
    )
    if not response.is_success:
        sys.exit(f"Error executing query: {response.status_code} {response.text}")
    return response.json()


def get_vulnerabilities():
    """Retrieve all open vulnerabilities for a given project."""
    query = """
    query {
      project(fullPath: "hounddog-ai/hounddog-test-healthcare-app") {
        vulnerabilities(state: [DETECTED, CONFIRMED]) {
          nodes { id }
        }
      }  
    }
    """
    result = run_graphql_query(query)
    print(result)


def resolve_vulnerability(vulnerability_id):
    mutation = """
    mutation {
      vulnerabilityResolve(input: { id: "gid://gitlab/Vulnerability/23577695"}) {
        vulnerability {
          state
        }
        errors
      }
    }
    """

    """Close a vulnerability by its ID."""
    mutation = f"""
    mutation {{
      vulnerabilityDismiss(input: {{ id: "{vulnerability_id}", comment: "Closed by automated script" }}) {{
        errors
        vulnerability {{
          id
          title
          state
        }}
      }}
    }}
    """
    result = run_graphql_query(mutation)
    if result:
        return result["data"]["vulnerabilityDismiss"]["vulnerability"]
    return None


if __name__ == "__main__":
    get_vulnerabilities()

    # resp = http.get(f"/projects/{os.environ['CI_PROJECT_ID']}/vulnerabilities")
    #
    # if not resp.is_success:
    #     sys.exit(f"Failed to get security issues: {resp.status_code} {resp.text}")
    #
    # security_issues = resp.json()
    # print(
    #     f"Found {len(security_issues)} security issues in project {os.environ['CI_PROJECT_ID']}"
    # )
    #
    # for issue in security_issues:
    #     print(f"Resolving security issue {issue['id']} ...")
    #     resp = http.delete(f"/vulnerabilities/{issue['id']}/resolve")
    #     if resp.status_code not in (201, 304):
    #         sys.exit(
    #             f"Cannot resolve issue {issue['id']}: {resp.status_code} {resp.text}"
    #         )
