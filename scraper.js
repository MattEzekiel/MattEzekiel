const puppeteer = require('puppeteer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPublicRepos(username) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://github.com/${username}?tab=repositories&type=source`;
    await page.goto(url);

    await page.waitForSelector('h3');

    const publicRepos = await page.evaluate(() => {
        const repos = [];
        const repoElements = document.querySelectorAll('h3');
        repoElements.forEach(element => {
            const repoName = element.textContent.trim();
            repos.push(repoName);
        });
        return repos;
    });

    await browser.close();

    return publicRepos;
}

async function getCommits(username, repo) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://github.com/${username}/${repo}`;
    console.log("Visiting url: ", url);
    await page.goto(url);

    await sleep(5000);
    await page.waitForSelector('span.Text-sc-17v1xeu-0.gPDEWA');

    const commitsText = await page.evaluate(() => {
        const span = document.querySelector('span.Text-sc-17v1xeu-0.gPDEWA');
        return span ? span.textContent.trim() : '';
    });

    await browser.close();

    return parseInt(commitsText.replace(/,/g, ''), 10) || 0;
}

async function main() {
    const username = 'MattEzekiel';
    const publicRepos = await getPublicRepos(username);
    let totalCommits = 0;
    for (const repo of publicRepos) {
        const commits = await getCommits(username, repo);
        console.log(`Commits en ${repo}: ${commits}`);
        totalCommits += commits;
    }
    console.log(`Total de commits en todos los repositorios públicos: ${totalCommits}`);
}

main().catch(console.error);
