const puppeteer = require('puppeteer');

async function getContributionCount(username, year) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://github.com/${username}?tab=overview&from=${year}-01-01&to=${year}-12-31`;
    await page.goto(url);

    await page.waitForSelector('.js-yearly-contributions h2');
    await page.setViewport({width: 1080, height: 1024});

    const contributionText = await page.evaluate(() => {
        const contributionHeader = document.querySelector('.js-yearly-contributions h2');
        return contributionHeader ? contributionHeader.textContent.trim() : '';
    });

    await browser.close();

    return parseInt(contributionText.split(' ')[0]) || 0;
}

async function main() {
    const username = 'MattEzekiel';
    const currentYear = new Date().getFullYear();
    let totalContributions = 0;

    for (let year = 2019; year <= currentYear; year++) {
        const contributions = await getContributionCount(username, year);
        totalContributions += contributions;
    }

    // console.log(`Total de contribuciones en todos los años: ${totalContributions}`);
    console.log(totalContributions);
    return totalContributions;
}

main().catch(console.error);
