const { Octokit } = require("@octokit/rest");
require('dotenv').config();

const githubToken = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
    auth: githubToken
});

async function getMyCommits() {
    try {
        const response = await octokit.activity.listEventsForAuthenticatedUser();
        console.log('Data', response.data);
        return response.data.filter(event => event.type === 'PushEvent');
    } catch (error) {
        console.error(error);
    }
}

getMyCommits().then(commits => {
    console.log(commits);
});
