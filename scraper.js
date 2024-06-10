const puppeteer = require('puppeteer');

async function getCommits(username, repo) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://github.com/${username}/${repo}`;
    await page.goto(url);

    // Esperar a que se cargue el contenido
    await page.waitForSelector('span.Text-sc-17v1xeu-0.gPDEWA');

    // Extraer el texto del span con las clases especificadas
    const commitsText = await page.evaluate(() => {
        const span = document.querySelector('span.Text-sc-17v1xeu-0.gPDEWA');
        return span ? span.textContent.trim() : '';
    });

    // Cerrar el navegador
    await browser.close();

    // Convertir el texto a un número
    const commits = parseInt(commitsText.replace(/,/g, ''), 10) || 0;
    return commits;
}

async function main() {
    const username = 'TuUsuarioGitHub';  // Reemplaza con tu nombre de usuario de GitHub
    const repo = 'NombreDelRepositorio';  // Reemplaza con el nombre de tu repositorio
    const commits = await getCommits(username, repo);
    console.log(`Commits en ${repo}: ${commits}`);
}

main().catch(console.error);
