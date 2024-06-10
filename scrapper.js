const axios = require('axios');
const cheerio = require('cheerio');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'MattEzekiel';

async function getRepos(username) {
    let repos = [];
    let page = 1;
    let url = `https://api.github.com/users/${username}/repos?per_page=100&page=`;
    while (true) {
        const { data } = await axios.get(url + page, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        if (data.length === 0) break;
        repos = repos.concat(data.map(repo => repo.full_name));
        page++;
    }
    return repos;
}

async function getCommits(repo) {
    let totalCommits = 0;
    let page = 1;
    while (true) {
        const { data } = await axios.get(`https://github.com/${repo}/commits`, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        const $ = cheerio.load(data);
        const commitElements = $(`span.Text-sc-17v1xeu-0.gPDEWA`);
        if (commitElements.length === 0) break;
        commitElements.each((_, element) => {
            const text = $(element).text().replace(/,/g, '');
            totalCommits += parseInt(text, 10);
        });
        const nextPage = $('a.next_page');
        if (!nextPage || !nextPage.attr('href')) break;
        page++;
    }
    return totalCommits;
}

async function main() {
    const repos = await getRepos(USERNAME);
    let totalCommits = 0;
    for (const repo of repos) {
        try {
            const commits = await getCommits(repo);
            totalCommits += commits;
        } catch (error) {
            console.log(`Error fetching commits for ${repo}:`, error.message);
        }
    }
    console.log(`TOTAL_COMMITS=${totalCommits}`);
}

main().catch(console.error);
