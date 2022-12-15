import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './images-service';

const refs = {
    searchForm: document.querySelector('.search-form'),
    imagesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService;
var lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: '250ms', });

const onSubmit = (event) => {
    event.preventDefault();
    clearImagesContainer();
  
    //якщо більше одного слова, поставити посередині плюсик
    const { value } = event.currentTarget.elements.searchQuery;

    imagesApiService.searchQuery = value.trim();
    imagesApiService.resetPage();
    imagesApiService.fetchImages()
        .then((response) => {
            if (response.length === 0) {
                Notify.failure('Oops, there is no country with that name');
                return;
          }
          
          //перевірити величину відповіді

          // вставити зображення
          insertImages(response);
          lightbox.refresh();
          Notify.info(`Hooray! We found ${imagesApiService.totalHits} images.`);
         })
        .catch(error => console.log('some error'));
};

const onLoadMore = () => {
    imagesApiService.fetchImages()
      .then((response) => {
        insertImages(response);
        lightbox.refresh();
        // var lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: '250ms', });
      })
      .catch(error => console.log('some error'));
};

const clearImagesContainer = () => {
    refs.imagesContainer.innerHTML = '';
};

const imageTpl = ( {webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
<a class="photo-link" href="${largeImageURL}">
  <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>
</a>
`;


const insertImages = (response) => {
    let markup = '';
    for (let i = 0; i < response.length; i += 1) {
        markup += imageTpl(response[i]);
    };
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
};

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);