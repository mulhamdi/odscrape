function changeVideoID(id) {
  const sourceElement = document.getElementById('video-source');
  sourceElement.setAttribute('src', `https://pixeldrain.com/api/file/${id}`);
  const videoElement = document.querySelector('video');
  videoElement.load();
}

fetch('../anime-list.json')
  .then((res) => res.json())
  .then((data) => {
    const targetElement = document.getElementById('anime-card-container');
    data.forEach((anime) => {
      targetElement.insertAdjacentHTML(
        'beforeend',
        `<div class="anime-card">
          <div class="thumbnail">
            <a id="${anime.pdrainID}">
              <span class="overlay flaticon-play-button"></span>
              <div class="cover">
                <img
                  width="106"
                  height="150"
                  src="${anime.thumbnail}"
                  alt="${anime.title}"
                  sizes="(max-width: 106px) 100vw, 106px"/>
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
