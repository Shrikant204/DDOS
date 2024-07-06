const BASE_URL = "http://localhost:10000"; // Replace with your backend server URL

async function fetchUserRepos() {
    const username = document.getElementById('username').value;

    try {
        const userInfoResponse = await axios.get(`${BASE_URL}/users/${username}`);
        const reposResponse = await axios.get(`${BASE_URL}/users/${username}/repos`);
        
        const userInfo = userInfoResponse.data;
        const repos = reposResponse.data;

        console.log(`USERINFO:${userInfo}`);
        console.log(`USERREPOS:${repos}`);

        displayUserRepos(userInfo, repos);
    } catch (error) {
        console.error(error);
        displayError(error.message);
    }
}

function displayUserRepos(userInfo, repos) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<h2>${userInfo.login}'s Repositories:</h2>`;
    
    repos.forEach(repo => {
        const repoBox = document.createElement('div');
        repoBox.className = 'repo-box';
        repoBox.onclick = () => {
            window.open(repo.html_url, '_blank');
        };

        const repoName = document.createElement('div');
        repoName.className = 'repo-name';
        repoName.innerText = repo.name;

        const repoDescription = document.createElement('div');
        repoDescription.className = 'repo-description';
        repoDescription.innerText = repo.description || 'No description available';

        repoBox.appendChild(repoName);
        repoBox.appendChild(repoDescription);

        contentDiv.appendChild(repoBox);
    });
}

function displayError(message) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `<p>Error: ${message}</p>`;
}

// Add event listener to the search button
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', fetchUserRepos);

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    document.getElementById('toggle-label').textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});
