import sys
import requests
from bs4 import BeautifulSoup

def get_commit_count(repo_url):
    response = requests.get(repo_url)
    soup = BeautifulSoup(response.content, "html.parser")
    span = soup.find("span", class_="Text-sc-17v1xeu-0 gPDEWA")
    if span:
        commits_text = span.get_text()
        commits = int(commits_text.replace(",", ""))
        return commits
    else:
        print(f"No se encontró el span con la clase especificada en {repo_url}")
        return 0

if __name__ == "__main__":
    repos = sys.argv[1].split()
    total_commits = 0
    for repo in repos:
        print(f"Scraping commits for: {repo}")
        commits = get_commit_count(f"https://github.com/{repo}")
        total_commits += commits
    print(f"::set-output name=total_commits::{total_commits}")
