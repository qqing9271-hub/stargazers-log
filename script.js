const listElement = document.getElementById('starred-list');
const statusElement = document.getElementById('status');

function renderRepository(repo) {
  const item = document.createElement('li');
  const header = document.createElement('div');
  header.className = 'repo-header';

  const title = document.createElement('a');
  title.href = repo.html_url;
  title.textContent = repo.name;
  title.target = '_blank';
  title.rel = 'noopener noreferrer';

  const details = document.createElement('span');
  details.textContent = `${repo.language || 'Unknown'} · ⭐ ${repo.stargazers_count.toLocaleString()}`;
  details.className = 'repo-meta';

  header.append(title, details);

  const updated = document.createElement('p');
  updated.className = 'repo-meta';
  updated.textContent = `Starred on ${new Date(repo.starred_at).toLocaleDateString()}`;

  const description = document.createElement('p');
  description.className = 'repo-description';
  description.textContent = repo.description || 'No description available.';

  item.append(header, updated, description);
  return item;
}

function showStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.style.color = isError ? '#cf222e' : '#57606a';
}

async function loadStarredRepos() {
  showStatus('Loading starred repositories...');

  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`Failed to load events.json: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    listElement.innerHTML = '';

    if (!Array.isArray(repos) || repos.length === 0) {
      showStatus('No starred repositories were found.');
      return;
    }

    repos.forEach(repo => {
      listElement.appendChild(renderRepository(repo));
    });

    showStatus(`Showing ${repos.length} starred repositories.`);
  } catch (error) {
    showStatus(error.message, true);
  }
}

window.addEventListener('DOMContentLoaded', loadStarredRepos);
