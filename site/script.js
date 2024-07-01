function changeVideoID(id) {
  const sourceElement = document.getElementById('video-source');
  sourceElement.setAttribute('src', `https://pixeldrain.com/api/file/${id}`);
  const videoElement = document.querySelector('video');
  videoElement.load();
}

fetch('./anime-list.json')
  .then((res) => res.json())
  .then((data) => {
    const targetElement = document.getElementById('anime-card-container');
    targetElement.innerHTML = '';
    data.forEach((anime) => {
      targetElement.insertAdjacentHTML(
        'beforeend',
        `<div class="anime-card">
          <div class="episode">Eps ${anime.episode}</div>
          <div class="thumbnail">
            <a id="${anime.pdrainID}">
              <div class="cover">
                <img
                  width="106"
                  height="150"
                  src="${anime.thumbnail}"
                  alt="${anime.title}"
                  referrerpolicy="no-referrer"
                  sizes="(max-width: 106px) 100vw, 106px"/>
                  <h2 class="title">${anime.title}</h2>
              </div>
            </a>
          </div>
        </div>`
      );
      const thumbnail = document.getElementById(`${anime.pdrainID}`);
      thumbnail.addEventListener('click', () => {
        changeVideoID(`${anime.pdrainID}`);
      });
    });
  });
