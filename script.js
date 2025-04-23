let allEpisodes = []; 

function setup() {
  fetchEpisodes()
    .then((episodes) => {
      allEpisodes = episodes; 
      makePageForEpisodes(allEpisodes);
      setupSearch(allEpisodes);
      setupEpisodeSelector(allEpisodes);
    })
    .catch((error) => {
      displayError(error.message); 
    });
}

function fetchEpisodes() {
  const url = "https://api.tvmaze.com/shows/82/episodes";
  displayLoadingMessage(); 

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch episodes: ${response.statusText}`);
      }
      return response.json();
    })
    .then(resolve)
    .catch(reject)
    .finally(() => {
      removeLoadingMessage(); 
    });
}, 3000

function displayLoadingMessage() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading episodes, please wait...</p>";
}

function removeLoadingMessage() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 
}

function displayError(errorMessage) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = `<p style="color: red;">Error: ${errorMessage}</p>`;
}

function setupSearch(allEpisodes) {
  const searchInput = document.getElementById("search-input");
  const searchResult = document.getElementById("search-result");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });

    makePageForEpisodes(filteredEpisodes);
    searchResult.textContent = `Displaying ${filteredEpisodes.length} / ${allEpisodes.length} episodes`;
  });
}

function setupEpisodeSelector(allEpisodes) {
  const episodeSelector = document.getElementById("episode-selector");

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  episodeSelector.addEventListener("change", () => {
    const selectedEpisodeId = Number(episodeSelector.value);
    if (selectedEpisodeId) {
      const selectedEpisode = allEpisodes.find((episode) => episode.id === selectedEpisodeId);
      makePageForEpisodes([selectedEpisode]);
    } else {
      makePageForEpisodes(allEpisodes);
    }
  });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; 

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - ${formatEpisodeCode(episode.season, episode.number)}`;
    episodeCard.appendChild(title);

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = `${episode.name} image`;
    episodeCard.appendChild(image);

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary;
    episodeCard.appendChild(summary);

    rootElem.appendChild(episodeCard);
  });

  const footer = document.createElement("footer");
  footer.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank">TVMaze.com</a>`;
  rootElem.appendChild(footer);
}

function formatEpisodeCode(season, number) {
  const paddedSeason = String(season).padStart(2, "0");
  const paddedNumber = String(number).padStart(2, "0");
  return `S${paddedSeason}E${paddedNumber}`;
}

window.onload = setup;