#!/usr/bin/env python

import os
import sys
import time
from typing import Any

import httpx


def run_gitlab_graphql(operation: str) -> Any:
    token = os.environ.get("GITLAB_TOKEN")
    if not token:
        sys.exit("GITLAB_TOKEN environment variable is not set")

    response = httpx.post(
        url="https://gitlab.com/api/graphql",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json={"query": operation},
        timeout=30,
    )
    if response.is_success:
        return response.json()
    else:
        sys.exit(f"GraphQL API Error: {response.status_code} {response.text}")


def get_project_global_id(project_full_name: str) -> str:
    """
    Get the GitLab project Global ID given its full name.

    :param project_full_name: Project name in the format "namespace/project"
    :return: Project Global ID (e.g. "gid://gitlab/Project/58149530")
    """
    project_name = project_full_name.split("/")[-1]
    query = f"""
    query {{
      projects(search: "{project_name}", membership: true) {{
        nodes {{
          id
        }}
      }}
    }}
    """
    response = run_gitlab_graphql(query)
    nodes = response["data"]["projects"]["nodes"]
    if nodes:
        return nodes[0]["id"]
    else:
        sys.exit("GitLab project not found")


def get_vulnerabilities(project_full_name: str) -> list[dict[str, Any]]:
    """
    Get the list of vulnerabilities for a project.

    :param project_full_name: Project full name in the format "namespace/project".
    :return: List of vulnerabilities.
    """
    query = f"""
    query {{
      project(fullPath: "{project_full_name}") {{
        vulnerabilities {{
          nodes {{ id }}
        }}
      }}  
    }}
    """
    response = run_gitlab_graphql(query)
    return response["data"]["project"]["vulnerabilities"]["nodes"]


def remove_all_vulnerabilities_from_project(project_full_name: str) -> list[dict[str, Any]]:
    project_global_id = get_project_global_id(project_full_name)
    mutation = f"""
    mutation {{  
      vulnerabilitiesRemoveAllFromProject(input: {{projectIds: ["{project_global_id}"]}}) {{
        errors
      }}
    }}
    """
    return run_gitlab_graphql(mutation)


if __name__ == "__main__":
    project_full_name = "hounddogai/hounddog-test-healthcare-app"
    project_global_id = get_project_global_id(project_full_name)

    # Remove all vulnerabilities from the project. This is an asynchronous operation.
    remove_all_vulnerabilities_from_project(project_full_name)

    # Wait until the vulnerabilities are removed.
    for _ in range(20):
        if not get_vulnerabilities(project_full_name):
            break
        time.sleep(1)
