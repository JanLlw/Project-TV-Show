function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearch(allEpisodes);
  setupEpisodeSelector(allEpisodes);
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
}

function formatEpisodeCode(season, number) {
  const paddedSeason = String(season).padStart(2, "0");
  const paddedNumber = String(number).padStart(2, "0");
  return `S${paddedSeason}E${paddedNumber}`;
}

window.onload = setup;