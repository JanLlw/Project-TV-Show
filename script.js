const showCache = {};
const episodeCache = {};

function setup() {
  fetchShows(); 
}

function fetchShows() {
  const showSelector = document.getElementById("show-selector");

  if (Object.keys(showCache).length > 0) {
    populateShowSelector(Object.values(showCache));
    return;
  }

  displayLoadingMessage();

  fetch("https://api.tvmaze.com/shows")
    .then((response) => response.json())
    .then((shows) => {
      shows.forEach((show) => (showCache[show.id] = show));
      populateShowSelector(Object.values(showCache));
    })
    .catch((error) => displayError(`Error fetching shows: ${error.message}`))
    .finally(removeLoadingMessage);
}

function populateShowSelector(shows) {
  const showSelector = document.getElementById("show-selector");

  const sortedShows = shows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  sortedShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });

  showSelector.addEventListener("change", () => {
    const selectedShowId = showSelector.value;
    if (selectedShowId) {
      fetchEpisodesForShow(selectedShowId);
    }
  });
}

function fetchEpisodesForShow(showId) {
  if (episodeCache[showId]) {
    makePageForEpisodes(episodeCache[showId]);
    setupEpisodeSelector(episodeCache[showId]);
    setupSearch(episodeCache[showId]);
    return;
  }

  displayLoadingMessage();

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch episodes: ${response.statusText}`);
      }
      return response.json();
    })
    .then((episodes) => {
      episodeCache[showId] = episodes;
      makePageForEpisodes(episodes);
      setupEpisodeSelector(episodes);
      setupSearch(episodes);
    })
    .catch((error) => displayError(`Error fetching episodes: ${error.message}`))
    .finally(removeLoadingMessage);
}

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
  rootElem.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
}


function setupSearch(episodes) {
  const searchInput = document.getElementById("search-input");
  const searchResult = document.getElementById("search-result");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredEpisodes = episodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
      return nameMatch || summaryMatch;
    });

    makePageForEpisodes(filteredEpisodes);
    searchResult.textContent = `Displaying ${filteredEpisodes.length} / ${episodes.length} episodes`;
  });
}

function setupEpisodeSelector(episodes) {
  const episodeSelector = document.getElementById("episode-selector");
  episodeSelector.innerHTML = '<option value="">Select an episode...</option>'; // Clear previous options

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  episodeSelector.addEventListener("change", () => {
    const selectedEpisodeId = Number(episodeSelector.value);
    if (selectedEpisodeId) {
      const selectedEpisode = episodes.find((episode) => episode.id === selectedEpisodeId);
      makePageForEpisodes([selectedEpisode]);
    } else {
      makePageForEpisodes(episodes);
    }
  });
}

function makePageForEpisodes(episodeList) {
  console.log("Episodes to display:", episodeList); 
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