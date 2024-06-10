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
    console.log(repo);
    const url = `https://github.com/${username}/${repo}`;
    console.log("Visiting url: ", url);
    await page.goto(url);
    await page.setViewport({width: 1080, height: 1024});

    await sleep(5000);
    console.log('Sleeping for 5 seconds...');
    await page.waitForSelector('a[aria-label="Commit history"]');

    const commitsText = await page.evaluate(() => {
        const commitHistoryLink = document.querySelector('a[aria-label="Commit history"]');
        console.log("commitHistoryLink:", commitHistoryLink)
        const commitCountSpan = commitHistoryLink.nextElementSibling.querySelector('span > span:nth-child(2)');
        console.log("commitCountSpan:", commitCountSpan)
        return commitCountSpan ? commitCountSpan.textContent.trim() : '';
    });

    await browser.close();

    const clearText = commitsText.replaceAll('commits', '').trim();
    console.log("clearText", clearText)
    console.log("commitsText", commitsText)

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
