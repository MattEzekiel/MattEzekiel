const puppeteer = require('puppeteer');

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
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 5000,
    });
    const page = await browser.newPage();

    const url = `https://github.com/${username}/${repo}`;
    console.log("Visiting url: ", url);

    await page.goto(url);
    await page.setViewport({width: 1080, height: 1024});

    const commitsText = await page.evaluate(() => {
        const commitSpan = document.querySelector('span.gPDEWA');
        return commitSpan ? commitSpan.textContent.trim() : '';
    });
    console.log("commitsText", commitsText ?? 'Vacío');

    await browser.close();

    const clearText = commitsText.replaceAll('commits', '').trim();

    return parseInt(clearText || 0);
}


async function main() {
    const username = 'MattEzekiel';
    const publicRepos = await getPublicRepos(username);
    let totalCommits = 0;
    for (const repo of publicRepos) {
        const repository = repo.split(' ')[0];
        const commits = await getCommits(username, repository);
        console.log(`Commits en ${repository}: ${commits}`);
        totalCommits += commits;
    }
    console.log(`Total de commits en todos los repositorios públicos: ${totalCommits}`);
}

main().catch(console.error);
