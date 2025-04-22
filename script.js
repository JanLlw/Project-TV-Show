function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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