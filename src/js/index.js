import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './images-service';

const refs = {
    searchForm: document.querySelector('#search-form'),
    imagesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService;
var lightbox = new SimpleLightbox('.gallery a');

const onSubmit = (event) => {
    event.preventDefault();
    clearImagesContainer();
  
    const { value } = event.currentTarget.elements.searchQuery;
  
    if (value.trim() === "") {
      return;
    }
  
  
    imagesApiService.searchQuery = value.trim();
    imagesApiService.resetPage();
    imagesApiService.fetchImages()
        .then((response) => {
          if (response.length === 0) {
            Notify.failure('Oops, there is no country with that name');
            return;
          }

          insertImages(response);
          lightbox.refresh();
          showLoadMoreBtn();
          console.log('Залишилось: ', imagesApiService.hitsLeft);
          
          Notify.info(`Hooray! We found ${imagesApiService.totalHits} images.`);
         })
        .catch(onError);
};

const onLoadMore = () => {
    imagesApiService.fetchImages()
      .then((response) => {
        hideLoadMoreBtn();
        insertImages(response);
        lightbox.refresh();
        console.log('Залишилось: ', imagesApiService.hitsLeft);
        showLoadMoreBtn();
      })
      .catch(onError);
};

const clearImagesContainer = () => {
    refs.imagesContainer.innerHTML = '';
};

const imageTpl = ( {webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `
<a class="photo-link" href="${largeImageURL}">
  <div class="photo-card">
    <div class="photo-thumb">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </div>
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

const showLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

const hideLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.add('is-hidden');
}

const onError = () => {
  console.log('some error');
}

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);