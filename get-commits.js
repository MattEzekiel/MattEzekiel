const { Octokit } = require("@octokit/rest");
const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.load(fs.readFileSync('your-config.yml', 'utf8'));

const githubToken = config.env.GITHUB_TOKEN;

const octokit = new Octokit({
    auth: githubToken
});

async function getMyCommits() {
    try {
        const response = await octokit.activity.listEventsForAuthenticatedUser();
        return response.data.filter(event => event.type === 'PushEvent');
    } catch (error) {
        console.error(error);
    }
}

getMyCommits().then(commits => {
    console.log(commits);
});
